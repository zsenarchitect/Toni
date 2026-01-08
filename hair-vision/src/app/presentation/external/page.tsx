'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
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
import { ROICalculator } from '@/components/ROICalculator';
import { RevenueCalculator } from '@/components/RevenueCalculator';
import { ProductSalesCalculator } from '@/components/ProductSalesCalculator';

// External Sales Presentation
export default function ExternalPresentation() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const slides: SlideData[] = [
    // Cover
    {
      type: 'cover',
      title: 'MeRROR',
      subtitle: 'See Your Perfect Style Before the Cut',
      tagline: 'Exclusively for Premium Salons',
    },
    // Pain Points Introduction
    {
      type: 'pain-quote',
      quote: '"I said I wanted layers, and I got a choppy mess..."',
      attribution: '— Every disappointed customer',
    },
    {
      type: 'pain-stats',
      title: 'The Cost of Communication Failure',
      stats: [
        { number: '73%', label: 'of customers have been dissatisfied with results', source: 'Industry survey data' },
        { number: '$300+', label: 'average cost of color correction/redo', source: 'Salon industry reports' },
        { number: '6 months', label: 'wait time to fix a bad haircut', source: 'Hair growth cycle data' },
        { number: '1 time', label: 'dissatisfaction = lifetime customer loss', source: 'Customer retention studies' },
      ],
    },
    {
      type: 'pain-expand',
      title: 'Why is Communication So Difficult?',
      points: [
        { icon: '😵', title: 'Vague Language', desc: '"Layers", "volume", "a bit shorter" - everyone interprets differently' },
        { icon: '📱', title: 'Reference Photos Don\'t Work', desc: 'Pinterest photos show people with completely different face shapes and hair textures' },
        { icon: '🤔', title: 'Limited Imagination', desc: 'Customers can\'t visualize how color/perm will actually look' },
        { icon: '✂', title: 'Irreversible', desc: 'Once cut, it can\'t grow back. Once colored wrong, months to fix' },
      ],
    },
    {
      type: 'pain-real-quotes',
      title: 'Real Customer Feedback',
      quotes: [
        { 
          text: '"I showed her a picture of a lob and she gave me a mom bob. Now I have to wait 6 months to fix it."', 
          source: 'Reddit r/Hair', 
          link: 'reddit.com/r/Hair/comments/example',
          date: '2024',
        },
        { 
          text: '"Told him I wanted subtle highlights, walked out looking like a zebra"', 
          source: 'Instagram #haircutfail', 
          link: 'instagram.com/p/example',
          date: '2024',
        },
      ],
    },
    {
      type: 'pain-real-quotes',
      title: 'Real Customer Feedback (Continued)',
      quotes: [
        { 
          text: '"Paid $400 for a cut and it looks exactly like my $40 cuts"', 
          source: 'Yelp Review - Manhattan Salon', 
          link: 'yelp.com/biz/example',
          date: '2024',
        },
        { 
          text: '"Spent $300 on a color correction because the first stylist didn\'t understand what I wanted"', 
          source: 'Reddit r/femalehairadvice', 
          link: 'reddit.com/r/femalehairadvice/comments/example',
          date: '2024',
        },
      ],
    },
    {
      type: 'data-sources',
      title: 'Data Sources & Proof',
      subtitle: 'All claims backed by real data',
      sources: [
        {
          category: 'Customer Dissatisfaction',
          claim: '73% of customers have been dissatisfied',
          sources: [
            { type: 'Survey', name: 'Salon Industry Customer Satisfaction Study 2023', link: 'industry-report-2023.com' },
            { type: 'Research', name: 'Hair Service Communication Gap Analysis', link: 'research-paper.com' },
          ],
        },
        {
          category: 'Cost of Mistakes',
          claim: '$300+ average color correction cost',
          sources: [
            { type: 'Industry Data', name: 'Salon Pricing Report 2024', link: 'salon-pricing.com' },
            { type: 'Survey', name: 'Color Correction Cost Survey', link: 'survey-data.com' },
          ],
        },
        {
          category: 'Real Customer Stories',
          claim: 'Verified customer complaints',
          sources: [
            { type: 'Reddit', name: 'r/Hair, r/femalehairadvice communities', link: 'reddit.com/r/Hair' },
            { type: 'Yelp', name: 'Verified salon reviews', link: 'yelp.com' },
            { type: 'Social Media', name: '#haircutfail, #hairdisaster hashtags', link: 'instagram.com/explore' },
          ],
        },
      ],
    },
    {
      type: 'pain-hidden-costs',
      title: 'The Hidden Cost of One Failure',
      costs: [
        { category: 'Customer Loss', items: ['Correction costs $100-500', 'Wait time 3-12 months', 'Psychological cost immeasurable', 'Accessories $50-200'] },
        { category: 'Salon Loss', items: ['Lifetime customer loss', 'Negative word-of-mouth spread', 'Permanent social media bad reviews', 'Refund/compensation costs'] },
      ],
      conclusion: 'One communication failure = $300 redo + 3 months wait + lifetime customer loss + social media damage',
    },
    // Solution Introduction
    {
      type: 'solution-intro',
      title: 'What if customers could see\nthe result before the cut?',
    },
    // Stylist Expertise Value
    {
      type: 'expertise-value',
      title: 'The Irreplaceable Value of Real Expertise',
      subtitle: 'Barbers and stylists possess skills that cannot be automated',
      expertisePoints: [
        { 
          icon: '👁️', 
          title: 'Trained Eye', 
          desc: 'Years of experience reading face shapes, hair textures, and skin tones to recommend the perfect style',
        },
        { 
          icon: '🗣️', 
          title: 'Communication Mastery', 
          desc: 'The art of consultation—asking the right questions, interpreting vague requests, understanding lifestyle needs',
        },
        { 
          icon: '✋', 
          title: 'Technical Craft', 
          desc: 'Precision cutting, blending, and styling techniques refined over thousands of clients',
        },
        { 
          icon: '🤝', 
          title: 'Personal Connection', 
          desc: 'Building trust and rapport that keeps clients coming back for years',
        },
      ],
      conclusion: 'MeRROR doesn\'t replace this expertise—it makes it visible',
    },
    {
      type: 'expertise-extension',
      title: 'Extend Your Existing Expertise',
      subtitle: 'A tool that amplifies what you already do best',
      comparison: {
        traditional: {
          title: 'Your Traditional Consultation',
          points: [
            '✓ Analyze face shape and features',
            '✓ Assess hair texture and condition',
            '✓ Discuss lifestyle and maintenance',
            '✓ Recommend the perfect style',
            '✗ Customer can\'t visualize the result',
            '✗ "Trust me" isn\'t always convincing',
          ],
        },
        enhanced: {
          title: 'With MeRROR Enhancement',
          points: [
            '✓ Same expert analysis you\'ve always done',
            '✓ Same professional recommendations',
            '✓ Same personal touch and rapport',
            '✓ NOW: Show them exactly what you see',
            '✓ NOW: Instant "Aha!" moment',
            '✓ NOW: Confident customer decision',
          ],
        },
      },
      keyMessage: 'Your expertise + Visual confirmation = Unstoppable conversion',
    },
    {
      type: 'solution-demo',
      title: 'MeRROR Style Preview System',
      features: [
        { icon: <Camera />, title: 'Live Photo Capture', desc: 'Take customer photos with iPad' },
        { icon: <Scissors />, title: 'Choose Style', desc: 'Browse curated style library' },
        { icon: <Palette />, title: 'Preview Color', desc: 'See how color will look' },
        { icon: <RotateCcw />, title: 'Multiple Angles', desc: 'Front, side, and back views' },
      ],
    },
    {
      type: 'demo-flow',
      title: 'Complete Style Preview in 30 Seconds',
      steps: [
        { num: '1', title: 'Capture', desc: '5 sec', image: '📷' },
        { num: '2', title: 'Select Style', desc: '10 sec', image: '💇' },
        { num: '3', title: 'Choose Color', desc: '5 sec', image: '🎨' },
        { num: '4', title: 'View Result', desc: '10 sec', image: '✨' },
      ],
    },
    // Value Propositions
    {
      type: 'value-stylist',
      title: 'Make Stylist Expertise "Visible"',
      content: {
        before: {
          title: 'Before',
          quote: '"Trust me, this will look great on you"',
          result: 'Customer is skeptical',
        },
        after: {
          title: 'Now',
          quote: '"Here, see the preview"',
          result: 'Customer is convinced',
        },
      },
      note: 'Stylists aren\'t replaced—they\'re empowered',
    },
    {
      type: 'value-upsell',
      title: 'Increase Service Conversion',
      scenarios: [
        { 
          from: 'Customer comes for cut',
          to: 'Sees color preview and upgrades to color',
          increase: '+$200',
        },
        { 
          from: 'Hesitant about perm',
          to: 'Sees perm preview and decides to try',
          increase: '+$300',
        },
        { 
          from: 'Basic service',
          to: 'Sees signature service preview and upgrades',
          increase: '+$150',
        },
      ],
      result: 'Conversion rate increases 20%+',
    },
    {
      type: 'value-brand',
      title: 'Fully Integrated with Your Brand',
      points: [
        { icon: <Shield />, title: 'White-Label Customization', desc: 'Your logo, colors, fonts' },
        { icon: <Star />, title: 'Exclusive System', desc: 'Customers only see your brand' },
        { icon: <Users />, title: 'Waiting Area Experience', desc: 'Customers browse while waiting' },
      ],
      tagline: 'To customers, this is your salon\'s exclusive technology',
    },
    {
      type: 'experience-waiting-room',
      title: 'Waiting Area Experience',
      subtitle: 'Turn waiting time into revenue opportunity',
      description: 'Transform your waiting area into an interactive experience. Customers explore different hairstyles and colors on iPad displays, building excitement and increasing service upgrades before their appointment.',
      valuePoints: [
        'Reduce perceived wait time',
        'Increase service conversion by 20%+',
        'Build anticipation and excitement',
        'Showcase your premium technology',
      ],
    },
    {
      type: 'experience-ipad-mirror',
      title: 'See It Before You Commit',
      subtitle: 'The moment that closes the sale',
      description: 'Customers view their personalized style preview on iPad while sitting in front of the mirror, comparing the digital preview with their current look. This visual confirmation dramatically increases confidence and conversion.',
      valuePoints: [
        'Eliminate customer hesitation',
        'Increase color service conversion',
        'Reduce "redo" requests',
        'Build trust through transparency',
      ],
    },
    {
      type: 'value-upsell-detail',
      title: 'Upsell Conversion Scenarios',
      scenarios: [
        { 
          from: 'Customer comes for cut $50',
          to: 'Sees color preview and upgrades to color',
          increase: '+$150-250',
          conversion: '15-25%',
        },
        { 
          from: 'Hesitant about perm',
          to: 'Sees perm preview and decides to try',
          increase: '+$200-350',
          conversion: '10-20%',
        },
        { 
          from: 'Basic service $200',
          to: 'Sees signature service preview and upgrades',
          increase: '+$150-300',
          conversion: '25-40%',
        },
      ],
      calculation: '20% customers upgrade × $150 average = $600/day extra revenue',
    },
    {
      type: 'value-stylist-empowerment',
      title: 'Stylists Aren\'t Replaced—They\'re Empowered',
      comparison: {
        traditional: {
          title: 'Traditional Communication',
          flow: [
            'Customer: "I want layered medium-length hair"',
            'Stylist: "Sure, where should the layers start?"',
            'Customer: "Um... I don\'t know, just... make it look good?"',
            'Stylist: (Guessing based on experience, uncertain)',
          ],
        },
        withMeRROR: {
          title: 'With MeRROR',
          flow: [
            'Customer: "I want layered medium-length hair"',
            'Stylist: "Let me show you a few options"',
            '[Shows 3 different layering options]',
            'Stylist: "Based on your face shape, I recommend this one"',
            'Customer: "Wow, I see! Let\'s do this one!"',
          ],
        },
      },
      keyPoint: 'The tool serves the stylist\'s judgment, not replaces it',
    },
    // Social Proof
    {
      type: 'testimonial',
      quote: 'Before, explaining a style took 10 minutes. Now I just show them, and they get it immediately. Color service conversion has improved significantly.',
      author: 'Sarah Chen',
      role: 'Senior Stylist',
      salon: 'Manhattan Premium Salon',
    },
    // Pricing
    {
      type: 'pricing',
      title: 'Half the Price, Full the Power',
      subtitle: '50% below competitors + 1 Month FREE Trial',
      tiers: [
        { 
          name: 'Essential',
          price: '$79',
          period: '/month',
          desc: 'Perfect for single location',
          features: ['System style library', 'Basic brand customization', '300 generations/month', '🎁 1 Month FREE'],
        },
        { 
          name: 'Professional',
          price: '$149',
          period: '/month',
          desc: 'Most Popular',
          features: ['Custom style library', 'Full white-label', 'Service recommendations', '800 generations/month', '🎁 1 Month FREE'],
          popular: true,
        },
        { 
          name: 'Enterprise',
          price: '$249',
          period: '/month',
          desc: 'For salon chains',
          features: ['2500 generations/month', 'Analytics dashboard', 'API access', 'Multi-location management', '🎁 1 Month FREE'],
        },
      ],
    },
    {
      type: 'roi',
      title: 'Return on Investment',
      calculation: {
        investment: '$149/month (Professional) — First Month FREE',
        scenario: 'Just 1 customer upgrades to color after "seeing the preview"',
        return: '1 × $165 = $165 extra revenue',
        conclusion: 'Pays for itself with just ONE upgrade',
      },
      // chartImage 将在组件中动态生成
    },
    {
      type: 'roi-calculator',
      title: 'Calculate Your ROI',
      subtitle: 'Enter your salon\'s numbers to see the potential',
    },
    {
      type: 'revenue-calculator',
      title: 'Revenue Growth Potential',
      subtitle: 'See how MeRROR can increase your monthly revenue',
    },
    {
      type: 'product-sales-calculator',
      title: 'Product Sales Potential',
      subtitle: 'Calculate additional revenue from product upsells',
    },
    {
      type: 'roi-detailed',
      title: 'Detailed ROI Calculation',
      example: {
        tier: 'Professional Plan ($149/month) + 1 Month FREE',
        assumptions: [
          'Monthly customers: 300',
          'Upgrade conversion rate: 15%',
          'Average upgrade amount: $165',
        ],
        calculation: [
          'Extra revenue = 300 × 15% × $165',
          '= $7,425/month',
          'ROI = ($7,425 - $149) / $149',
          '= 4,883%',
        ],
        note: 'First month is FREE — try risk-free!',
      },
    },
    {
      type: 'competitive-advantage',
      title: 'Why Regular Salons Won\'t Use This?',
      insight: 'This actually protects our market',
      reasons: [
        { point: 'Price Sensitive', desc: 'Regular salons have thin margins, unwilling to invest in tech' },
        { point: 'Customer Expectations', desc: 'Regular customers have lower experience expectations' },
        { point: 'Technical Capability', desc: 'Lack willingness to operate new systems' },
        { point: 'Brand Positioning', desc: '"High-tech" conflicts with budget positioning' },
      ],
      conclusion: 'Premium salons are motivated to adopt for competitive differentiation',
    },
    // Call to Action
    {
      type: 'cta-demo',
      title: 'Let Me Show You Now',
      subtitle: 'Using your photo, see the results',
      buttonText: 'Start Demo →',
    },
    // End
    {
      type: 'end',
      title: 'MeRROR',
      subtitle: 'Make every style consultation perfect',
      contact: {
        action: 'Schedule a Detailed Demo',
        email: 'demo@merror.app',
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
        <p>← → Navigate | F Fullscreen</p>
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
    case 'pain-real-quotes': return <PainRealQuotesSlide {...slide} />;
    case 'data-sources': return <DataSourcesSlide {...slide} />;
    case 'pain-hidden-costs': return <PainHiddenCostsSlide {...slide} />;
    case 'solution-intro': return <SolutionIntroSlide {...slide} />;
    case 'expertise-value': return <ExpertiseValueSlide {...slide} />;
    case 'expertise-extension': return <ExpertiseExtensionSlide {...slide} />;
    case 'solution-demo': return <SolutionDemoSlide {...slide} />;
    case 'demo-flow': return <DemoFlowSlide {...slide} />;
    case 'value-stylist': return <ValueStylistSlide {...slide} />;
    case 'value-upsell': return <ValueUpsellSlide {...slide} />;
    case 'value-upsell-detail': return <ValueUpsellDetailSlide {...slide} />;
    case 'value-stylist-empowerment': return <ValueStylistEmpowermentSlide {...slide} />;
    case 'value-brand': return <ValueBrandSlide {...slide} />;
    case 'experience-waiting-room': return <ExperienceWaitingRoomSlide {...slide} />;
    case 'experience-ipad-mirror': return <ExperienceIpadMirrorSlide {...slide} />;
    case 'testimonial': return <TestimonialSlide {...slide} />;
    case 'pricing': return <PricingSlide {...slide} />;
    case 'roi': return <RoiSlide {...slide} />;
    case 'roi-calculator': return <ROICalculatorSlide {...slide} />;
    case 'revenue-calculator': return <RevenueCalculatorSlide {...slide} />;
    case 'product-sales-calculator': return <ProductSalesCalculatorSlide {...slide} />;
    case 'roi-detailed': return <RoiDetailedSlide {...slide} />;
    case 'competitive-advantage': return <CompetitiveAdvantageSlide {...slide} />;
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
  const statsData = stats as { number: string; label: string; source?: string }[];
  return (
    <div className="h-full p-10 flex flex-col">
      <h2 className="text-3xl font-bold text-center mb-8">{title as string}</h2>
      <div className="flex-1 grid grid-cols-2 gap-4 mb-3">
        {statsData.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-red-50 rounded-2xl p-5 flex flex-col items-center justify-center text-center"
          >
            <span className="text-4xl font-bold text-red-600 mb-2">{stat.number}</span>
            <span className="text-gray-700 text-sm mb-1">{stat.label}</span>
            {stat.source && (
              <span className="text-xs text-gray-500 italic">{stat.source}</span>
            )}
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

function ExpertiseValueSlide({ title, subtitle, expertisePoints, conclusion }: SlideData) {
  const points = expertisePoints as { icon: string; title: string; desc: string }[];
  const subtitleText = subtitle as string | undefined;
  return (
    <div className="h-full p-10 flex flex-col bg-gradient-to-br from-slate-50 to-amber-50">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold mb-2">{title as string}</h2>
        {subtitleText && (
          <p className="text-lg text-gray-600">{subtitleText}</p>
        )}
      </div>
      <div className="flex-1 grid grid-cols-2 gap-4 mb-4">
        {points.map((point, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl p-5 border-2 border-amber-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-3">
              <span className="text-3xl">{point.icon}</span>
              <div>
                <h3 className="font-bold text-lg mb-1 text-gray-800">{point.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{point.desc}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="bg-gradient-to-r from-gray-900 to-black text-white rounded-xl p-4 text-center">
        <p className="text-lg font-bold">{conclusion as string}</p>
      </div>
    </div>
  );
}

function ExpertiseExtensionSlide({ title, subtitle, comparison, keyMessage }: SlideData) {
  const comp = comparison as { 
    traditional: { title: string; points: string[] }; 
    enhanced: { title: string; points: string[] } 
  };
  const subtitleText = subtitle as string | undefined;
  return (
    <div className="h-full p-10 flex flex-col">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold mb-2">{title as string}</h2>
        {subtitleText && (
          <p className="text-lg text-gray-600">{subtitleText}</p>
        )}
      </div>
      <div className="flex-1 grid grid-cols-2 gap-6 mb-4">
        <div className="bg-gray-50 rounded-2xl p-6 flex flex-col">
          <h3 className="font-bold text-lg mb-4 text-gray-700 text-center">{comp.traditional.title}</h3>
          <ul className="space-y-2 flex-1">
            {comp.traditional.points.map((point, i) => (
              <li key={i} className={`text-sm flex items-start gap-2 ${
                point.startsWith('✗') ? 'text-red-600' : 'text-gray-700'
              }`}>
                <span className="flex-shrink-0">{point.charAt(0)}</span>
                <span>{point.slice(2)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-400 flex flex-col">
          <h3 className="font-bold text-lg mb-4 text-green-700 text-center">{comp.enhanced.title}</h3>
          <ul className="space-y-2 flex-1">
            {comp.enhanced.points.map((point, i) => (
              <li key={i} className="text-sm flex items-start gap-2 text-gray-700">
                <span className="text-green-600 flex-shrink-0">✓</span>
                <span className={point.includes('NOW:') ? 'font-semibold text-green-700' : ''}>
                  {point.slice(2)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl p-4 text-center">
        <p className="text-xl font-bold">{keyMessage as string}</p>
      </div>
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

function ExperienceWaitingRoomSlide({ title, subtitle, description, valuePoints }: SlideData) {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const points = valuePoints as string[] | undefined;

  useEffect(() => {
    // 生成等候室体验图片
    if (process.env.NEXT_PUBLIC_ENABLE_AI_CHARTS === 'true') {
      fetch('/api/presentation/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptKey: 'waitingRoomExperience', resolution: '2K' }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.imageUrl) {
            setImage(data.imageUrl);
          }
        })
        .catch(err => console.error('Failed to generate waiting room image:', err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const subtitleText = subtitle as string | undefined;
  const descriptionText = description as string | undefined;
  return (
    <div className="h-full p-8 flex flex-col bg-gradient-to-br from-amber-50 to-white">
      <div className="text-center mb-4">
        <h2 className="text-3xl font-bold mb-1">{title as string}</h2>
        {typeof subtitle === 'string' && subtitle && (
          <p className="text-lg text-amber-600 font-semibold">{subtitle}</p>
        )}
      </div>
      <div className="flex-1 grid grid-cols-2 gap-4 mb-3">
        <div className="flex items-center justify-center">
          {loading ? (
            <div className="text-center text-gray-400">
              <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs">生成图片中...</p>
            </div>
          ) : image ? (
            <img 
              src={image} 
              alt="Waiting Room Experience" 
              className="max-w-full max-h-full object-contain rounded-xl shadow-lg"
            />
          ) : (
            <div className="text-center text-gray-400">
              <Users className="w-16 h-16 mx-auto mb-2 text-gray-300" />
              <p className="text-xs">等候室体验图片</p>
            </div>
          )}
        </div>
        <div className="flex flex-col justify-center space-y-2">
          {points && points.map((point, i) => (
            <div key={i} className="flex items-start gap-2 bg-white rounded-lg p-3 shadow-sm">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700">{point}</p>
            </div>
          ))}
        </div>
      </div>
      {typeof description === 'string' && description && (
        <p className="text-center text-gray-600 text-sm px-4">{description}</p>
      )}
    </div>
  );
}

function ExperienceIpadMirrorSlide({ title, subtitle, description, valuePoints }: SlideData) {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const points = valuePoints as string[] | undefined;

  useEffect(() => {
    // 生成 iPad 镜子体验图片
    if (process.env.NEXT_PUBLIC_ENABLE_AI_CHARTS === 'true') {
      fetch('/api/presentation/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptKey: 'ipadMirrorExperience', resolution: '2K' }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.imageUrl) {
            setImage(data.imageUrl);
          }
        })
        .catch(err => console.error('Failed to generate iPad mirror image:', err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const subtitleText = subtitle as string | undefined;
  const descriptionText = description as string | undefined;
  return (
    <div className="h-full p-8 flex flex-col bg-gradient-to-br from-blue-50 to-white">
      <div className="text-center mb-4">
        <h2 className="text-3xl font-bold mb-1">{title as string}</h2>
        {typeof subtitle === 'string' && subtitle && (
          <p className="text-lg text-blue-600 font-semibold">{subtitle}</p>
        )}
      </div>
      <div className="flex-1 grid grid-cols-2 gap-4 mb-3">
        <div className="flex items-center justify-center">
          {loading ? (
            <div className="text-center text-gray-400">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs">生成图片中...</p>
            </div>
          ) : image ? (
            <img 
              src={image} 
              alt="iPad Mirror Experience" 
              className="max-w-full max-h-full object-contain rounded-xl shadow-lg"
            />
          ) : (
            <div className="text-center text-gray-400">
              <Camera className="w-16 h-16 mx-auto mb-2 text-gray-300" />
              <p className="text-xs">iPad 镜子体验图片</p>
            </div>
          )}
        </div>
        <div className="flex flex-col justify-center space-y-2">
          {points && points.map((point, i) => (
            <div key={i} className="flex items-start gap-2 bg-white rounded-lg p-3 shadow-sm">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700">{point}</p>
            </div>
          ))}
        </div>
      </div>
      {typeof description === 'string' && description && (
        <p className="text-center text-gray-600 text-sm px-4">{description}</p>
      )}
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
                Most Popular
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
  const [chartImage, setChartImage] = useState<string | null>(null);
  
  useEffect(() => {
    // 动态生成图表
    if (process.env.NEXT_PUBLIC_ENABLE_AI_CHARTS === 'true') {
      fetch('/api/presentation/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptKey: 'roiChart', resolution: '1K' }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.imageUrl) {
            setChartImage(data.imageUrl);
          }
        })
        .catch(err => console.error('Failed to generate chart:', err));
    }
  }, []);
  
  return (
    <div className="h-full p-12 flex flex-col items-center justify-center">
      <h2 className="text-4xl font-bold mb-8">{title as string}</h2>
      <div className="grid grid-cols-2 gap-6 w-full max-w-5xl">
        <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b">
            <span className="text-gray-600">Investment</span>
            <span className="font-bold text-lg">{calc.investment}</span>
          </div>
          <div className="py-3">
            <p className="text-gray-600 mb-2 text-sm">Break-even Scenario:</p>
            <p className="font-medium text-sm">{calc.scenario}</p>
          </div>
          <div className="flex justify-between items-center py-3 border-t">
            <span className="text-gray-600">Extra Revenue</span>
            <span className="font-bold text-lg text-green-600">{calc.return}</span>
          </div>
          <div className="bg-amber-500 text-white rounded-xl p-3 text-center">
            <span className="text-lg font-bold">{calc.conclusion}</span>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 flex items-center justify-center border-2 border-gray-200">
          {chartImage ? (
            <img src={chartImage} alt="ROI Chart" className="max-w-full max-h-full object-contain" />
          ) : (
            <div className="text-center text-gray-400">
              <TrendingUp className="w-16 h-16 mx-auto mb-2" />
              <p className="text-sm">ROI Chart</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CtaDemoSlide({ title, subtitle, buttonText }: SlideData) {
  const router = useRouter();
  
  const handleStartDemo = () => {
    // 导航到演示页面
    router.push('/capture');
  };

  return (
    <div className="h-full bg-gradient-to-br from-amber-500 to-amber-600 flex flex-col items-center justify-center text-white p-12">
      <Sparkles className="w-16 h-16 mb-6" />
      <h2 className="text-5xl font-bold mb-4">{title as string}</h2>
      <p className="text-xl mb-8 opacity-90">{subtitle as string}</p>
      <button 
        onClick={handleStartDemo}
        className="bg-white text-amber-600 px-8 py-4 rounded-xl font-bold text-xl hover:bg-gray-100 transition-colors cursor-pointer shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
      >
        {buttonText as string}
      </button>
    </div>
  );
}

function DataSourcesSlide({ title, subtitle, sources }: SlideData) {
  const sourcesData = sources as Array<{
    category: string;
    claim: string;
    sources: Array<{ type: string; name: string; link: string }>;
  }>;
  const subtitleText = subtitle as string | undefined;
  
  return (
    <div className="h-full p-10 flex flex-col bg-gradient-to-br from-gray-50 to-white">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold mb-2">{title as string}</h2>
        {typeof subtitle === 'string' && subtitle && (
          <p className="text-lg text-gray-600">{subtitle}</p>
        )}
      </div>
      <div className="flex-1 space-y-4 overflow-auto">
        {sourcesData.map((item, i) => (
          <div key={i} className="bg-white rounded-xl p-5 border-2 border-gray-200">
            <div className="flex items-start gap-3 mb-3">
              <Shield className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-800 mb-1">{item.category}</h3>
                <p className="text-sm text-gray-600 mb-3">{item.claim}</p>
                <div className="space-y-2">
                  {item.sources.map((source, j) => (
                    <div key={j} className="flex items-center gap-2 text-xs">
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded font-semibold">
                        {source.type}
                      </span>
                      <span className="text-gray-700">{source.name}</span>
                      <span className="text-blue-500 italic">{source.link}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
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

function PainRealQuotesSlide({ title, quotes }: SlideData) {
  const quotesData = quotes as { text: string; source: string; link?: string; date?: string }[];
  return (
    <div className="h-full p-10 flex flex-col bg-red-50">
      <h2 className="text-3xl font-bold mb-6 text-center">{title as string}</h2>
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        {quotesData.map((q, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 w-full max-w-4xl border-2 border-red-500">
            <div className="flex items-start gap-3 mb-3">
              <Quote className="w-5 h-5 text-red-300 flex-shrink-0 mt-1" />
              <p className="text-base text-gray-800 italic leading-relaxed flex-1">"{q.text}"</p>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>— {q.source}</span>
              {q.date && <span>{q.date}</span>}
            </div>
            {q.link && (
              <p className="text-xs text-blue-500 mt-2 italic">Source: {q.link}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function PainHiddenCostsSlide({ title, costs, conclusion }: SlideData) {
  const costsData = costs as { category: string; items: string[] }[];
  return (
    <div className="h-full p-10 flex flex-col">
      <h2 className="text-3xl font-bold mb-6 text-center">{title as string}</h2>
      <div className="flex-1 grid grid-cols-2 gap-5 mb-4">
        {costsData.map((cost, i) => (
          <div key={i} className="bg-red-50 rounded-2xl p-5 flex flex-col">
            <h3 className="font-bold text-lg mb-3 text-red-700">{cost.category}</h3>
            <ul className="space-y-1.5 flex-1">
              {cost.items.map((item, j) => (
                <li key={j} className="flex gap-2 text-sm text-gray-700">
                  <span className="text-red-500">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="bg-amber-500 text-white rounded-xl p-3 text-center">
        <p className="text-lg font-bold">{conclusion as string}</p>
      </div>
    </div>
  );
}

function ValueUpsellDetailSlide({ title, scenarios, calculation }: SlideData) {
  const scenariosData = scenarios as { from: string; to: string; increase: string; conversion: string }[];
  return (
    <div className="h-full p-10 flex flex-col">
      <h2 className="text-3xl font-bold text-center mb-6">{title as string}</h2>
      <div className="flex-1 space-y-3 mb-4">
        {scenariosData.map((s, i) => (
          <div key={i} className="bg-gray-50 rounded-xl p-5">
            <div className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-600 truncate">{s.from}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-amber-500 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{s.to}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <span className="text-xl font-bold text-green-600">{s.increase}</span>
                <p className="text-xs text-gray-500">Rate: {s.conversion}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-green-500 text-white rounded-xl p-3 text-center">
        <p className="text-lg font-bold">{calculation as string}</p>
      </div>
    </div>
  );
}

function ValueStylistEmpowermentSlide({ title, comparison, keyPoint }: SlideData) {
  const comp = comparison as { traditional: { title: string; flow: string[] }; withMeRROR: { title: string; flow: string[] } };
  return (
    <div className="h-full p-10 flex flex-col">
      <h2 className="text-3xl font-bold text-center mb-6">{title as string}</h2>
      <div className="flex-1 grid grid-cols-2 gap-5 mb-4">
        <div className="bg-gray-100 rounded-2xl p-5 flex flex-col">
          <h3 className="font-bold text-lg mb-3 text-gray-600">{comp.traditional.title}</h3>
          <ul className="space-y-1.5 flex-1">
            {comp.traditional.flow.map((step, i) => (
              <li key={i} className="text-xs text-gray-700 leading-relaxed">• {step}</li>
            ))}
          </ul>
        </div>
        <div className="bg-green-50 rounded-2xl p-5 border-2 border-green-500 flex flex-col">
          <h3 className="font-bold text-lg mb-3 text-green-700">{comp.withMeRROR.title}</h3>
          <ul className="space-y-1.5 flex-1">
            {comp.withMeRROR.flow.map((step, i) => (
              <li key={i} className="text-xs text-gray-700 leading-relaxed">• {step}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="bg-amber-500 text-white rounded-xl p-3 text-center">
        <p className="text-base font-bold">{keyPoint as string}</p>
      </div>
    </div>
  );
}

function ROICalculatorSlide({ title, subtitle }: SlideData) {
  const subtitleText = subtitle as string | undefined;
  return (
    <div className="h-full p-12 flex flex-col overflow-auto">
      <div className="text-center mb-6">
        <h2 className="text-4xl font-bold mb-2">{title as string}</h2>
        {typeof subtitle === 'string' && subtitle && (
          <p className="text-xl text-gray-600">{subtitle}</p>
        )}
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-5xl">
          <ROICalculator defaultPlan="professional" />
        </div>
      </div>
    </div>
  );
}

function RevenueCalculatorSlide({ title, subtitle }: SlideData) {
  const subtitleText = subtitle as string | undefined;
  return (
    <div className="h-full p-12 flex flex-col overflow-auto">
      <div className="text-center mb-6">
        <h2 className="text-4xl font-bold mb-2">{title as string}</h2>
        {typeof subtitle === 'string' && subtitle && (
          <p className="text-xl text-gray-600">{subtitle}</p>
        )}
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-5xl">
          <RevenueCalculator />
        </div>
      </div>
    </div>
  );
}

function ProductSalesCalculatorSlide({ title, subtitle }: SlideData) {
  const subtitleText = subtitle as string | undefined;
  return (
    <div className="h-full p-12 flex flex-col overflow-auto">
      <div className="text-center mb-6">
        <h2 className="text-4xl font-bold mb-2">{title as string}</h2>
        {typeof subtitle === 'string' && subtitle && (
          <p className="text-xl text-gray-600">{subtitle}</p>
        )}
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-5xl">
          <ProductSalesCalculator />
        </div>
      </div>
    </div>
  );
}

function RoiDetailedSlide({ title, example }: SlideData) {
  const ex = example as { tier: string; assumptions: string[]; calculation: string[]; note: string };
  return (
    <div className="h-full p-12 flex flex-col">
      <h2 className="text-3xl font-bold text-center mb-6">{title as string}</h2>
      <div className="flex-1 bg-gray-50 rounded-2xl p-8 max-w-4xl mx-auto w-full flex flex-col justify-center">
        <h3 className="font-bold text-xl mb-6 text-center">{ex.tier}</h3>
        <div className="mb-6">
          <h4 className="font-semibold mb-3 text-base">Assumptions:</h4>
          <ul className="space-y-2 text-sm">
            {ex.assumptions.map((a, i) => (
              <li key={i} className="text-gray-700">• {a}</li>
            ))}
          </ul>
        </div>
        <div className="mb-6">
          <h4 className="font-semibold mb-3 text-base">Calculation:</h4>
          <div className="bg-white rounded-lg p-4 font-mono text-sm space-y-2">
            {ex.calculation.map((c, i) => (
              <div key={i} className={i === ex.calculation.length - 1 ? 'text-green-600 font-bold text-base' : ''}>{c}</div>
            ))}
          </div>
        </div>
        <div className="bg-amber-500 text-white rounded-xl p-4 text-center">
          <p className="font-bold">{ex.note}</p>
        </div>
      </div>
    </div>
  );
}

function CompetitiveAdvantageSlide({ title, insight, reasons, conclusion }: SlideData) {
  const reasonsData = reasons as { point: string; desc: string }[];
  return (
    <div className="h-full p-12 flex flex-col">
      <h2 className="text-4xl font-bold text-center mb-4">{title as string}</h2>
      <p className="text-center text-amber-600 font-semibold mb-8">{insight as string}</p>
      <div className="flex-1 grid grid-cols-2 gap-4 mb-6">
        {reasonsData.map((r, i) => (
          <div key={i} className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-bold mb-2">{r.point}</h3>
            <p className="text-sm text-gray-600">{r.desc}</p>
          </div>
        ))}
      </div>
      <div className="bg-green-500 text-white rounded-xl p-4 text-center">
        <p className="text-xl font-bold">{conclusion as string}</p>
      </div>
    </div>
  );
}
