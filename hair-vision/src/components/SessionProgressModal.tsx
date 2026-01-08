'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Download,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  ChevronLeft,
  Image as ImageIcon,
  Layers,
} from 'lucide-react';
import { useSessionProgress, type SessionAttempt } from '@/hooks/useSessionProgress';
import { cn } from '@/lib/utils';
import { downloadImage } from '@/lib/utils';

// 格式化时间
function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(date);
}

// 格式化持续时间
function formatDuration(start: Date, end: Date = new Date()): string {
  const diffMs = end.getTime() - start.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffSecs = Math.floor((diffMs % 60000) / 1000);
  
  if (diffMins > 0) {
    return `${diffMins}分${diffSecs}秒`;
  }
  return `${diffSecs}秒`;
}

// 下载单张图片
function handleDownloadSingle(attempt: SessionAttempt) {
  const filename = `merror-${attempt.style.nameEn}-${attempt.viewAngle}-${Date.now()}.jpg`;
  downloadImage(attempt.resultPhoto, filename);
}

// 批量下载所有图片
async function handleDownloadAll(attempts: SessionAttempt[]) {
  const successAttempts = attempts.filter(a => a.status === 'success');
  
  for (let i = 0; i < successAttempts.length; i++) {
    const attempt = successAttempts[i];
    const filename = `merror-${attempt.style.nameEn}-${attempt.viewAngle}-${i + 1}.jpg`;
    downloadImage(attempt.resultPhoto, filename);
    
    // 添加延迟，防止浏览器阻止多次下载
    if (i < successAttempts.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  }
}

// 尝试卡片组件
function AttemptCard({ 
  attempt, 
  onSelect, 
  onDownload,
  onDelete,
}: { 
  attempt: SessionAttempt;
  onSelect: () => void;
  onDownload: () => void;
  onDelete: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        'relative bg-white rounded-xl overflow-hidden border',
        attempt.status === 'success' 
          ? 'border-gray-200 hover:border-gray-300' 
          : 'border-red-200 bg-red-50'
      )}
    >
      {/* 图片预览区域 */}
      <button
        onClick={onSelect}
        className="w-full aspect-[3/4] relative overflow-hidden"
      >
        {attempt.status === 'success' ? (
          <img
            src={attempt.resultPhoto}
            alt={attempt.style.name}
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <XCircle className="w-12 h-12 text-red-400" />
          </div>
        )}
        
        {/* 状态标识 */}
        <div className={cn(
          'absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium',
          attempt.status === 'success' 
            ? 'bg-green-100 text-green-700'
            : 'bg-red-100 text-red-700'
        )}>
          {attempt.status === 'success' ? '成功' : '失败'}
        </div>
        
        {/* 视角标识 */}
        <div className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium bg-black/60 text-white">
          {attempt.viewAngle === 'front' ? '正面' : attempt.viewAngle === 'side' ? '侧面' : '背面'}
        </div>
      </button>
      
      {/* 信息区域 */}
      <div className="p-3">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm text-gray-900 truncate">
              {attempt.style.name}
            </h4>
            {attempt.color && (
              <div className="flex items-center gap-1.5 mt-1">
                <div 
                  className="w-3 h-3 rounded-full border border-gray-200"
                  style={{ backgroundColor: attempt.color.hexCode }}
                />
                <span className="text-xs text-gray-500">{attempt.color.name}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{formatTime(attempt.timestamp)}</span>
          </div>
          
          <div className="flex items-center gap-1">
            {attempt.status === 'success' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDownload();
                }}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
                title="下载图片"
              >
                <Download className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-1.5 rounded-lg hover:bg-red-100 text-gray-400 hover:text-red-500 transition-colors"
              title="删除记录"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// 详情视图组件
function AttemptDetail({ 
  attempt, 
  onBack,
  onDownload,
}: { 
  attempt: SessionAttempt;
  onBack: () => void;
  onDownload: () => void;
}) {
  const [showOriginal, setShowOriginal] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col h-full"
    >
      {/* 详情头部 */}
      <div className="flex items-center justify-between p-4 border-b">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>返回列表</span>
        </button>
        
        {attempt.status === 'success' && (
          <button
            onClick={onDownload}
            className="flex items-center gap-2 px-3 py-1.5 bg-black text-white rounded-lg hover:bg-gray-800 text-sm"
          >
            <Download className="w-4 h-4" />
            下载
          </button>
        )}
      </div>
      
      {/* 图片展示 */}
      <div className="flex-1 p-4 overflow-auto">
        <div className="relative aspect-[3/4] max-h-[50vh] mx-auto mb-4 rounded-xl overflow-hidden">
          {attempt.status === 'success' ? (
            <>
              <AnimatePresence mode="wait">
                <motion.img
                  key={showOriginal ? 'original' : 'result'}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  src={showOriginal ? attempt.originalPhoto : attempt.resultPhoto}
                  alt={showOriginal ? '原图' : '效果图'}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
              
              {/* 切换按钮 */}
              <button
                onMouseDown={() => setShowOriginal(true)}
                onMouseUp={() => setShowOriginal(false)}
                onMouseLeave={() => setShowOriginal(false)}
                onTouchStart={() => setShowOriginal(true)}
                onTouchEnd={() => setShowOriginal(false)}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/70 text-white rounded-full text-sm backdrop-blur-sm"
              >
                {showOriginal ? '查看原图' : '按住查看原图'}
              </button>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-red-50">
              <XCircle className="w-16 h-16 text-red-400 mb-4" />
              <p className="text-red-600 font-medium">生成失败</p>
              {attempt.errorMessage && (
                <p className="text-red-500 text-sm mt-2 text-center px-4">
                  {attempt.errorMessage}
                </p>
              )}
            </div>
          )}
        </div>
        
        {/* 详细信息 */}
        <div className="bg-gray-50 rounded-xl p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">发型</span>
            <span className="font-medium">{attempt.style.name}</span>
          </div>
          
          {attempt.color && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">颜色</span>
              <div className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded-full border border-gray-200"
                  style={{ backgroundColor: attempt.color.hexCode }}
                />
                <span className="font-medium">{attempt.color.name}</span>
              </div>
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">视角</span>
            <span className="font-medium">
              {attempt.viewAngle === 'front' ? '正面' : attempt.viewAngle === 'side' ? '侧面' : '背面'}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">背景</span>
            <span className="font-medium">{attempt.background.name}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">生成时间</span>
            <span className="font-medium">{formatTime(attempt.timestamp)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">状态</span>
            <span className={cn(
              'px-2 py-0.5 rounded-full text-xs font-medium',
              attempt.status === 'success' 
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            )}>
              {attempt.status === 'success' ? '成功' : '失败'}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// 确认删除模态框
function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[60]"
            onClick={onClose}
          />
          {/* 模态框 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[61] bg-white rounded-2xl p-6 w-[90vw] max-w-sm shadow-2xl"
          >
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
              >
                删除
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// 主模态框组件
export function SessionProgressModal() {
  const {
    attempts,
    sessionStartTime,
    isProgressModalOpen,
    selectedAttemptId,
    closeProgressModal,
    selectAttempt,
    removeAttempt,
    clearSession,
  } = useSessionProgress();
  
  const [confirmDelete, setConfirmDelete] = useState<{
    type: 'single' | 'all';
    id?: string;
  } | null>(null);
  
  const selectedAttempt = attempts.find(a => a.id === selectedAttemptId);
  const successCount = attempts.filter(a => a.status === 'success').length;
  const errorCount = attempts.filter(a => a.status === 'error').length;
  
  const handleDeleteSingle = useCallback((id: string) => {
    setConfirmDelete({ type: 'single', id });
  }, []);
  
  const handleDeleteAll = useCallback(() => {
    setConfirmDelete({ type: 'all' });
  }, []);
  
  const confirmDeleteAction = useCallback(() => {
    if (confirmDelete?.type === 'single' && confirmDelete.id) {
      removeAttempt(confirmDelete.id);
    } else if (confirmDelete?.type === 'all') {
      clearSession();
    }
  }, [confirmDelete, removeAttempt, clearSession]);
  
  return (
    <>
      <AnimatePresence>
        {isProgressModalOpen && (
          <>
            {/* 背景遮罩 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={closeProgressModal}
            />
            
            {/* 模态框主体 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-2xl w-[95vw] max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              <AnimatePresence mode="wait">
                {selectedAttempt ? (
                  // 详情视图
                  <AttemptDetail
                    key="detail"
                    attempt={selectedAttempt}
                    onBack={() => selectAttempt(null)}
                    onDownload={() => handleDownloadSingle(selectedAttempt)}
                  />
                ) : (
                  // 列表视图
                  <motion.div
                    key="list"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col h-full"
                  >
                    {/* 头部 */}
                    <div className="flex items-center justify-between p-4 border-b">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                          <Layers className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold">本次会话记录</h2>
                          {sessionStartTime && (
                            <p className="text-sm text-gray-500">
                              已进行 {formatDuration(sessionStartTime)}
                            </p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={closeProgressModal}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    
                    {/* 统计信息 */}
                    <div className="px-4 py-3 border-b bg-gray-50 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                          <ImageIcon className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            共 <span className="font-medium text-gray-900">{attempts.length}</span> 次尝试
                          </span>
                        </div>
                        {successCount > 0 && (
                          <div className="flex items-center gap-1.5">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-green-600">{successCount} 成功</span>
                          </div>
                        )}
                        {errorCount > 0 && (
                          <div className="flex items-center gap-1.5">
                            <XCircle className="w-4 h-4 text-red-500" />
                            <span className="text-sm text-red-600">{errorCount} 失败</span>
                          </div>
                        )}
                      </div>
                      
                      {/* 批量操作 */}
                      {attempts.length > 0 && (
                        <div className="flex items-center gap-2">
                          {successCount > 1 && (
                            <button
                              onClick={() => handleDownloadAll(attempts)}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-black text-white rounded-lg hover:bg-gray-800"
                            >
                              <Download className="w-3.5 h-3.5" />
                              全部下载
                            </button>
                          )}
                          <button
                            onClick={handleDeleteAll}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-red-200 text-red-600 rounded-lg hover:bg-red-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            清空
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {/* 内容区域 */}
                    <div className="flex-1 overflow-auto p-4">
                      {attempts.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 py-12">
                          <ImageIcon className="w-16 h-16 mb-4 opacity-50" />
                          <p className="text-lg font-medium">暂无生成记录</p>
                          <p className="text-sm mt-1">开始生成发型预览后，记录将显示在这里</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          <AnimatePresence>
                            {attempts.map((attempt) => (
                              <AttemptCard
                                key={attempt.id}
                                attempt={attempt}
                                onSelect={() => selectAttempt(attempt.id)}
                                onDownload={() => handleDownloadSingle(attempt)}
                                onDelete={() => handleDeleteSingle(attempt.id)}
                              />
                            ))}
                          </AnimatePresence>
                        </div>
                      )}
                    </div>
                    
                    {/* 底部提示 */}
                    <div className="px-4 py-3 border-t bg-amber-50 text-center">
                      <p className="text-sm text-amber-700">
                        💡 记录仅在本次会话内保留，关闭页面后将自动清除
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* 确认删除模态框 */}
      <ConfirmDeleteModal
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={confirmDeleteAction}
        title={confirmDelete?.type === 'all' ? '清空所有记录' : '删除记录'}
        message={
          confirmDelete?.type === 'all'
            ? '确定要清空本次会话的所有记录吗？此操作无法撤销。'
            : '确定要删除这条记录吗？'
        }
      />
    </>
  );
}

// 触发按钮组件（可在页面中使用）
export function SessionProgressButton() {
  const { attempts, openProgressModal } = useSessionProgress();
  const successCount = attempts.filter(a => a.status === 'success').length;
  
  if (attempts.length === 0) return null;
  
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileTap={{ scale: 0.95 }}
      onClick={openProgressModal}
      className="relative flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md transition-shadow"
    >
      <Layers className="w-4 h-4 text-gray-600" />
      <span className="text-sm font-medium text-gray-700">
        {attempts.length} 次尝试
      </span>
      {successCount > 0 && (
        <span className="flex items-center justify-center w-5 h-5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
          {successCount}
        </span>
      )}
    </motion.button>
  );
}
