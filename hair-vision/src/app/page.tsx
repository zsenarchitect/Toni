'use client';

/**
 * MeRROR Homepage - Neomorphic Design
 * 
 * Design Principles:
 * - Neomorphic style with soft shadows
 * - White/off-white background
 * - Turquoise etching accents
 * - Clean typography (Inter)
 * - Minimal emoji usage
 */

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Camera, History, ChevronRight, Scissors, Presentation, Users } from 'lucide-react';
import { useStore } from '@/hooks/useStore';

export default function HomePage() {
  const { history } = useStore();

  return (
    <div className="min-h-screen neo-bg">
      {/* Header - Neomorphic 风格 */}
      <header className="px-6 pt-12 pb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          {/* Logo 容器 - 新拟物凸起效果 + 青绿色蚀刻 */}
          <div className="neo-icon-circle neo-etching w-14 h-14 flex items-center justify-center">
            <Scissors className="w-6 h-6 neo-text-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight neo-heading-etched">MeRROR</h1>
            <p className="text-sm text-gray-500 font-light mt-1">Salon Style Preview</p>
          </div>
        </motion.div>
      </header>

      {/* 青绿色蚀刻分隔线 */}
      <div className="px-6">
        <div className="neo-divider" />
      </div>

      {/* Main Content */}
      <main className="px-6 py-12 max-w-md mx-auto">
        {/* Hero Section - Neomorphic 卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div className="neo-card neo-corner-etching p-8 mb-8">
            <h2 className="text-3xl font-light text-gray-900 mb-4 leading-tight tracking-tight">
              Preview Your <span className="neo-text-accent">Perfect</span> Style
            </h2>
            <p className="text-gray-600 leading-relaxed font-light">
              See how different hairstyles look on you before your salon visit. 
              Communicate clearly with your stylist for the best results.
            </p>
          </div>
          
          <Link href="/capture">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="neo-btn-primary w-full py-4 px-6 font-medium flex items-center justify-center gap-2"
            >
              <Camera className="w-5 h-5" />
              Get Started
            </motion.button>
          </Link>
        </motion.div>

        {/* Features - Neomorphic 网格 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-4 mb-12"
        >
          <FeatureCard title="Curated Styles" description="Trending designs" />
          <FeatureCard title="Color Preview" description="Multiple options" />
          <FeatureCard title="Multi-Angle" description="Front, side, back" />
          <FeatureCard title="High Quality" description="Professional results" />
        </motion.div>

        {/* Quick Links - Neomorphic 风格 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="space-y-4 mb-12"
        >
          <Link href="/capture">
            <QuickLinkCard
              icon={<Camera className="w-5 h-5 neo-text-accent" />}
              title="Style Preview"
              description="Try different hairstyles"
            />
          </Link>
          <Link href="/presentation/external">
            <QuickLinkCard
              icon={<Users className="w-5 h-5 neo-text-accent" />}
              title="Client Demo"
              description="Product presentation"
            />
          </Link>
          <Link href="/presentation/internal">
            <QuickLinkCard
              icon={<Presentation className="w-5 h-5 neo-text-accent" />}
              title="Internal Demo"
              description="Technical overview"
            />
          </Link>
        </motion.div>

        {/* History Section - Neomorphic */}
        {history.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link href="/history">
              <div className="neo-card neo-etching-glow p-5 cursor-pointer flex items-center justify-between group hover:scale-[1.02] transition-transform">
                <div className="flex items-center gap-4">
                  <div className="neo-icon-circle-inset w-12 h-12 flex items-center justify-center">
                    <History className="w-5 h-5 neo-text-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">My Styles</p>
                    <p className="text-sm text-gray-500 font-light">{history.length} saved</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:neo-text-accent transition-colors" />
              </div>
            </Link>
          </motion.div>
        )}
      </main>

      {/* Footer - 蚀刻风格 */}
      <footer className="px-6 py-10 text-center">
        <div className="neo-divider mb-6" />
        <p className="text-sm text-gray-400 font-light neo-line-etching pb-4">
          Exclusively for Premium Salons
        </p>
      </footer>
    </div>
  );
}

// Neomorphic Feature Card - 凹陷效果 + 青绿色蚀刻
function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="neo-card-inset neo-etching p-5 hover:scale-[1.02] transition-transform">
      <h3 className="font-medium text-gray-900 mb-1 text-sm">{title}</h3>
      <p className="text-xs text-gray-500 font-light">{description}</p>
    </div>
  );
}

// Neomorphic Quick Link Card - 凸起效果 + 蚀刻边框
function QuickLinkCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="neo-card neo-etching-full p-5 cursor-pointer flex items-center justify-between group hover:scale-[1.02] transition-transform">
      <div className="flex items-center gap-4">
        <div className="neo-icon-circle-inset w-12 h-12 flex items-center justify-center">
          {icon}
        </div>
        <div>
          <p className="font-medium text-gray-900">{title}</p>
          <p className="text-sm text-gray-500 font-light">{description}</p>
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:neo-text-accent transition-colors" />
    </div>
  );
}
