# 🎨 白标定制化与主题系统

## 一、核心商业价值

### 隐形整合 vs 第三方工具

| 方面 | 第三方工具感觉 | 白标整合感觉 |
|------|---------------|-------------|
| **品牌印象** | "他们用了一个App" | "他们有自己的预览系统" |
| **专业度** | 像是省成本的方案 | 像是高端定制服务 |
| **信任感** | 数据给了第三方？ | 都在店家的系统里 |
| **差异化** | 竞争对手也能用 | "这是我们的独家技术" |

### 销售话术

> "您的客户不会看到任何'HairVision'的字样。在她们眼里，这就是您沙龙的专属系统，跟您的网站、品牌完全融合。这种专业感和独家体验，是普通工具给不了的。"

> "就算只有10%的客户真正使用预览功能，剩下90%看到您店里有这个'高端系统'，也会对品牌印象加分。"

---

## 二、等位区策略

### 场景设计

```
┌─────────────────────────────────────────────────────────────────┐
│                         等位区                                   │
│                                                                 │
│    ┌──────────┐         ┌──────────────────────────────┐       │
│    │          │         │                              │       │
│    │  扫码    │         │      公共 iPad               │       │
│    │  体验    │         │      (嵌入沙龙品牌界面)       │       │
│    │          │         │                              │       │
│    │ [QR码]   │         │  "等待时，探索您的新造型"     │       │
│    │          │         │                              │       │
│    └──────────┘         └──────────────────────────────────┘   │
│                                                                 │
│    💡 顾客等位时自行浏览，增加参与感和期待感                      │
│    💡 无压力体验，不打扰服务流程                                 │
│    💡 顾客可能主动要求"我刚才看到一个发型想做"                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 等位区专属模式

- 简化界面，只有"浏览发型"功能
- 不需要拍照，用示例模特展示效果
- 收藏功能 → 扫码发送到手机 → 咨询时展示给造型师
- 沙龙招牌项目优先展示

---

## 三、主题系统架构

### 3.1 主题配置结构

```typescript
interface SalonTheme {
  // 基础信息
  salonId: string;
  salonName: string;
  
  // Logo & 品牌
  branding: {
    logo: string;              // Logo URL
    logoPosition: 'left' | 'center';
    favicon: string;
    appName: string;           // 显示名称，如 "Serge Normant Style Preview"
    tagline?: string;          // 标语
  };
  
  // 颜色系统
  colors: {
    primary: string;           // 主色
    primaryLight: string;
    primaryDark: string;
    secondary: string;         // 强调色
    background: string;        // 背景色
    backgroundSecondary: string;
    text: string;              // 主文字色
    textSecondary: string;
    textMuted: string;
    border: string;
    success: string;
    error: string;
  };
  
  // 字体
  typography: {
    fontFamily: string;        // 主字体
    headingFont?: string;      // 标题字体（可选）
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
    };
    fontWeight: {
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
    };
  };
  
  // 圆角
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  
  // 阴影
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
  
  // 按钮样式
  buttons: {
    primary: {
      background: string;
      text: string;
      hoverBackground: string;
      borderRadius: string;
    };
    secondary: {
      background: string;
      text: string;
      border: string;
      hoverBackground: string;
    };
  };
  
  // 卡片样式
  cards: {
    background: string;
    border: string;
    borderRadius: string;
    shadow: string;
    selectedBorder: string;
  };
  
  // 自定义CSS（高级）
  customCSS?: string;
}
```

### 3.2 预设主题模板

```typescript
// 经典黑金（默认）
const classicBlackGold: SalonTheme = {
  colors: {
    primary: '#000000',
    secondary: '#D4AF37',  // 金色
    background: '#FFFFFF',
    text: '#1A1A1A',
    // ...
  },
  // ...
};

// 现代极简白
const modernMinimal: SalonTheme = {
  colors: {
    primary: '#111111',
    secondary: '#666666',
    background: '#FAFAFA',
    text: '#333333',
    // ...
  },
  // ...
};

// 奢华深色
const luxuryDark: SalonTheme = {
  colors: {
    primary: '#C9A962',  // 香槟金
    secondary: '#8B7355',
    background: '#1A1A1A',
    text: '#F5F5F5',
    // ...
  },
  // ...
};

// 柔和女性化
const softFeminine: SalonTheme = {
  colors: {
    primary: '#B76E79',  // 玫瑰金
    secondary: '#E8D5D5',
    background: '#FDF8F8',
    text: '#4A4A4A',
    // ...
  },
  // ...
};

// 都市工业风
const urbanIndustrial: SalonTheme = {
  colors: {
    primary: '#2D2D2D',
    secondary: '#FF6B35',  // 橙色
    background: '#F0F0F0',
    text: '#1A1A1A',
    // ...
  },
  // ...
};
```

### 3.3 主题生成器

基于沙龙网站自动提取配色：

```typescript
interface WebsiteAnalysis {
  extractedColors: {
    dominant: string[];      // 主要颜色
    accent: string[];        // 强调色
    background: string[];    // 背景色
    text: string[];          // 文字色
  };
  fonts: {
    headings: string[];
    body: string[];
  };
  style: 'minimal' | 'luxury' | 'modern' | 'classic' | 'playful';
}

// 分析目标网站，生成匹配主题
async function generateThemeFromWebsite(url: string): Promise<SalonTheme> {
  // 1. 抓取网站截图和CSS
  // 2. 提取主要颜色
  // 3. 识别字体
  // 4. 判断整体风格
  // 5. 生成匹配的主题配置
}
```

---

## 四、技术实现

### 4.1 CSS变量系统

```css
/* 主题变量 - 由配置动态生成 */
:root {
  /* 颜色 */
  --color-primary: var(--theme-primary, #000000);
  --color-primary-light: var(--theme-primary-light, #333333);
  --color-secondary: var(--theme-secondary, #D4AF37);
  --color-background: var(--theme-background, #FFFFFF);
  --color-background-secondary: var(--theme-background-secondary, #F8F8F8);
  --color-text: var(--theme-text, #1A1A1A);
  --color-text-secondary: var(--theme-text-secondary, #666666);
  --color-border: var(--theme-border, #E5E5E5);
  
  /* 字体 */
  --font-family: var(--theme-font-family, 'Inter', sans-serif);
  --font-heading: var(--theme-font-heading, var(--font-family));
  
  /* 圆角 */
  --radius-sm: var(--theme-radius-sm, 8px);
  --radius-md: var(--theme-radius-md, 12px);
  --radius-lg: var(--theme-radius-lg, 16px);
  --radius-xl: var(--theme-radius-xl, 24px);
  
  /* 阴影 */
  --shadow-sm: var(--theme-shadow-sm, 0 1px 2px rgba(0,0,0,0.05));
  --shadow-md: var(--theme-shadow-md, 0 4px 6px rgba(0,0,0,0.1));
  --shadow-lg: var(--theme-shadow-lg, 0 10px 15px rgba(0,0,0,0.1));
}

/* 组件使用变量 */
.button-primary {
  background: var(--color-primary);
  color: white;
  border-radius: var(--radius-md);
}

.card {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}
```

### 4.2 主题Provider组件

```typescript
// ThemeProvider.tsx
'use client';

import { createContext, useContext, useEffect } from 'react';
import type { SalonTheme } from '@/types';

const ThemeContext = createContext<SalonTheme | null>(null);

export function ThemeProvider({ 
  theme, 
  children 
}: { 
  theme: SalonTheme; 
  children: React.ReactNode 
}) {
  // 将主题配置注入CSS变量
  useEffect(() => {
    const root = document.documentElement;
    
    // 颜色
    root.style.setProperty('--theme-primary', theme.colors.primary);
    root.style.setProperty('--theme-primary-light', theme.colors.primaryLight);
    root.style.setProperty('--theme-secondary', theme.colors.secondary);
    root.style.setProperty('--theme-background', theme.colors.background);
    root.style.setProperty('--theme-text', theme.colors.text);
    root.style.setProperty('--theme-border', theme.colors.border);
    
    // 字体
    root.style.setProperty('--theme-font-family', theme.typography.fontFamily);
    
    // 圆角
    root.style.setProperty('--theme-radius-sm', theme.borderRadius.sm);
    root.style.setProperty('--theme-radius-md', theme.borderRadius.md);
    root.style.setProperty('--theme-radius-lg', theme.borderRadius.lg);
    
    // 加载自定义字体
    if (theme.typography.fontFamily !== 'Inter') {
      loadGoogleFont(theme.typography.fontFamily);
    }
  }, [theme]);
  
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
```

### 4.3 项目结构调整

```
hair-vision/
├── src/
│   ├── app/
│   │   ├── [salonSlug]/           # 动态沙龙路由
│   │   │   ├── page.tsx           # 沙龙首页
│   │   │   ├── capture/
│   │   │   ├── styles/
│   │   │   ├── color/
│   │   │   └── result/
│   │   └── demo/                   # 演示模式
│   │       └── [targetSalon]/      # 针对目标沙龙的演示
│   ├── themes/
│   │   ├── default.ts             # 默认主题
│   │   ├── presets/               # 预设主题
│   │   │   ├── classic-black-gold.ts
│   │   │   ├── modern-minimal.ts
│   │   │   ├── luxury-dark.ts
│   │   │   └── soft-feminine.ts
│   │   └── salons/                # 沙龙专属主题
│   │       ├── serge-normant.ts
│   │       ├── sally-hershberger.ts
│   │       └── ...
│   ├── components/
│   │   ├── themed/                # 主题化组件
│   │   │   ├── ThemedButton.tsx
│   │   │   ├── ThemedCard.tsx
│   │   │   └── ThemedHeader.tsx
│   │   └── ...
│   └── lib/
│       ├── theme-generator.ts     # 主题生成器
│       └── website-analyzer.ts    # 网站分析器
└── ...
```

---

## 五、销售演示流程

### 演示准备清单

在拜访每个沙龙之前：

```
┌─────────────────────────────────────────────────────────────────┐
│                    拜访前准备 (1-2小时)                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1️⃣ 分析目标沙龙网站                                            │
│     └── 提取配色、字体、整体风格                                 │
│                                                                 │
│  2️⃣ 生成专属演示主题                                            │
│     └── 颜色、Logo、品牌名称                                     │
│                                                                 │
│  3️⃣ 配置沙龙专属URL                                             │
│     └── demo.hairvision.app/serge-normant                      │
│                                                                 │
│  4️⃣ 添加几款沙龙风格的"招牌发型"                                │
│     └── 根据沙龙定位选择合适的发型                               │
│                                                                 │
│  5️⃣ 准备iPad演示                                                │
│     └── 全屏模式，像沙龙自己的App                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 演示话术

**进入沙龙时**:
> "您好，我为您准备了一个专属的演示。这就是它在您的品牌下看起来的样子..."
> [展示已经配好品牌色和Logo的界面]

**展示时**:
> "您的客户不会看到任何第三方的标识。在她们眼里，这就是[沙龙名]的专属系统。"

**强调价值**:
> "就算等位的客户只是随便看看，没有真的用来预览，她们也会觉得——'这家店真的很专业，连造型预览系统都是定制的'。这种品牌印象是无价的。"

---

## 六、定价策略更新

### 白标溢价

| 套餐 | 月费 | 白标级别 |
|------|------|---------|
| Essential | $199 | 基础品牌化（Logo + 主色调） |
| Professional | $499 | 完全白标 + 自定义域名 |
| Enterprise | $999 | 完全定制 + 专属开发支持 |

### 一次性定制费

| 服务 | 费用 | 内容 |
|------|------|------|
| 基础主题匹配 | 免费 | 从预设模板选择 + 调整颜色 |
| 网站风格复刻 | $500 | 分析网站 + 完全匹配 |
| 深度定制 | $2,000+ | UI重设计 + 特殊功能 |

---

## 七、技术路线图

### Phase 1: MVP白标 (2周)
- [ ] CSS变量系统
- [ ] ThemeProvider组件
- [ ] 5个预设主题模板
- [ ] 基础品牌配置（Logo、颜色、名称）

### Phase 2: 高级定制 (4周)
- [ ] 完整主题配置界面
- [ ] 自定义域名支持
- [ ] 沙龙后台管理
- [ ] 主题导入/导出

### Phase 3: 自动化 (未来)
- [ ] 网站自动分析
- [ ] AI主题生成
- [ ] 一键复刻网站风格

---

## 八、竞争优势总结

| 我们 | 竞品 |
|------|------|
| ✅ 完全融入沙龙品牌 | ❌ 第三方工具感 |
| ✅ 顾客感觉是沙龙专属 | ❌ 显示第三方Logo |
| ✅ 增加品牌专业感 | ❌ 降低品牌独特性 |
| ✅ 可作为等位区互动 | ❌ 只是工具 |
| ✅ 演示即定制 | ❌ 通用界面 |

---

*白标系统设计 v1.0*  
*最后更新: January 2026*
