import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getHairstyleById } from '@/data/hairstyles';
import { getColorById } from '@/data/colors';
import { getBackgroundById } from '@/data/backgrounds';
import type { ViewAngle, ImageResolution } from '@/types';
import { calculateCreditsRequiredForRequest, useCredits, getCreditStats } from '@/lib/credits';
import { getCreditBalance, updateCreditBalance, recordCreditUsage } from '@/lib/credit-storage';
import { generateHairstyle } from '@/lib/gemini';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// 成本估算常量
const COST_ESTIMATES: Record<ImageResolution, number> = {
  '1K': 0.0134,
  '2K': 0.0134,
  '4K': 0.024,
};

interface GenerateRequestBody {
  photo: string; // 向后兼容：单张照片
  multiAnglePhotos?: {
    front: string;
    left45?: string;
    right45?: string;
    back?: string;
  }; // V1.5: 多角度照片（如果提供，优先使用）
  styleId: string;
  colorId?: string;
  viewAngle: ViewAngle;
  backgroundId: string;
  resolution?: ImageResolution; // 可选分辨率参数
  salonId?: string; // 可选：沙龙ID，用于信用管理。如果不提供，则跳过信用检查（向后兼容）
}

// 优化的提示词构建 - 更简洁以减少token成本
function buildPrompt(
  style: NonNullable<ReturnType<typeof getHairstyleById>>,
  color: ReturnType<typeof getColorById> | null | undefined,
  viewAngle: ViewAngle,
  background: NonNullable<ReturnType<typeof getBackgroundById>>,
  resolution?: ImageResolution
): string {
  const viewAngleMap: Record<ViewAngle, string> = {
    front: 'front view',
    side: 'side profile',
    back: 'back view',
  };

  const bgMap: Record<string, string> = {
    salon: 'salon interior',
    studio: 'white studio',
    outdoor: 'outdoor setting',
    gradient: 'gradient background',
  };

  // 优化的简洁提示词 - 减少约30%的token使用
  let prompt = `Transform hairstyle, preserve face exactly. Style: ${style.promptDescription} (${style.nameEn}). Angle: ${viewAngleMap[viewAngle]}. Background: ${bgMap[background.value] || background.value}.`;

  if (color) {
    prompt += ` Color: ${color.promptDescription} (${color.hexCode}).`;
  } else {
    prompt += ` Keep original hair color.`;
  }

  prompt += ` Requirements: 1) Face identical. 2) Natural realistic hair. 3) Professional styling. 4) Proper lighting.`;

  // 添加分辨率要求
  if (resolution === '1K') {
    prompt += ' Generate at 1K (1024x1024).';
  } else if (resolution === '2K') {
    prompt += ' Generate at 2K (2048x2048).';
  } else if (resolution === '4K') {
    prompt += ' Generate at 4K (4096x4096).';
  }

  return prompt;
}

export async function POST(request: NextRequest) {
  try {
    // Check API key
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    const body: GenerateRequestBody = await request.json();
    const { photo, multiAnglePhotos, styleId, colorId, viewAngle, backgroundId, resolution, salonId } = body;
    
    // 获取分辨率设置，优先使用请求参数，其次环境变量，默认1K以节省成本
    const imageResolution: ImageResolution = resolution || 
      (process.env.GEMINI_IMAGE_RESOLUTION as ImageResolution) || 
      '1K';
    
    // 信用检查和计算（如果提供了salonId）
    // 注意：永远不因为信用问题而降级模型，确保服务质量一致
    // 始终使用 Gemini 3.0 Pro，只有在 API 错误（不可用/配额限制）时才降级
    let creditsRequired = 0;
    let creditBalance = null;
    let isOverage = false;
    
    if (salonId) {
      try {
        creditBalance = await getCreditBalance(salonId);
        // 始终使用 Pro 模型计算信用需求，不因信用降级
        creditsRequired = calculateCreditsRequiredForRequest(imageResolution);
        
        const stats = getCreditStats(creditBalance);
        const available = stats.displayAvailable;
        isOverage = stats.isOverage || (available - creditsRequired < 0);
        
        console.log(`[Credits] Salon ${salonId}: Available: ${available}, Required: ${creditsRequired}, Model: gemini-1.5-pro (always), Overage: ${isOverage}`);
        
        if (isOverage) {
          console.log(`[Credits] Overage mode - service continues with Pro model, will be billed later. Overage: ${stats.overage} credits ($${stats.overageCost.toFixed(2)})`);
        }
      } catch (error) {
        // 即使信用检查失败，也继续服务（使用默认 Pro 模型）
        console.warn(`[Credits] Credit check failed for salon ${salonId}, continuing with Pro model:`, error);
        // 使用默认信用需求
        creditsRequired = calculateCreditsRequiredForRequest(imageResolution);
      }
    }
    
    // 记录成本估算
    const estimatedCost = COST_ESTIMATES[imageResolution];
    console.log(`[Cost] API call - Resolution: ${imageResolution}, Estimated cost: $${estimatedCost.toFixed(4)}`);

    // Validate required fields
    // V1.5: 支持多角度照片或单张照片
    const hasValidPhoto = multiAnglePhotos?.front || photo;
    if (!hasValidPhoto || !styleId || !viewAngle || !backgroundId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get data from our database
    const style = getHairstyleById(styleId);
    if (!style) {
      return NextResponse.json(
        { error: 'Invalid style ID' },
        { status: 400 }
      );
    }

    const color = colorId ? getColorById(colorId) : null;
    const background = getBackgroundById(backgroundId) || { id: 'studio', name: 'Studio', value: 'studio' };

    // 使用统一的生成函数
    // 始终使用 Gemini 3.0 Pro，只有在 API 错误（不可用/配额限制）时才会自动降级到 Flash
    // V1.5: 如果提供了多角度照片，使用多角度照片；否则使用单张照片（向后兼容）
    const primaryPhoto = multiAnglePhotos?.front || photo;
    const resultUrl = await generateHairstyle({
      photoBase64: primaryPhoto,
      multiAnglePhotos: multiAnglePhotos ? {
        front: multiAnglePhotos.front,
        left45: multiAnglePhotos.left45,
        right45: multiAnglePhotos.right45,
        back: multiAnglePhotos.back,
      } : undefined,
      style,
      color: color || undefined,
      viewAngle,
      background,
      resolution: imageResolution,
      // 不指定 model，使用默认的 Pro 模型
      // 只有在 API 错误时才会在 generateHairstyle 内部自动降级
    });

    // 检查是否成功生成图片
    if (!resultUrl) {
      return NextResponse.json(
        { error: 'Failed to generate image. Please try again.' },
        { status: 500 }
      );
    }

    // 如果生成成功，扣除信用
    if (salonId && creditBalance && creditsRequired > 0) {
      try {
        const updatedBalance = useCredits(creditBalance, creditsRequired);
        await updateCreditBalance(updatedBalance);
        
        // 记录使用历史
        await recordCreditUsage({
          id: `usage-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
          salonId,
          creditsUsed: creditsRequired,
          model: 'gemini-1.5-pro', // 使用 Pro 模型
          resolution: imageResolution,
          timestamp: new Date(),
          cost: estimatedCost,
        });
        
        const updatedStats = getCreditStats(updatedBalance);
        console.log(`[Credits] Deducted ${creditsRequired} credits from salon ${salonId}. Remaining: ${updatedStats.available}`);
        
        // 异步检查是否需要发送使用提醒邮件（不阻塞响应）
        // 注意：这里需要沙龙邮箱信息，暂时跳过，由定时任务统一处理
        // if (salonEmail) {
        //   checkAndSendUsageAlert(salonId, salonEmail, salonName, updatedBalance).catch(err => {
        //     console.error(`[Credit Alert] Failed to send alert:`, err);
        //   });
        // }
      } catch (error) {
        console.error(`[Credits] Failed to update credits for salon ${salonId}:`, error);
        // 即使信用更新失败，也返回生成的图片（避免用户体验问题）
      }
    }

    // 返回结果（不包含信用信息给客户 - 只在admin端显示）
    // 客户永远看不到信用错误或限制
    return NextResponse.json({
      success: true,
      resultUrl,
      resolution: imageResolution,
      estimatedCost: estimatedCost,
      // 不返回信用信息给前端客户界面
      // 信用信息只在admin API中可见
    });

  } catch (error) {
    console.error('Generation error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Handle specific Gemini errors
    if (errorMessage.includes('SAFETY')) {
      return NextResponse.json(
        { error: 'Image could not be processed due to safety guidelines. Please try a different photo.' },
        { status: 400 }
      );
    }
    
    if (errorMessage.includes('quota') || errorMessage.includes('rate')) {
      return NextResponse.json(
        { error: 'Service is temporarily busy. Please try again in a moment.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate image. Please try again.' },
      { status: 500 }
    );
  }
}
