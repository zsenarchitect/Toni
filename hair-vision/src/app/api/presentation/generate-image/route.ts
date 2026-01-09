// API 路由：生成演示文稿图片
import { NextRequest, NextResponse } from 'next/server';
import { generatePresentationImage, PRESENTATION_IMAGE_PROMPTS } from '@/lib/presentation-image-generator';

export async function POST(request: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { prompt, promptKey, resolution = '1K' } = body;

    // 如果提供了 promptKey，使用预定义的提示词
    const finalPrompt = promptKey && PRESENTATION_IMAGE_PROMPTS[promptKey as keyof typeof PRESENTATION_IMAGE_PROMPTS]
      ? PRESENTATION_IMAGE_PROMPTS[promptKey as keyof typeof PRESENTATION_IMAGE_PROMPTS]
      : prompt;

    if (!finalPrompt) {
      return NextResponse.json(
        { error: 'Prompt or promptKey is required' },
        { status: 400 }
      );
    }

    const imageUrl = await generatePresentationImage(finalPrompt, resolution as '1K' | '2K' | '4K');

    return NextResponse.json({
      success: true,
      imageUrl,
    });
  } catch (error) {
    console.error('Error generating presentation image:', error);
    return NextResponse.json(
      { error: 'Failed to generate image', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}



