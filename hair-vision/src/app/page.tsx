'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Camera, History, Sparkles, ChevronRight, Scissors, Presentation, Users, Palette } from 'lucide-react';
import { useStore } from '@/hooks/useStore';

// 新拟态样式工具类
const neu = {
  // 凸起效果 - 元素看起来从背景中凸起
  raised: 'bg-[#e8eef5] rounded-2xl shadow-[8px_8px_16px_#c5cad1,-8px_-8px_16px_#ffffff]',
  // 凹陷效果 - 元素看起来被按压进背景
  pressed: 'bg-[#e8eef5] rounded-2xl shadow-[inset_4px_4px_8px_#c5cad1,inset_-4px_-4px_8px_#ffffff]',
  // 悬浮效果 - 更强的凸起
  floating: 'bg-[#e8eef5] rounded-3xl shadow-[12px_12px_24px_#c5cad1,-12px_-12px_24px_#ffffff]',
  // 按钮悬停效果
  buttonHover: 'hover:shadow-[4px_4px_8px_#c5cad1,-4px_-4px_8px_#ffffff] transition-all duration-300',
  // 图标容器
  iconBox: 'rounded-xl shadow-[4px_4px_8px_#c5cad1,-4px_-4px_8px_#ffffff]',
};

export default function HomePage() {
  const { history } = useStore();

  return (
    <div className="min-h-screen bg-[#e8eef5]">
      {/* Header */}
      <header className="px-6 pt-12 pb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <div className={`w-14 h-14 ${neu.iconBox} bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center`}>
            <Scissors className="w-7 h-7 text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-700">MeRROR</h1>
            <p className="text-sm text-gray-500">Salon Style Preview</p>
          </div>
        </motion.div>
      </header>

      {/* Main Content */}
      <main className="px-6 pb-8">
        {/* Hero Section - 新拟态风格 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className={`relative ${neu.floating} p-8 mb-8 overflow-hidden`}
        >
          {/* 柔和的背景装饰 */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-amber-200/30 to-orange-200/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-amber-100/20 to-yellow-100/10 rounded-full blur-2xl" />
          
          <div className="relative z-10">
            <div className={`w-16 h-16 ${neu.iconBox} bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-6`}>
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-700 mb-3">
              预见您的完美造型
            </h2>
            <p className="text-gray-500 mb-6 leading-relaxed">
              在剪发前预览您的新发型，
              与造型师轻松沟通，实现理想效果
            </p>
            
            <Link href="/capture">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-4 px-6 ${neu.raised} ${neu.buttonHover} flex items-center justify-center gap-2 text-gray-700 font-semibold`}
              >
                <Camera className="w-5 h-5 text-amber-500" />
                开始体验
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Features Grid - 新拟态卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-5 mb-8"
        >
          <FeatureCard icon="💇" title="精选发型" description="时尚流行款式" />
          <FeatureCard icon="🎨" title="染发效果" description="多种颜色可选" />
          <FeatureCard icon="🔄" title="多角度" description="正面/侧面/背面" />
          <FeatureCard icon="📸" title="专业呈现" description="高品质效果图" />
        </motion.div>

        {/* Quick Links Section - 新拟态风格 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-8"
        >
          <h3 className="text-lg font-semibold text-gray-600 mb-5 px-1">快速入口</h3>
          <div className="space-y-4">
            <QuickLinkCard
              href="/capture"
              icon={<Palette className="w-5 h-5 text-white" />}
              iconBg="bg-gradient-to-br from-amber-400 to-orange-500"
              title="造型体验"
              description="开始预览您的新发型"
              accentColor="text-amber-500"
            />
            <QuickLinkCard
              href="/presentation/external"
              icon={<Users className="w-5 h-5 text-white" />}
              iconBg="bg-gradient-to-br from-blue-400 to-indigo-500"
              title="销售演示"
              description="面向客户的产品介绍"
              accentColor="text-blue-500"
            />
            <QuickLinkCard
              href="/presentation/internal"
              icon={<Presentation className="w-5 h-5 text-white" />}
              iconBg="bg-gradient-to-br from-purple-400 to-pink-500"
              title="内部演示"
              description="技术架构与商业计划"
              accentColor="text-purple-500"
            />
          </div>
        </motion.div>

        {/* History Section - 新拟态风格 */}
        {history.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link href="/history">
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={`${neu.raised} p-5 flex items-center justify-between cursor-pointer transition-all duration-300 hover:shadow-[10px_10px_20px_#c5cad1,-10px_-10px_20px_#ffffff]`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${neu.pressed} flex items-center justify-center`}>
                    <History className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700">我的造型</p>
                    <p className="text-sm text-gray-500">{history.length} 个造型记录</p>
                  </div>
                </div>
                <div className={`w-10 h-10 ${neu.iconBox} flex items-center justify-center`}>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </motion.div>
            </Link>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="px-6 py-10 text-center">
        <div className={`inline-block px-6 py-3 ${neu.pressed} rounded-full`}>
          <p className="text-sm text-gray-500">
            Exclusively for Premium Salons
          </p>
        </div>
      </footer>
    </div>
  );
}

// 新拟态特性卡片组件
function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`p-5 ${neu.raised} cursor-pointer transition-all duration-300 hover:shadow-[10px_10px_20px_#c5cad1,-10px_-10px_20px_#ffffff]`}
    >
      <div className={`w-12 h-12 ${neu.pressed} flex items-center justify-center mb-3`}>
        <span className="text-2xl">{icon}</span>
      </div>
      <h3 className="font-semibold text-gray-700">{title}</h3>
      <p className="text-sm text-gray-500 mt-1">{description}</p>
    </motion.div>
  );
}

// 新拟态快速链接卡片组件
function QuickLinkCard({
  href,
  icon,
  iconBg,
  title,
  description,
  accentColor,
}: {
  href: string;
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
  accentColor: string;
}) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ scale: 1.01, x: 4 }}
        whileTap={{ scale: 0.99 }}
        className={`${neu.raised} p-5 flex items-center justify-between cursor-pointer transition-all duration-300 hover:shadow-[10px_10px_20px_#c5cad1,-10px_-10px_20px_#ffffff]`}
      >
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center shadow-lg`}>
            {icon}
          </div>
          <div>
            <p className="font-semibold text-gray-700">{title}</p>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        </div>
        <div className={`w-10 h-10 ${neu.iconBox} flex items-center justify-center`}>
          <ChevronRight className={`w-5 h-5 ${accentColor}`} />
        </div>
      </motion.div>
    </Link>
  );
}
