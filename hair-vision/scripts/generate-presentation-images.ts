// 生成演示文稿图片资源的脚本
// 使用方法: 调用 API /api/presentation/generate-all-images 来生成图片
// 或者直接使用浏览器访问该 API 端点

// 注意：这个脚本需要 Node.js 环境，建议使用 API 路由方式生成
// 运行: curl -X POST http://localhost:3000/api/presentation/generate-all-images

import * as fs from 'fs';
import * as path from 'path';
import { generatePresentationImage, PRESENTATION_IMAGE_PROMPTS } from '../src/lib/presentation-image-generator';

/**
 * 将 base64 data URL 转换为文件并保存
 */
function saveImageFromDataUrl(dataUrl: string, outputPath: string): void {
  // 提取 base64 数据
  const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error('Invalid data URL format');
  }

  const imageBuffer = Buffer.from(matches[2], 'base64');
  fs.writeFileSync(outputPath, imageBuffer);
  console.log(`✅ Saved: ${outputPath}`);
}

/**
 * 生成所有演示文稿图片
 */
async function generateAllPresentationImages() {
  const outputDir = path.join(process.cwd(), 'public', 'presentation-images');
  
  // 确保输出目录存在
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`📁 Created directory: ${outputDir}`);
  }

  console.log('🎨 Starting to generate presentation images...\n');

  // 需要生成的图片列表
  const imagesToGenerate = [
    {
      key: 'roiChart',
      filename: 'roi-chart.png',
      resolution: '1K' as const,
      description: 'ROI Chart',
    },
    {
      key: 'waitingRoomExperience',
      filename: 'waiting-room-experience.png',
      resolution: '2K' as const,
      description: 'Waiting Room Experience',
    },
    {
      key: 'ipadMirrorExperience',
      filename: 'ipad-mirror-experience.png',
      resolution: '2K' as const,
      description: 'iPad Mirror Experience',
    },
    {
      key: 'marketGrowth',
      filename: 'market-growth-chart.png',
      resolution: '1K' as const,
      description: 'Market Growth Chart',
    },
    {
      key: 'satisfactionComparison',
      filename: 'satisfaction-comparison.png',
      resolution: '1K' as const,
      description: 'Customer Satisfaction Comparison',
    },
    {
      key: 'salonScene',
      filename: 'salon-scene.png',
      resolution: '2K' as const,
      description: 'Salon Scene',
    },
    {
      key: 'customerUsing',
      filename: 'customer-using-ipad.png',
      resolution: '2K' as const,
      description: 'Customer Using iPad',
    },
  ];

  let successCount = 0;
  let failCount = 0;

  for (const image of imagesToGenerate) {
    try {
      console.log(`🔄 Generating ${image.description}...`);
      
      const prompt = PRESENTATION_IMAGE_PROMPTS[image.key as keyof typeof PRESENTATION_IMAGE_PROMPTS];
      if (!prompt) {
        console.error(`❌ Prompt not found for key: ${image.key}`);
        failCount++;
        continue;
      }

      const dataUrl = await generatePresentationImage(prompt, image.resolution);
      const outputPath = path.join(outputDir, image.filename);
      
      saveImageFromDataUrl(dataUrl, outputPath);
      successCount++;
      
      // 添加延迟以避免 API 限制
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`❌ Failed to generate ${image.description}:`, error instanceof Error ? error.message : error);
      failCount++;
    }
  }

  console.log(`\n✨ Generation complete!`);
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);
  console.log(`\n📂 Images saved to: ${outputDir}`);
}

// 运行脚本
if (require.main === module) {
  generateAllPresentationImages()
    .then(() => {
      console.log('\n🎉 All done!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Fatal error:', error);
      process.exit(1);
    });
}

export { generateAllPresentationImages };

