'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { StyleGrid } from '@/components/StyleGrid';
import { useStore } from '@/hooks/useStore';

export default function StylesPage() {
  const router = useRouter();
  const { currentPhoto, selectedStyle, setStyle } = useStore();

  // Redirect if no photo
  useEffect(() => {
    if (!currentPhoto) {
      router.push('/capture');
    }
  }, [currentPhoto, router]);

  if (!currentPhoto) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4 bg-white border-b">
        <Link href="/capture">
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="w-6 h-6" />
          </motion.button>
        </Link>
        <div className="text-center">
          <h1 className="text-lg font-medium">选择发型</h1>
          <p className="text-sm text-gray-500">第 1 步，共 3 步</p>
        </div>
        <div className="w-10" />
      </header>

      {/* Photo Preview */}
      <div className="px-4 py-4 bg-white border-b">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
            <img
              src={currentPhoto}
              alt="Your photo"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-sm text-gray-500">您的照片</p>
            <p className="font-medium">
              {selectedStyle ? selectedStyle.name : '请选择发型'}
            </p>
          </div>
        </div>
      </div>

      {/* Style Grid */}
      <main className="flex-1 px-4 py-6 overflow-auto">
        <StyleGrid
          selectedStyle={selectedStyle}
          onSelect={setStyle}
        />
      </main>

      {/* Bottom Action */}
      <div className="p-4 bg-white border-t">
        <Button
          size="lg"
          className="w-full"
          disabled={!selectedStyle}
          onClick={() => router.push('/color')}
        >
          下一步：选择颜色
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}
