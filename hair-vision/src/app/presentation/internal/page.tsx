'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Maximize,
  Monitor,
  Code,
  DollarSign,
  Target,
  MessageSquare,
  Calendar,
  Users,
  Zap,
  Shield,
  TrendingUp,
  Layers,
  Palette,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

// 内部演示文稿 - 技术、商业、计划
export default function InternalPresentation() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const slides: SlideData[] = [
    // 封面
    {
      type: 'cover',
      title: 'MeRROR',
      subtitle: '高端沙龙造型预览系统',
      footer: '内部商业计划 | January 2026',
    },
    // 目录
    {
      type: 'toc',
      title: '目录',
      items: [
        { icon: <Target />, text: '项目概述与核心价值' },
        { icon: <Code />, text: '技术架构与实现' },
        { icon: <DollarSign />, text: '商业模式与定价' },
        { icon: <TrendingUp />, text: '市场研究与分析' },
        { icon: <MessageSquare />, text: '销售策略与话术' },
        { icon: <Calendar />, text: '执行计划与里程碑' },
      ],
    },
    // 项目概述
    {
      type: 'section',
      title: '项目概述',
      icon: <Target className="w-16 h-16" />,
    },
    {
      type: 'content',
      title: '我们在解决什么问题？',
      content: {
        layout: 'two-column',
        left: {
          title: '顾客痛点',
          items: [
            '"我说要层次感，结果剪成狗啃的"',
            '参考图片与实际效果差异大',
            '剪完不满意无法撤销',
            '沟通成本高，容易产生误解',
          ],
        },
        right: {
          title: '沙龙痛点',
          items: [
            '咨询时间长 (30-60分钟)',
            '沟通失败导致客户流失',
            '负面评价影响品牌',
            '造型师压力大',
          ],
        },
      },
    },
    {
      type: 'highlight',
      title: '核心洞察',
      highlight: '头发剪短不能变长',
      subtitle: '不可挽回性 = 我们的核心卖点',
      description: '一次沟通失败的代价：$300返工 + 3-12个月等待 + 客户终身流失 + 社交差评',
    },
    {
      type: 'content',
      title: '我们的解决方案',
      content: {
        layout: 'features',
        items: [
          { icon: '📷', title: '拍照/上传', desc: 'iPad现场拍摄' },
          { icon: '💇', title: '发型库', desc: '18+精选发型' },
          { icon: '🎨', title: '染发预览', desc: '17种发色' },
          { icon: '🔄', title: '多视角', desc: '正面/侧面/背面' },
          { icon: '✨', title: '参数调整', desc: '长度/卷度/光泽' },
          { icon: '💎', title: '白标定制', desc: '完全融入品牌' },
        ],
      },
    },
    // 技术架构
    {
      type: 'section',
      title: '技术架构',
      icon: <Code className="w-16 h-16" />,
    },
    {
      type: 'content',
      title: '技术栈',
      content: {
        layout: 'tech-stack',
        items: [
          { category: 'Frontend', techs: ['Next.js 14', 'React', 'TailwindCSS', 'Framer Motion', 'PWA Support'] },
          { category: 'Backend', techs: ['Vercel Serverless', 'Edge Functions', 'API Routes'] },
          { category: 'AI', techs: ['Google Gemini 2.0 Flash', 'Image Generation API', 'Prompt Engineering'] },
          { category: 'Storage', techs: ['Supabase (Database + Auth)', 'Cloudinary (Images)'] },
          { category: 'DevOps', techs: ['Vercel (Deployment)', 'GitHub Actions (CI/CD)', 'Sentry (Monitoring)'] },
        ],
      },
    },
    {
      type: 'content',
      title: '系统架构',
      content: {
        layout: 'architecture',
        layers: [
          { name: 'Frontend Layer', desc: 'Next.js 14 App Router, iPad优化响应式设计' },
          { name: 'API Layer', desc: 'Vercel Serverless Functions, Edge Functions' },
          { name: 'AI Layer', desc: 'Google Gemini API, 图像生成与处理' },
          { name: 'Data Layer', desc: 'Supabase (用户/沙龙/生成记录), Cloudinary (图片存储)' },
        ],
      },
    },
    {
      type: 'content',
      title: '核心技术挑战',
      content: {
        layout: 'challenges',
        items: [
          { 
            challenge: '多角度一致性', 
            solution: '多张参考图输入 + Prompt工程优化',
            status: 'V1.5',
          },
          { 
            challenge: '持续编辑不变形', 
            solution: '参数化Prompt + 基于前图编辑',
            status: 'V1.5',
          },
          { 
            challenge: '生成速度', 
            solution: 'Edge Functions + 流式响应',
            status: '已实现',
          },
          { 
            challenge: '白标主题系统', 
            solution: 'CSS变量 + ThemeProvider',
            status: '已实现',
          },
        ],
      },
    },
    {
      type: 'code',
      title: 'Gemini Prompt 策略',
      code: `// 核心Prompt结构
const prompt = \`
Transform this person's hairstyle while keeping 
their face EXACTLY the same.

HAIRSTYLE: \${style.promptDescription}
HAIR COLOR: \${color?.promptDescription || 'Keep original'}
VIEW ANGLE: \${viewAngle}

CRITICAL REQUIREMENTS:
1. Face must remain IDENTICAL
2. Hair must look natural and realistic
3. Professional salon quality output
\`;`,
    },
    {
      type: 'content',
      title: '多角度一致性方案',
      content: {
        layout: 'multi-angle',
        current: {
          approach: '单张正面照片 + AI想象',
          pros: ['操作简单', '降低使用门槛', '快速出图'],
          cons: ['侧面/背面可能不准确', '个人特征无法精确呈现', '不同角度可能不一致'],
        },
        future: {
          approach: '多角度拍摄输入 (V1.5)',
          features: ['正面(必需) + 左侧45度(可选) + 右侧45度(可选) + 背面(可选)', '多张参考图提高一致性', '更准确的个人特征'],
        },
      },
    },
    {
      type: 'content',
      title: '持续编辑功能设计',
      content: {
        layout: 'editing-features',
        features: [
          { name: '长度调整', desc: '滑块: -5cm 到 +5cm', status: 'V1.5' },
          { name: '层次感', desc: '滑块: 0-100%', status: 'V1.5' },
          { name: '卷度大小', desc: '5档选择: 直发/微卷/中卷/大卷/小卷', status: 'V1.5' },
          { name: '光泽度', desc: '滑块: 0-100%', status: 'V1.5' },
          { name: '颜色深浅', desc: '滑块: -50 到 +50', status: 'V1.5' },
          { name: '刘海长度', desc: '5档选择', status: 'V1.5' },
        ],
        strategy: '基于前图的编辑指令 + 参数化Prompt',
      },
    },
    {
      type: 'content',
      title: '白标主题系统',
      content: {
        layout: 'white-label',
        features: [
          { feature: '品牌融合', desc: 'Logo、配色、字体完全匹配沙龙品牌' },
          { feature: 'CSS变量系统', desc: '动态主题注入，无需重新编译' },
          { feature: '预设模板', desc: '5种预设主题 + 自定义主题' },
          { feature: '等位区模式', desc: '简化界面，顾客自行浏览' },
          { feature: '自定义域名', desc: 'Professional+ 套餐支持' },
        ],
        value: '顾客看不到任何第三方标识，完全融入沙龙品牌',
      },
    },
    // 商业模式
    {
      type: 'section',
      title: '商业模式',
      icon: <DollarSign className="w-16 h-16" />,
    },
    {
      type: 'content',
      title: '定价策略',
      content: {
        layout: 'pricing',
        tiers: [
          { 
            name: 'Essential', 
            price: '$149', 
            period: '/月',
            features: ['系统发型库', '基础生成 300次/月', 'Logo + 主色调定制'],
            highlight: false,
          },
          { 
            name: 'Professional', 
            price: '$299', 
            period: '/月',
            features: ['自定义发型 10款', '服务关联推荐', '完全白标', '自定义域名', '800次/月'],
            highlight: true,
          },
          { 
            name: 'Enterprise', 
            price: '$599', 
            period: '/月',
            features: ['无限自定义', '数据分析', 'API接入', '专属支持', '2500次/月'],
            highlight: false,
          },
        ],
      },
    },
    {
      type: 'content',
      title: '收入模型',
      content: {
        layout: 'revenue',
        scenarios: [
          { 
            label: '保守 (Year 1)', 
            salons: 25, 
            avgPrice: 250, 
            monthly: '$6,250',
            annual: '$75,000',
          },
          { 
            label: '目标 (Year 1)', 
            salons: 60, 
            avgPrice: 300, 
            monthly: '$18,000',
            annual: '$216,000',
          },
          { 
            label: '乐观 (Year 2)', 
            salons: 180, 
            avgPrice: 350, 
            monthly: '$63,000',
            annual: '$756,000',
          },
        ],
      },
    },
    {
      type: 'content',
      title: '成本结构',
      content: {
        layout: 'costs',
        items: [
          { category: '技术运营', monthly: '$150', items: ['Vercel Pro $20', 'Supabase $25', 'Gemini API $50-100'] },
          { category: '纽约地推', monthly: '$700', items: ['交通 $200', '餐饮约见 $300', '营销材料 $200'] },
          { category: '一次性', amount: '$800', items: ['演示用iPad'] },
        ],
        total: '~$1,000/月 (初期)',
      },
    },
    {
      type: 'highlight',
      title: 'ROI 卖点',
      highlight: '2个升级 = 回本',
      subtitle: '每月只需2个客户因"看到效果"而升级染发，即可回本',
      description: '客户升级率提升20%，平均+$165 → 每月$9,900+额外收入 (以300客户/月计算)',
    },
    {
      type: 'content',
      title: '信用系统与定价策略',
      content: {
        layout: 'two-column',
        left: {
          title: '订阅套餐',
          items: [
            'Essential: $199/月 (200次)',
            'Professional: $499/月 (500次)',
            'Enterprise: $999/月 (2000次)',
            '主要收入来源：订阅',
          ],
        },
        right: {
          title: '按需付费',
          items: [
            '接近成本价：$0.13-$0.15/次',
            '目的：鼓励升级套餐',
            '订阅更划算：节省74-86%',
            '服务永不中断（允许超支）',
          ],
        },
      },
    },
    {
      type: 'content',
      title: '服务质量保证',
      content: {
        layout: 'two-column',
        left: {
          title: '一致的服务质量',
          items: [
            '始终使用 Gemini 3.0 Pro',
            '不因信用问题降级',
            '客户体验一致',
            '高质量输出保证',
          ],
        },
        right: {
          title: '业务安全方案',
          items: [
            '仅在 API 错误时降级',
            '配额限制自动切换',
            '服务不中断',
            '技术问题自动处理',
          ],
        },
      },
    },
    {
      type: 'content',
      title: '自动使用提醒',
      content: {
        layout: 'features',
        items: [
          { icon: '📊', title: '80% 使用率', desc: '友好提醒使用情况' },
          { icon: '⚠', title: '95% 使用率', desc: '严重警告，建议升级' },
          { icon: '💳', title: '超支通知', desc: '说明服务继续，月底结算' },
          { icon: '📧', title: '邮件提醒', desc: '24小时频率控制，避免重复' },
          { icon: '📈', title: '使用统计', desc: '详细的使用数据和成本分析' },
          { icon: '🔄', title: '月度重置', desc: '基础信用每月自动重置' },
        ],
      },
    },
    // 市场研究
    {
      type: 'section',
      title: '市场研究与分析',
      icon: <TrendingUp className="w-16 h-16" />,
    },
    {
      type: 'content',
      title: '市场规模分析',
      content: {
        layout: 'two-column',
        left: {
          title: '市场背景',
          items: [
            '全球美发市场: $105-108B (2024)',
            '美国美发市场: $20.12B (2025), 年增长4.57%',
            '高端美发市场: $8.13B (2024) → $12.62B (2033)',
            '沙龙软件市场: $2-3B 全球',
          ],
        },
        right: {
          title: '目标市场 (NYC)',
          items: [
            '总沙龙数: 8,000-10,000 (需验证)',
            '高端沙龙 ($150+): 500-800 (需验证)',
            '目标客户 (ICP): 200-300 (需验证)',
            'SAM: $960K-$1.44M/年 (需验证)',
            '数据来源: 使用 /admin/research 工具验证',
          ],
        },
      },
    },
    {
      type: 'content',
      title: '竞争分析',
      content: {
        layout: 'two-column',
        left: {
          title: '直接竞争对手',
          items: [
            'YouCam Makeup: 消费者应用，威胁低',
            'Style My Hair (L\'Oréal): 产品推广工具，威胁低',
            'Perfect Corp B2B: $5K-$50K+，威胁中等',
          ],
        },
        right: {
          title: '间接竞争对手',
          items: [
            'Vagaro: $25-75/月 (运营工具)',
            'Square: $29-69/月 (预约系统)',
            'Mindbody: $129-249/月 (完整套件)',
            '关键洞察: 这些平台专注运营，不解决沟通问题',
          ],
        },
      },
    },
    {
      type: 'content',
      title: '关键发现与风险',
      content: {
        layout: 'challenges',
        items: [
          { 
            challenge: '✓ 问题真实存在', 
            solution: '沟通失败在沙龙中确实存在，有数据支持',
            risk: '低',
          },
          { 
            challenge: '⚠ 市场规模未验证', 
            solution: '需要验证73%不满意率等关键假设',
            risk: '中',
          },
          { 
            challenge: '⚠ 定价可能过高', 
            solution: '建议启动时使用"创始人定价" $99-$199',
            risk: '中',
          },
          { 
            challenge: '⚠ 销售周期较长', 
            solution: 'B2B沙龙销售通常3-6个月，需调整预期',
            risk: '中',
          },
          { 
            challenge: '✓ 竞争护城河', 
            solution: '白标定位是明智的差异化策略',
            risk: '低',
          },
        ],
      },
    },
    {
      type: 'content',
      title: '定价策略建议',
      content: {
        layout: 'two-column',
        left: {
          title: '当前定价',
          items: [
            'Essential: $199/月',
            'Professional: $499/月',
            'Enterprise: $999/月',
          ],
        },
        right: {
          title: '建议调整',
          items: [
            '启动期: "创始人定价" $99-$249',
            '收集ROI数据证明价值',
            '6个月后逐步提升至$199-$499',
            '基于实际转化数据调整',
          ],
        },
      },
    },
    {
      type: 'content',
      title: '销售策略建议',
      content: {
        layout: 'two-column',
        left: {
          title: '当前计划',
          items: [
            'Month 1-2: 20+沙龙访问',
            'Month 3-4: 5个试用转化',
            'Month 5-6: 30+付费客户',
          ],
        },
        right: {
          title: '建议调整',
          items: [
            'Month 1-2: 100+冷接触, 30+访问, 5-10试用',
            'Month 3-4: 10-15付费客户 (非5个)',
            'Month 5-6: 25-40客户 (非30个)',
            '聚焦早期采用者: 技术导向沙龙',
          ],
        },
      },
    },
    {
      type: 'highlight',
      title: '关键验证需求',
      highlight: '在规模化前必须验证',
      subtitle: '1. 73%不满意率 | 2. 15-20%升级转化率 | 3. $199-499价格接受度',
      description: '建议: 前3-5个试点客户收集真实数据，验证ROI故事后再扩展。使用 /admin/research 工具收集和验证市场数据。',
    },
    {
      type: 'content',
      title: '数据验证状态',
      content: {
        layout: 'two-column',
        left: {
          title: '已验证数据',
          items: [
            '使用 /admin/research 工具验证',
            'NYC 沙龙数量（通过 API 查询）',
            '竞争分析（通过市场研究）',
          ],
        },
        right: {
          title: '待验证假设',
          items: [
            '73% 客户不满意率',
            '$300+ 颜色修正成本',
            '6个月等待时间',
            '市场规模数据',
            '定价接受度',
          ],
        },
      },
    },
    // 销售策略
    {
      type: 'section',
      title: '销售策略',
      icon: <MessageSquare className="w-16 h-16" />,
    },
    {
      type: 'content',
      title: '目标客户 (ICP)',
      content: {
        layout: 'icp',
        criteria: [
          { label: '位置', value: 'Manhattan, Brooklyn (SoHo, UES, Williamsburg)' },
          { label: '定位', value: '高端/精品沙龙' },
          { label: '客单价', value: '$150+ 剪发, $300+ 染发' },
          { label: '规模', value: '3-15位造型师' },
          { label: '特点', value: '重视客户体验, 愿意投资技术' },
        ],
      },
    },
    {
      type: 'content',
      title: '核心销售话术',
      content: {
        layout: 'scripts',
        scripts: [
          {
            scenario: '开场',
            script: '"我们专门为高端沙龙开发了造型预览系统，让您的客户在剪发前就看到效果，减少沟通时间和决策焦虑。"',
          },
          {
            scenario: '造型师价值',
            script: '"这不是取代造型师，而是让造型师的专业判断被客户\'看见\'。您说\'这款更适合您\'，她能直接看到为什么。"',
          },
          {
            scenario: '增值销售',
            script: '"客户犹豫要不要染发？让她看到效果。转化率能提升20%，每个月多几个染发客户就回本了。"',
          },
          {
            scenario: '白标价值',
            script: '"您的客户看不到任何第三方标识，这就是您沙龙的专属系统。就算只有10%使用，90%看到也会觉得很专业。"',
          },
        ],
      },
    },
    {
      type: 'content',
      title: '异议处理',
      content: {
        layout: 'objections',
        items: [
          { objection: '"太贵了"', response: '每天不到$15，一个染发升级就回本' },
          { objection: '"我们不需要"', response: '您的竞争对手可能已经在用类似技术了' },
          { objection: '"效果不真实"', response: '我现在给您演示，您亲眼看看' },
          { objection: '"客户不会用"', response: '造型师操作，客户只需要看和选择' },
          { objection: '"造型师会抵触"', response: '这是赋能工具，让专业判断被"看见"，不是取代' },
          { objection: '"技术太复杂"', response: '30秒完成预览，操作比拍照还简单' },
        ],
      },
    },
    {
      type: 'content',
      title: '造型师赋能策略',
      content: {
        layout: 'stylist-empowerment',
        keyPoints: [
          { point: '定位', desc: '专业助手，不是AI设计师' },
          { point: '流程', desc: '造型师问诊 → 专业分析 → 推荐方案 → MeRROR可视化 → 客户决策' },
          { point: '价值', desc: '让专业判断被"看见"，增强说服力' },
          { point: '话术', desc: '"这款更适合您的脸型" + 可视化效果 = 客户信服' },
        ],
        scenarios: [
          { from: '剪发 $50', to: '看到染色效果 → 升级染发', increase: '+$150-250' },
          { from: '犹豫烫发', to: '看到烫发效果 → 决定尝试', increase: '+$200-350' },
          { from: '普通服务', to: '看到招牌项目 → 升级', increase: '+$150-300' },
        ],
      },
    },
    {
      type: 'content',
      title: '沙龙定制化功能',
      content: {
        layout: 'salon-customization',
        features: [
          { feature: '自定义发型库', desc: '添加沙龙招牌发型/独家设计 (Professional+)' },
          { feature: '服务关联推荐', desc: '每个发型关联推荐服务和产品' },
          { feature: '效果对比模式', desc: '基础服务 vs 高级服务对比展示' },
          { feature: '护理效果预览', desc: '光泽度、顺滑度等参数调整预览' },
        ],
        example: {
          signature: 'Cloud Perm 云朵烫',
          services: ['深层护理 $150', '光泽护理 $80'],
          products: ['卷发定型慕斯 $45', '护色洗发水 $38'],
        },
      },
    },
    // 执行计划
    {
      type: 'section',
      title: '执行计划',
      icon: <Calendar className="w-16 h-16" />,
    },
    {
      type: 'content',
      title: '里程碑计划',
      content: {
        layout: 'timeline',
        milestones: [
          { phase: 'Month 1-2', title: '冷启动', tasks: ['走访20+沙龙', '产品演示', '收集反馈', '签约5家试用'] },
          { phase: 'Month 3-4', title: '验证期', tasks: ['迭代产品', '转化付费', '案例研究', '优化话术'] },
          { phase: 'Month 5-6', title: '扩张期', tasks: ['签约30+客户', '招聘销售', '扩展LA/Miami'] },
          { phase: 'Year 2', title: '规模化', tasks: ['100+客户', '国际扩展', '融资准备'] },
        ],
      },
    },
    {
      type: 'content',
      title: '开发路线图',
      content: {
        layout: 'roadmap',
        phases: [
          { 
            phase: 'MVP (V1.0)', 
            status: '已完成',
            features: ['单张照片输入', '基础发型选择', '颜色选择', '多视角生成', '基础白标'],
          },
          { 
            phase: 'V1.5', 
            status: '进行中',
            features: ['颜色深浅滑块', '光泽度调整', '卷度大小选择', '长度微调', '可选多角度拍摄'],
          },
          { 
            phase: 'V2.0', 
            status: '计划中',
            features: ['完整参数化编辑', '多角度拍摄引导', '编辑历史/撤销', '参数预设保存'],
          },
          { 
            phase: 'V3.0', 
            status: '未来',
            features: ['实时预览', '3D头部模型', 'AR实时试戴'],
          },
        ],
      },
    },
    {
      type: 'content',
      title: '成本预算',
      content: {
        layout: 'budget',
        items: [
          { category: '技术运营', monthly: '$150', items: ['Vercel Pro', 'Supabase', 'Gemini API'] },
          { category: '纽约地推', monthly: '$700', items: ['交通', '餐饮约见', '营销材料'] },
          { category: '一次性', monthly: '$800', items: ['演示用iPad'] },
        ],
        total: '~$1,000/月 (初期)',
      },
    },
    // 总结
    {
      type: 'summary',
      title: '核心竞争优势',
      items: [
        { icon: <Shield />, title: '市场空白', desc: '没有专为高端沙龙设计的B2B白标方案' },
        { icon: <Zap />, title: '技术领先', desc: 'Gemini 2.0最新图像生成能力' },
        { icon: <Palette />, title: '品牌融合', desc: '完全白标，增强沙龙专业形象' },
        { icon: <TrendingUp />, title: '增值工具', desc: '不只是沟通工具，是销售转化工具' },
      ],
    },
    // 结束页
    {
      type: 'end',
      title: 'Let\'s Build This',
      subtitle: 'MeRROR - 从纽约开始，征服高端沙龙市场',
      contact: 'Internal Document | Confidential',
    },
  ];

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      } else if (e.key === 'Escape') {
        setIsFullscreen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, toggleFullscreen]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      {/* Slide Container - 16:9 */}
      <div className="relative w-full max-w-[1280px] aspect-video bg-white rounded-lg shadow-2xl overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <SlideRenderer slide={slides[currentSlide]} />
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-4">
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="p-2 rounded-full bg-black/10 hover:bg-black/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <span className="text-sm text-gray-500 min-w-[80px] text-center">
            {currentSlide + 1} / {slides.length}
          </span>
          
          <button
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            className="p-2 rounded-full bg-black/10 hover:bg-black/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Fullscreen Button */}
        <button
          onClick={toggleFullscreen}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/10 hover:bg-black/20 transition-colors"
        >
          <Maximize className="w-5 h-5" />
        </button>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
          <div 
            className="h-full bg-black transition-all duration-300"
            style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Keyboard Hints */}
      <div className="fixed bottom-4 right-4 text-xs text-gray-500 space-y-1">
        <p>← → 切换幻灯片</p>
        <p>F 全屏</p>
      </div>
    </div>
  );
}

// Types
interface SlideData {
  type: string;
  title?: string;
  subtitle?: string;
  [key: string]: unknown;
}

// Slide Renderer
function SlideRenderer({ slide }: { slide: SlideData }) {
  switch (slide.type) {
    case 'cover':
      return <CoverSlide {...slide} />;
    case 'toc':
      return <TocSlide {...slide} />;
    case 'section':
      return <SectionSlide {...slide} />;
    case 'content':
      return <ContentSlide {...slide} />;
    case 'highlight':
      return <HighlightSlide {...slide} />;
    case 'code':
      return <CodeSlide {...slide} />;
    case 'summary':
      return <SummarySlide {...slide} />;
    case 'end':
      return <EndSlide {...slide} />;
    default:
      return <div>Unknown slide type</div>;
  }
}

// Slide Components
function CoverSlide({ title, subtitle, footer }: SlideData) {
  return (
    <div className="h-full bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center text-white p-12">
      <div className="w-20 h-20 bg-amber-500 rounded-2xl flex items-center justify-center mb-8">
        <Monitor className="w-10 h-10 text-white" />
      </div>
      <h1 className="text-6xl font-bold mb-4">{title as string}</h1>
      <p className="text-2xl text-gray-400 mb-12">{subtitle as string}</p>
      <p className="text-sm text-gray-500">{footer as string}</p>
    </div>
  );
}

function TocSlide({ title, items }: SlideData) {
  const tocItems = items as { icon: React.ReactNode; text: string }[];
  return (
    <div className="h-full p-12 flex flex-col">
      <h2 className="text-4xl font-bold mb-12">{title}</h2>
      <div className="flex-1 grid grid-cols-1 gap-4">
        {tocItems.map((item, i) => (
          <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center">
              {item.icon}
            </div>
            <span className="text-xl">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionSlide({ title, icon }: SlideData) {
  return (
    <div className="h-full bg-black flex flex-col items-center justify-center text-white">
      <div className="text-amber-500 mb-6">{icon as React.ReactNode}</div>
      <h2 className="text-5xl font-bold">{title}</h2>
    </div>
  );
}

function ContentSlide({ title, content }: SlideData) {
  const contentData = content as Record<string, unknown>;
  
  return (
    <div className="h-full p-12 flex flex-col overflow-hidden">
      <h2 className="text-3xl font-bold mb-6">{title}</h2>
      <div className="flex-1 overflow-auto">
        {contentData.layout === 'two-column' && <TwoColumnLayout content={contentData} />}
        {contentData.layout === 'features' && <FeaturesLayout content={contentData} />}
        {contentData.layout === 'tech-stack' && <TechStackLayout content={contentData} />}
        {contentData.layout === 'challenges' && <ChallengesLayout content={contentData} />}
        {contentData.layout === 'pricing' && <PricingLayout content={contentData} />}
        {contentData.layout === 'revenue' && <RevenueLayout content={contentData} />}
        {contentData.layout === 'icp' && <IcpLayout content={contentData} />}
        {contentData.layout === 'scripts' && <ScriptsLayout content={contentData} />}
        {contentData.layout === 'objections' && <ObjectionsLayout content={contentData} />}
        {contentData.layout === 'timeline' && <TimelineLayout content={contentData} />}
        {contentData.layout === 'budget' && <BudgetLayout content={contentData} />}
        {contentData.layout === 'architecture' && <ArchitectureLayout content={contentData} />}
        {contentData.layout === 'multi-angle' && <MultiAngleLayout content={contentData} />}
        {contentData.layout === 'editing-features' && <EditingFeaturesLayout content={contentData} />}
        {contentData.layout === 'white-label' && <WhiteLabelLayout content={contentData} />}
        {contentData.layout === 'costs' && <CostsLayout content={contentData} />}
        {contentData.layout === 'stylist-empowerment' && <StylistEmpowermentLayout content={contentData} />}
        {contentData.layout === 'salon-customization' && <SalonCustomizationLayout content={contentData} />}
        {contentData.layout === 'roadmap' && <RoadmapLayout content={contentData} />}
      </div>
    </div>
  );
}

function HighlightSlide({ title, highlight, subtitle, description }: SlideData) {
  return (
    <div className="h-full bg-gradient-to-br from-amber-500 to-amber-600 flex flex-col items-center justify-center text-white p-12 text-center">
      <p className="text-xl mb-4 opacity-80">{title as string}</p>
      <h2 className="text-6xl font-bold mb-4">{highlight as string}</h2>
      <p className="text-2xl mb-8">{subtitle as string}</p>
      <p className="text-lg opacity-80 max-w-2xl">{description as string}</p>
    </div>
  );
}

function CodeSlide({ title, code }: SlideData) {
  return (
    <div className="h-full p-12 bg-gray-900 text-white flex flex-col">
      <h2 className="text-3xl font-bold mb-8">{title}</h2>
      <pre className="flex-1 bg-black/50 rounded-xl p-6 overflow-auto text-sm font-mono">
        <code>{code as string}</code>
      </pre>
    </div>
  );
}

function SummarySlide({ title, items }: SlideData) {
  const summaryItems = items as { icon: React.ReactNode; title: string; desc: string }[];
  return (
    <div className="h-full p-12 flex flex-col">
      <h2 className="text-4xl font-bold mb-12 text-center">{title}</h2>
      <div className="flex-1 grid grid-cols-2 gap-6">
        {summaryItems.map((item, i) => (
          <div key={i} className="flex gap-4 p-6 bg-gray-50 rounded-2xl">
            <div className="w-14 h-14 bg-black text-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
              {item.icon}
            </div>
            <div>
              <h3 className="font-bold text-lg">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EndSlide({ title, subtitle, contact }: SlideData) {
  return (
    <div className="h-full bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center text-white p-12 text-center">
      <h2 className="text-5xl font-bold mb-4">{title as string}</h2>
      <p className="text-xl text-gray-400 mb-12">{subtitle as string}</p>
      <p className="text-sm text-gray-500">{contact as string}</p>
    </div>
  );
}

// Layout Components
function TwoColumnLayout({ content }: { content: Record<string, unknown> }) {
  const left = content.left as { title: string; items: string[] };
  const right = content.right as { title: string; items: string[] };
  
  return (
    <div className="grid grid-cols-2 gap-8 h-full">
      <div className="bg-red-50 rounded-2xl p-6">
        <h3 className="font-bold text-xl mb-4">{left.title}</h3>
        <ul className="space-y-3">
          {left.items.map((item, i) => (
            <li key={i} className="flex gap-2 text-gray-700">
              <span className="text-red-500">•</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-orange-50 rounded-2xl p-6">
        <h3 className="font-bold text-xl mb-4">{right.title}</h3>
        <ul className="space-y-3">
          {right.items.map((item, i) => (
            <li key={i} className="flex gap-2 text-gray-700">
              <span className="text-orange-500">•</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function FeaturesLayout({ content }: { content: Record<string, unknown> }) {
  const items = content.items as { icon: string; title: string; desc: string }[];
  return (
    <div className="grid grid-cols-3 gap-4 h-full">
      {items.map((item, i) => (
        <div key={i} className="bg-gray-50 rounded-2xl p-6 flex flex-col items-center text-center">
          <span className="text-4xl mb-3">{item.icon}</span>
          <h3 className="font-bold">{item.title}</h3>
          <p className="text-sm text-gray-500">{item.desc}</p>
        </div>
      ))}
    </div>
  );
}

function TechStackLayout({ content }: { content: Record<string, unknown> }) {
  const items = content.items as { category: string; techs: string[] }[];
  return (
    <div className="grid grid-cols-2 gap-6">
      {items.map((item, i) => (
        <div key={i} className="bg-gray-900 text-white rounded-2xl p-6">
          <h3 className="font-bold text-amber-500 mb-3">{item.category}</h3>
          <div className="flex flex-wrap gap-2">
            {item.techs.map((tech, j) => (
              <span key={j} className="px-3 py-1 bg-white/10 rounded-full text-sm">
                {tech}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ChallengesLayout({ content }: { content: Record<string, unknown> }) {
  const items = content.items as { challenge: string; solution: string; status: string }[];
  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="flex-1">
            <h4 className="font-bold">{item.challenge}</h4>
            <p className="text-sm text-gray-600">{item.solution}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm ${
            item.status === '已实现' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
          }`}>
            {item.status}
          </span>
        </div>
      ))}
    </div>
  );
}

function PricingLayout({ content }: { content: Record<string, unknown> }) {
  const tiers = content.tiers as { name: string; price: string; period: string; features: string[]; highlight: boolean }[];
  return (
    <div className="grid grid-cols-3 gap-4 h-full">
      {tiers.map((tier, i) => (
        <div key={i} className={`rounded-2xl p-6 flex flex-col ${
          tier.highlight ? 'bg-black text-white ring-2 ring-amber-500' : 'bg-gray-50'
        }`}>
          <h3 className="font-bold text-xl">{tier.name}</h3>
          <div className="mt-4 mb-6">
            <span className="text-4xl font-bold">{tier.price}</span>
            <span className={tier.highlight ? 'text-gray-400' : 'text-gray-500'}>{tier.period}</span>
          </div>
          <ul className="space-y-2 flex-1">
            {tier.features.map((feature, j) => (
              <li key={j} className="flex gap-2 text-sm">
                <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${tier.highlight ? 'text-amber-500' : 'text-green-500'}`} />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function RevenueLayout({ content }: { content: Record<string, unknown> }) {
  const scenarios = content.scenarios as { label: string; salons: number; avgPrice: number; monthly: string; annual: string }[];
  return (
    <div className="space-y-4">
      {scenarios.map((s, i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="flex-1">
            <h4 className="font-bold">{s.label}</h4>
            <p className="text-sm text-gray-500">{s.salons} 沙龙 × ${s.avgPrice}/月</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-lg">{s.monthly}<span className="text-sm text-gray-500">/月</span></p>
            <p className="text-sm text-green-600">{s.annual}/年</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function IcpLayout({ content }: { content: Record<string, unknown> }) {
  const criteria = content.criteria as { label: string; value: string }[];
  return (
    <div className="grid grid-cols-2 gap-4">
      {criteria.map((c, i) => (
        <div key={i} className="p-4 bg-gray-50 rounded-xl">
          <p className="text-sm text-gray-500">{c.label}</p>
          <p className="font-medium">{c.value}</p>
        </div>
      ))}
    </div>
  );
}

function ScriptsLayout({ content }: { content: Record<string, unknown> }) {
  const scripts = content.scripts as { scenario: string; script: string }[];
  return (
    <div className="space-y-3 overflow-auto max-h-[450px]">
      {scripts.map((s, i) => (
        <div key={i} className="p-3 bg-amber-50 rounded-xl border-l-4 border-amber-500">
          <p className="text-xs font-bold text-amber-700 mb-1">{s.scenario}</p>
          <p className="text-sm text-gray-700 italic">{s.script}</p>
        </div>
      ))}
    </div>
  );
}

function ObjectionsLayout({ content }: { content: Record<string, unknown> }) {
  const items = content.items as { objection: string; response: string }[];
  return (
    <div className="grid grid-cols-2 gap-4">
      {items.map((item, i) => (
        <div key={i} className="p-4 bg-gray-50 rounded-xl">
          <p className="font-bold text-red-600 mb-2">{item.objection}</p>
          <p className="text-gray-700">→ {item.response}</p>
        </div>
      ))}
    </div>
  );
}

function TimelineLayout({ content }: { content: Record<string, unknown> }) {
  const milestones = content.milestones as { phase: string; title: string; tasks: string[] }[];
  return (
    <div className="grid grid-cols-4 gap-4">
      {milestones.map((m, i) => (
        <div key={i} className="bg-gray-50 rounded-xl p-4">
          <p className="text-sm text-amber-600 font-bold">{m.phase}</p>
          <h4 className="font-bold mb-2">{m.title}</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            {m.tasks.map((t, j) => (
              <li key={j}>• {t}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function BudgetLayout({ content }: { content: Record<string, unknown> }) {
  const items = content.items as { category: string; monthly: string; items: string[] }[];
  const total = content.total as string;
  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="flex-1">
            <h4 className="font-bold">{item.category}</h4>
            <p className="text-sm text-gray-500">{item.items.join(', ')}</p>
          </div>
          <span className="font-bold">{item.monthly}</span>
        </div>
      ))}
      <div className="flex items-center justify-between p-4 bg-black text-white rounded-xl">
        <span className="font-bold">总计</span>
        <span className="font-bold text-amber-500">{total}</span>
      </div>
    </div>
  );
}

function ArchitectureLayout({ content }: { content: Record<string, unknown> }) {
  const layers = content.layers as { name: string; desc: string }[];
  return (
    <div className="space-y-4">
      {layers.map((layer, i) => (
        <div key={i} className="p-4 bg-gray-900 text-white rounded-xl">
          <h4 className="font-bold text-amber-500 mb-2">{layer.name}</h4>
          <p className="text-sm text-gray-300">{layer.desc}</p>
        </div>
      ))}
    </div>
  );
}

function MultiAngleLayout({ content }: { content: Record<string, unknown> }) {
  const current = content.current as { approach: string; pros: string[]; cons: string[] };
  const future = content.future as { approach: string; features: string[] };
  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="bg-gray-50 rounded-xl p-6">
        <h4 className="font-bold mb-3 text-red-600">当前方案</h4>
        <p className="text-sm mb-4">{current.approach}</p>
        <div className="mb-4">
          <p className="text-xs font-semibold text-green-600 mb-2">优点:</p>
          <ul className="text-xs space-y-1">
            {current.pros.map((p, i) => (
              <li key={i}>✓ {p}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold text-red-600 mb-2">缺点:</p>
          <ul className="text-xs space-y-1">
            {current.cons.map((c, i) => (
              <li key={i}>✗ {c}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="bg-green-50 rounded-xl p-6 border-2 border-green-500">
        <h4 className="font-bold mb-3 text-green-700">未来方案 (V1.5)</h4>
        <p className="text-sm mb-4">{future.approach}</p>
        <div>
          <p className="text-xs font-semibold mb-2">特性:</p>
          <ul className="text-xs space-y-1">
            {future.features.map((f, i) => (
              <li key={i}>• {f}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function EditingFeaturesLayout({ content }: { content: Record<string, unknown> }) {
  const features = content.features as { name: string; desc: string; status: string }[];
  const strategy = content.strategy as string;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        {features.map((f, i) => (
          <div key={i} className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-bold mb-2">{f.name}</h4>
            <p className="text-sm text-gray-600 mb-2">{f.desc}</p>
            <span className={`text-xs px-2 py-1 rounded ${
              f.status === 'V1.5' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
            }`}>
              {f.status}
            </span>
          </div>
        ))}
      </div>
      <div className="bg-amber-50 rounded-xl p-4 border-l-4 border-amber-500">
        <p className="text-sm font-semibold">实现策略: {strategy}</p>
      </div>
    </div>
  );
}

function WhiteLabelLayout({ content }: { content: Record<string, unknown> }) {
  const features = content.features as { feature: string; desc: string }[];
  const value = content.value as string;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {features.map((f, i) => (
          <div key={i} className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-bold mb-2">{f.feature}</h4>
            <p className="text-sm text-gray-600">{f.desc}</p>
          </div>
        ))}
      </div>
      <div className="bg-black text-white rounded-xl p-4 text-center">
        <p className="font-semibold">{value}</p>
      </div>
    </div>
  );
}

function CostsLayout({ content }: { content: Record<string, unknown> }) {
  const items = content.items as { category: string; monthly?: string; amount?: string; items: string[] }[];
  const total = content.total as string;
  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="flex-1">
            <h4 className="font-bold">{item.category}</h4>
            <p className="text-sm text-gray-500">{item.items.join(', ')}</p>
          </div>
          <span className="font-bold">{item.monthly || item.amount}</span>
        </div>
      ))}
      <div className="flex items-center justify-between p-4 bg-black text-white rounded-xl">
        <span className="font-bold">总计</span>
        <span className="font-bold text-amber-500">{total}</span>
      </div>
    </div>
  );
}

function StylistEmpowermentLayout({ content }: { content: Record<string, unknown> }) {
  const keyPoints = content.keyPoints as { point: string; desc: string }[];
  const scenarios = content.scenarios as { from: string; to: string; increase: string }[];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {keyPoints.map((kp, i) => (
          <div key={i} className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-bold mb-2">{kp.point}</h4>
            <p className="text-sm text-gray-600">{kp.desc}</p>
          </div>
        ))}
      </div>
      <div>
        <h4 className="font-bold mb-3">增值销售场景:</h4>
        <div className="space-y-2">
          {scenarios.map((s, i) => (
            <div key={i} className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
              <span className="text-sm text-gray-600">{s.from}</span>
              <ArrowRight className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium flex-1">{s.to}</span>
              <span className="font-bold text-green-600">{s.increase}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SalonCustomizationLayout({ content }: { content: Record<string, unknown> }) {
  const features = content.features as { feature: string; desc: string }[];
  const example = content.example as { signature: string; services: string[]; products: string[] };
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {features.map((f, i) => (
          <div key={i} className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-bold mb-2">{f.feature}</h4>
            <p className="text-sm text-gray-600">{f.desc}</p>
          </div>
        ))}
      </div>
      <div className="bg-amber-50 rounded-xl p-6 border-l-4 border-amber-500">
        <h4 className="font-bold mb-3">示例: {example.signature}</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-semibold mb-2">关联服务:</p>
            <ul className="text-sm space-y-1">
              {example.services.map((s, i) => (
                <li key={i}>• {s}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2">关联产品:</p>
            <ul className="text-sm space-y-1">
              {example.products.map((p, i) => (
                <li key={i}>• {p}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function RoadmapLayout({ content }: { content: Record<string, unknown> }) {
  const phases = content.phases as { phase: string; status: string; features: string[] }[];
  return (
    <div className="space-y-4">
      {phases.map((phase, i) => (
        <div key={i} className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <h4 className="font-bold">{phase.phase}</h4>
            <span className={`text-xs px-2 py-1 rounded ${
              phase.status === '已完成' ? 'bg-green-100 text-green-700' :
              phase.status === '进行中' ? 'bg-amber-100 text-amber-700' :
              phase.status === '计划中' ? 'bg-blue-100 text-blue-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {phase.status}
            </span>
          </div>
          <ul className="text-sm space-y-1">
            {phase.features.map((f, j) => (
              <li key={j} className="flex gap-2">
                <span className={phase.status === '已完成' ? 'text-green-600' : 'text-gray-400'}>
                  {phase.status === '已完成' ? '✓' : '○'}
                </span>
                {f}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
