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
  photoBase64: string; // 主照片（向后兼容）
  multiAnglePhotos?: {
    front: string;
    left45?: string;
    right45?: string;
    back?: string;
  }; // V1.5: 多角度照片
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
// V1.5: 支持多角度参考图以提高一致性
function buildPrompt(params: GenerateParams): string {
  const { style, color, viewAngle, background, multiAnglePhotos } = params;
  
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

  // V1.5: 如果提供了多角度参考图，在提示词中说明
  if (multiAnglePhotos) {
    const referenceAngles = [];
    if (multiAnglePhotos.front) referenceAngles.push('front');
    if (multiAnglePhotos.left45) referenceAngles.push('left 45°');
    if (multiAnglePhotos.right45) referenceAngles.push('right 45°');
    if (multiAnglePhotos.back) referenceAngles.push('back');
    
    if (referenceAngles.length > 1) {
      prompt += ` Reference photos provided: ${referenceAngles.join(', ')}. Use these to maintain consistency across angles and accurately capture facial features.`;
    }
  }

  if (color) {
    prompt += ` Color: ${color.promptDescription} (${color.hexCode}).`;
  } else {
    prompt += ` Keep original hair color.`;
  }

  prompt += ` Requirements: 1) Face identical (eyes, nose, mouth, skin). 2) Natural realistic hair. 3) Professional styling. 4) Proper lighting. Generate photorealistic salon preview.`;

  return prompt;
}

export async function generateHairstyle(params: GenerateParams): Promise<string> {
  // 获取分辨率设置，优先使用参数，其次环境变量，默认1K以节省成本
  const resolution: ImageResolution = params.resolution || 
    (process.env.GEMINI_IMAGE_RESOLUTION as ImageResolution) || 
    '1K';
  
  // 始终使用 Gemini 3.0 Pro 作为首选模型，确保服务质量一致
  // 只有在 API 错误（不可用/配额限制）时才降级到 Flash
  const preferredModel: GeminiModel = 'gemini-3.0-pro-image-generation';
  const fallbackModel: GeminiModel = 'gemini-2.0-flash-preview-image-generation';
  
  // 如果明确指定了模型（用于降级场景），使用指定的模型
  const modelName: GeminiModel = params.model || preferredModel;
  
  // 记录成本估算
  const estimatedCost = COST_ESTIMATES[resolution];
  console.log(`[Cost] Generating ${resolution} image with ${modelName}, estimated cost: $${estimatedCost.toFixed(4)}`);

  // 在 try 块外构建 prompt，以便在 fallback 中也能使用
  const prompt = buildPrompt(params);
  
  // 如果指定了分辨率，在提示词中明确要求
  const resolutionPrompt = resolution === '1K' 
    ? ' Generate at 1K resolution (1024x1024).'
    : resolution === '2K'
    ? ' Generate at 2K resolution (2048x2048).'
    : ' Generate at 4K resolution (4096x4096).';
  
  const fullPrompt = prompt + resolutionPrompt;

  try {
    const model = genAI.getGenerativeModel({ 
      model: modelName,
      generationConfig: {
        responseModalities: ['Text', 'Image'],
        // 注意: media_resolution 参数可能需要根据实际API文档调整
        // 目前通过prompt中的分辨率要求来控制
      } as unknown as Record<string, unknown>,
    });
    
    // V1.5: 构建多角度输入数组
    const contentParts: Array<{ inlineData: { mimeType: string; data: string } } | string> = [];
    
    if (params.multiAnglePhotos) {
      // 使用多角度照片：按顺序添加所有提供的角度
      const addPhoto = (photo: string | undefined, label: string) => {
        if (photo) {
          const base64Data = photo.includes(',') ? photo.split(',')[1] : photo;
          const mimeType = photo.includes(';') 
            ? photo.split(';')[0].split(':')[1] 
            : 'image/jpeg';
          contentParts.push({
            inlineData: {
              mimeType: mimeType || 'image/jpeg',
              data: base64Data,
            },
          });
        }
      };
      
      // 按顺序添加：正面（必需）、左侧45度、右侧45度、背面
      addPhoto(params.multiAnglePhotos.front, 'front');
      addPhoto(params.multiAnglePhotos.left45, 'left45');
      addPhoto(params.multiAnglePhotos.right45, 'right45');
      addPhoto(params.multiAnglePhotos.back, 'back');
    } else {
      // 向后兼容：使用单张照片
      const base64Data = params.photoBase64.includes(',') 
        ? params.photoBase64.split(',')[1] 
        : params.photoBase64;
      const mimeType = params.photoBase64.includes(';')
        ? params.photoBase64.split(';')[0].split(':')[1]
        : 'image/jpeg';
      contentParts.push({
        inlineData: {
          mimeType: mimeType || 'image/jpeg',
          data: base64Data,
        },
      });
    }
    
    // 添加提示词
    contentParts.push(fullPrompt);

    const result = await model.generateContent(contentParts);

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
    // 业务安全方案：如果首选模型失败（不可用/配额限制），尝试降级到 Flash
    // 这确保服务不中断，但只有在技术问题时才降级，而不是因为信用问题
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const isQuotaOrAvailabilityError = 
      errorMessage.includes('quota') || 
      errorMessage.includes('rate limit') || 
      errorMessage.includes('unavailable') ||
      errorMessage.includes('503') ||
      errorMessage.includes('429');
    
    // 如果已经使用了降级模型，或者不是配额/可用性错误，直接抛出
    if (modelName !== preferredModel || !isQuotaOrAvailabilityError) {
      console.error(`[Gemini API] Error with ${modelName}:`, error);
      throw error;
    }
    
    // 尝试降级到 Flash 模型（业务安全方案）
    console.warn(`[Gemini API] ${preferredModel} unavailable (${errorMessage}), falling back to ${fallbackModel} for business continuity`);
    
    try {
      const fallbackModelInstance = genAI.getGenerativeModel({ 
        model: fallbackModel,
        generationConfig: {
          responseModalities: ['Text', 'Image'],
        } as unknown as Record<string, unknown>,
      });

      // 构建降级模型的输入（使用相同的多角度逻辑）
      const fallbackContentParts: Array<{ inlineData: { mimeType: string; data: string } } | string> = [];
      
      if (params.multiAnglePhotos) {
        const addPhoto = (photo: string | undefined) => {
          if (photo) {
            const base64Data = photo.includes(',') ? photo.split(',')[1] : photo;
            const mimeType = photo.includes(';') 
              ? photo.split(';')[0].split(':')[1] 
              : 'image/jpeg';
            fallbackContentParts.push({
              inlineData: {
                mimeType: mimeType || 'image/jpeg',
                data: base64Data,
              },
            });
          }
        };
        addPhoto(params.multiAnglePhotos.front);
        addPhoto(params.multiAnglePhotos.left45);
        addPhoto(params.multiAnglePhotos.right45);
        addPhoto(params.multiAnglePhotos.back);
      } else {
        const base64Data = params.photoBase64.includes(',') 
          ? params.photoBase64.split(',')[1] 
          : params.photoBase64;
        const mimeType = params.photoBase64.includes(';')
          ? params.photoBase64.split(';')[0].split(':')[1]
          : 'image/jpeg';
        fallbackContentParts.push({
          inlineData: {
            mimeType: mimeType || 'image/jpeg',
            data: base64Data,
          },
        });
      }
      fallbackContentParts.push(fullPrompt);

      const fallbackResult = await fallbackModelInstance.generateContent(fallbackContentParts);

      const fallbackResponse = fallbackResult.response;
      
      if (fallbackResponse.candidates && fallbackResponse.candidates[0]?.content?.parts) {
        for (const part of fallbackResponse.candidates[0].content.parts) {
          const imagePart = part as InlineDataPart;
          if (imagePart.inlineData) {
            const imageData = imagePart.inlineData;
            console.log(`[Cost] Image generated with fallback model ${fallbackModel} at ${resolution}`);
            return `data:${imageData.mimeType};base64,${imageData.data}`;
          }
        }
      }
      
      throw new Error('No image generated in fallback response');
    } catch (fallbackError) {
      console.error(`[Gemini API] Fallback model ${fallbackModel} also failed:`, fallbackError);
      throw fallbackError;
    }
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
