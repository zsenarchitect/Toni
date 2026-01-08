'use client';

import { useRef, useCallback, useState } from 'react';
import Webcam from 'react-webcam';
import { motion } from 'framer-motion';
import { Camera as CameraIcon, SwitchCamera, Upload, X } from 'lucide-react';
import { Button } from './ui/Button';
import { cn } from '@/lib/utils';
import { fileToBase64 } from '@/lib/utils';

interface CameraProps {
  onCapture: (imageData: string) => void;
  onClose?: () => void;
  className?: string;
}

export function CameraComponent({ onCapture, onClose, className }: CameraProps) {
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode,
  };

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        onCapture(imageSrc);
      }
    }
  }, [onCapture]);

  const switchCamera = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        onCapture(base64);
      } catch {
        setError('无法读取图片文件');
      }
    }
  };

  const handleUserMediaError = () => {
    setError('无法访问摄像头，请确保已授权摄像头权限');
  };

  return (
    <div className={cn('relative flex flex-col', className)}>
      {/* Camera View */}
      <div className="relative aspect-[3/4] bg-black rounded-2xl overflow-hidden">
        {error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
            <CameraIcon className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-lg mb-4">{error}</p>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="bg-white/10 border-white/20 text-white"
            >
              <Upload className="w-5 h-5 mr-2" />
              从相册选择
            </Button>
          </div>
        ) : (
          <>
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              onUserMedia={() => setIsCameraReady(true)}
              onUserMediaError={handleUserMediaError}
              className="absolute inset-0 w-full h-full object-cover"
              mirrored={facingMode === 'user'}
            />
            
            {/* Face Guide Overlay */}
            {isCameraReady && (
              <div className="absolute inset-0 pointer-events-none">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <ellipse
                    cx="50"
                    cy="40"
                    rx="25"
                    ry="32"
                    fill="none"
                    stroke="white"
                    strokeWidth="0.3"
                    strokeDasharray="2 2"
                    opacity="0.6"
                  />
                </svg>
                <p className="absolute bottom-20 left-0 right-0 text-center text-white text-sm opacity-80">
                  将面部置于框内
                </p>
              </div>
            )}
          </>
        )}

        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/30 text-white backdrop-blur-sm"
          >
            <X className="w-6 h-6" />
          </button>
        )}

        {/* Camera Switch Button */}
        {isCameraReady && (
          <button
            onClick={switchCamera}
            className="absolute top-4 left-4 p-2 rounded-full bg-black/30 text-white backdrop-blur-sm"
          >
            <SwitchCamera className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6 py-6">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-4 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
        >
          <Upload className="w-6 h-6" />
        </button>

        <motion.button
          onClick={capture}
          disabled={!isCameraReady}
          whileTap={{ scale: 0.9 }}
          className="w-20 h-20 rounded-full bg-white border-4 border-black disabled:opacity-50 flex items-center justify-center"
        >
          <div className="w-14 h-14 rounded-full bg-black" />
        </motion.button>

        <div className="w-14 h-14" /> {/* Spacer for balance */}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
}
