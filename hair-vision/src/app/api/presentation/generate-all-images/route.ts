// API 路由：批量生成所有演示文稿图片
import { NextRequest, NextResponse } from 'next/server';
import { generatePresentationImage, PRESENTATION_IMAGE_PROMPTS } from '@/lib/presentation-image-generator';

/**
 * 批量生成所有演示文稿图片
 */
export async function POST(request: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    const imagesToGenerate = [
      {
        key: 'roiChart',
        resolution: '1K' as const,
        description: 'ROI Chart',
      },
      {
        key: 'waitingRoomExperience',
        resolution: '2K' as const,
        description: 'Waiting Room Experience',
      },
      {
        key: 'ipadMirrorExperience',
        resolution: '2K' as const,
        description: 'iPad Mirror Experience',
      },
      {
        key: 'marketGrowth',
        resolution: '1K' as const,
        description: 'Market Growth Chart',
      },
      {
        key: 'satisfactionComparison',
        resolution: '1K' as const,
        description: 'Customer Satisfaction Comparison',
      },
      {
        key: 'salonScene',
        resolution: '2K' as const,
        description: 'Salon Scene',
      },
      {
        key: 'customerUsing',
        resolution: '2K' as const,
        description: 'Customer Using iPad',
      },
    ];

    const results: Array<{
      key: string;
      description: string;
      success: boolean;
      imageUrl?: string;
      error?: string;
    }> = [];

    for (const image of imagesToGenerate) {
      try {
        const prompt = PRESENTATION_IMAGE_PROMPTS[image.key as keyof typeof PRESENTATION_IMAGE_PROMPTS];
        if (!prompt) {
          results.push({
            key: image.key,
            description: image.description,
            success: false,
            error: 'Prompt not found',
          });
          continue;
        }

        const imageUrl = await generatePresentationImage(prompt, image.resolution);
        results.push({
          key: image.key,
          description: image.description,
          success: true,
          imageUrl,
        });

        // 添加延迟以避免 API 限制
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        results.push({
          key: image.key,
          description: image.description,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    return NextResponse.json({
      success: true,
      summary: {
        total: results.length,
        success: successCount,
        failed: failCount,
      },
      results,
    });
  } catch (error) {
    console.error('Error generating presentation images:', error);
    return NextResponse.json(
      { error: 'Failed to generate images', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}


