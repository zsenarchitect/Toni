// 演示文稿图片生成工具
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

/**
 * 生成演示文稿用的图表或股票图片
 * @param prompt 图片生成提示词
 * @param resolution 分辨率 ('1K' | '2K' | '4K')
 * @returns 图片的 data URL
 */
export async function generatePresentationImage(
  prompt: string,
  resolution: '1K' | '2K' | '4K' = '1K'
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-3.0-pro-image-generation',
      generationConfig: {
        responseModalities: ['Text', 'Image'],
      } as unknown as Record<string, unknown>,
    });

    const resolutionPrompt = resolution === '1K' 
      ? ' Generate at 1K resolution (1024x1024).'
      : resolution === '2K'
      ? ' Generate at 2K resolution (2048x2048).'
      : ' Generate at 4K resolution (4096x4096).';

    const fullPrompt = `${prompt}${resolutionPrompt}`;

    const result = await model.generateContent([fullPrompt]);

    const response = result.response;

    // 检查响应中的图片
    if (response.candidates && response.candidates[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        const imagePart = part as { inlineData?: { mimeType: string; data: string } };
        if (imagePart.inlineData) {
          const imageData = imagePart.inlineData;
          return `data:${imageData.mimeType};base64,${imageData.data}`;
        }
      }
    }

    throw new Error('No image generated in response');
  } catch (error) {
    console.error('Error generating presentation image:', error);
    throw error;
  }
}

/**
 * 预定义的演示文稿图片提示词
 */
export const PRESENTATION_IMAGE_PROMPTS = {
  // ROI 图表
  roiChart: 'Create a professional business chart showing ROI calculation. Show a bar chart with "Investment" and "Return" columns. Modern, clean design with amber and green colors. White background, professional business style.',
  
  // 市场增长图表
  marketGrowth: 'Create a professional line chart showing market growth over time. Show upward trending line from left to right. Modern, clean design with amber accent color. White background, professional business style.',
  
  // 客户满意度对比
  satisfactionComparison: 'Create a professional comparison chart showing "Before" and "After" customer satisfaction scores. Two side-by-side bar charts. Modern, clean design with red and green colors. White background, professional business style.',
  
  // 沙龙场景
  salonScene: 'Professional salon interior, modern and elegant, high-end barbershop setting, clean and bright lighting, professional atmosphere, realistic photography style, 4K quality.',
  
  // 客户使用场景
  customerUsing: 'Professional photo of a customer using an iPad in a modern salon, stylist showing hairstyle preview on screen, elegant and professional atmosphere, realistic photography style, 4K quality.',
  
  // 等候室体验
  waitingRoomExperience: 'Professional photo of a modern salon waiting area, elegant and comfortable seating, customers browsing hairstyle previews on iPad tablets mounted on stands, warm ambient lighting, premium salon atmosphere, realistic photography style, 4K quality. Show multiple customers casually browsing different hairstyles on screens while waiting.',
  
  // iPad 镜子体验
  ipadMirrorExperience: 'Professional photo of a customer sitting in front of a salon mirror, holding an iPad showing their hairstyle preview result, comparing the preview on the iPad screen with their reflection in the mirror, elegant salon setting, professional lighting, realistic photography style, 4K quality. The customer should be looking at both the iPad screen and the mirror reflection.',
};

