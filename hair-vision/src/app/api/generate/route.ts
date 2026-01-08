import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getHairstyleById } from '@/data/hairstyles';
import { getColorById } from '@/data/colors';
import { getBackgroundById } from '@/data/backgrounds';
import type { ViewAngle } from '@/types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface GenerateRequestBody {
  photo: string;
  styleId: string;
  colorId?: string;
  viewAngle: ViewAngle;
  backgroundId: string;
}

function buildPrompt(
  style: NonNullable<ReturnType<typeof getHairstyleById>>,
  color: ReturnType<typeof getColorById> | null | undefined,
  viewAngle: ViewAngle,
  background: NonNullable<ReturnType<typeof getBackgroundById>>
): string {
  const viewAngleDescriptions: Record<ViewAngle, string> = {
    front: 'front view, facing directly at the camera',
    side: 'side profile view, 90 degrees from the front, showing the side silhouette',
    back: 'back view, showing the back of the head and the full hairstyle from behind',
  };

  const backgroundDescriptions: Record<string, string> = {
    salon: 'professional upscale hair salon interior with soft lighting and elegant mirrors in the background',
    studio: 'clean pure white photography studio background with professional soft lighting',
    outdoor: 'beautiful natural outdoor setting with soft golden hour daylight, blurred nature background',
    gradient: 'subtle elegant gradient background transitioning from light gray to white',
  };

  let prompt = `Create a highly photorealistic image transformation. Take the person in this photo and give them a completely new hairstyle while preserving their exact facial features, skin tone, face shape, and identity.

HAIRSTYLE TO APPLY:
Name: ${style.name} (${style.nameEn})
Description: ${style.promptDescription}

`;

  if (color) {
    prompt += `HAIR COLOR:
Name: ${color.name} (${color.nameEn})
Color: ${color.promptDescription}
Hex Reference: ${color.hexCode}

`;
  } else {
    prompt += `HAIR COLOR: Maintain the person's natural original hair color as shown in the photo.

`;
  }

  prompt += `VIEWING ANGLE: Generate the image showing the ${viewAngleDescriptions[viewAngle]}

BACKGROUND: ${backgroundDescriptions[background.value]}

CRITICAL REQUIREMENTS FOR PHOTOREALISTIC RESULT:
1. IDENTITY PRESERVATION: The person's face must be EXACTLY the same - same eyes, nose, mouth, jaw, skin texture, skin tone, and facial proportions. Do not alter any facial features.
2. NATURAL HAIR: The new hairstyle must look completely natural and realistic, as if professionally styled by an expert hairdresser.
3. SEAMLESS BLEND: The hair must blend naturally with the person's head, hairline, and skin tone.
4. REALISTIC LIGHTING: Apply proper lighting, shadows, and highlights to the hair that match the background environment.
5. HIGH QUALITY: Generate a high-resolution, professional-quality image suitable for salon preview purposes.
6. HAIR TEXTURE: Show realistic hair texture, shine, and movement appropriate for the hairstyle type.
7. CONSISTENT STYLE: Ensure the hairstyle looks consistent with the description and would look natural on this specific person.

Generate a single photorealistic image that looks like a professional salon photograph.`;

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
    const { photo, styleId, colorId, viewAngle, backgroundId } = body;

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

    // Build prompt
    const prompt = buildPrompt(style, color, viewAngle, background);

    // Initialize Gemini model with image generation capability
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-preview-image-generation',
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
          return NextResponse.json({
            success: true,
            resultUrl,
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
