'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { CameraComponent } from '@/components/Camera';
import { MultiAngleCapture } from '@/components/MultiAngleCapture';
import { useStore } from '@/hooks/useStore';

type CaptureMode = 'single' | 'multi';

export default function CapturePage() {
  const router = useRouter();
  const { setPhoto, setMultiAnglePhotos } = useStore();
  const [mode, setMode] = useState<CaptureMode>('single');

  const handleSingleCapture = (imageData: string) => {
    setPhoto(imageData);
    router.push('/styles');
  };

  const handleMultiAngleComplete = (photos: Parameters<typeof setMultiAnglePhotos>[0]) => {
    if (photos) {
      setMultiAnglePhotos(photos);
      router.push('/styles');
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4">
        <Link href="/">
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full bg-white/10 text-white"
          >
            <ArrowLeft className="w-6 h-6" />
          </motion.button>
        </Link>
        <h1 className="text-lg font-medium text-white">拍摄照片</h1>
        <div className="w-10" /> {/* Spacer */}
      </header>

      {/* Mode Selector */}
      <div className="px-4 mb-4">
        <div className="flex gap-2 max-w-lg mx-auto">
          <button
            onClick={() => setMode('single')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
              mode === 'single'
                ? 'bg-white text-black'
                : 'bg-white/10 text-white'
            }`}
          >
            单张照片
          </button>
          <button
            onClick={() => setMode('multi')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
              mode === 'multi'
                ? 'bg-white text-black'
                : 'bg-white/10 text-white'
            }`}
          >
            多角度 (V1.5)
          </button>
        </div>
      </div>

      {/* Camera */}
      <main className="px-4 pb-8">
        {mode === 'single' ? (
          <>
            <CameraComponent
              onCapture={handleSingleCapture}
              className="max-w-lg mx-auto"
            />
            
            {/* Tips */}
            <div className="mt-6 max-w-lg mx-auto">
              <p className="text-center text-gray-400 text-sm">
                提示：请确保光线充足，面部正对镜头
              </p>
            </div>
          </>
        ) : (
          <MultiAngleCapture
            onComplete={handleMultiAngleComplete}
            className="max-w-lg mx-auto"
          />
        )}
      </main>
    </div>
  );
}
