import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getHairstyleById } from '@/data/hairstyles';
import { getColorById } from '@/data/colors';
import { getBackgroundById } from '@/data/backgrounds';
import type { ViewAngle, ImageResolution } from '@/types';

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
    const { photo, styleId, colorId, viewAngle, backgroundId, resolution } = body;
    
    // 获取分辨率设置，优先使用请求参数，其次环境变量，默认1K以节省成本
    const imageResolution: ImageResolution = resolution || 
      (process.env.GEMINI_IMAGE_RESOLUTION as ImageResolution) || 
      '1K';
    
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

    // Build prompt with resolution
    const prompt = buildPrompt(style, color, viewAngle, background, imageResolution);

    // Initialize Gemini model with image generation capability
    const model = genAI.getGenerativeModel({
      model: 'gemini-3.0-pro-image-generation',
      generationConfig: {
        responseModalities: ['Text', 'Image'],
      } as Record<string, unknown>,
    });

    // Extract base64 data from data URL
    const base64Match = photo.match(/^data:([^;]+);base64,(.+)$/);
    if (!base64Match) {
      return NextResponse.json(
        { error: 'Invalid image format' },
        { status: 400 }
      );
    }

    const mimeType = base64Match[1];
    const base64Data = base64Match[2];

    // Generate image
    const result = await model.generateContent([
      {
        inlineData: {
          mimeType,
          data: base64Data,
        },
      },
      prompt,
    ]);

    const response = result.response;

    // Extract generated image from response
    if (response.candidates && response.candidates[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        const imagePart = part as { inlineData?: { mimeType: string; data: string } };
        if (imagePart.inlineData) {
          const resultUrl = `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
          console.log(`[Cost] Image generated successfully at ${imageResolution}`);
          return NextResponse.json({
            success: true,
            resultUrl,
            resolution: imageResolution,
            estimatedCost: estimatedCost,
          });
        }
      }
    }

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
