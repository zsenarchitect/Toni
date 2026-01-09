# 演示文稿图片生成指南

本文档说明如何生成演示文稿所需的图片资源。

## 方法 1: 使用 Web 界面（推荐）

1. 启动开发服务器：
   ```bash
   npm run dev
   ```

2. 在浏览器中访问：
   ```
   http://localhost:3000/generate-images.html
   ```

3. 点击 "Generate All Images" 按钮

4. 等待生成完成（可能需要几分钟）

5. 点击 "Download All Images" 下载所有图片

## 方法 2: 使用 API 端点

直接调用 API：

```bash
curl -X POST http://localhost:3000/api/presentation/generate-all-images
```

响应将包含所有生成的图片的 base64 data URL。

## 方法 3: 使用命令行脚本

如果安装了 `tsx`：

```bash
npm install -D tsx
npm run generate:presentation-images
```

## 生成的图片列表

以下图片将被生成：

1. **roiChart** - ROI 计算图表 (1K)
2. **waitingRoomExperience** - 等候室体验场景 (2K)
3. **ipadMirrorExperience** - iPad 镜子体验场景 (2K)
4. **marketGrowth** - 市场增长图表 (1K)
5. **satisfactionComparison** - 客户满意度对比图表 (1K)
6. **salonScene** - 沙龙场景 (2K)
7. **customerUsing** - 客户使用 iPad 场景 (2K)

## 注意事项

- 需要配置 `GEMINI_API_KEY` 环境变量
- 生成过程可能需要几分钟（每个图片之间有 2 秒延迟以避免 API 限制）
- 生成的图片是 base64 data URL 格式，可以直接在代码中使用
- 如果需要保存为文件，可以使用 Web 界面的下载功能

## 在代码中使用生成的图片

生成的图片可以通过以下方式使用：

1. **动态生成**（当前方式）：图片在运行时通过 API 生成
2. **静态资源**：将生成的图片保存到 `public/presentation-images/` 目录，然后直接引用

如果选择静态资源方式，更新幻灯片组件以使用本地图片：

```typescript
// 使用静态资源
<img src="/presentation-images/roi-chart.png" alt="ROI Chart" />

// 或继续使用动态生成
const [image, setImage] = useState<string | null>(null);
// ... 生成逻辑
```


