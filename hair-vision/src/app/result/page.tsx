'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  RefreshCw,
  Download,
  Share2,
  Home,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { GeneratingAnimation } from '@/components/ui/Loading';
import { ImageComparison, ToggleComparison } from '@/components/ImageComparison';
import { ViewAngleSelector } from '@/components/ViewAngleSelector';
import { BackgroundSelector } from '@/components/BackgroundSelector';
import { useStore } from '@/hooks/useStore';
import { downloadImage, shareImage, generateId } from '@/lib/utils';
import type { ViewAngle, GenerationResult } from '@/types';

export default function ResultPage() {
  const router = useRouter();
  const {
    currentPhoto,
    selectedStyle,
    selectedColor,
    selectedBackground,
    selectedViewAngle,
    generatedResults,
    isGenerating,
    setBackground,
    setViewAngle,
    setGeneratedResult,
    setIsGenerating,
    addToHistory,
    resetSession,
  } = useStore();

  const [error, setError] = useState<string | null>(null);
  const [comparisonMode, setComparisonMode] = useState<'slider' | 'toggle'>('toggle');

  // Redirect if missing required data
  useEffect(() => {
    if (!currentPhoto) {
      router.push('/capture');
    } else if (!selectedStyle) {
      router.push('/styles');
    }
  }, [currentPhoto, selectedStyle, router]);

  // Generate image when needed
  const generateImage = useCallback(async (angle: ViewAngle) => {
    if (!currentPhoto || !selectedStyle || isGenerating) return;
    
    // Check if already generated
    if (generatedResults[angle]) return;

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          photo: currentPhoto,
          styleId: selectedStyle.id,
          colorId: selectedColor?.id,
          viewAngle: angle,
          backgroundId: selectedBackground.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '生成失败');
      }

      setGeneratedResult(angle, data.resultUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成失败，请重试');
    } finally {
      setIsGenerating(false);
    }
  }, [
    currentPhoto,
    selectedStyle,
    selectedColor,
    selectedBackground,
    isGenerating,
    generatedResults,
    setIsGenerating,
    setGeneratedResult,
  ]);

  // Auto-generate front view on mount
  useEffect(() => {
    if (currentPhoto && selectedStyle && !generatedResults.front && !isGenerating) {
      generateImage('front');
    }
  }, [currentPhoto, selectedStyle]); // eslint-disable-line

  // Handle view angle change
  const handleAngleChange = (angle: ViewAngle) => {
    setViewAngle(angle);
    if (!generatedResults[angle]) {
      generateImage(angle);
    }
  };

  // Handle regenerate
  const handleRegenerate = () => {
    // Clear current result and regenerate
    setGeneratedResult(selectedViewAngle, '');
    setTimeout(() => generateImage(selectedViewAngle), 100);
  };

  // Handle save
  const handleSave = () => {
    const result = generatedResults[selectedViewAngle];
    if (result && currentPhoto && selectedStyle) {
      // Add to history
      const historyItem: GenerationResult = {
        id: generateId(),
        originalPhoto: currentPhoto,
        resultPhoto: result,
        style: selectedStyle,
        color: selectedColor || undefined,
        viewAngle: selectedViewAngle,
        background: selectedBackground,
        createdAt: new Date(),
      };
      addToHistory(historyItem);

      // Download
      downloadImage(result, `merror-${selectedStyle.nameEn}-${selectedViewAngle}.jpg`);
    }
  };

  // Handle share
  const handleShare = async () => {
    const result = generatedResults[selectedViewAngle];
    if (result) {
      await shareImage(result, `我的新发型 - ${selectedStyle?.name}`);
    }
  };

  // Handle done
  const handleDone = () => {
    resetSession();
    router.push('/');
  };

  if (!currentPhoto || !selectedStyle) {
    return null;
  }

  const currentResult = generatedResults[selectedViewAngle];
  const generatedAngles = (Object.entries(generatedResults) as [ViewAngle, string | null][])
    .filter(([, url]) => url)
    .map(([angle]) => angle);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4 bg-white border-b">
        <Link href="/color">
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="w-6 h-6" />
          </motion.button>
        </Link>
        <div className="text-center">
          <h1 className="text-lg font-medium">效果预览</h1>
          <p className="text-sm text-gray-500">
            {selectedStyle.name}
            {selectedColor && ` · ${selectedColor.name}`}
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleDone}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <Home className="w-6 h-6" />
        </motion.button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Image Display */}
        <div className="flex-1 p-4">
          <AnimatePresence mode="wait">
            {isGenerating ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex items-center justify-center bg-white rounded-2xl"
              >
                <GeneratingAnimation />
              </motion.div>
            ) : error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center bg-white rounded-2xl p-6"
              >
                <p className="text-red-500 mb-4">{error}</p>
                <Button onClick={handleRegenerate}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  重试
                </Button>
              </motion.div>
            ) : currentResult ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="h-full"
              >
                {comparisonMode === 'slider' ? (
                  <ImageComparison
                    beforeImage={currentPhoto}
                    afterImage={currentResult}
                    className="h-full aspect-[3/4] max-h-[60vh] mx-auto"
                  />
                ) : (
                  <ToggleComparison
                    beforeImage={currentPhoto}
                    afterImage={currentResult}
                    className="h-full aspect-[3/4] max-h-[60vh] mx-auto"
                  />
                )}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex items-center justify-center bg-white rounded-2xl"
              >
                <p className="text-gray-500">点击生成效果图</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="bg-white border-t">
          {/* View Angle Selector */}
          <div className="px-4 py-4 border-b">
            <ViewAngleSelector
              selectedAngle={selectedViewAngle}
              onSelect={handleAngleChange}
              generatedAngles={generatedAngles}
            />
          </div>

          {/* Background Selector */}
          <div className="px-4 py-4 border-b">
            <p className="text-sm text-gray-500 mb-3">背景</p>
            <BackgroundSelector
              selectedBackground={selectedBackground}
              onSelect={setBackground}
            />
          </div>

          {/* Comparison Mode Toggle */}
          <div className="px-4 py-3 border-b flex justify-center">
            <div className="inline-flex gap-1 p-1 bg-gray-100 rounded-lg">
              <button
                onClick={() => setComparisonMode('toggle')}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  comparisonMode === 'toggle'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600'
                }`}
              >
                按住对比
              </button>
              <button
                onClick={() => setComparisonMode('slider')}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  comparisonMode === 'slider'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600'
                }`}
              >
                滑动对比
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-4 flex gap-3">
            <Button
              variant="outline"
              size="lg"
              onClick={handleRegenerate}
              disabled={isGenerating}
              className="flex-1"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              重新生成
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleShare}
              disabled={!currentResult}
            >
              <Share2 className="w-5 h-5" />
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={handleSave}
              disabled={!currentResult}
              className="flex-1"
            >
              <Download className="w-5 h-5 mr-2" />
              保存
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
