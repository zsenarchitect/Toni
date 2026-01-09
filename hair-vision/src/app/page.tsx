'use client';

/**
 * MeRROR Homepage - Elegant Minimalist Design
 * 
 * Design Principles:
 * - Minimalist and professional
 * - English-only content
 * - Turquoise accent color
 * - Clean typography (Inter/Montserrat)
 * - Minimal emoji usage
 */

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Camera, History, ChevronRight, Scissors, Presentation, Users } from 'lucide-react';
import { useStore } from '@/hooks/useStore';

export default function HomePage() {
  const { history } = useStore();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="px-6 pt-12 pb-8 border-b border-gray-100">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
            <Scissors className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">MeRROR</h1>
            <p className="text-sm text-gray-500 font-light">Salon Style Preview</p>
          </div>
        </motion.div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-12 max-w-md mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-light text-gray-900 mb-4 leading-tight tracking-tight">
            Preview Your Perfect Style
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed font-light">
            See how different hairstyles look on you before your salon visit. 
            Communicate clearly with your stylist for the best results.
          </p>
          
          <Link href="/capture">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 px-6 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Camera className="w-5 h-5" />
              Get Started
            </motion.button>
          </Link>
        </motion.div>

        {/* Features - Simplified */}
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

        {/* Quick Links - Minimalist */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="space-y-3 mb-12"
        >
          <Link href="/capture">
            <QuickLinkCard
              icon={<Camera className="w-5 h-5 text-teal-500" />}
              title="Style Preview"
              description="Try different hairstyles"
            />
          </Link>
          <Link href="/presentation/external">
            <QuickLinkCard
              icon={<Users className="w-5 h-5 text-teal-500" />}
              title="Client Demo"
              description="Product presentation"
            />
          </Link>
          <Link href="/presentation/internal">
            <QuickLinkCard
              icon={<Presentation className="w-5 h-5 text-teal-500" />}
              title="Internal Demo"
              description="Technical overview"
            />
          </Link>
        </motion.div>

        {/* History Section */}
        {history.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link href="/history">
              <div className="p-5 border border-gray-200 rounded-xl hover:border-teal-300 transition-colors cursor-pointer flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-teal-50 transition-colors">
                    <History className="w-5 h-5 text-gray-400 group-hover:text-teal-500 transition-colors" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">My Styles</p>
                    <p className="text-sm text-gray-500 font-light">{history.length} saved</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-teal-500 transition-colors" />
              </div>
            </Link>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="px-6 py-10 text-center border-t border-gray-100">
        <p className="text-sm text-gray-400 font-light">
          Exclusively for Premium Salons
        </p>
      </footer>
    </div>
  );
}

// Minimalist Feature Card
function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="p-4 border border-gray-200 rounded-xl hover:border-teal-300 transition-colors">
      <h3 className="font-medium text-gray-900 mb-1 text-sm">{title}</h3>
      <p className="text-xs text-gray-500 font-light">{description}</p>
    </div>
  );
}

// Minimalist Quick Link Card
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
    <div className="p-5 border border-gray-200 rounded-xl hover:border-teal-300 hover:bg-teal-50/50 transition-all cursor-pointer flex items-center justify-between group">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-teal-50 transition-colors">
          {icon}
        </div>
        <div>
          <p className="font-medium text-gray-900">{title}</p>
          <p className="text-sm text-gray-500 font-light">{description}</p>
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-teal-500 transition-colors" />
    </div>
  );
}
