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
} from 'lucide-react';

// 内部演示文稿 - 技术、商业、计划
export default function InternalPresentation() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const slides: SlideData[] = [
    // 封面
    {
      type: 'cover',
      title: 'HairVision',
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
          title: '😤 顾客痛点',
          items: [
            '"我说要层次感，结果剪成狗啃的"',
            '参考图片与实际效果差异大',
            '剪完不满意无法撤销',
            '沟通成本高，容易产生误解',
          ],
        },
        right: {
          title: '😰 沙龙痛点',
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
          { category: 'Frontend', techs: ['Next.js 14', 'React', 'TailwindCSS', 'Framer Motion'] },
          { category: 'Backend', techs: ['Vercel Serverless', 'Edge Functions'] },
          { category: 'AI', techs: ['Google Gemini 2.0 Flash', 'Image Generation API'] },
          { category: 'Storage', techs: ['Supabase', 'Cloudinary'] },
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
            price: '$199', 
            period: '/月',
            features: ['系统发型库', '基础生成 200次/月', 'Logo + 主色调定制'],
            highlight: false,
          },
          { 
            name: 'Professional', 
            price: '$499', 
            period: '/月',
            features: ['自定义发型 10款', '服务关联推荐', '完全白标', '自定义域名', '500次/月'],
            highlight: true,
          },
          { 
            name: 'Enterprise', 
            price: '$999', 
            period: '/月',
            features: ['无限自定义', '数据分析', 'API接入', '专属支持'],
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
            salons: 20, 
            avgPrice: 350, 
            monthly: '$7,000',
            annual: '$84,000',
          },
          { 
            label: '目标 (Year 1)', 
            salons: 50, 
            avgPrice: 400, 
            monthly: '$20,000',
            annual: '$240,000',
          },
          { 
            label: '乐观 (Year 2)', 
            salons: 150, 
            avgPrice: 450, 
            monthly: '$67,500',
            annual: '$810,000',
          },
        ],
      },
    },
    {
      type: 'highlight',
      title: 'ROI 卖点',
      highlight: '3个升级 = 回本',
      subtitle: '每月只需3个客户因"看到效果"而升级染发，即可回本',
      description: '客户升级率提升20%，平均+$150 → 每月$15,000+额外收入 (以400客户/月计算)',
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
        ],
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
      subtitle: 'HairVision - 从纽约开始，征服高端沙龙市场',
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
    <div className="h-full p-12 flex flex-col">
      <h2 className="text-3xl font-bold mb-8">{title}</h2>
      <div className="flex-1">
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
    <div className="space-y-4 overflow-auto max-h-[400px]">
      {scripts.map((s, i) => (
        <div key={i} className="p-4 bg-amber-50 rounded-xl border-l-4 border-amber-500">
          <p className="text-sm font-bold text-amber-700 mb-1">{s.scenario}</p>
          <p className="text-gray-700 italic">{s.script}</p>
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
