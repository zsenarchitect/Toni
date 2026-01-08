import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Hairstyle, HairColor, ViewAngle, Background, ImageResolution, GeminiModel } from '@/types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// 成本估算 (基于官方定价)
const COST_ESTIMATES: Record<ImageResolution, number> = {
  '1K': 0.0134, // ~$0.134 per image (1,120 tokens)
  '2K': 0.0134, // ~$0.134 per image (1,120 tokens)
  '4K': 0.024,  // ~$0.24 per image (2,000 tokens)
};

interface GenerateParams {
  photoBase64: string;
  style: Hairstyle;
  color?: HairColor;
  viewAngle: ViewAngle;
  background: Background;
  resolution?: ImageResolution; // 分辨率控制，用于成本优化
  model?: GeminiModel; // 可选：指定使用的模型，如果不提供则根据信用自动选择
}

// Extended types for Gemini image generation (not yet in official types)
interface ImageGenerationConfig {
  responseModalities: string[];
}

interface InlineDataPart {
  inlineData?: {
    mimeType: string;
    data: string;
  };
}

// 优化的提示词构建函数 - 更简洁以减少token使用
function buildPrompt(params: GenerateParams): string {
  const { style, color, viewAngle, background } = params;
  
  const viewAngleMap: Record<ViewAngle, string> = {
    front: 'front view',
    side: 'side profile',
    back: 'back view',
  };

  const bgMap: Record<string, string> = {
    salon: 'salon interior',
    outdoor: 'outdoor setting',
    studio: 'white studio',
    gradient: 'gradient background',
  };

  // 优化后的简洁提示词 - 减少约30%的token使用
  let prompt = `Transform hairstyle, preserve face exactly. Style: ${style.promptDescription} (${style.nameEn}). Angle: ${viewAngleMap[viewAngle]}. Background: ${bgMap[background.value] || background.value}.`;

  if (color) {
    prompt += ` Color: ${color.promptDescription} (${color.hexCode}).`;
  } else {
    prompt += ` Keep original hair color.`;
  }

  prompt += ` Requirements: 1) Face identical (eyes, nose, mouth, skin). 2) Natural realistic hair. 3) Professional styling. 4) Proper lighting. Generate photorealistic salon preview.`;

  return prompt;
}

export async function generateHairstyle(params: GenerateParams): Promise<string> {
  try {
    // 获取分辨率设置，优先使用参数，其次环境变量，默认1K以节省成本
    const resolution: ImageResolution = params.resolution || 
      (process.env.GEMINI_IMAGE_RESOLUTION as ImageResolution) || 
      '1K';
    
    // 获取模型，如果未指定则使用默认的Pro模型
    const modelName: GeminiModel = params.model || 'gemini-3.0-pro-image-generation';
    
    // 记录成本估算
    const estimatedCost = COST_ESTIMATES[resolution];
    console.log(`[Cost] Generating ${resolution} image with ${modelName}, estimated cost: $${estimatedCost.toFixed(4)}`);

    const model = genAI.getGenerativeModel({ 
      model: modelName,
      generationConfig: {
        responseModalities: ['Text', 'Image'],
        // 注意: media_resolution 参数可能需要根据实际API文档调整
        // 目前通过prompt中的分辨率要求来控制
      } as unknown as Record<string, unknown>,
    });

    const prompt = buildPrompt(params);
    
    // 如果指定了分辨率，在提示词中明确要求
    const resolutionPrompt = resolution === '1K' 
      ? ' Generate at 1K resolution (1024x1024).'
      : resolution === '2K'
      ? ' Generate at 2K resolution (2048x2048).'
      : ' Generate at 4K resolution (4096x4096).';
    
    const fullPrompt = prompt + resolutionPrompt;
    
    // Extract base64 data from data URL
    const base64Data = params.photoBase64.split(',')[1];
    const mimeType = params.photoBase64.split(';')[0].split(':')[1] || 'image/jpeg';

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType,
          data: base64Data,
        },
      },
      fullPrompt,
    ]);

    const response = result.response;
    
    // Check for image in the response
    if (response.candidates && response.candidates[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        const imagePart = part as InlineDataPart;
        if (imagePart.inlineData) {
          const imageData = imagePart.inlineData;
          console.log(`[Cost] Image generated successfully at ${resolution} with ${modelName}, actual cost may vary`);
          return `data:${imageData.mimeType};base64,${imageData.data}`;
        }
      }
    }

    throw new Error('No image generated in response');
  } catch (error) {
    console.error('Gemini API error:', error);
    throw error;
  }
}

// 成本计算辅助函数
export function estimateGenerationCost(resolution: ImageResolution = '1K'): number {
  return COST_ESTIMATES[resolution];
}

// 批量成本估算
export function estimateBatchCost(count: number, resolution: ImageResolution = '1K'): number {
  return count * COST_ESTIMATES[resolution];
}

// Fallback function using Imagen if available
export async function generateWithImagen(params: GenerateParams): Promise<string> {
  // This is a placeholder for potential Imagen integration
  // For MVP, we'll use the main Gemini function
  return generateHairstyle(params);
}
