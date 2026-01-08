'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Camera, Upload, Check, X, RotateCcw } from 'lucide-react';
import { CameraComponent } from './Camera';
import { Button } from './ui/Button';
import { fileToBase64 } from '@/lib/utils';
import type { MultiAnglePhotos } from '@/types';

interface MultiAngleCaptureProps {
  onComplete: (photos: MultiAnglePhotos) => void;
  onCancel?: () => void;
  className?: string;
}

type CaptureStep = 'front' | 'left45' | 'right45' | 'back' | 'review';

const STEP_INFO: Record<CaptureStep, { label: string; desc: string; required: boolean }> = {
  front: { label: '正面照片', desc: '请正对镜头，确保面部清晰', required: true },
  left45: { label: '左侧45度', desc: '将头部转向左侧约45度', required: false },
  right45: { label: '右侧45度', desc: '将头部转向右侧约45度', required: false },
  back: { label: '背面照片', desc: '请背对镜头，展示后脑勺', required: false },
  review: { label: '确认照片', desc: '检查所有照片，确认无误后继续', required: false },
};

export function MultiAngleCapture({ onComplete, onCancel, className }: MultiAngleCaptureProps) {
  const [currentStep, setCurrentStep] = useState<CaptureStep>('front');
  const [photos, setPhotos] = useState<Partial<MultiAnglePhotos>>({});
  const [showCamera, setShowCamera] = useState(false);

  const handleCapture = useCallback((imageData: string) => {
    if (currentStep === 'front') {
      setPhotos({ ...photos, front: imageData });
      setCurrentStep('left45');
    } else if (currentStep === 'left45') {
      setPhotos({ ...photos, left45: imageData });
      setCurrentStep('right45');
    } else if (currentStep === 'right45') {
      setPhotos({ ...photos, right45: imageData });
      setCurrentStep('back');
    } else if (currentStep === 'back') {
      setPhotos({ ...photos, back: imageData });
      setCurrentStep('review');
    }
    setShowCamera(false);
  }, [currentStep, photos]);

  const handleSkip = useCallback(() => {
    if (currentStep === 'left45') {
      setCurrentStep('right45');
    } else if (currentStep === 'right45') {
      setCurrentStep('back');
    } else if (currentStep === 'back') {
      setCurrentStep('review');
    }
  }, [currentStep]);

  const handleRetake = useCallback((step: CaptureStep) => {
    if (step === 'front') {
      setPhotos({ ...photos, front: undefined });
      setCurrentStep('front');
    } else if (step === 'left45') {
      setPhotos({ ...photos, left45: undefined });
      setCurrentStep('left45');
    } else if (step === 'right45') {
      setPhotos({ ...photos, right45: undefined });
      setCurrentStep('right45');
    } else if (step === 'back') {
      setPhotos({ ...photos, back: undefined });
      setCurrentStep('back');
    }
    setShowCamera(true);
  }, [photos]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, step: CaptureStep) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        if (step === 'front') {
          setPhotos({ ...photos, front: base64 });
          setCurrentStep('left45');
        } else if (step === 'left45') {
          setPhotos({ ...photos, left45: base64 });
          setCurrentStep('right45');
        } else if (step === 'right45') {
          setPhotos({ ...photos, right45: base64 });
          setCurrentStep('back');
        } else if (step === 'back') {
          setPhotos({ ...photos, back: base64 });
          setCurrentStep('review');
        }
      } catch (err) {
        console.error('Failed to read file:', err);
      }
    }
  };

  const handleConfirm = () => {
    if (photos.front) {
      onComplete({
        front: photos.front,
        left45: photos.left45,
        right45: photos.right45,
        back: photos.back,
      });
    }
  };

  const canProceed = currentStep === 'front' ? !!photos.front : true;
  const canSkip = currentStep !== 'front' && !STEP_INFO[currentStep].required;

  if (showCamera && currentStep !== 'review') {
    return (
      <div className={className}>
        <div className="mb-4 text-center">
          <h3 className="text-xl font-bold mb-2">{STEP_INFO[currentStep].label}</h3>
          <p className="text-gray-500 text-sm">{STEP_INFO[currentStep].desc}</p>
        </div>
        <CameraComponent
          onCapture={handleCapture}
          onClose={() => setShowCamera(false)}
        />
        <div className="mt-4 flex gap-4 justify-center">
          {canSkip && (
            <Button
              variant="outline"
              onClick={handleSkip}
              className="flex-1"
            >
              跳过此角度
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'image/*';
              input.onchange = (e) => handleFileUpload(e as any, currentStep);
              input.click();
            }}
            className="flex-1"
          >
            <Upload className="w-4 h-4 mr-2" />
            从相册选择
          </Button>
        </div>
      </div>
    );
  }

  if (currentStep === 'review') {
    return (
      <div className={className}>
        <div className="mb-6 text-center">
          <h3 className="text-xl font-bold mb-2">确认照片</h3>
          <p className="text-gray-500 text-sm">检查所有照片，确认无误后继续</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {photos.front && (
            <div className="relative">
              <img src={photos.front} alt="正面" className="w-full aspect-[3/4] object-cover rounded-lg" />
              <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">必需</div>
              <button
                onClick={() => handleRetake('front')}
                className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          )}
          {photos.left45 && (
            <div className="relative">
              <img src={photos.left45} alt="左侧45度" className="w-full aspect-[3/4] object-cover rounded-lg" />
              <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">可选</div>
              <button
                onClick={() => handleRetake('left45')}
                className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          )}
          {photos.right45 && (
            <div className="relative">
              <img src={photos.right45} alt="右侧45度" className="w-full aspect-[3/4] object-cover rounded-lg" />
              <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">可选</div>
              <button
                onClick={() => handleRetake('right45')}
                className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          )}
          {photos.back && (
            <div className="relative">
              <img src={photos.back} alt="背面" className="w-full aspect-[3/4] object-cover rounded-lg" />
              <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">可选</div>
              <button
                onClick={() => handleRetake('back')}
                className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <div className="flex gap-4">
          {onCancel && (
            <Button variant="outline" onClick={onCancel} className="flex-1">
              取消
            </Button>
          )}
          <Button onClick={handleConfirm} className="flex-1" disabled={!photos.front}>
            确认并继续
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="mb-6 text-center">
        <h3 className="text-xl font-bold mb-2">{STEP_INFO[currentStep].label}</h3>
        <p className="text-gray-500 text-sm">{STEP_INFO[currentStep].desc}</p>
      </div>

      <div className="flex flex-col gap-4">
        <Button
          onClick={() => setShowCamera(true)}
          className="w-full"
          size="lg"
        >
          <Camera className="w-5 h-5 mr-2" />
          拍摄照片
        </Button>

        <Button
          variant="outline"
          onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = (e) => handleFileUpload(e as any, currentStep);
            input.click();
          }}
          className="w-full"
        >
          <Upload className="w-5 h-5 mr-2" />
          从相册选择
        </Button>

        {canSkip && (
          <Button
            variant="ghost"
            onClick={handleSkip}
            className="w-full"
          >
            跳过此角度
          </Button>
        )}
      </div>

      {onCancel && (
        <Button
          variant="ghost"
          onClick={onCancel}
          className="w-full mt-4"
        >
          取消
        </Button>
      )}
    </div>
  );
}

