'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Camera, History, Sparkles, ChevronRight, Scissors, Presentation, Users, Palette } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useStore } from '@/hooks/useStore';

export default function HomePage() {
  const { history } = useStore();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <header className="px-6 pt-12 pb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center">
            <Scissors className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">MeRROR</h1>
            <p className="text-sm text-gray-500">Salon Style Preview</p>
          </div>
        </motion.div>
      </header>

      {/* Main Content */}
      <main className="px-6 pb-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="relative bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 mb-8 overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-400/10 rounded-full blur-2xl" />
          
          <div className="relative z-10">
            <Sparkles className="w-10 h-10 text-amber-400 mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              预见您的完美造型
            </h2>
            <p className="text-gray-400 mb-6 leading-relaxed">
              在剪发前预览您的新发型，
              与造型师轻松沟通，实现理想效果
            </p>
            
            <Link href="/capture">
              <Button size="lg" variant="secondary" className="w-full">
                <Camera className="w-5 h-5 mr-2" />
                开始体验
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-4 mb-8"
        >
          <FeatureCard
            icon="💇"
            title="精选发型"
            description="时尚流行款式"
          />
          <FeatureCard
            icon="🎨"
            title="染发效果"
            description="多种颜色可选"
          />
          <FeatureCard
            icon="🔄"
            title="多角度"
            description="正面/侧面/背面"
          />
          <FeatureCard
            icon="📸"
            title="专业呈现"
            description="高品质效果图"
          />
        </motion.div>

        {/* Quick Links Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-8"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">快速入口</h3>
          <div className="space-y-3">
            <Link href="/capture">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-100 hover:border-amber-200 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
                    <Palette className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">造型体验</p>
                    <p className="text-sm text-gray-500">开始预览您的新发型</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-amber-500" />
              </div>
            </Link>

            <Link href="/presentation/external">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 hover:border-blue-200 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">销售演示</p>
                    <p className="text-sm text-gray-500">面向客户的产品介绍</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-blue-500" />
              </div>
            </Link>

            <Link href="/presentation/internal">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-100 hover:border-purple-200 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
                    <Presentation className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">内部演示</p>
                    <p className="text-sm text-gray-500">技术架构与商业计划</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-purple-500" />
              </div>
            </Link>
          </div>
        </motion.div>

        {/* History Section */}
        {history.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link href="/history">
              <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                    <History className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">我的造型</p>
                    <p className="text-sm text-gray-500">{history.length} 个造型记录</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </Link>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="px-6 py-8 text-center">
        <p className="text-sm text-gray-400">
          Exclusively for Premium Salons
        </p>
      </footer>
    </div>
  );
}

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
    <div className="p-4 bg-white rounded-2xl border border-gray-100">
      <span className="text-2xl">{icon}</span>
      <h3 className="font-medium text-gray-900 mt-2">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );
}
