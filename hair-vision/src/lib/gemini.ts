import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Hairstyle, HairColor, ViewAngle, Background } from '@/types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface GenerateParams {
  photoBase64: string;
  style: Hairstyle;
  color?: HairColor;
  viewAngle: ViewAngle;
  background: Background;
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

function buildPrompt(params: GenerateParams): string {
  const { style, color, viewAngle, background } = params;
  
  const viewAngleDescriptions: Record<ViewAngle, string> = {
    front: 'front view, looking directly at the camera',
    side: 'side profile view, 90 degrees from the front',
    back: 'back view, showing the back of the head and hairstyle',
  };

  const backgroundDescriptions: Record<string, string> = {
    salon: 'professional hair salon with modern lighting and mirrors',
    outdoor: 'natural outdoor setting with soft daylight',
    studio: 'clean white studio background with professional lighting',
    gradient: 'subtle gradient background from light gray to white',
  };

  let prompt = `Transform this person's hairstyle while keeping their face, skin tone, and all facial features EXACTLY the same.

NEW HAIRSTYLE: ${style.promptDescription}
Style name: ${style.name} (${style.nameEn})

`;

  if (color) {
    prompt += `HAIR COLOR: ${color.promptDescription}
Color: ${color.name} (${color.nameEn}) - ${color.hexCode}

`;
  } else {
    prompt += `HAIR COLOR: Keep the original natural hair color

`;
  }

  prompt += `VIEW ANGLE: Generate the ${viewAngleDescriptions[viewAngle]}

BACKGROUND: ${backgroundDescriptions[background.value] || background.value}

CRITICAL REQUIREMENTS:
1. The person's face must remain IDENTICAL - same eyes, nose, mouth, skin tone, facial structure
2. Only modify the hair to match the requested style and color
3. The hair must look completely natural and realistic
4. Proper lighting and shadows on the hair matching the scene
5. High quality, photorealistic result suitable for a professional salon preview
6. The hairstyle should look like it was done by a professional stylist
7. Natural hair texture and movement appropriate for the style

Generate a single high-quality photorealistic image.`;

  return prompt;
}

export async function generateHairstyle(params: GenerateParams): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp-image-generation',
      generationConfig: {
        responseModalities: ['Text', 'Image'],
      } as unknown as Record<string, unknown>,
    });

    const prompt = buildPrompt(params);
    
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
      prompt,
    ]);

    const response = result.response;
    
    // Check for image in the response
    if (response.candidates && response.candidates[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        const imagePart = part as InlineDataPart;
        if (imagePart.inlineData) {
          const imageData = imagePart.inlineData;
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

// Fallback function using Imagen if available
export async function generateWithImagen(params: GenerateParams): Promise<string> {
  // This is a placeholder for potential Imagen integration
  // For MVP, we'll use the main Gemini function
  return generateHairstyle(params);
}
