'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Maximize,
  Scissors,
  Camera,
  Palette,
  RotateCcw,
  Sparkles,
  Shield,
  TrendingUp,
  Users,
  MessageSquare,
  Check,
  Star,
  Quote,
  ArrowRight,
} from 'lucide-react';

// 外部销售演示文稿
export default function ExternalPresentation() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const slides: SlideData[] = [
    // 封面
    {
      type: 'cover',
      title: 'HairVision',
      subtitle: '在剪发前，预见完美造型',
      tagline: 'Exclusively for Premium Salons',
    },
    // 痛点引入
    {
      type: 'pain-quote',
      quote: '"我说要有层次感，结果剪成了狗啃的..."',
      attribution: '— 每一位曾经失望的顾客',
    },
    {
      type: 'pain-stats',
      title: '沟通失败的代价',
      stats: [
        { number: '73%', label: '的顾客曾对发型结果不满意' },
        { number: '$300+', label: '色彩矫正/返工的平均费用' },
        { number: '6个月', label: '修复一次失败剪发的等待时间' },
        { number: '1次', label: '不满意 = 终身流失的客户' },
      ],
    },
    {
      type: 'pain-expand',
      title: '为什么沟通这么难？',
      points: [
        { icon: '😵', title: '语言模糊', desc: '"层次感"、"蓬松"、"稍微短一点"每个人理解不同' },
        { icon: '📱', title: '参考图片不适用', desc: 'Pinterest图片的人跟顾客的脸型、发质完全不同' },
        { icon: '🤔', title: '想象力有限', desc: '顾客无法想象染色/烫发后的真实效果' },
        { icon: '✂️', title: '不可挽回', desc: '剪短了不能变长，染坏了要等半年' },
      ],
    },
    // 解决方案引入
    {
      type: 'solution-intro',
      title: '如果顾客能在剪发前\n看到效果呢？',
    },
    {
      type: 'solution-demo',
      title: 'HairVision 造型预览系统',
      features: [
        { icon: <Camera />, title: '现场拍照', desc: '用iPad拍摄顾客照片' },
        { icon: <Scissors />, title: '选择发型', desc: '浏览精选发型库' },
        { icon: <Palette />, title: '预览颜色', desc: '看到染发后的效果' },
        { icon: <RotateCcw />, title: '多角度', desc: '正面、侧面、背面' },
      ],
    },
    {
      type: 'demo-flow',
      title: '30秒完成造型预览',
      steps: [
        { num: '1', title: '拍照', desc: '5秒', image: '📷' },
        { num: '2', title: '选发型', desc: '10秒', image: '💇' },
        { num: '3', title: '选颜色', desc: '5秒', image: '🎨' },
        { num: '4', title: '查看效果', desc: '10秒', image: '✨' },
      ],
    },
    // 价值主张
    {
      type: 'value-stylist',
      title: '让造型师的专业被"看见"',
      content: {
        before: {
          title: '以前',
          quote: '"相信我，这款很适合您"',
          result: '客户半信半疑',
        },
        after: {
          title: '现在',
          quote: '"您看，这是效果图"',
          result: '客户立刻信服',
        },
      },
      note: '造型师不是被取代，而是被赋能',
    },
    {
      type: 'value-upsell',
      title: '提升服务转化',
      scenarios: [
        { 
          from: '客户来剪发',
          to: '看到染色效果后升级染发',
          increase: '+$200',
        },
        { 
          from: '犹豫要不要烫发',
          to: '看到烫发效果后决定尝试',
          increase: '+$300',
        },
        { 
          from: '普通服务',
          to: '看到招牌项目效果后升级',
          increase: '+$150',
        },
      ],
      result: '转化率提升 20%+',
    },
    {
      type: 'value-brand',
      title: '完全融入您的品牌',
      points: [
        { icon: <Shield />, title: '白标定制', desc: '您的Logo、配色、字体' },
        { icon: <Star />, title: '专属系统', desc: '顾客只看到您的品牌' },
        { icon: <Users />, title: '等位区体验', desc: '顾客等待时自行浏览' },
      ],
      tagline: '在顾客眼里，这就是您沙龙的专属技术',
    },
    // 社会证明
    {
      type: 'testimonial',
      quote: '以前解释一个发型要10分钟，现在直接展示，客户马上懂了。染发转化率明显提升了。',
      author: 'Sarah Chen',
      role: '资深造型师',
      salon: 'Manhattan高端沙龙',
    },
    // 定价
    {
      type: 'pricing',
      title: '简单透明的定价',
      tiers: [
        { 
          name: 'Essential',
          price: '$199',
          period: '/月',
          desc: '适合单店起步',
          features: ['系统发型库', '基础品牌定制', '200次生成/月'],
        },
        { 
          name: 'Professional',
          price: '$499',
          period: '/月',
          desc: '最受欢迎',
          features: ['自定义发型库', '完全白标', '服务关联推荐', '500次生成/月'],
          popular: true,
        },
        { 
          name: 'Enterprise',
          price: '联系我们',
          period: '',
          desc: '适合连锁品牌',
          features: ['无限生成', '专属定制开发', 'API接入', '多店管理'],
        },
      ],
    },
    {
      type: 'roi',
      title: '投资回报',
      calculation: {
        investment: '$499/月 (Professional)',
        scenario: '每月只需 3 位客户因"看到效果"而升级染发',
        return: '3 × $150 = $450 额外收入',
        conclusion: '一周就能回本',
      },
    },
    // 行动号召
    {
      type: 'cta-demo',
      title: '现在，让我为您演示',
      subtitle: '用您的照片，看看效果',
      buttonText: '开始演示 →',
    },
    // 结束
    {
      type: 'end',
      title: 'HairVision',
      subtitle: '让每一次造型沟通，都完美无误',
      contact: {
        action: '预约详细演示',
        email: 'demo@hairvision.app',
      },
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
            <ExternalSlideRenderer slide={slides[currentSlide]} />
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-4">
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="p-2 rounded-full bg-black/10 hover:bg-black/20 disabled:opacity-30 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <div className="flex gap-1">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === currentSlide ? 'bg-black' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          
          <button
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            className="p-2 rounded-full bg-black/10 hover:bg-black/20 disabled:opacity-30 transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Fullscreen */}
        <button
          onClick={toggleFullscreen}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/10 hover:bg-black/20"
        >
          <Maximize className="w-5 h-5" />
        </button>

        {/* Progress */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
          <div 
            className="h-full bg-amber-500 transition-all"
            style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Hints */}
      <div className="fixed bottom-4 right-4 text-xs text-gray-500 space-y-1">
        <p>← → 翻页 | F 全屏</p>
      </div>
    </div>
  );
}

interface SlideData {
  type: string;
  [key: string]: unknown;
}

function ExternalSlideRenderer({ slide }: { slide: SlideData }) {
  switch (slide.type) {
    case 'cover': return <CoverSlide {...slide} />;
    case 'pain-quote': return <PainQuoteSlide {...slide} />;
    case 'pain-stats': return <PainStatsSlide {...slide} />;
    case 'pain-expand': return <PainExpandSlide {...slide} />;
    case 'solution-intro': return <SolutionIntroSlide {...slide} />;
    case 'solution-demo': return <SolutionDemoSlide {...slide} />;
    case 'demo-flow': return <DemoFlowSlide {...slide} />;
    case 'value-stylist': return <ValueStylistSlide {...slide} />;
    case 'value-upsell': return <ValueUpsellSlide {...slide} />;
    case 'value-brand': return <ValueBrandSlide {...slide} />;
    case 'testimonial': return <TestimonialSlide {...slide} />;
    case 'pricing': return <PricingSlide {...slide} />;
    case 'roi': return <RoiSlide {...slide} />;
    case 'cta-demo': return <CtaDemoSlide {...slide} />;
    case 'end': return <EndSlide {...slide} />;
    default: return <div>Unknown</div>;
  }
}

function CoverSlide({ title, subtitle, tagline }: SlideData) {
  return (
    <div className="h-full bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col items-center justify-center text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-48 h-48 bg-amber-500/5 rounded-full blur-2xl" />
      
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-3xl flex items-center justify-center mb-8 shadow-2xl"
      >
        <Scissors className="w-12 h-12 text-white" />
      </motion.div>
      
      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-7xl font-bold mb-4"
      >
        {title as string}
      </motion.h1>
      
      <motion.p 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-2xl text-gray-300 mb-8"
      >
        {subtitle as string}
      </motion.p>
      
      <motion.p 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-sm text-amber-500 tracking-widest uppercase"
      >
        {tagline as string}
      </motion.p>
    </div>
  );
}

function PainQuoteSlide({ quote, attribution }: SlideData) {
  return (
    <div className="h-full bg-red-50 flex flex-col items-center justify-center p-16">
      <Quote className="w-16 h-16 text-red-300 mb-8" />
      <p className="text-4xl font-medium text-gray-800 text-center max-w-3xl mb-8 leading-relaxed">
        {quote as string}
      </p>
      <p className="text-xl text-gray-500">{attribution as string}</p>
    </div>
  );
}

function PainStatsSlide({ title, stats }: SlideData) {
  const statsData = stats as { number: string; label: string }[];
  return (
    <div className="h-full p-12 flex flex-col">
      <h2 className="text-4xl font-bold text-center mb-12">{title as string}</h2>
      <div className="flex-1 grid grid-cols-4 gap-6">
        {statsData.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-red-50 rounded-2xl p-6 flex flex-col items-center justify-center text-center"
          >
            <span className="text-5xl font-bold text-red-600 mb-2">{stat.number}</span>
            <span className="text-gray-600">{stat.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function PainExpandSlide({ title, points }: SlideData) {
  const pointsData = points as { icon: string; title: string; desc: string }[];
  return (
    <div className="h-full p-12 flex flex-col">
      <h2 className="text-4xl font-bold mb-12">{title as string}</h2>
      <div className="flex-1 grid grid-cols-2 gap-6">
        {pointsData.map((point, i) => (
          <div key={i} className="bg-gray-50 rounded-2xl p-6 flex gap-4">
            <span className="text-4xl">{point.icon}</span>
            <div>
              <h3 className="font-bold text-xl mb-2">{point.title}</h3>
              <p className="text-gray-600">{point.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SolutionIntroSlide({ title }: SlideData) {
  return (
    <div className="h-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center p-16">
      <h2 className="text-5xl font-bold text-white text-center leading-tight whitespace-pre-line">
        {title as string}
      </h2>
    </div>
  );
}

function SolutionDemoSlide({ title, features }: SlideData) {
  const featuresData = features as { icon: React.ReactNode; title: string; desc: string }[];
  return (
    <div className="h-full p-12 flex flex-col">
      <h2 className="text-4xl font-bold text-center mb-12">{title as string}</h2>
      <div className="flex-1 grid grid-cols-4 gap-6">
        {featuresData.map((feature, i) => (
          <motion.div 
            key={i}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-gray-900 text-white rounded-2xl p-6 flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center mb-4">
              {feature.icon}
            </div>
            <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
            <p className="text-gray-400 text-sm">{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function DemoFlowSlide({ title, steps }: SlideData) {
  const stepsData = steps as { num: string; title: string; desc: string; image: string }[];
  return (
    <div className="h-full p-12 flex flex-col">
      <h2 className="text-4xl font-bold text-center mb-12">{title as string}</h2>
      <div className="flex-1 flex items-center justify-center gap-4">
        {stepsData.map((step, i) => (
          <div key={i} className="flex items-center">
            <div className="bg-gray-50 rounded-2xl p-6 w-40 text-center">
              <span className="text-4xl mb-2 block">{step.image}</span>
              <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                {step.num}
              </div>
              <h3 className="font-bold">{step.title}</h3>
              <p className="text-sm text-gray-500">{step.desc}</p>
            </div>
            {i < stepsData.length - 1 && (
              <ArrowRight className="w-8 h-8 text-gray-300 mx-2" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ValueStylistSlide({ title, content, note }: SlideData) {
  const contentData = content as { before: { title: string; quote: string; result: string }; after: { title: string; quote: string; result: string } };
  return (
    <div className="h-full p-12 flex flex-col">
      <h2 className="text-4xl font-bold text-center mb-8">{title as string}</h2>
      <div className="flex-1 grid grid-cols-2 gap-8">
        <div className="bg-gray-100 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
          <p className="text-gray-500 mb-4">{contentData.before.title}</p>
          <p className="text-2xl font-medium mb-4">"{contentData.before.quote}"</p>
          <p className="text-red-500">→ {contentData.before.result}</p>
        </div>
        <div className="bg-green-50 rounded-2xl p-8 flex flex-col items-center justify-center text-center border-2 border-green-500">
          <p className="text-green-600 mb-4">{contentData.after.title}</p>
          <p className="text-2xl font-medium mb-4">"{contentData.after.quote}"</p>
          <p className="text-green-600">→ {contentData.after.result}</p>
        </div>
      </div>
      <p className="text-center text-gray-500 mt-6">{note as string}</p>
    </div>
  );
}

function ValueUpsellSlide({ title, scenarios, result }: SlideData) {
  const scenariosData = scenarios as { from: string; to: string; increase: string }[];
  return (
    <div className="h-full p-12 flex flex-col">
      <h2 className="text-4xl font-bold text-center mb-8">{title as string}</h2>
      <div className="flex-1 space-y-4">
        {scenariosData.map((s, i) => (
          <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="flex-1">
              <p className="text-gray-500">{s.from}</p>
            </div>
            <ArrowRight className="w-6 h-6 text-amber-500" />
            <div className="flex-1">
              <p className="font-medium">{s.to}</p>
            </div>
            <span className="text-2xl font-bold text-green-600">{s.increase}</span>
          </div>
        ))}
      </div>
      <div className="bg-amber-500 text-white rounded-xl p-4 text-center mt-4">
        <span className="text-2xl font-bold">{result as string}</span>
      </div>
    </div>
  );
}

function ValueBrandSlide({ title, points, tagline }: SlideData) {
  const pointsData = points as { icon: React.ReactNode; title: string; desc: string }[];
  return (
    <div className="h-full p-12 flex flex-col bg-gray-900 text-white">
      <h2 className="text-4xl font-bold text-center mb-12">{title as string}</h2>
      <div className="flex-1 grid grid-cols-3 gap-6">
        {pointsData.map((point, i) => (
          <div key={i} className="bg-white/10 rounded-2xl p-6 text-center">
            <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              {point.icon}
            </div>
            <h3 className="font-bold text-lg mb-2">{point.title}</h3>
            <p className="text-gray-400">{point.desc}</p>
          </div>
        ))}
      </div>
      <p className="text-center text-amber-500 text-xl mt-8">{tagline as string}</p>
    </div>
  );
}

function TestimonialSlide({ quote, author, role, salon }: SlideData) {
  return (
    <div className="h-full bg-amber-50 flex flex-col items-center justify-center p-16">
      <Quote className="w-12 h-12 text-amber-300 mb-6" />
      <p className="text-3xl text-center max-w-3xl mb-8 leading-relaxed">
        "{quote as string}"
      </p>
      <div className="text-center">
        <p className="font-bold text-xl">{author as string}</p>
        <p className="text-gray-600">{role as string}</p>
        <p className="text-gray-500">{salon as string}</p>
      </div>
    </div>
  );
}

function PricingSlide({ title, tiers }: SlideData) {
  const tiersData = tiers as { name: string; price: string; period: string; desc: string; features: string[]; popular?: boolean }[];
  return (
    <div className="h-full p-12 flex flex-col">
      <h2 className="text-4xl font-bold text-center mb-8">{title as string}</h2>
      <div className="flex-1 grid grid-cols-3 gap-6">
        {tiersData.map((tier, i) => (
          <div 
            key={i} 
            className={`rounded-2xl p-6 flex flex-col ${
              tier.popular 
                ? 'bg-black text-white ring-4 ring-amber-500' 
                : 'bg-gray-50'
            }`}
          >
            {tier.popular && (
              <span className="bg-amber-500 text-white text-xs px-3 py-1 rounded-full self-start mb-2">
                最受欢迎
              </span>
            )}
            <h3 className="font-bold text-xl">{tier.name}</h3>
            <p className={`text-sm mb-4 ${tier.popular ? 'text-gray-400' : 'text-gray-500'}`}>
              {tier.desc}
            </p>
            <div className="mb-6">
              <span className="text-4xl font-bold">{tier.price}</span>
              <span className={tier.popular ? 'text-gray-400' : 'text-gray-500'}>{tier.period}</span>
            </div>
            <ul className="space-y-2 flex-1">
              {tier.features.map((f, j) => (
                <li key={j} className="flex gap-2 text-sm">
                  <Check className={`w-4 h-4 ${tier.popular ? 'text-amber-500' : 'text-green-500'}`} />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function RoiSlide({ title, calculation }: SlideData) {
  const calc = calculation as { investment: string; scenario: string; return: string; conclusion: string };
  return (
    <div className="h-full p-12 flex flex-col items-center justify-center">
      <h2 className="text-4xl font-bold mb-12">{title as string}</h2>
      <div className="bg-gray-50 rounded-2xl p-8 max-w-2xl w-full space-y-6">
        <div className="flex justify-between items-center pb-4 border-b">
          <span className="text-gray-600">投入</span>
          <span className="font-bold text-xl">{calc.investment}</span>
        </div>
        <div className="py-4">
          <p className="text-gray-600 mb-2">回本场景:</p>
          <p className="font-medium">{calc.scenario}</p>
        </div>
        <div className="flex justify-between items-center py-4 border-t">
          <span className="text-gray-600">额外收入</span>
          <span className="font-bold text-xl text-green-600">{calc.return}</span>
        </div>
        <div className="bg-amber-500 text-white rounded-xl p-4 text-center">
          <span className="text-2xl font-bold">{calc.conclusion}</span>
        </div>
      </div>
    </div>
  );
}

function CtaDemoSlide({ title, subtitle, buttonText }: SlideData) {
  return (
    <div className="h-full bg-gradient-to-br from-amber-500 to-amber-600 flex flex-col items-center justify-center text-white p-12">
      <Sparkles className="w-16 h-16 mb-6" />
      <h2 className="text-5xl font-bold mb-4">{title as string}</h2>
      <p className="text-xl mb-8 opacity-90">{subtitle as string}</p>
      <button className="bg-white text-amber-600 px-8 py-4 rounded-xl font-bold text-xl hover:bg-gray-100 transition-colors">
        {buttonText as string}
      </button>
    </div>
  );
}

function EndSlide({ title, subtitle, contact }: SlideData) {
  const contactData = contact as { action: string; email: string };
  return (
    <div className="h-full bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center text-white p-12">
      <div className="w-20 h-20 bg-amber-500 rounded-2xl flex items-center justify-center mb-8">
        <Scissors className="w-10 h-10" />
      </div>
      <h2 className="text-5xl font-bold mb-4">{title as string}</h2>
      <p className="text-xl text-gray-400 mb-12">{subtitle as string}</p>
      <div className="text-center">
        <p className="text-amber-500 mb-2">{contactData.action}</p>
        <p className="text-2xl font-bold">{contactData.email}</p>
      </div>
    </div>
  );
}
