# Vercel 部署配置说明

## 问题
项目结构是 monorepo 形式，Next.js 应用位于 `hair-vision/` 子目录中，但 Vercel 默认在根目录查找 Next.js 项目。

## 解决方案

### 方法 1：在 Vercel 项目设置中配置（推荐）

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 进入项目设置 (Settings)
3. 找到 **General** → **Root Directory**
4. 设置为：`hair-vision`
5. 保存设置
6. 重新部署

### 方法 2：使用 vercel.json（已配置）

根目录的 `vercel.json` 已配置 `rootDirectory: "hair-vision"`，但 Vercel 可能仍需要在项目设置中确认。

## 环境变量配置

在 Vercel 项目设置中添加以下环境变量：

- `GEMINI_API_KEY` - Google Gemini API Key（必需）
- `GEMINI_IMAGE_RESOLUTION` - 图像分辨率，可选（1K/2K/4K，默认 1K）
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase URL（如果使用 Outreach 功能）
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase Anon Key（如果使用 Outreach 功能）

## 验证部署

部署成功后，检查：
1. 构建日志中应该显示在 `hair-vision` 目录中运行 `npm install` 和 `npm run build`
2. 应用应该可以正常访问
3. API 路由应该正常工作

## 故障排除

如果仍然遇到 "No Next.js version detected" 错误：

1. 确认 Vercel 项目设置中的 Root Directory 已设置为 `hair-vision`
2. 确认 `hair-vision/package.json` 中包含 `next` 依赖
3. 检查构建日志，确认在正确的目录中运行命令
4. 如果问题持续，尝试删除并重新导入项目

