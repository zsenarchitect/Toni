'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ColorPicker } from '@/components/ColorPicker';
import { useStore } from '@/hooks/useStore';

export default function ColorPage() {
  const router = useRouter();
  const { currentPhoto, selectedStyle, selectedColor, setColor } = useStore();

  // Redirect if no photo or style
  useEffect(() => {
    if (!currentPhoto) {
      router.push('/capture');
    } else if (!selectedStyle) {
      router.push('/styles');
    }
  }, [currentPhoto, selectedStyle, router]);

  if (!currentPhoto || !selectedStyle) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4 bg-white border-b">
        <Link href="/styles">
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="w-6 h-6" />
          </motion.button>
        </Link>
        <div className="text-center">
          <h1 className="text-lg font-medium">选择发色</h1>
          <p className="text-sm text-gray-500">第 2 步，共 3 步</p>
        </div>
        <div className="w-10" />
      </header>

      {/* Photo & Style Preview */}
      <div className="px-4 py-4 bg-white border-b">
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
            <img
              src={currentPhoto}
              alt="Your photo"
              className="w-full h-full object-cover"
            />
            {selectedColor && (
              <div
                className="absolute bottom-1 right-1 w-6 h-6 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: selectedColor.hexCode }}
              />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-500">选中的发型</p>
            <p className="font-medium truncate">{selectedStyle.name}</p>
            <p className="text-sm text-gray-500 truncate">
              {selectedColor ? selectedColor.name : '原发色'}
            </p>
          </div>
        </div>
      </div>

      {/* Color Picker */}
      <main className="flex-1 px-4 py-6 overflow-auto">
        <ColorPicker
          selectedColor={selectedColor}
          onSelect={setColor}
        />
      </main>

      {/* Bottom Action */}
      <div className="p-4 bg-white border-t">
        <Button
          size="lg"
          variant="secondary"
          className="w-full"
          onClick={() => router.push('/result')}
        >
          <Sparkles className="w-5 h-5 mr-2" />
          预览效果
        </Button>
      </div>
    </div>
  );
}
