# 🔄 多角度一致性与持续编辑功能规格

## 一、多角度输入问题分析

### 当前方案：单张正面照片 + AI想象

**优点**:
- 操作简单，用户只需拍一张照片
- 降低使用门槛
- 快速出图

**缺点**:
- 侧面/背面是AI"想象"的，可能与真实不符
- 发际线、头型、脖子长度等个人特征无法准确呈现
- 不同角度生成可能不一致（同一人看起来不像）

### 改进方案对比

#### 方案A：多角度拍摄输入 (推荐用于V2)

```
用户操作流程：
┌─────────────────────────────────────────────────────────────┐
│  1. 拍摄正面照片 (必需)                                      │
│     ↓                                                       │
│  2. 拍摄左侧45度照片 (可选)                                  │
│     ↓                                                       │
│  3. 拍摄右侧45度照片 (可选)                                  │
│     ↓                                                       │
│  4. 拍摄背面照片 (可选，用于精确背面生成)                     │
└─────────────────────────────────────────────────────────────┘
```

**技术实现**:
```typescript
interface MultiAngleInput {
  front: string;       // 必需：正面照片
  leftSide?: string;   // 可选：左侧45度
  rightSide?: string;  // 可选：右侧45度  
  back?: string;       // 可选：背面
}

// Prompt 策略
const buildMultiAnglePrompt = (inputs: MultiAngleInput, targetAngle: ViewAngle) => {
  let context = `Reference photos provided:
- Front view: [attached as image 1]`;
  
  if (inputs.leftSide) context += `\n- Left side view: [attached as image 2]`;
  if (inputs.rightSide) context += `\n- Right side view: [attached as image 3]`;
  if (inputs.back) context += `\n- Back view: [attached as image 4]`;
  
  return `${context}

Using these reference photos, generate a ${targetAngle} view of this person with the new hairstyle.
Maintain EXACT consistency in:
- Face shape and features
- Head shape and size
- Hairline position
- Ear position and shape
- Neck length and shape
- Skin tone

The person in all generated images must be clearly recognizable as the same individual.`;
};
```

**优点**:
- 更准确的个人特征
- 多角度一致性更好
- 专业度更高

**缺点**:
- 操作更复杂
- 需要引导用户正确拍摄
- 拍摄时间增加

#### 方案B：3D面部重建 (未来考虑)

使用面部扫描技术或多张照片重建3D头部模型，然后应用发型。

**技术栈**: 
- Apple ARKit Face Tracking
- Google MediaPipe Face Mesh
- 或专业3D重建API

**优点**: 最高精度
**缺点**: 技术复杂，成本高

### MVP建议

**阶段1 (当前)**: 
- 保持单张正面照片输入
- 在生成侧面/背面时添加提示："效果图仅供参考，实际效果以正面为准"

**阶段2 (V1.5)**:
- 添加可选的多角度拍摄
- 提供拍摄引导（姿势提示、角度提示）
- 多张照片一起发送给AI提高一致性

**阶段3 (V2.0)**:
- 考虑3D重建或更高级的一致性方案

---

## 二、持续编辑功能设计

### 用户场景

造型师和客户在沟通过程中，需要不断调整细节：

> "这个颜色再浅一点"
> "卷度能不能小一些"
> "刘海短一点试试"
> "层次再多一些"

### 当前问题

每次修改都需要重新生成，导致：
- 等待时间长（每次5-10秒）
- 多次生成不一致
- 无法精确微调

### 解决方案：参数化持续编辑

#### UI 设计

```
┌─────────────────────────────────────────────────────────────┐
│                      效果预览                                │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                                                       │  │
│  │                   [生成的效果图]                       │  │
│  │                                                       │  │
│  └───────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                      微调面板                                │
│                                                             │
│  📏 长度调整                                                │
│  更短 ●━━━━━━━━━━━━━━━●━━━━━━━━━━━━━━ 更长                   │
│        -5cm        当前        +5cm                        │
│                                                             │
│  💇 层次感                                                  │
│  更少 ━━━━━━━━━━━●━━━━━━━━━━━━━━━━━━━━ 更多                   │
│                                                             │
│  🌀 卷度 (仅烫发)                                           │
│  [直发] [微卷] [中卷] [大卷] [小卷]                          │
│                                                             │
│  ✨ 光泽度                                                  │
│  哑光 ━━━━━━━━━━━━━━━━━━●━━━━━━━━━━━━ 高光泽                  │
│                                                             │
│  🎨 颜色深浅                                                │
│  更深 ━━━━━━━━━●━━━━━━━━━━━━━━━━━━━━━ 更浅                   │
│                                                             │
│  ✂️ 刘海长度                                                │
│  [无刘海] [眉上] [眉毛] [眼睛] [更长]                         │
│                                                             │
│         [应用修改]              [重置]                       │
└─────────────────────────────────────────────────────────────┘
```

#### 技术实现

```typescript
// 可调整参数
interface StyleParameters {
  // 长度相关
  lengthAdjustment: number;      // -5 到 +5 cm
  bangsLength: 'none' | 'above-brow' | 'brow' | 'eye' | 'longer';
  
  // 层次相关
  layerIntensity: number;        // 0-100，层次感强度
  texturizing: number;           // 0-100，打薄程度
  
  // 烫发相关
  curlSize: 'straight' | 'slight' | 'medium' | 'large' | 'tight';
  curlPattern: 'waves' | 'curls' | 'spiral';
  
  // 染发相关
  colorBrightness: number;       // -50 到 +50，颜色明暗
  colorSaturation: number;       // -50 到 +50，颜色饱和度
  colorTone: 'cool' | 'neutral' | 'warm';  // 色调冷暖
  
  // 质感相关
  glossiness: number;            // 0-100，光泽度
  volume: number;                // 0-100，蓬松度
}

// 构建增量修改Prompt
const buildEditPrompt = (
  baseResult: string,           // 之前生成的结果
  changes: Partial<StyleParameters>,
  changeDescription: string     // 自然语言描述变化
) => {
  return `Based on the attached hairstyle image, make the following adjustments:

${changeDescription}

Specific parameters:
${Object.entries(changes).map(([key, value]) => `- ${key}: ${value}`).join('\n')}

CRITICAL: Maintain everything else exactly the same - same person, same basic style, same angle. 
Only modify the specific aspects mentioned above.
The result should look like a natural variation of the original, not a completely new image.`;
};
```

#### 增量生成策略

**策略1: 参数化Prompt重新生成**
- 每次调整重新构建完整Prompt
- 包含所有当前参数
- 简单但一致性可能有问题

**策略2: 基于前图的编辑指令**
- 将上一次生成结果作为输入
- 只发送变化的部分
- 更好的连续性

```typescript
// 推荐策略：混合方案
const generateWithEdit = async (
  originalPhoto: string,      // 用户原始照片
  previousResult: string,     // 上次生成的结果
  baseStyle: Hairstyle,       // 基础发型
  parameters: StyleParameters // 当前参数
) => {
  // 构建两张参考图的Prompt
  const prompt = `You are given:
1. Original photo of the client (Image 1)
2. Previous hairstyle preview (Image 2) - this is the base to modify

Apply these adjustments to the hairstyle in Image 2:
- Length: ${describeLengthChange(parameters.lengthAdjustment)}
- Layers: ${describeLayerIntensity(parameters.layerIntensity)}
- Curl: ${parameters.curlSize}
- Glossiness: ${parameters.glossiness}%
- Volume: ${describeVolume(parameters.volume)}

Keep the person's identity from Image 1.
Keep the overall style concept from Image 2.
Only modify the specified parameters.`;

  return await generateImage([originalPhoto, previousResult], prompt);
};
```

---

## 三、细节调整参数清单

### 剪发参数

| 参数 | 范围 | 单位 | UI控件 |
|------|------|------|--------|
| 整体长度 | -10 ~ +10 | cm | 滑块 |
| 刘海长度 | 5档 | - | 分段选择 |
| 层次强度 | 0-100 | % | 滑块 |
| 打薄程度 | 0-100 | % | 滑块 |
| 发尾形状 | 4档 | - | 图标选择 |

### 烫发参数

| 参数 | 范围 | 单位 | UI控件 |
|------|------|------|--------|
| 卷度大小 | 5档 | - | 分段选择 |
| 卷的起始位置 | 发根/中段/发尾 | - | 分段选择 |
| 蓬松度 | 0-100 | % | 滑块 |
| 卷的方向 | 内扣/外翻/混合 | - | 图标选择 |

### 染发参数

| 参数 | 范围 | 单位 | UI控件 |
|------|------|------|--------|
| 颜色明度 | -50 ~ +50 | - | 滑块 |
| 颜色饱和度 | -50 ~ +50 | - | 滑块 |
| 色调冷暖 | 冷/中/暖 | - | 分段选择 |
| 光泽度 | 0-100 | % | 滑块 |

### 整体造型参数

| 参数 | 范围 | 单位 | UI控件 |
|------|------|------|--------|
| 发量感 | 更薄/正常/更厚 | - | 分段选择 |
| 头顶蓬松 | 0-100 | % | 滑块 |
| 服帖度 | 蓬松/自然/服帖 | - | 分段选择 |

---

## 四、实现优先级

### MVP (V1.0) - 当前
- [x] 单张照片输入
- [x] 基础发型选择
- [x] 颜色选择
- [x] 多视角生成 (AI想象)
- [ ] 添加"效果仅供参考"提示

### V1.5 - 近期迭代
- [ ] 颜色深浅滑块
- [ ] 光泽度调整
- [ ] 卷度大小选择 (烫发场景)
- [ ] 长度微调滑块
- [ ] 可选的多角度拍摄

### V2.0 - 中期目标
- [ ] 完整参数化编辑面板
- [ ] 多角度拍摄引导
- [ ] 编辑历史/撤销功能
- [ ] 参数预设保存

### V3.0 - 远期愿景
- [ ] 实时预览 (参数调整即时反馈)
- [ ] 3D头部模型
- [ ] AR实时试戴

---

## 五、Prompt 工程优化

### 确保多角度一致性的Prompt技巧

```
CONSISTENCY REQUIREMENTS:
1. The generated image must show the EXACT SAME PERSON as in the reference photo(s)
2. Facial features, skin tone, head shape must be identical
3. If generating side/back view from front photo only:
   - Estimate head shape based on visible facial structure
   - Maintain consistent ear position relative to eyes
   - Keep neck proportions consistent
4. Hair characteristics must be consistent across all angles:
   - Same color throughout
   - Same texture and curl pattern
   - Same length (accounting for perspective)
   - Same volume and density
```

### 确保编辑一致性的Prompt技巧

```
EDIT CONSISTENCY REQUIREMENTS:
1. This is an EDIT of the previous result, not a new generation
2. Keep 90% of the image identical to the previous version
3. Only modify the specifically requested attributes:
   [LIST CHANGES HERE]
4. The person should be immediately recognizable as the same
5. Lighting, background, and angle must remain exactly the same
6. Changes should look natural, not artificially modified
```

---

*技术规格文档 v1.1*  
*最后更新: January 2026*
