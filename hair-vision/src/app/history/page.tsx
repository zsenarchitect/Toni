'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Trash2, Download, X } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useStore } from '@/hooks/useStore';
import { formatDate, downloadImage } from '@/lib/utils';
import type { GenerationResult } from '@/types';

export default function HistoryPage() {
  const { history, removeFromHistory, clearHistory } = useStore();
  const [selectedItem, setSelectedItem] = useState<GenerationResult | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleDownload = (item: GenerationResult) => {
    downloadImage(
      item.resultPhoto,
      `hairvision-${item.style.nameEn}-${item.viewAngle}.jpg`
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4 bg-white border-b sticky top-0 z-10">
        <Link href="/">
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="w-6 h-6" />
          </motion.button>
        </Link>
        <h1 className="text-lg font-medium">历史记录</h1>
        {history.length > 0 && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowClearConfirm(true)}
            className="p-2 rounded-full hover:bg-gray-100 text-red-500"
          >
            <Trash2 className="w-5 h-5" />
          </motion.button>
        )}
        {history.length === 0 && <div className="w-10" />}
      </header>

      {/* Content */}
      <main className="p-4">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl">📷</span>
            </div>
            <h2 className="text-lg font-medium text-gray-900 mb-2">
              暂无历史记录
            </h2>
            <p className="text-gray-500 mb-6">
              生成的造型效果图会显示在这里
            </p>
            <Link href="/capture">
              <Button>开始创建</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {history.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <HistoryCard
                  item={item}
                  onClick={() => setSelectedItem(item)}
                  onDelete={() => removeFromHistory(item.id)}
                />
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Detail Modal */}
      <Modal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        title={selectedItem?.style.name}
        className="max-w-md"
      >
        {selectedItem && (
          <div className="space-y-4">
            <div className="aspect-[3/4] rounded-xl overflow-hidden bg-gray-100">
              <img
                src={selectedItem.resultPhoto}
                alt={selectedItem.style.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">发型</span>
                <span className="text-gray-900">{selectedItem.style.name}</span>
              </div>
              {selectedItem.color && (
                <div className="flex justify-between text-sm items-center">
                  <span className="text-gray-500">发色</span>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: selectedItem.color.hexCode }}
                    />
                    <span className="text-gray-900">{selectedItem.color.name}</span>
                  </div>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">视角</span>
                <span className="text-gray-900">
                  {selectedItem.viewAngle === 'front' ? '正面' : 
                   selectedItem.viewAngle === 'side' ? '侧面' : '背面'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">创建时间</span>
                <span className="text-gray-900">
                  {formatDate(new Date(selectedItem.createdAt))}
                </span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  removeFromHistory(selectedItem.id);
                  setSelectedItem(null);
                }}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                删除
              </Button>
              <Button
                className="flex-1"
                onClick={() => handleDownload(selectedItem)}
              >
                <Download className="w-4 h-4 mr-2" />
                下载
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Clear Confirm Modal */}
      <Modal
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        title="确认清空"
        className="max-w-sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            确定要清空所有历史记录吗？此操作无法撤销。
          </p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowClearConfirm(false)}
            >
              取消
            </Button>
            <Button
              variant="primary"
              className="flex-1 bg-red-500 hover:bg-red-600"
              onClick={() => {
                clearHistory();
                setShowClearConfirm(false);
              }}
            >
              确认清空
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

interface HistoryCardProps {
  item: GenerationResult;
  onClick: () => void;
  onDelete: () => void;
}

function HistoryCard({ item, onClick, onDelete }: HistoryCardProps) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
      <div
        className="aspect-[3/4] relative cursor-pointer"
        onClick={onClick}
      >
        <img
          src={item.resultPhoto}
          alt={item.style.name}
          className="w-full h-full object-cover"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="p-3">
        <p className="font-medium text-gray-900 text-sm truncate">
          {item.style.name}
        </p>
        <p className="text-xs text-gray-500 mt-0.5">
          {formatDate(new Date(item.createdAt))}
        </p>
      </div>
    </div>
  );
}
