'use client';

import { create } from 'zustand';
import type { Hairstyle, HairColor, ViewAngle, Background } from '@/types';

// 单次生成尝试的记录
export interface SessionAttempt {
  id: string;
  timestamp: Date;
  originalPhoto: string;
  resultPhoto: string;
  style: Hairstyle;
  color?: HairColor;
  viewAngle: ViewAngle;
  background: Background;
  status: 'success' | 'error';
  errorMessage?: string;
}

// 会话进度状态
interface SessionProgressState {
  // 当前会话的所有尝试记录（不持久化，仅在会话内有效）
  attempts: SessionAttempt[];
  
  // 当前会话开始时间
  sessionStartTime: Date | null;
  
  // 是否显示进度模态框
  isProgressModalOpen: boolean;
  
  // 当前选中查看的尝试（用于详情查看）
  selectedAttemptId: string | null;
  
  // Actions
  addAttempt: (attempt: Omit<SessionAttempt, 'id' | 'timestamp'>) => void;
  removeAttempt: (id: string) => void;
  clearSession: () => void;
  openProgressModal: () => void;
  closeProgressModal: () => void;
  selectAttempt: (id: string | null) => void;
  startSession: () => void;
}

// 生成唯一ID
const generateId = () => `attempt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const useSessionProgress = create<SessionProgressState>((set) => ({
  // 初始状态
  attempts: [],
  sessionStartTime: null,
  isProgressModalOpen: false,
  selectedAttemptId: null,
  
  // 添加新的尝试记录
  addAttempt: (attemptData) => set((state) => ({
    attempts: [
      {
        ...attemptData,
        id: generateId(),
        timestamp: new Date(),
      },
      ...state.attempts,
    ],
    // 如果是第一次尝试，记录会话开始时间
    sessionStartTime: state.sessionStartTime || new Date(),
  })),
  
  // 移除尝试记录
  removeAttempt: (id) => set((state) => ({
    attempts: state.attempts.filter((a) => a.id !== id),
  })),
  
  // 清除当前会话（会话结束时调用）
  clearSession: () => set({
    attempts: [],
    sessionStartTime: null,
    isProgressModalOpen: false,
    selectedAttemptId: null,
  }),
  
  // 打开进度模态框
  openProgressModal: () => set({ isProgressModalOpen: true }),
  
  // 关闭进度模态框
  closeProgressModal: () => set({ 
    isProgressModalOpen: false,
    selectedAttemptId: null,
  }),
  
  // 选择查看特定尝试
  selectAttempt: (id) => set({ selectedAttemptId: id }),
  
  // 开始新会话
  startSession: () => set({
    attempts: [],
    sessionStartTime: new Date(),
    isProgressModalOpen: false,
    selectedAttemptId: null,
  }),
}));
