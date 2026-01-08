'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { CameraComponent } from '@/components/Camera';
import { useStore } from '@/hooks/useStore';

export default function CapturePage() {
  const router = useRouter();
  const { setPhoto } = useStore();

  const handleCapture = (imageData: string) => {
    setPhoto(imageData);
    router.push('/styles');
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

      {/* Camera */}
      <main className="px-4 pb-8">
        <CameraComponent
          onCapture={handleCapture}
          className="max-w-lg mx-auto"
        />
        
        {/* Tips */}
        <div className="mt-6 max-w-lg mx-auto">
          <p className="text-center text-gray-400 text-sm">
            提示：请确保光线充足，面部正对镜头
          </p>
        </div>
      </main>
    </div>
  );
}
