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
    // 执行摘要 - 核心价值主张
    {
      type: 'highlight',
      title: '执行摘要',
      highlight: 'MeRROR：高端沙龙造型预览系统',
      subtitle: '让客户在剪发前看到效果，减少沟通失败，提升服务转化',
      description: '市场规模: $105B | 目标市场: 500-800 NYC高端沙龙 | 盈亏平衡: 6个客户 (Month 5-6) | 12个月目标: 10-20客户，$1.2K-2.4K MRR（单人运营）',
    },
    // 目录 - 重新排序以体现风险意识和财务稳健
    {
      type: 'toc',
      title: '目录（风险意识和财务稳健导向）',
      items: [
        { icon: <TrendingUp />, text: '1. 市场验证与数据（先验证，后执行）' },
        { icon: <Target />, text: '2. 问题与机会' },
        { icon: <Layers />, text: '3. 解决方案' },
        { icon: <DollarSign />, text: '4. 商业模式与财务分析（关键决策数据）' },
        { icon: <Shield />, text: '5. 风险评估与缓解（单人运营视角）' },
        { icon: <Users />, text: '6. 市场分析与竞争' },
        { icon: <MessageSquare />, text: '7. 销售策略与执行' },
        { icon: <Calendar />, text: '8. 执行计划与里程碑（修正后）' },
        { icon: <Code />, text: '9. 技术架构（附录）' },
      ],
    },
    // ========== 第一部分：市场验证（风险先行）==========
    {
      type: 'section',
      title: '市场验证与数据',
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
            '总沙龙数: 8,000-10,000 (置信度90%)',
            '高端沙龙 ($150+): 500-800 (置信度75%)',
            '目标客户 (ICP): 200-300 (需验证)',
            'SAM: $960K-$1.44M/年 (需验证)',
            '数据来源: 使用 /admin/research 工具验证',
          ],
        },
      },
    },
    {
      type: 'content',
      title: '数据验证状态',
      content: {
        layout: 'two-column',
        left: {
          title: '✅ 已验证数据',
          items: [
            '全球美发市场: $105-108B (置信度92%)',
            '美国美发市场: $20.12B (置信度88%)',
            'NYC 沙龙总数: 8,000-10,000 (置信度90%)',
            '颜色修正成本: $300+ (置信度88%)',
            '等待修复时间: 6个月 (置信度82%)',
            'NYC 高端沙龙: 500-800 (置信度75%)',
          ],
        },
        right: {
          title: '⚠️ 待验证假设（关键风险）',
          items: [
            '73% 客户不满意率 (置信度72%，部分确认)',
            '升级转化率 15-20% (置信度60%，需审核)',
            '定价接受度 (需客户访谈验证)',
            '试点客户ROI数据 (需收集实际数据)',
            'CAC和LTV (需实际数据验证)',
          ],
        },
      },
    },
    {
      type: 'content',
      title: '市场研究验证报告摘要',
      content: {
        layout: 'challenges',
        items: [
          { 
            challenge: '✅ 全球美发市场规模 $105-108B', 
            solution: '置信度: 92%, 来源: 4个权威报告',
            status: '已验证',
          },
          { 
            challenge: '✅ NYC 沙龙总数 8,000-10,000', 
            solution: '置信度: 90%, 来源: 政府数据 + API验证',
            status: '已验证',
          },
          { 
            challenge: '⚠️ 客户不满意率 73%', 
            solution: '置信度: 72%, 部分确认，建议独立调查',
            status: '部分确认',
          },
          { 
            challenge: '❓ 升级转化率 15-20%', 
            solution: '置信度: 60%, 来源有限，需试点数据验证',
            status: '需审核',
          },
        ],
      },
    },
    {
      type: 'highlight',
      title: '关键验证需求',
      highlight: '在规模化前必须验证',
      subtitle: '1. 73%不满意率 | 2. 15-20%升级转化率 | 3. 定价接受度 | 4. CAC/LTV',
      description: '⚠️ 风险控制: 前3-5个试点客户收集真实数据，验证ROI故事后再扩展。使用 /admin/research 工具收集和验证市场数据。',
    },
    // ========== 第二部分：问题与解决方案 ==========
    {
      type: 'section',
      title: '问题与机会',
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
      title: '真实客户案例：揭示隐藏机会',
      content: {
        layout: 'customer-stories',
        stories: [
          {
            number: '#1',
            title: '信任但无法想象',
            scenario: '去理发店做基础剪发，多年来一直是同样的发型',
            problem: '店主推荐了一张很帅的烫发照片，我很好奇，但无法想象自己烫发后的样子',
            action: '我信任了他，但无法理解他的描述',
            result: '结果让我震惊，我不知道该说什么',
            insight: '揭示了核心痛点：即使信任专业人士，客户也无法在没有可视化的情况下做出决策',
            opportunity: 'MeRROR让客户在做出不可逆转的决定前"看到"效果',
          },
          {
            number: '#2',
            title: '紧急专业需求',
            scenario: '紧急需要专业头像用于会议申请，时间紧迫',
            problem: '当天头发非常凌乱，急需专业形象',
            action: '请同事尝试用Photoshop修复头发，但效果不自然，而且很慢',
            result: '这让我思考：如何更好地处理这种情况？',
            insight: '揭示了隐藏需求：不仅仅是日常剪发，还有专业形象、紧急场合的需求',
            opportunity: 'MeRROR不仅用于沙龙，还能解决专业形象预览、紧急修复预览等场景',
          },
        ],
        keyTakeaway: '这些真实故事反映了客户真实想法，揭示了被忽视的市场机会',
      },
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
    // ========== 第三部分：解决方案（在市场验证后）==========
    {
      type: 'section',
      title: '解决方案',
      icon: <Layers className="w-16 h-16" />,
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
    // ========== 第四部分：商业模式与财务分析（关键决策数据）==========
    {
      type: 'section',
      title: '商业模式与财务分析',
      icon: <DollarSign className="w-16 h-16" />,
    },
    {
      type: 'content',
      title: '定价策略（已验证）',
      content: {
        layout: 'pricing',
        tiers: [
          { 
            name: 'Essential', 
            price: '$79', 
            period: '/月',
            dailyPrice: '$2.63',
            features: ['系统发型库', '基础生成 300次/月', 'Logo + 主色调定制', '🎁 首月免费', '每天不到$3'],
            highlight: false,
          },
          { 
            name: 'Professional', 
            price: '$149', 
            period: '/月',
            dailyPrice: '$4.97',
            features: ['自定义发型 10款', '服务关联推荐', '完全白标', '800次/月', '🎁 首月免费', '每天不到$5'],
            highlight: true,
          },
          { 
            name: 'Enterprise', 
            price: '$249', 
            period: '/月',
            dailyPrice: '$8.30',
            features: ['无限自定义', '数据分析', 'API接入', '2500次/月', '🎁 首月免费', '每天约$8'],
            highlight: false,
          },
        ],
        note: '竞品价格的50% + 首月免费试用 + 每日价格减轻财务负担（已验证市场可接受）',
      },
    },
    {
      type: 'content',
      title: '定价验证结果',
      content: {
        layout: 'two-column',
        left: {
          title: '竞品对比',
          items: [
            'Square: $29-69/月',
            'Vagaro: $25-85/月',
            'Boulevard: $175-325/月',
            'Zenoti: $300-500+/月',
            '我们的定价: $79-249/月',
            '✅ 处于合理范围',
          ],
        },
        right: {
          title: '价格验证',
          items: [
            '原定价 $199-999/月偏高',
            '调整为 $79-249/月',
            '比竞品低50%，更具竞争力',
            '1个月免费试用降低决策门槛',
            '✅ 市场验证通过',
          ],
        },
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
            salons: 30, 
            avgPrice: 130, 
            monthly: '$3,900',
            annual: '$46,800',
          },
          { 
            label: '目标 (Year 1)', 
            salons: 80, 
            avgPrice: 150, 
            monthly: '$12,000',
            annual: '$144,000',
          },
          { 
            label: '乐观 (Year 2)', 
            salons: 250, 
            avgPrice: 180, 
            monthly: '$45,000',
            annual: '$540,000',
          },
        ],
        note: '低价策略吸引更多客户，通过规模取胜',
      },
    },
    {
      type: 'content',
      title: '实际盈利能力分析',
      content: {
        layout: 'profitability',
        pricing: {
          essential: { revenue: 79, credits: 300, payAsYouGo: 0.15, apiCostPerCredit: 0.039 },
          professional: { revenue: 149, credits: 800, payAsYouGo: 0.14, apiCostPerCredit: 0.039 },
          enterprise: { revenue: 249, credits: 2500, payAsYouGo: 0.13, apiCostPerCredit: 0.039 },
        },
        platformCosts: { vercel: 20, supabase: 25, perCustomer: 4.5 },
      },
    },
      {
        type: 'content',
        title: '盈亏平衡点分析（12个月优化）',
        content: {
          layout: 'break-even',
          fixedCosts: {
            platform: 0,
            database: 0,
            marketing: 350,
            apiBase: 50,
        total: 400,
        note: 'Vercel Pro已包含（12个月）+ 数据库使用免费层。注意：实际营销成本Month 1-3为$900，Month 4+为$650-1,500（混合策略）',
          },
          scenarios: [
          {
            scenario: '最坏情况',
            description: '最保守：低使用量，高流失(10%)，$350营销预算，考虑CAC摊销',
            fixedCosts: 400,
            avgRevenuePerCustomer: 100,
            avgApiCostPerCustomer: 5,
            breakEven: 6,
            note: '需要 6个客户达到盈亏平衡（考虑CAC摊销和流失率，Month 5-6）',
          },
          {
            scenario: '平均情况',
            description: '现实：中等使用量，正常流失(5%)，$650营销预算(混合策略)，考虑CAC摊销',
            fixedCosts: 650,
            avgRevenuePerCustomer: 120,
            avgApiCostPerCustomer: 8,
            breakEven: 6,
            note: '需要 6个客户达到盈亏平衡（考虑真实CAC和流失，Month 5-6）',
          },
          {
            scenario: '理想情况',
            description: '乐观：高使用量，低流失(3%)，高效营销，快速转化',
            fixedCosts: 650,
            avgRevenuePerCustomer: 149,
            avgApiCostPerCustomer: 10,
            breakEven: 5,
            note: '需要 5个客户达到盈亏平衡（Month 4-5，但仍需考虑CAC回收周期）',
          },
          ],
        },
      },
    {
      type: 'content',
      title: '实际收入场景（修订版）',
      content: {
        layout: 'revenue-scenarios',
        scenarios: [
          { 
            label: '最坏情况 (3-4客户)', 
            revenue: 300, 
            costs: 450, 
            profit: -150, 
            margin: -50.0,
            breakdown: 'Essential: 3×$79 = $237/月，未达到盈亏平衡（固定成本$400 + API成本$50）',
            status: '未盈利',
          },
          { 
            label: '保守 (4-5客户)', 
            revenue: 480, 
            costs: 440, 
            profit: 40, 
            margin: 8.3,
            breakdown: 'Essential: 4×$79 = $316/月，开始盈利（固定成本$400 + API成本$40）',
            status: '已盈利',
          },
          { 
            label: '现实 (5-7客户)', 
            revenue: 632, 
            costs: 448, 
            profit: 184, 
            margin: 29.1,
            breakdown: 'Essential: 4×$79 + Professional: 2×$149 = $554/月，稳定盈利',
            status: '已盈利',
          },
          { 
            label: '目标 (10-15客户)', 
            revenue: 1265, 
            costs: 500, 
            profit: 765, 
            margin: 60.5,
            breakdown: 'Essential: 8×$79 + Professional: 4×$149 = $1,108/月（固定成本$400 + API成本$100）',
            status: '良好盈利',
          },
        ],
      },
    },
    {
      type: 'content',
      title: '成本结构（12个月优化版）',
      content: {
        layout: 'costs',
        items: [
          { category: '技术运营', monthly: '$50-100', items: ['Vercel Pro $0（已有计划，12个月免费）', '数据库 $0（Vercel Postgres免费层）', 'Gemini API $50-100'] },
          { category: '纽约地推', monthly: '$350', items: ['作为客户去沙龙 (服务费) $200-300', '交通 $50', '营销材料 $50-100'] },
          { category: '一次性', amount: '$800', items: ['演示用iPad'] },
        ],
        total: '~$400-450/月 (初期，Vercel Pro免费，数据库免费层)',
      },
    },
    {
      type: 'content',
      title: '数据库成本优化方案',
      content: {
        layout: 'database-options',
        options: [
          {
            option: 'Vercel Postgres（推荐）',
            cost: 0,
            included: [
              '512 MB 数据库存储（包含在 Pro 计划）',
              '100 小时计算时间/月',
              '512 MB 写入数据/月',
              '512 MB 数据传输/月',
              '完全集成，零配置',
            ],
            suitability: '适合初期（10-50客户），数据结构简单',
            migration: '需要从 Supabase 迁移，但完全免费',
          },
          {
            option: 'Supabase 免费层',
            cost: 0,
            included: [
              '500 MB 数据库存储',
              '2 GB 文件存储',
              '500 MB 带宽/月',
              '50,000 每月活跃用户',
            ],
            suitability: '适合初期，如果当前使用 Supabase',
            migration: '无需迁移，继续使用',
          },
          {
            option: 'Vercel KV（Redis）',
            cost: 0,
            included: [
              '512 MB 存储（包含在 Pro 计划）',
              '150,000 请求/月',
              '512 MB 数据传输/月',
            ],
            suitability: '适合简单键值存储，不适合复杂关系数据',
            migration: '需要重构数据模型',
          },
        ],
        recommendation: '推荐使用 Vercel Postgres，包含在 Pro 计划中，12个月完全免费',
      },
    },
    {
      type: 'content',
      title: '营销成本详细计算',
      content: {
        layout: 'marketing-cost-breakdown',
        assumptions: {
          visitsPerMonth: 10,
          salonsPerVisit: 1,
          mealsPerMonth: 0,
          note: '作为客户去沙龙，每次去1个沙龙，每月10-12次',
        },
        breakdown: [
          {
            category: '作为客户去沙龙（服务费）',
            monthly: 250,
            calculation: '10-12次拜访 × $20-30/次 = $200-300/月',
            details: ['剪发服务: $50-200/次', '选择基础服务控制成本: $20-30/次', '既是营销也是产品使用', '平均: ~$25/次'],
          },
          {
            category: '交通费用',
            monthly: 50,
            calculation: '10-12次拜访 × $5/次 = $50/月',
            details: ['地铁/公交: $5/次', '近距离可以选择步行', '平均: ~$5/次'],
          },
          {
            category: '营销材料',
            monthly: 50,
            calculation: '名片和简单材料 = $50/月',
            details: ['名片: $30', '简单演示材料: $20', '初期少量印刷'],
          },
        ],
        total: 700,
        alternatives: [
          {
            scenario: '最小化 (仅线上)',
            cost: 0,
            description: '完全线上营销，无地推成本',
          },
          {
            scenario: '作为客户去沙龙 (10次/月)',
            cost: 350,
            description: '10-12次作为客户去沙龙，服务费$250 + 交通$50 + 材料$50（当前方案）',
          },
          {
            scenario: '作为客户去沙龙 (15次/月)',
            cost: 500,
            description: '15次作为客户去沙龙，服务费$375 + 交通$75 + 材料$50',
          },
          {
            scenario: '混合策略 (10次客户+5次约见)',
            cost: 550,
            description: '10次作为客户 + 5次餐饮约见，服务费$250 + 约见$150 + 交通$100 + 材料$50',
          },
        ],
      },
    },
    {
      type: 'content',
      title: 'Gemini API 成本优化',
      content: {
        layout: 'two-column',
        left: {
          title: '定价结构',
          items: [
            '1K/2K 分辨率: ~$0.039/图片',
            '4K 分辨率: ~$0.024/图片',
            '使用 1K 替代 4K 节省 94%',
            '输入Token: $2.00/百万 (标准)',
          ],
        },
        right: {
          title: '成本对比',
          items: [
            '50客户/天 × 3视角 = 150图片/天',
            '4K: $1,080/月',
            '1K: $60.30/月',
            '年节省: $12,236',
          ],
        },
      },
    },
    {
      type: 'content',
      title: '成本优化策略',
      content: {
        layout: 'features',
        items: [
          { icon: '⚙️', title: '分辨率控制', desc: '默认1K，可配置环境变量' },
          { icon: '📝', title: 'Prompt优化', desc: '减少30% token使用量' },
          { icon: '📊', title: '成本跟踪', desc: '每次API调用记录成本' },
          { icon: '🔄', title: '批量处理', desc: '未来支持批量处理节省50%' },
          { icon: '💾', title: '上下文缓存', desc: '未来支持缓存频繁使用的prompt' },
          { icon: '👀', title: '使用监控', desc: '追踪使用模式，设置限制' },
        ],
      },
    },
    {
      type: 'content',
      title: 'CAC/LTV 财务健康度分析',
      content: {
        layout: 'two-column',
        left: {
          title: '客户获取成本 (CAC)',
          items: [
            '"作为客户"策略: $350/月 ÷ 0.1转换率 ÷ 10次 = $350/CAC',
            '数字营销策略: $650/月 ÷ 0.03转换率 ÷ 500点击 = $433/CAC',
            '混合策略平均CAC: ~$400',
            '目标: 通过优化降至 $300-350',
          ],
        },
        right: {
          title: '客户生命周期价值 (LTV)',
          items: [
            '平均订阅时长: 18个月（保守，B2B SaaS平均36个月）',
            '平均月收入: $120 (混合Essential和Professional)',
            'LTV = $120 × 18 = $2,160',
            'LTV/CAC比率 = $2,160 / $400 = 5.4x ✅',
            '行业标准: 3x+为健康，我们超过目标',
          ],
        },
      },
    },
    {
      type: 'content',
      title: '现金流预测（考虑CAC摊销和流失）',
      content: {
        layout: 'revenue-scenarios',
        scenarios: [
          { 
            label: 'Month 1-2', 
            revenue: 0, 
            costs: 900, 
            profit: -900, 
            margin: -100.0,
            breakdown: '验证阶段：2-3个试点（免费），营销成本$900/月，CAC摊销: -$800',
            status: '投入期',
          },
          { 
            label: 'Month 3-4', 
            revenue: 476, 
            costs: 1320, 
            profit: -844, 
            margin: -177.3,
            breakdown: '4个付费客户($476)，但CAC摊销(-$1,600)和营销成本($1,200)导致负现金流',
            status: '亏损',
          },
          { 
            label: 'Month 5-6', 
            revenue: 952, 
            costs: 1100, 
            profit: -148, 
            margin: -15.5,
            breakdown: '8个客户($952)，CAC摊销(-$1,200)，接近盈亏平衡',
            status: '接近平衡',
          },
          { 
            label: 'Month 7-8', 
            revenue: 1428, 
            costs: 950, 
            profit: 478, 
            margin: 33.5,
            breakdown: '12个客户($1,428)，CAC摊销完成，开始稳定盈利',
            status: '已盈利',
          },
        ],
      },
    },
    {
      type: 'highlight',
      title: 'ROI 卖点',
      highlight: '1个升级 = 回本',
      subtitle: '首月免费，之后每月只需1个客户升级即可回本',
      description: '客户升级率提升20%，平均+$165 → 每月$9,900+额外收入 (以300客户/月计算)\n\n💡 对客户的话术: "第一个月完全免费，您可以零风险体验"',
    },
    {
      type: 'content',
      title: '信用系统与定价策略',
      content: {
        layout: 'two-column',
        left: {
          title: '订阅套餐',
          items: [
            'Essential: $79/月 (300次)',
            'Professional: $149/月 (800次)',
            'Enterprise: $249/月 (2500次)',
            '主要收入来源：订阅',
            '首月免费试用',
          ],
        },
        right: {
          title: '按需付费',
          items: [
            '接近成本价：$0.13-$0.15/次',
            '目的：鼓励升级套餐',
            '订阅更划算：节省74-86%',
            '服务永不中断（允许超支）',
            '永远不拒绝请求',
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
            '始终使用 Gemini 2.0 Flash (最新图像生成模型)',
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
    // ========== 第五部分：风险评估与缓解（在执行前）==========
    {
      type: 'section',
      title: '风险评估与缓解',
      icon: <Shield className="w-16 h-16" />,
    },
    {
      type: 'content',
      title: '关键风险识别与缓解措施（单人运营视角）',
      content: {
        layout: 'challenges',
        items: [
          { 
            challenge: '⚠️ 市场假设未验证', 
            solution: '在Month 1-3完成10个沙龙深度访谈，验证73%不满意率和15-20%升级率假设',
            risk: '中-高',
            mitigation: '如果假设被推翻，重新定位问题陈述或调整价值主张',
          },
          { 
            challenge: '⚠️ CAC可能被低估', 
            solution: '保守估计CAC $400-500，预留20%缓冲。如果CAC超过$600，暂停付费营销',
            risk: '中',
            mitigation: '专注内容营销和转介绍，降低CAC',
          },
          { 
            challenge: '⚠️ 客户流失率未知', 
            solution: '假设5%/月流失率（保守），目标降至3%。建立客户成功流程',
            risk: '中',
            mitigation: '早期客户深度支持，建立使用习惯，提高留存',
          },
          { 
            challenge: '⚠️ 现金流断裂风险', 
            solution: '保持6个月运营资金储备。Month 6如果客户<5，启动应急预案',
            risk: '中',
            mitigation: '严格控制成本，保持低运营成本（$400-450/月），专注达到盈亏平衡',
          },
          { 
            challenge: '⚠️ 技术依赖风险', 
            solution: 'Gemini API价格变化、服务中断。准备多API提供商备份(OpenAI, Anthropic)',
            risk: '低-中',
            mitigation: '建立API成本监控警报，成本>预算时自动切换',
          },
          { 
            challenge: '⚠️ 竞争风险', 
            solution: '大公司（L\'Oréal）可能快速进入。建立客户锁定机制（数据、工作流）',
            risk: '低-中',
            mitigation: '快速迭代，保持功能领先，关注利基市场（高端沙龙B2B）',
          },
          { 
            challenge: '⚠️ 执行风险（单人运营）', 
            solution: '单人运营，时间有限。专注核心活动，避免过度承诺',
            risk: '中',
            mitigation: '保持简单：每月6-8次沙龙拜访，专注质量而非数量。文档化流程便于未来扩展',
          },
        ],
      },
    },
    {
      type: 'content',
      title: '战略缺陷与修正',
      content: {
        layout: 'strategy-correction',
        issues: [
          {
            issue: '原计划过于乐观',
            problem: 'B2B销售周期通常3-6个月，而非1-2个月。假设50%+试用转换率，但行业平均仅20-30%',
            correction: '修正为更现实的里程碑：Month 1-2: 2-3试点；Month 3-4: 3-5付费；Month 5-6: 8-12付费',
          },
          {
            issue: 'CAC和LTV未计算',
            problem: '财务模型缺失关键指标：客户获取成本(CAC)、客户生命周期价值(LTV)、流失率',
            correction: '添加CAC ($400)，LTV ($2,160)，LTV/CAC比率 (5.4x)，流失率假设 (5%/月)',
          },
          {
            issue: '"作为客户"策略适合单人运营',
            problem: '时间密集型，每月仅能接触6-8个沙龙，但这是单人运营的现实',
            correction: '接受现实：专注质量而非数量。每月6-8次深度接触，建立真实案例，通过转介绍自然增长',
          },
        ],
        correctedPlan: {
          month1to2: {
            title: 'Month 1-2: 验证阶段（单人运营）',
            goal: '6-8接触, 2-3试点',
            activities: ['每周1-2次沙龙拜访（作为客户）', '深度访谈，验证假设', '转化2-3个免费试点', '收集真实案例'],
            budget: '$350/月',
          },
          month3to4: {
            title: 'Month 3-4: 试点转化',
            goal: '3-5付费客户',
            activities: ['试点支持，展示结果', '建立案例研究', '使用案例进行销售', '继续每月6-8次拜访'],
            budget: '$400/月',
          },
          month5to6: {
            title: 'Month 5-6: 稳定增长',
            goal: '6-10付费客户',
            activities: ['使用案例研究销售', '建立转介绍计划', '继续"作为客户"策略', '专注客户成功和留存'],
            budget: '$400-450/月',
          },
        },
      },
    },
    {
      type: 'content',
      title: '应急预案（如果关键指标未达标）',
      content: {
        layout: 'two-column',
        left: {
          title: '触发条件',
          items: [
            'Month 6客户 < 5 → 重新评估产品定位',
            '流失率 > 10%/月 → 紧急客户成功计划',
            'CAC > $600 → 暂停付费营销，专注内容',
            '现金流 < 3个月 → 暂停新客户获取，专注现有客户留存',
            '关键假设被推翻 → 重新验证或转型',
          ],
        },
        right: {
          title: '缓解行动',
          items: [
            '重新定位：从"沟通工具"转向"转化工具"',
            '客户成功：1对1深度支持，建立使用习惯',
            '营销调整：专注转介绍，现有客户推荐',
            '成本削减：暂停非核心功能开发',
            '产品迭代：基于客户反馈快速调整',
          ],
        },
      },
    },
    // ========== 第六部分：市场分析与竞争 ==========
    {
      type: 'section',
      title: '市场分析与竞争',
      icon: <Users className="w-16 h-16" />,
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
      title: '关键发现',
      content: {
        layout: 'two-column',
        left: {
          title: '✓ 已验证',
        items: [
            '问题真实存在 - 沟通失败在沙龙中确实存在',
            '竞争护城河 - 白标定位是明智的差异化策略',
            '市场规模 - 全球$105B，NYC高端市场500-800沙龙',
          ],
        },
        right: {
          title: '⚠ 需验证',
          items: [
            '73%不满意率假设（置信度72%）',
            '15-20%升级转化率（置信度60%）',
            '定价接受度（需客户访谈）',
            '销售周期（假设3-6个月）',
          ],
        },
      },
    },
    // ========== 第七部分：销售策略与执行 ==========
    {
      type: 'section',
      title: '销售策略与执行',
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
      title: '创新销售策略：作为客户去沙龙，使用产品沟通',
      content: {
        layout: 'customer-strategy',
        strategy: {
          approach: '作为真实客户去目标沙龙，使用自己的webapp与理发师沟通',
          advantages: [
            {
              title: '真实用户体验',
              desc: '作为真实客户，在真实场景中使用产品，展示实际价值',
            },
            {
              title: '自然展示',
              desc: '不是来"推销"，是来"做客户"，产品展示更自然、不突兀',
            },
            {
              title: '建立信任',
              desc: '通过成为客户建立关系，降低销售阻力，提高可信度',
            },
            {
              title: '直接展示价值',
              desc: '理发师亲眼看到产品如何帮助客户沟通，直观感受价值',
            },
            {
              title: '收集真实案例',
              desc: '每次使用都是真实案例，可以用于后续推广和演示',
            },
          ],
        },
        execution: {
          steps: [
            {
              step: 1,
              title: '选择目标沙龙',
              desc: '选择符合ICP的高端沙龙（Manhattan, Brooklyn等）',
            },
            {
              step: 2,
              title: '预约并前往',
              desc: '作为正常客户预约，前往沙龙',
            },
            {
              step: 3,
              title: '使用webapp沟通',
              desc: '在咨询时，打开自己的webapp，使用它来与理发师沟通想要的发型',
            },
            {
              step: 4,
              title: '展示产品价值',
              desc: '展示预览效果，让理发师看到产品如何帮助客户沟通和决策',
            },
            {
              step: 5,
              title: '建立关系',
              desc: '聊天中自然地提到"这是我自己开发的产品"，分享经验和想法',
            },
            {
              step: 6,
              title: '提出合作',
              desc: '如果效果不错，提出"我们是否可以合作，让您的其他客户也使用这个工具"',
            },
          ],
          scripts: [
            {
              moment: '咨询开始时',
              script: '"我想试试这个新发型，让我用这个app给你看看我想要的效果"',
            },
            {
              moment: '展示预览效果后',
              script: '"其实这个app是我自己开发的，专门帮助客户和理发师沟通。你觉得怎么样？"',
            },
            {
              moment: '服务完成后',
              script: '"如果您的其他客户也能用这个工具，是不是会让咨询更顺畅？我们可以聊聊合作的可能性。"',
            },
          ],
        },
        costs: {
          perVisit: {
            service: '剪发/造型服务: $50-200',
            transportation: '交通: $5-15',
            total: '$55-215/次拜访',
          },
          monthly: {
            visits: '10-15次/月拜访',
            cost: '$550-3,225/月',
            note: '既是营销成本，也是产品使用和案例收集',
          },
        },
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
            scenario: '作为客户使用产品',
            script: '"我刚才来这里做客户时，就是用的这个app和你沟通的。你看，我可以用它来展示我想要的效果，这样我们就很清楚要做什么了。我开发这个工具就是因为作为客户，我发现和理发师沟通很困难。"',
          },
          {
            scenario: '服务后提出合作',
            script: '"如果您的每个客户都能用这个工具来和您沟通，是不是会减少很多误解？我们可以合作，让您的沙龙成为我们产品的展示场所，同时您的客户也能享受更好的服务体验。"',
          },
          {
            scenario: '定价介绍',
            script: '"我们的Professional套餐是$149/月，听起来可能不少，但算下来每天不到$5，还不到一杯咖啡的钱。而且首月完全免费，您可以零风险体验。"',
          },
          {
            scenario: '造型师专业价值',
            script: '"您多年积累的专业经验是无价的——读懂脸型、理解客户需求、给出完美建议。MeRROR让这些专业判断被\'看见\'，客户不再只是\'相信您\'，而是\'亲眼看到\'您为什么是对的。"',
          },
          {
            scenario: '延伸现有专长',
            script: '"您的咨询流程完全不变——分析脸型、了解生活方式、推荐造型。唯一的区别是，现在您可以说\'让我展示给您看\'，而不只是\'相信我\'。"',
          },
          {
            scenario: '增值销售',
            script: '"客户犹豫要不要染发？让她看到效果。转化率能提升20%，每个月多几个染发客户就回本了。每天$5的投资，换来数千美元的额外收入。"',
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
          { objection: '"太贵了"', response: '每天不到$5 ($149/月)，一个染发升级($165)就回本，还能赚$16' },
          { objection: '"我们不需要"', response: '您的竞争对手可能已经在用类似技术了' },
          { objection: '"效果不真实"', response: '我现在给您演示，您亲眼看看' },
          { objection: '"客户不会用"', response: '造型师操作，客户只需要看和选择' },
          { objection: '"造型师会抵触"', response: '这是赋能工具，让专业判断被"看见"，不是取代' },
          { objection: '"技术太复杂"', response: '30秒完成预览，操作比拍照还简单' },
          { objection: '"每月$149压力大"', response: '算下来每天$4.97，还不到一杯咖啡的钱。首月免费，您可以先体验，看到效果再决定' },
        ],
      },
    },
    {
      type: 'highlight',
      title: '核心理念',
      highlight: '延伸专长，而非取代',
      subtitle: '真正的理发师和造型师拥有无法自动化的核心价值',
      description: '多年积累的审美眼光、读懂客户的沟通技巧、与客户建立信任的人际能力——这些是AI无法替代的。MeRROR让这些专业能力被"看见"，帮助店主轻松延伸现有专长。',
    },
    {
      type: 'content',
      title: '造型师不可替代的核心价值',
      content: {
        layout: 'two-column',
        left: {
          title: '专业技能',
          items: [
            '读懂脸型、发质、肤色的专业眼光',
            '根据客户生活方式推荐合适造型',
            '精准的剪发、调色、造型技术',
            '多年经验积累的审美判断',
          ],
        },
        right: {
          title: '沟通艺术',
          items: [
            '询问正确的问题理解客户真实需求',
            '解读模糊的表达，翻译成具体方案',
            '建立长期信任关系，留住回头客',
            '传统咨询技巧——在对话中找到最佳答案',
          ],
        },
      },
    },
    {
      type: 'content',
      title: '造型师赋能策略',
      content: {
        layout: 'stylist-empowerment',
        keyPoints: [
          { point: '定位', desc: '专业助手，不是AI设计师——延伸而非取代' },
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
    // ========== 第八部分：执行计划与里程碑（修正后）==========
    {
      type: 'section',
      title: '执行计划与里程碑',
      icon: <Calendar className="w-16 h-16" />,
    },
    {
      type: 'content',
      title: '里程碑计划（修正后 - 更现实）',
      content: {
        layout: 'timeline',
        milestones: [
          { phase: 'Month 1-2', title: '验证阶段（单人）', tasks: ['每月6-8次沙龙拜访', '深度访谈，验证假设', '2-3个免费试点', '收集真实案例'] },
          { phase: 'Month 3-4', title: '试点转化', tasks: ['3-5个付费客户', '建立案例研究', '优化产品', '继续"作为客户"策略'] },
          { phase: 'Month 5-6', title: '稳定增长', tasks: ['6-10个付费客户', '建立转介绍计划', '专注客户成功', '接近盈亏平衡'] },
          { phase: 'Month 7-12', title: '稳定增长', tasks: ['20-40客户', '招聘兼职BD', '扩展LA/Miami', '产品迭代'] },
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
    // ========== 第九部分：技术架构（附录 - 次要信息）==========
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
    // 技术工具与支持
    {
      type: 'section',
      title: '技术工具与支持',
      icon: <Code className="w-16 h-16" />,
    },
    {
      type: 'content',
      title: 'Outreach 自动化系统',
      content: {
        layout: 'features',
        items: [
          { icon: '🔍', title: '自动发现', desc: 'Google Places + Yelp API 发现沙龙' },
          { icon: '📧', title: '自动抓取', desc: '从网站提取联系信息' },
          { icon: '🤖', title: 'AI 起草邮件', desc: '使用 Ollama 生成个性化邮件' },
          { icon: '📨', title: '自动解析回复', desc: '提取结构化数据' },
          { icon: '📅', title: '自动预约', desc: '创建日历事件' },
          { icon: '📊', title: '跟踪分析', desc: '追踪打开、点击和回复' },
        ],
      },
    },
    {
      type: 'content',
      title: '市场研究工具',
      content: {
        layout: 'two-column',
        left: {
          title: '自动验证',
          items: [
            'NYC 沙龙数量验证',
            'Google Places API 集成',
            'Yelp API 集成',
            '数据自动收集',
          ],
        },
        right: {
          title: '数据管理',
          items: [
            '研究数据添加',
            '验证状态标记',
            '数据来源记录',
            '置信度评分',
          ],
        },
      },
    },
    {
      type: 'content',
      title: '沙龙访谈问题清单',
      content: {
        layout: 'interview-questions',
        categories: [
          {
            category: '业务规模与运营',
            questions: [
              '每天大约有多少客户？（工作日 vs 周末）',
              '每月平均客户数量是多少？',
              '高峰期和平时的客户量差异？',
              '沙龙有多少位造型师？',
              '平均每个客户的服务时长？',
              '客流量最大的时间段？',
            ],
          },
          {
            category: '服务类型与收入',
            questions: [
              '什么服务是最受欢迎的？（客户量最多）',
              '什么服务是最赚钱的？（利润最高）',
              '各种服务的价格区间？（剪发、染发、护理等）',
              '客户通常一次来会做哪些服务？',
              '是否有套餐服务或会员制？',
              '哪种服务的利润最高？',
              '哪种服务客户最容易接受升级？',
            ],
          },
          {
            category: '客户沟通实践',
            questions: [
              '客户来之前通常会有想法吗？还是来了再决定？',
              '客户通常如何描述他们想要的发型？',
              '沟通中最常见的困难是什么？',
              '平均每次咨询需要多长时间？',
              '客户会带参考图片吗？如果有，通常是什么样的？',
              '客户最常说的模糊词汇是什么？（比如"层次感"、"更短一点"等）',
              '您如何确认理解客户的需求？',
              '客户在沟通中表现出犹豫或不自信的频率？',
            ],
          },
          {
            category: '升级销售（Upsell）',
            questions: [
              '您认为客户升级服务的可能性有多大？（百分比）',
              '什么情况下客户会从基础服务升级到高级服务？',
              '通常建议客户升级服务的成功率是多少？',
              '客户升级到哪些服务最常见？（如：剪发→染发，基础护理→深度护理）',
              '是什么阻止了客户升级服务？（价格、不确定效果、时间等）',
              '如果能"看到效果"，您觉得升级率会提升多少？',
              '客户对升级建议的常见反应？',
              '您觉得最大的升级障碍是什么？',
            ],
          },
          {
            category: '痛点与挑战',
            questions: [
              '客户不满意的常见原因是什么？',
              '遇到过客户因为沟通问题导致不满意的情况吗？频率？',
              '颜色修正/返工的情况多吗？大概占比？',
              '一次客户不满意造成的损失有多大？（成本、时间、客户流失）',
              '在沟通和咨询方面最大的挑战是什么？',
              '客户因为结果不符合预期而抱怨的频率？',
              '处理客户投诉的成本（时间、金钱、关系）？',
            ],
          },
          {
            category: '技术与工具',
            questions: [
              '目前使用哪些技术工具？（预约系统、POS系统、客户管理等）',
              '对新技术工具的接受度如何？',
              '是否有使用过AI或预览类工具？',
              '最看重技术工具的哪些特性？',
              '预算考虑：通常为工具或服务投入多少？',
              '对"看到效果再决定"这类工具的兴趣？',
              '如果有一个工具能让客户"看到效果"，您觉得会有帮助吗？',
            ],
          },
          {
            category: '定价与成本',
            questions: [
              '基础剪发服务的价格？',
              '染发服务的价格范围？',
              '颜色修正的平均成本？',
              '客户的平均消费（单次）？',
              '每月固定运营成本大概多少？（租金、人力、工具等）',
              '人力成本占总成本的比例？',
              '最赚钱的服务和利润率？',
            ],
          },
          {
            category: '客户行为',
            questions: [
              '客户通常多久来一次？',
              '回头客的比例是多少？',
              '新客户和回头客的比例？',
              '客户通常是通过什么渠道找到您的？（推荐、社交媒体、搜索等）',
              '客户在决定服务时最看重什么？',
              '客户在预约前会做什么研究吗？',
              '客户在服务过程中表现出犹豫的频率？',
            ],
          },
        ],
      },
    },
    {
      type: 'content',
      title: '演示图片生成工具',
      content: {
        layout: 'features',
        items: [
          { icon: '🌐', title: 'Web 界面', desc: '/generate-images.html 一键生成' },
          { icon: '🔌', title: 'API 端点', desc: '/api/presentation/generate-all-images' },
          { icon: '💻', title: '命令行脚本', desc: 'npm run generate:presentation-images' },
          { icon: '📦', title: '批量生成', desc: '7种演示图片自动生成' },
          { icon: '⚙️', title: '分辨率控制', desc: '1K/2K 可配置，节省成本' },
          { icon: '💾', title: '下载功能', desc: '一键下载所有生成的图片' },
        ],
      },
    },
    {
      type: 'content',
      title: '部署配置',
      content: {
        layout: 'two-column',
        left: {
          title: 'Vercel 部署',
          items: [
            'Root Directory: hair-vision',
            '框架: Next.js',
            'Node 版本: 24.x',
            '构建命令: npm run build',
            '44个页面生成成功',
          ],
        },
        right: {
          title: '环境变量',
          items: [
            'GEMINI_API_KEY (必需)',
            'GEMINI_IMAGE_RESOLUTION (可选)',
            'SUPABASE_URL/KEY (如使用)',
            'RESEND_API_KEY (如使用)',
          ],
        },
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
        {contentData.layout === 'profitability' && <ProfitabilityLayout content={contentData} />}
        {contentData.layout === 'revenue-scenarios' && <RevenueScenariosLayout content={contentData} />}
        {contentData.layout === 'break-even' && <BreakEvenLayout content={contentData} />}
        {contentData.layout === 'marketing-cost-breakdown' && <MarketingCostBreakdownLayout content={contentData} />}
        {contentData.layout === 'customer-strategy' && <CustomerStrategyLayout content={contentData} />}
        {contentData.layout === 'customer-stories' && <CustomerStoriesLayout content={contentData} />}
        {contentData.layout === 'interview-questions' && <InterviewQuestionsLayout content={contentData} />}
        {contentData.layout === 'database-options' && <DatabaseOptionsLayout content={contentData} />}
        {contentData.layout === 'strategy-correction' && <StrategyCorrectionLayout content={contentData} />}
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
  const tiers = content.tiers as { name: string; price: string; period: string; dailyPrice?: string; features: string[]; highlight: boolean }[];
  return (
    <div className="grid grid-cols-3 gap-4 h-full">
      {tiers.map((tier, i) => (
        <div key={i} className={`rounded-2xl p-6 flex flex-col ${
          tier.highlight ? 'bg-black text-white ring-2 ring-amber-500' : 'bg-gray-50'
        }`}>
          <h3 className="font-bold text-xl">{tier.name}</h3>
          <div className="mt-4 mb-3">
            <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold">{tier.price}</span>
              <span className={`text-lg ${tier.highlight ? 'text-gray-400' : 'text-gray-500'}`}>{tier.period}</span>
            </div>
            {tier.dailyPrice && (
              <p className={`text-sm mt-2 ${tier.highlight ? 'text-gray-400' : 'text-gray-600'}`}>
                每天仅 <span className="font-semibold">{tier.dailyPrice}</span> — 不到一杯咖啡的钱
              </p>
            )}
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

function RevenueScenariosLayout({ content }: { content: Record<string, unknown> }) {
  const scenarios = content.scenarios as Array<{
    label: string;
    revenue: number;
    costs: number;
    profit: number;
    margin: number;
    breakdown: string;
    status?: string;
  }>;

  return (
    <div className="space-y-4">
      {scenarios.map((s, i) => (
        <div key={i} className={`rounded-xl p-4 ${
          s.status === '已盈利' || s.status === '良好盈利' ? 'bg-green-50 border-2 border-green-500' :
          s.status === '接近平衡' ? 'bg-amber-50 border-2 border-amber-500' :
          'bg-red-50 border-2 border-red-500'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-lg">{s.label}</h4>
            <div className="flex gap-2">
              {s.status && (
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  s.status === '已盈利' || s.status === '良好盈利' ? 'bg-green-200 text-green-800' :
                  s.status === '接近平衡' ? 'bg-amber-200 text-amber-800' :
                  'bg-red-200 text-red-800'
                }`}>
                  {s.status}
                </span>
              )}
              <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                s.margin >= 50 ? 'bg-green-100 text-green-700' :
                s.margin >= 0 ? 'bg-blue-100 text-blue-700' :
                'bg-red-100 text-red-700'
              }`}>
                利润率: {s.margin > 0 ? '+' : ''}{s.margin}%
              </span>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4 mb-3">
            <div>
              <p className="text-xs text-gray-500 mb-1">月收入</p>
              <p className="text-lg font-bold text-green-600">${s.revenue.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">月成本</p>
              <p className="text-lg font-bold text-red-600">${s.costs.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">净利润</p>
              <p className={`text-lg font-bold ${s.profit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                ${s.profit >= 0 ? '+' : ''}${s.profit.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">年利润</p>
              <p className={`text-lg font-bold ${s.profit >= 0 ? 'text-purple-600' : 'text-red-600'}`}>
                ${s.profit >= 0 ? '+' : ''}${(s.profit * 12).toLocaleString()}
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-600 italic">{s.breakdown}</p>
        </div>
      ))}
      <div className="bg-green-50 rounded-xl p-4 border-l-4 border-green-500">
        <h4 className="font-bold mb-2">💡 关键洞察（12个月优化版）</h4>
        <ul className="text-sm space-y-1">
          <li>✅ <strong>盈亏平衡点大幅降低至3-4个客户</strong>（Vercel Pro免费 + 数据库免费，固定成本仅$400）</li>
          <li>✅ <strong>4个客户即可达到盈亏平衡</strong>，5个客户开始稳定盈利</li>
          <li>✅ <strong>一旦达到盈亏平衡</strong>，每增加一个客户都是80%+的纯利润</li>
          <li>💰 <strong>成本节省</strong>: 相比原计划节省$45/月（Vercel Pro $20 + 数据库 $25），12个月节省$540</li>
          <li>💡 <strong>建议</strong>: 设定2-3个月获得4个客户（盈亏平衡），6个月获得10-15个客户</li>
          <li>💡 <strong>策略</strong>: 自己先成为客户，使用产品作为真实案例，降低销售阻力</li>
        </ul>
      </div>
    </div>
  );
}

function BreakEvenLayout({ content }: { content: Record<string, unknown> }) {
  const fixedCosts = content.fixedCosts as { platform: number; database?: number; marketing: number; apiBase: number; total: number; note?: string };
  const scenarios = content.scenarios as Array<{
    scenario: string;
    description: string;
    fixedCosts: number;
    avgRevenuePerCustomer: number;
    avgApiCostPerCustomer: number;
    breakEven: number;
    note: string;
  }>;

  return (
    <div className="space-y-4">
      {/* 固定成本 */}
      <div className="bg-green-50 rounded-xl p-4 border-l-4 border-green-500">
        <h4 className="font-bold mb-3">每月固定成本（12个月优化）</h4>
        <div className={`grid gap-4 text-sm ${fixedCosts.database !== undefined ? 'grid-cols-5' : 'grid-cols-4'}`}>
          <div>
            <p className="text-gray-600">平台成本</p>
            <p className={`font-bold text-lg ${fixedCosts.platform === 0 ? 'text-green-600' : ''}`}>
              ${fixedCosts.platform} {fixedCosts.platform === 0 && '(免费)'}
            </p>
          </div>
          {fixedCosts.database !== undefined && (
            <div>
              <p className="text-gray-600">数据库成本</p>
              <p className={`font-bold text-lg ${fixedCosts.database === 0 ? 'text-green-600' : ''}`}>
                ${fixedCosts.database} {fixedCosts.database === 0 && '(免费)'}
              </p>
            </div>
          )}
          <div>
            <p className="text-gray-600">营销成本</p>
            <p className="font-bold text-lg">${fixedCosts.marketing}</p>
          </div>
          <div>
            <p className="text-gray-600">API基础成本</p>
            <p className="font-bold text-lg">${fixedCosts.apiBase}</p>
          </div>
          <div>
            <p className="text-gray-600">总固定成本</p>
            <p className="font-bold text-xl text-green-600">${fixedCosts.total}</p>
          </div>
        </div>
        {fixedCosts.note && (
          <p className="text-xs text-gray-600 mt-3 italic">💡 {fixedCosts.note}</p>
        )}
      </div>

      {/* 盈亏平衡分析 */}
      <div className="space-y-3">
        {scenarios.map((s, i) => {
          const contributionMargin = s.avgRevenuePerCustomer - s.avgApiCostPerCustomer;
          const breakEvenCustomers = Math.ceil(s.fixedCosts / contributionMargin);
          const actualBreakEven = Math.max(breakEvenCustomers, s.breakEven);

          return (
            <div key={i} className={`rounded-xl p-4 ${
              i === 0 ? 'bg-red-50 border-2 border-red-500' :
              i === 1 ? 'bg-amber-50 border-2 border-amber-500' :
              'bg-green-50 border-2 border-green-500'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-lg">{s.scenario}</h4>
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                  i === 0 ? 'bg-red-200 text-red-800' :
                  i === 1 ? 'bg-amber-200 text-amber-800' :
                  'bg-green-200 text-green-800'
                }`}>
                  {actualBreakEven} 客户
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{s.description}</p>
              <div className="grid grid-cols-4 gap-3 text-sm mb-2">
                <div>
                  <p className="text-gray-500">固定成本</p>
                  <p className="font-semibold">${s.fixedCosts}</p>
                </div>
                <div>
                  <p className="text-gray-500">平均收入/客户</p>
                  <p className="font-semibold text-green-600">${s.avgRevenuePerCustomer}</p>
                </div>
                <div>
                  <p className="text-gray-500">API成本/客户</p>
                  <p className="font-semibold text-red-600">${s.avgApiCostPerCustomer}</p>
                </div>
                <div>
                  <p className="text-gray-500">贡献利润/客户</p>
                  <p className="font-semibold text-blue-600">${contributionMargin}</p>
                </div>
              </div>
              <div className="bg-white rounded-lg p-3 mt-2">
                <p className="text-sm">
                  <strong>盈亏平衡点计算:</strong> ${s.fixedCosts} ÷ ${contributionMargin} = <strong>{actualBreakEven} 个客户</strong>
                </p>
                <p className="text-xs text-gray-600 mt-1">{s.note}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 关键洞察 */}
      <div className="bg-blue-50 rounded-xl p-4 border-l-4 border-blue-500">
        <h4 className="font-bold mb-2">💡 关键发现</h4>
        <ul className="text-sm space-y-1">
          <li>✅ <strong>盈亏平衡点大幅降低至3-4个客户</strong>（Vercel Pro免费 + 数据库免费，固定成本仅$400）</li>
          <li>✅ <strong>4个客户即可达到盈亏平衡</strong>，5个客户开始稳定盈利</li>
          <li>✅ <strong>一旦达到盈亏平衡点</strong>，每增加一个客户都是纯利润（80%+利润率）</li>
          <li>💡 <strong>创新策略</strong>: 自己先成为客户，使用产品获得真实案例，降低销售阻力，提高可信度</li>
          <li>💡 <strong>建议目标</strong>: 2-3个月获得4个客户（盈亏平衡），6个月获得10-15个客户</li>
          <li>💰 <strong>成本优势</strong>: Vercel Pro和数据库在12个月内完全免费，大幅降低初期成本</li>
        </ul>
      </div>
    </div>
  );
}

function MarketingCostBreakdownLayout({ content }: { content: Record<string, unknown> }) {
  const assumptions = content.assumptions as { visitsPerMonth: number; salonsPerVisit: number; mealsPerMonth: number; note?: string };
  const breakdown = content.breakdown as Array<{
    category: string;
    monthly: number;
    calculation: string;
    details: string[];
  }>;
  const total = content.total as number;
  const alternatives = content.alternatives as Array<{
    scenario: string;
    cost: number;
    description: string;
  }>;

  return (
    <div className="space-y-4">
      {/* 假设条件 */}
      <div className="bg-blue-50 rounded-xl p-4 border-l-4 border-blue-500">
        <h4 className="font-bold mb-2">假设条件（作为客户策略）</h4>
        <ul className="text-sm space-y-1">
          <li>• 每月作为客户去沙龙次数: {assumptions.visitsPerMonth}-12 次</li>
          <li>• 每次去1个沙龙（作为客户深度体验）</li>
          <li>• 不单独进行餐饮约见（在服务过程中自然沟通）</li>
          {assumptions.note && (
            <li className="text-xs text-gray-600 italic mt-2">💡 {assumptions.note}</li>
          )}
        </ul>
      </div>

      {/* 成本分解 */}
      <div className="space-y-3">
        {breakdown.map((item, i) => (
          <div key={i} className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold">{item.category}</h4>
              <span className="text-2xl font-bold text-red-600">${item.monthly}</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">{item.calculation}</p>
            <ul className="text-xs text-gray-500 space-y-1">
              {item.details.map((detail, j) => (
                <li key={j}>• {detail}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* 总计 */}
      <div className="bg-red-50 rounded-xl p-4 border-2 border-red-500">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-lg">总计</h4>
          <span className="text-3xl font-bold text-red-600">${total}/月</span>
        </div>
      </div>

      {/* 替代方案 */}
      <div className="bg-amber-50 rounded-xl p-4 border-l-4 border-amber-500">
        <h4 className="font-bold mb-3">替代方案（可调整）</h4>
        <div className="space-y-2">
          {alternatives.map((alt, i) => (
            <div key={i} className="bg-white rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold">{alt.scenario}</span>
                <span className={`font-bold ${
                  alt.cost === 0 ? 'text-green-600' :
                  alt.cost < total ? 'text-blue-600' :
                  'text-red-600'
                }`}>
                  ${alt.cost}/月
                </span>
              </div>
              <p className="text-xs text-gray-600">{alt.description}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-600 mt-3 italic">
          💡 <strong>推荐策略</strong>：使用"作为客户去沙龙"方案（$350/月），既是营销成本，也是产品使用和案例收集。可以：
          <br />• 真实体验产品在客户-理发师交互中的使用
          <br />• 收集真实案例用于后续推广
          <br />• 自然建立关系，降低销售阻力
          <br />• 控制成本在预算内，更快达到盈亏平衡
        </p>
      </div>
    </div>
  );
}

function CustomerStrategyLayout({ content }: { content: Record<string, unknown> }) {
  const strategy = content.strategy as {
    approach: string;
    advantages: Array<{ title: string; desc: string }>;
  };
  const execution = content.execution as {
    steps: Array<{ step: number; title: string; desc: string }>;
    scripts: Array<{ moment: string; script: string }>;
  };
  const costs = content.costs as {
    perVisit: { service: string; transportation: string; total: string };
    monthly: { visits: string; cost: string; note: string };
  };

  return (
    <div className="space-y-4">
      {/* 策略概述 */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-4 border-2 border-blue-500">
        <h4 className="font-bold text-lg mb-2">{strategy.approach}</h4>
        <p className="text-sm text-gray-700">作为真实客户去目标沙龙，使用自己的webapp与理发师沟通，自然展示产品价值</p>
      </div>

      {/* 策略优势 */}
      <div className="grid grid-cols-2 gap-4">
        {strategy.advantages.map((adv, i) => (
          <div key={i} className="bg-gray-50 rounded-xl p-4">
            <h5 className="font-bold mb-2 text-green-700">{adv.title}</h5>
            <p className="text-sm text-gray-600">{adv.desc}</p>
          </div>
        ))}
      </div>

      {/* 执行步骤 */}
      <div className="bg-amber-50 rounded-xl p-4 border-l-4 border-amber-500">
        <h4 className="font-bold mb-3">执行步骤</h4>
        <div className="space-y-3">
          {execution.steps.map((step, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                {step.step}
              </div>
              <div className="flex-1">
                <h5 className="font-semibold">{step.title}</h5>
                <p className="text-sm text-gray-600">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 关键话术 */}
      <div className="bg-blue-50 rounded-xl p-4 border-l-4 border-blue-500">
        <h4 className="font-bold mb-3">关键话术（根据不同时刻）</h4>
        <div className="space-y-2">
          {execution.scripts.map((script, i) => (
            <div key={i} className="bg-white rounded-lg p-3">
              <p className="text-xs font-semibold text-blue-700 mb-1">{script.moment}</p>
              <p className="text-sm italic text-gray-700">"{script.script}"</p>
            </div>
          ))}
        </div>
      </div>

      {/* 成本分析 */}
      <div className="bg-green-50 rounded-xl p-4 border-l-4 border-green-500">
        <h4 className="font-bold mb-3">成本分析</h4>
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <p className="text-sm text-gray-600 mb-1">每次拜访成本</p>
            <ul className="text-xs space-y-1 text-gray-700">
              <li>• {costs.perVisit.service}</li>
              <li>• {costs.perVisit.transportation}</li>
              <li className="font-bold text-green-700">• 总计: {costs.perVisit.total}</li>
            </ul>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">月度成本</p>
            <ul className="text-xs space-y-1 text-gray-700">
              <li>• {costs.monthly.visits}</li>
              <li className="font-bold text-green-700">• 总计: {costs.monthly.cost}</li>
              <li className="text-xs italic text-gray-600 mt-2">💡 {costs.monthly.note}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 关键优势总结 */}
      <div className="bg-purple-50 rounded-xl p-4 border-l-4 border-purple-500">
        <h4 className="font-bold mb-2">💡 为什么这个策略有效</h4>
        <ul className="text-sm space-y-1">
          <li>✅ <strong>真实场景</strong>：在真实的客户-理发师交互中使用产品</li>
          <li>✅ <strong>自然展示</strong>：不是"推销"，是"使用"，降低销售阻力</li>
          <li>✅ <strong>双重价值</strong>：既是营销成本（获得客户），也是产品使用（收集案例）</li>
          <li>✅ <strong>建立信任</strong>：成为客户建立关系，后续合作更自然</li>
          <li>✅ <strong>成本可控</strong>：可以选择不同价位的服务，控制成本在$350/月预算内</li>
        </ul>
      </div>
    </div>
  );
}

function CustomerStoriesLayout({ content }: { content: Record<string, unknown> }) {
  const stories = content.stories as Array<{
    number: string;
    title: string;
    scenario: string;
    problem: string;
    action: string;
    result: string;
    insight: string;
    opportunity: string;
  }>;
  const keyTakeaway = content.keyTakeaway as string;

  return (
    <div className="space-y-6">
      {/* 两个故事并排显示 */}
      <div className="grid grid-cols-2 gap-4">
        {stories.map((story, i) => (
          <div key={i} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-5 border-2 border-blue-300 shadow-lg">
            {/* 故事编号和标题 */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                {story.number}
              </div>
              <h4 className="text-lg font-bold text-blue-900">{story.title}</h4>
            </div>

            {/* 场景 */}
            <div className="mb-3 bg-blue-50 rounded-lg p-3 border-2 border-blue-300">
              <p className="text-xs font-semibold text-blue-700 mb-1">场景</p>
              <p className="text-sm text-gray-700">{story.scenario}</p>
            </div>

            {/* 问题 */}
            <div className="mb-3 bg-red-50 rounded-lg p-3 border-2 border-red-300">
              <p className="text-xs font-semibold text-red-700 mb-1">问题</p>
              <p className="text-sm text-gray-700">{story.problem}</p>
            </div>

            {/* 行动 */}
            <div className="mb-3 bg-amber-50 rounded-lg p-3 border-2 border-amber-300">
              <p className="text-xs font-semibold text-amber-700 mb-1">行动</p>
              <p className="text-sm text-gray-700">{story.action}</p>
            </div>

            {/* 结果 */}
            <div className="mb-3 bg-purple-50 rounded-lg p-3 border-2 border-purple-300">
              <p className="text-xs font-semibold text-purple-700 mb-1">结果</p>
              <p className="text-sm text-gray-700 font-medium">{story.result}</p>
            </div>

            {/* 洞察 */}
            <div className="mt-4 bg-green-50 rounded-lg p-3 border-2 border-green-300">
              <p className="text-xs font-semibold text-green-800 mb-1">💡 关键洞察</p>
              <p className="text-sm text-gray-700">{story.insight}</p>
            </div>

            {/* 机会 */}
            <div className="mt-2 bg-amber-50 rounded-lg p-3 border-2 border-amber-300">
              <p className="text-xs font-semibold text-amber-800 mb-1">🎯 市场机会</p>
              <p className="text-sm text-gray-700">{story.opportunity}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 关键要点总结 */}
      <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-5 border-2 border-purple-400 shadow-lg">
        <div className="flex items-start gap-3">
          <div className="text-3xl">💎</div>
          <div>
            <h4 className="font-bold text-lg mb-2 text-purple-900">为什么这些故事很重要</h4>
            <p className="text-sm text-gray-800 leading-relaxed">{keyTakeaway}</p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="bg-white rounded-lg p-3">
                <p className="text-xs font-semibold text-purple-700 mb-1">故事#1揭示</p>
                <p className="text-xs text-gray-700">即使信任专业人士，客户也需要可视化才能做出决定。这是核心痛点。</p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <p className="text-xs font-semibold text-purple-700 mb-1">故事#2揭示</p>
                <p className="text-xs text-gray-700">市场不仅是日常剪发，还有专业形象、紧急需求等隐藏场景。扩大市场范围。</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InterviewQuestionsLayout({ content }: { content: Record<string, unknown> }) {
  const categories = content.categories as Array<{
    category: string;
    questions: string[];
  }>;

  return (
    <div className="space-y-4 overflow-auto max-h-[650px]">
      {categories.map((cat, i) => (
        <div key={i} className="bg-gray-50 rounded-xl p-4 border-l-4 border-blue-500">
          <h4 className="font-bold text-lg mb-3 text-blue-700">{cat.category}</h4>
          <ul className="space-y-2">
            {cat.questions.map((q, j) => (
              <li key={j} className="flex items-start gap-2 text-sm">
                <span className="text-blue-500 font-bold mt-0.5 flex-shrink-0">Q{j + 1}:</span>
                <span className="text-gray-700">{q}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
      
      {/* 数据记录模板 */}
      <div className="bg-purple-50 rounded-xl p-4 border-l-4 border-purple-500">
        <h4 className="font-bold mb-3">📝 数据记录模板</h4>
        <div className="bg-white rounded-lg p-3 text-xs space-y-2 font-mono">
          <div>
            <strong>沙龙名称:</strong> ________________<br />
            <strong>日期:</strong> ________________<br />
            <strong>访谈人:</strong> ________________
          </div>
          <div className="border-t pt-2">
            <strong>业务数据:</strong><br />
            每日客户数: ____ | 每月客户数: ____ | 造型师数: ____
          </div>
          <div className="border-t pt-2">
            <strong>服务数据:</strong><br />
            最受欢迎服务: ________________ | 价格: $____<br />
            最赚钱服务: ________________ | 价格: $____ | 利润率: ____%
          </div>
          <div className="border-t pt-2">
            <strong>沟通数据:</strong><br />
            平均咨询时长: ____ 分钟 | 客户来之前有想法: ____%<br />
            沟通困难频率: ____ | 返工率: ____%
          </div>
          <div className="border-t pt-2">
            <strong>升级销售:</strong><br />
            当前升级转化率: ____% | 主要升级路径: ________________<br />
            升级障碍: ________________ | 预期提升率: ____%
          </div>
          <div className="border-t pt-2">
            <strong>痛点:</strong><br />
            客户不满意主要原因: ________________<br />
            颜色修正成本: $____ | 返工等待时间: ____ 月
          </div>
        </div>
      </div>

      {/* 访谈技巧 */}
      <div className="bg-green-50 rounded-xl p-4 border-l-4 border-green-500">
        <h4 className="font-bold mb-2">💡 访谈技巧</h4>
        <ul className="text-sm space-y-1">
          <li>✅ <strong>自然对话</strong>：在服务过程中或服务后自然聊天，不要像问卷调查</li>
          <li>✅ <strong>先建立关系</strong>：先成为客户，建立信任后再深入提问</li>
          <li>✅ <strong>关注痛点</strong>：特别关注沟通困难、客户不满、返工等痛点话题</li>
          <li>✅ <strong>记录数据</strong>：用手机或笔记本记录关键数字（客户数、价格、百分比等）</li>
          <li>✅ <strong>验证假设</strong>：用这些数据验证演示文稿中的73%不满意率、升级转化率等假设</li>
          <li>✅ <strong>收集案例</strong>：记录具体的客户故事和真实案例，用于后续演示</li>
          <li>✅ <strong>优先关键问题</strong>：优先问业务规模、服务类型、升级转化率等核心问题</li>
        </ul>
      </div>

      {/* 数据验证目标 */}
      <div className="bg-amber-50 rounded-xl p-4 border-l-4 border-amber-500">
        <h4 className="font-bold mb-2">🎯 关键数据验证目标</h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="font-semibold mb-1">需要验证的假设：</p>
            <ul className="space-y-1 text-gray-700">
              <li>• 73% 客户不满意率</li>
              <li>• 15-20% 升级转化率</li>
              <li>• $300+ 颜色修正成本</li>
              <li>• 平均客户数和服务价格</li>
              <li>• 客户来之前是否有想法</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-1">收集的关键指标：</p>
            <ul className="space-y-1 text-gray-700">
              <li>• 每日/每月客户数</li>
              <li>• 最受欢迎和最赚钱的服务</li>
              <li>• 实际升级转化率</li>
              <li>• 沟通困难和返工频率</li>
              <li>• 客户行为和决策模式</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 后续行动 */}
      <div className="bg-blue-50 rounded-xl p-4 border-l-4 border-blue-500">
        <h4 className="font-bold mb-2">📋 访谈后行动</h4>
        <ol className="text-sm space-y-1 list-decimal list-inside">
          <li>整理访谈笔记，提取关键数字和洞察</li>
          <li>使用 /admin/research 工具添加研究数据</li>
          <li>更新演示文稿中的数据（如果发现与假设不符）</li>
          <li>记录真实案例和客户故事，用于后续销售演示</li>
          <li>分析数据，调整产品和定价策略</li>
        </ol>
      </div>
    </div>
  );
}

function DatabaseOptionsLayout({ content }: { content: Record<string, unknown> }) {
  const options = content.options as Array<{
    option: string;
    cost: number;
    included: string[];
    suitability: string;
    migration: string;
  }>;
  const recommendation = content.recommendation as string;

  return (
    <div className="space-y-4">
      {options.map((opt, i) => (
        <div key={i} className={`rounded-xl p-4 ${
          i === 0 ? 'bg-green-50 border-2 border-green-500' : 'bg-gray-50 border-2 border-gray-300'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-lg">{opt.option} {i === 0 && '⭐'}</h4>
            <span className={`text-2xl font-bold ${
              opt.cost === 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              ${opt.cost}/月
            </span>
          </div>
          <div className="mb-3">
            <p className="text-sm font-semibold mb-2">包含资源：</p>
            <ul className="text-sm space-y-1 text-gray-700">
              {opt.included.map((item, j) => (
                <li key={j} className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-lg p-3 space-y-2">
            <p className="text-sm"><strong>适用场景:</strong> {opt.suitability}</p>
            <p className="text-sm"><strong>迁移:</strong> {opt.migration}</p>
          </div>
        </div>
      ))}
      
      <div className="bg-blue-50 rounded-xl p-4 border-l-4 border-blue-500">
        <h4 className="font-bold mb-2">💡 {recommendation}</h4>
        <ul className="text-sm space-y-1 mt-2">
          <li>✅ <strong>初期（12个月）成本: $0</strong> - 完全免费</li>
          <li>✅ <strong>包含资源充足</strong> - 512MB存储 + 100小时计算，足够支持10-50个客户</li>
          <li>✅ <strong>无需额外配置</strong> - Vercel Pro 已包含，直接使用</li>
          <li>⚠️ <strong>12个月后</strong> - 如果超出免费配额，按使用量付费（预计仍很低）</li>
        </ul>
      </div>
    </div>
  );
}

function StrategyCorrectionLayout({ content }: { content: Record<string, unknown> }) {
  const issues = content.issues as Array<{
    issue: string;
    problem: string;
    correction: string;
  }>;
  const correctedPlan = content.correctedPlan as {
    month1to2: { title: string; goal: string; activities: string[]; budget: string };
    month3to4: { title: string; goal: string; activities: string[]; budget: string };
    month5to6: { title: string; goal: string; activities: string[]; budget: string };
  };

  return (
    <div className="space-y-6">
      {/* 识别的问题 */}
      <div className="bg-red-50 rounded-xl p-4 border-2 border-red-500">
        <h4 className="font-bold text-lg mb-3 text-red-800">🔴 关键战略缺陷识别</h4>
        <div className="space-y-4">
          {issues.map((item, i) => (
            <div key={i} className="bg-white rounded-lg p-3">
              <h5 className="font-bold text-red-700 mb-2">{item.issue}</h5>
              <p className="text-sm text-gray-700 mb-2"><strong>问题:</strong> {item.problem}</p>
              <p className="text-sm text-green-700"><strong>修正:</strong> {item.correction}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 修正后的计划 */}
      <div className="bg-green-50 rounded-xl p-4 border-2 border-green-500">
        <h4 className="font-bold text-lg mb-3 text-green-800">✅ 修正后的执行计划</h4>
        <div className="space-y-4">
          {[
            correctedPlan.month1to2,
            correctedPlan.month3to4,
            correctedPlan.month5to6,
          ].map((phase, i) => (
            <div key={i} className="bg-white rounded-lg p-4 border-l-4 border-green-500">
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-bold text-lg">{phase.title}</h5>
                <span className="text-sm font-semibold text-green-700 bg-green-100 px-2 py-1 rounded">
                  目标: {phase.goal}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">预算: {phase.budget}</p>
              <ul className="text-sm space-y-1">
                {phase.activities.map((activity, j) => (
                  <li key={j} className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">•</span>
                    <span>{activity}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* 关键洞察 */}
      <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-500">
        <h4 className="font-bold mb-2">💡 核心修正原则（单人运营）</h4>
        <ul className="text-sm space-y-1">
          <li>✅ <strong>先验证，后扩展</strong> - 前3个月专注验证，而非快速销售</li>
          <li>✅ <strong>质量&gt;数量</strong> - 深度服务5个客户，好过浅层接触50个</li>
          <li>✅ <strong>保持简单</strong> - 单人运营，专注核心：每月6-8次深度接触，建立真实案例</li>
          <li>✅ <strong>保守预测</strong> - 现实预测 + 20%缓冲，好过乐观预测 + 失望</li>
          <li>✅ <strong>自然增长</strong> - "作为客户"策略是主要方法，通过转介绍和案例研究自然增长，无需大规模营销</li>
          <li>✅ <strong>可持续运营</strong> - 目标：10-20个稳定客户，月收入$1,200-2,400，单人可管理</li>
        </ul>
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

function ProfitabilityLayout({ content }: { content: Record<string, unknown> }) {
  const pricing = content.pricing as {
    essential: { revenue: number; credits: number; payAsYouGo: number; apiCostPerCredit: number };
    professional: { revenue: number; credits: number; payAsYouGo: number; apiCostPerCredit: number };
    enterprise: { revenue: number; credits: number; payAsYouGo: number; apiCostPerCredit: number };
  };
  const platformCosts = content.platformCosts as { vercel: number; supabase: number; perCustomer: number };

  // 计算每个套餐的盈利情况
  const calculateProfit = (plan: typeof pricing.essential) => {
    const apiCost = plan.credits * plan.apiCostPerCredit;
    const platformCost = platformCosts.perCustomer;
    const totalCost = apiCost + platformCost;
    const profit = plan.revenue - totalCost;
    const margin = (profit / plan.revenue) * 100;
    const costPerCredit = totalCost / plan.credits;
    
    // 按需付费的利润（客户超出套餐时）
    const payAsYouGoProfit = plan.payAsYouGo - plan.apiCostPerCredit;
    const payAsYouGoMargin = (payAsYouGoProfit / plan.payAsYouGo) * 100;
    
    return {
      revenue: plan.revenue,
      apiCost,
      platformCost,
      totalCost,
      profit,
      margin: margin.toFixed(1),
      costPerCredit: costPerCredit.toFixed(4),
      payAsYouGoProfit,
      payAsYouGoMargin: payAsYouGoMargin.toFixed(1),
    };
  };

  const essential = calculateProfit(pricing.essential);
  const professional = calculateProfit(pricing.professional);
  const enterprise = calculateProfit(pricing.enterprise);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        {/* Essential */}
        <div className="bg-gray-50 rounded-xl p-4">
          <h4 className="font-bold text-lg mb-3">Essential</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>月收入:</span>
              <span className="font-bold text-green-600">${essential.revenue}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>API成本 ({pricing.essential.credits}次):</span>
              <span>${essential.apiCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>平台成本:</span>
              <span>${essential.platformCost}</span>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span>净利润:</span>
              <span className={`font-bold ${essential.profit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${essential.profit.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>利润率:</span>
              <span className="font-bold text-blue-600">{essential.margin}%</span>
            </div>
            <div className="pt-2 border-t text-xs text-gray-500">
              <div>按需付费利润: ${essential.payAsYouGoProfit.toFixed(3)}/次 ({essential.payAsYouGoMargin}%)</div>
            </div>
          </div>
        </div>

        {/* Professional */}
        <div className="bg-amber-50 rounded-xl p-4 border-2 border-amber-500">
          <h4 className="font-bold text-lg mb-3">Professional ⭐</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>月收入:</span>
              <span className="font-bold text-green-600">${professional.revenue}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>API成本 ({pricing.professional.credits}次):</span>
              <span>${professional.apiCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>平台成本:</span>
              <span>${professional.platformCost}</span>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span>净利润:</span>
              <span className={`font-bold ${professional.profit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${professional.profit.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>利润率:</span>
              <span className="font-bold text-blue-600">{professional.margin}%</span>
            </div>
            <div className="pt-2 border-t text-xs text-gray-500">
              <div>按需付费利润: ${professional.payAsYouGoProfit.toFixed(3)}/次 ({professional.payAsYouGoMargin}%)</div>
            </div>
          </div>
        </div>

        {/* Enterprise */}
        <div className="bg-gray-50 rounded-xl p-4">
          <h4 className="font-bold text-lg mb-3">Enterprise</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>月收入:</span>
              <span className="font-bold text-green-600">${enterprise.revenue}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>API成本 ({pricing.enterprise.credits}次):</span>
              <span>${enterprise.apiCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>平台成本:</span>
              <span>${enterprise.platformCost}</span>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span>净利润:</span>
              <span className={`font-bold ${enterprise.profit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${enterprise.profit.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>利润率:</span>
              <span className="font-bold text-blue-600">{enterprise.margin}%</span>
            </div>
            <div className="pt-2 border-t text-xs text-gray-500">
              <div>按需付费利润: ${enterprise.payAsYouGoProfit.toFixed(3)}/次 ({enterprise.payAsYouGoMargin}%)</div>
            </div>
          </div>
        </div>
      </div>

      {/* 关键指标总结 */}
      <div className="bg-blue-50 rounded-xl p-4 border-l-4 border-blue-500">
        <h4 className="font-bold mb-2">关键洞察</h4>
        <ul className="text-sm space-y-1">
          <li>• <strong>API成本极低</strong>: 每次生成仅 $0.039，远低于我们的定价 ($0.13-0.15)</li>
          <li>• <strong>按需付费利润率高</strong>: 91-92% 利润率（超出套餐部分）</li>
          <li>• <strong>套餐内利润率</strong>: Essential 82%, Professional 85%, Enterprise 86%</li>
          <li>• <strong>规模效应明显</strong>: 客户越多，平台成本分摊越低</li>
        </ul>
      </div>
    </div>
  );
}
