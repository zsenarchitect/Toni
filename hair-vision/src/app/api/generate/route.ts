import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getHairstyleById } from '@/data/hairstyles';
import { getColorById } from '@/data/colors';
import { getBackgroundById } from '@/data/backgrounds';
import type { ViewAngle, ImageResolution } from '@/types';
import { selectModel, useCredits, getCreditStats } from '@/lib/credits';
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
  photo: string;
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
    const { photo, styleId, colorId, viewAngle, backgroundId, resolution, salonId } = body;
    
    // 获取分辨率设置，优先使用请求参数，其次环境变量，默认1K以节省成本
    const imageResolution: ImageResolution = resolution || 
      (process.env.GEMINI_IMAGE_RESOLUTION as ImageResolution) || 
      '1K';
    
    // 信用检查和模型选择（如果提供了salonId）
    // 注意：永远不拒绝请求 - 允许超支，服务不中断
    let selectedModel: string | undefined;
    let creditsRequired = 0;
    let creditBalance = null;
    let isOverage = false;
    
    if (salonId) {
      try {
        creditBalance = await getCreditBalance(salonId);
        const modelSelection = selectModel(creditBalance, imageResolution);
        selectedModel = modelSelection.model;
        creditsRequired = modelSelection.creditsRequired;
        isOverage = modelSelection.isOverage;
        
        const stats = getCreditStats(creditBalance);
        console.log(`[Credits] Salon ${salonId}: Available: ${stats.displayAvailable}, Required: ${creditsRequired}, Model: ${selectedModel}, Overage: ${isOverage}`);
        
        if (isOverage) {
          console.log(`[Credits] Overage mode - service continues, will be billed later. Overage: ${stats.overage} credits ($${stats.overageCost.toFixed(2)})`);
        }
      } catch (error) {
        // 即使信用检查失败，也继续服务（使用默认模型）
        console.warn(`[Credits] Credit check failed for salon ${salonId}, continuing with default model:`, error);
      }
    }
    
    // 记录成本估算
    const estimatedCost = COST_ESTIMATES[imageResolution];
    console.log(`[Cost] API call - Resolution: ${imageResolution}, Estimated cost: $${estimatedCost.toFixed(4)}`);

    // Validate required fields
    if (!photo || !styleId || !viewAngle || !backgroundId) {
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

    // 使用统一的生成函数（支持模型选择）
    const resultUrl = await generateHairstyle({
      photoBase64: photo,
      style,
      color: color || undefined,
      viewAngle,
      background,
      resolution: imageResolution,
      model: selectedModel as any, // 如果提供了salonId，使用信用系统选择的模型
    });

    // 如果生成成功，扣除信用
    if (salonId && creditBalance && creditsRequired > 0) {
      try {
        const updatedBalance = useCredits(creditBalance, creditsRequired);
        await updateCreditBalance(updatedBalance);
        
        // 记录使用历史
        await recordCreditUsage({
          id: `usage-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          salonId,
          creditsUsed: creditsRequired,
          model: selectedModel as any,
          resolution: imageResolution,
          timestamp: new Date(),
          cost: estimatedCost,
        });
        
        console.log(`[Credits] Deducted ${creditsRequired} credits from salon ${salonId}. Remaining: ${getCreditStats(updatedBalance).available}`);
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

    // If no image was generated, return error
    return NextResponse.json(
      { error: 'Failed to generate image. Please try again.' },
      { status: 500 }
    );

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
