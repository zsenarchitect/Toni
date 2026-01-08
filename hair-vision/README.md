# MeRROR 💇

> Professional hairstyle preview system for premium salons

MeRROR 是一款为高端理发沙龙设计的专业发型预览系统。让顾客在剪发前就能看到效果图，大幅减少沟通成本，提升服务体验。

## ✨ 功能特点

- 📷 **实时拍照/上传** - 支持 iPad 摄像头拍照或从相册上传
- 💇 **精选发型库** - 18+ 款精选发型，涵盖男女短/中/长发
- 🎨 **染发颜色预览** - 17 种发色可选，包括自然色和时尚色
- 🔄 **多视角生成** - 正面、侧面、背面效果图
- 🖼️ **背景切换** - 沙龙、白色、户外、渐变背景
- 📊 **效果对比** - 滑动/按住对比原图和效果图
- 💾 **造型记录** - 本地保存生成记录
- 📱 **PWA 支持** - 可安装为原生应用体验

## 🚀 快速开始

### 环境要求

- Node.js 18+
- npm 或 yarn
- Google Gemini API Key

### 安装步骤

```bash
# 克隆项目
git clone <repo-url>
cd hair-vision

# 安装依赖
npm install

# 配置环境变量
cp .env.local.example .env.local
# 编辑 .env.local，填入你的 Gemini API Key

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000 查看应用。

### 获取 Gemini API Key

1. 访问 [Google AI Studio](https://aistudio.google.com/apikey)
2. 创建新的 API Key
3. 将 Key 添加到 `.env.local` 文件

## 🛠️ 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: TailwindCSS
- **动画**: Framer Motion
- **状态管理**: Zustand
- **图像生成**: Google Gemini 2.0 Flash
- **部署**: Vercel

## 📁 项目结构

```
hair-vision/
├── src/
│   ├── app/                 # Next.js App Router 页面
│   │   ├── api/            # API 路由
│   │   ├── capture/        # 拍照页面
│   │   ├── styles/         # 发型选择页面
│   │   ├── color/          # 颜色选择页面
│   │   ├── result/         # 结果页面
│   │   └── history/        # 造型记录页面
│   ├── components/          # React 组件
│   │   ├── ui/             # 基础 UI 组件
│   │   ├── Camera.tsx      # 相机组件
│   │   ├── StyleGrid.tsx   # 发型网格
│   │   └── ColorPicker.tsx # 颜色选择器
│   ├── data/               # 静态数据
│   │   ├── hairstyles.ts   # 发型库
│   │   ├── colors.ts       # 颜色库
│   │   └── backgrounds.ts  # 背景库
│   ├── hooks/              # React Hooks
│   ├── lib/                # 工具函数
│   └── types/              # TypeScript 类型
├── public/                  # 静态资源
└── ...
```

## 🖥️ 页面流程

```
首页 → 拍照 → 选发型 → 选颜色 → 效果预览 → 保存/分享
```

## ⚙️ 环境变量

| 变量名 | 必需 | 描述 |
|--------|------|------|
| `GEMINI_API_KEY` | ✅ | Google Gemini API Key |

## 🚢 部署到 Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-repo/hair-vision)

1. Fork 本仓库
2. 在 Vercel 导入项目
3. 添加环境变量 `GEMINI_API_KEY`
4. 部署完成！

## 📱 iPad 优化

本应用专为 iPad 使用场景优化：

- 触控友好的 44px+ 点击区域
- 支持横屏和竖屏
- PWA 全屏模式
- 手势操作支持

## 🔐 安全与隐私

- 所有照片处理通过 HTTPS
- 图片仅存储在用户设备本地
- 不收集用户个人信息
- 支持数据删除

## 📄 License

MIT License

---

Exclusively designed for premium salons
