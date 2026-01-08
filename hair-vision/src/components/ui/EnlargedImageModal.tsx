'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface EnlargedImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  alt?: string;
}

/**
 * 放大图片查看模态框
 * 极简UI设计，适合iPad竖起来当镜子使用
 * 点击任意位置关闭
 */
export function EnlargedImageModal({ 
  isOpen, 
  onClose, 
  imageSrc, 
  alt = '放大查看' 
}: EnlargedImageModalProps) {
  // 处理ESC键关闭
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
      // 禁止背景滚动
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // 双击保存图片（可选功能）
  const handleDoubleClick = useCallback(() => {
    // 可以在这里添加保存功能
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          onClick={onClose}
        >
          {/* 关闭按钮 - 极简设计，半透明小按钮 */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="absolute top-4 right-4 p-3 rounded-full bg-white/10 text-white/60 hover:bg-white/20 hover:text-white transition-colors z-10"
            aria-label="关闭"
          >
            <X className="w-6 h-6" />
          </motion.button>

          {/* 图片容器 - 最大化显示 */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full h-full flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
            onDoubleClick={handleDoubleClick}
          >
            <img
              src={imageSrc}
              alt={alt}
              className="max-w-full max-h-full object-contain select-none"
              draggable={false}
              onClick={onClose}
            />
          </motion.div>

          {/* 底部提示 - 淡入后淡出 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.2 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.p
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 0 }}
              transition={{ delay: 2, duration: 1 }}
              className="text-white/40 text-sm"
            >
              点击任意位置关闭
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * 可点击放大的图片包装组件
 * 包装任意图片，点击后全屏显示
 */
interface EnlargableImageProps {
  src: string;
  alt?: string;
  className?: string;
  children?: React.ReactNode;
}

export function EnlargableImage({ 
  src, 
  alt = '', 
  className = '',
  children 
}: EnlargableImageProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div 
        className={`cursor-zoom-in ${className}`}
        onClick={() => setIsOpen(true)}
      >
        {children || (
          <img src={src} alt={alt} className="w-full h-full object-cover" />
        )}
      </div>
      <EnlargedImageModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        imageSrc={src}
        alt={alt}
      />
    </>
  );
}
