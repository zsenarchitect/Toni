'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Hairstyle, HairColor, Background, ViewAngle, GenerationResult, MultiAnglePhotos } from '@/types';
import { backgrounds } from '@/data/backgrounds';

interface AppState {
  // Current session
  currentPhoto: string | null; // 向后兼容：单张照片
  multiAnglePhotos: MultiAnglePhotos | null; // V1.5: 多角度照片
  selectedStyle: Hairstyle | null;
  selectedColor: HairColor | null;
  selectedBackground: Background;
  selectedViewAngle: ViewAngle;
  
  // Generated results for current session (keyed by view angle)
  generatedResults: Record<ViewAngle, string | null>;
  
  // Loading state
  isGenerating: boolean;
  
  // History
  history: GenerationResult[];
  
  // Actions
  setPhoto: (photo: string | null) => void; // 向后兼容
  setMultiAnglePhotos: (photos: MultiAnglePhotos | null) => void; // V1.5
  setStyle: (style: Hairstyle | null) => void;
  setColor: (color: HairColor | null) => void;
  setBackground: (background: Background) => void;
  setViewAngle: (angle: ViewAngle) => void;
  setGeneratedResult: (angle: ViewAngle, result: string) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  addToHistory: (result: GenerationResult) => void;
  removeFromHistory: (id: string) => void;
  clearHistory: () => void;
  resetSession: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial state
      currentPhoto: null,
      multiAnglePhotos: null,
      selectedStyle: null,
      selectedColor: null,
      selectedBackground: backgrounds[0],
      selectedViewAngle: 'front',
      generatedResults: {
        front: null,
        side: null,
        back: null,
      },
      isGenerating: false,
      history: [],
      
      // Actions
      setPhoto: (photo) => set({ 
        currentPhoto: photo,
        multiAnglePhotos: null, // 使用单张照片时，清除多角度照片
        generatedResults: { front: null, side: null, back: null },
      }),
      
      setMultiAnglePhotos: (photos) => set({
        multiAnglePhotos: photos,
        currentPhoto: photos?.front || null, // 保持向后兼容
        generatedResults: { front: null, side: null, back: null },
      }),
      
      setStyle: (style) => set({ 
        selectedStyle: style,
        generatedResults: { front: null, side: null, back: null },
      }),
      
      setColor: (color) => set({ 
        selectedColor: color,
        generatedResults: { front: null, side: null, back: null },
      }),
      
      setBackground: (background) => set({ selectedBackground: background }),
      
      setViewAngle: (angle) => set({ selectedViewAngle: angle }),
      
      setGeneratedResult: (angle, result) =>
        set((state) => ({
          generatedResults: {
            ...state.generatedResults,
            [angle]: result,
          },
        })),
      
      setIsGenerating: (isGenerating) => set({ isGenerating }),
      
      addToHistory: (result) =>
        set((state) => ({
          history: [result, ...state.history].slice(0, 50), // Keep last 50
        })),
      
      removeFromHistory: (id) =>
        set((state) => ({
          history: state.history.filter((item) => item.id !== id),
        })),
      
      clearHistory: () => set({ history: [] }),
      
      resetSession: () =>
        set({
          currentPhoto: null,
          multiAnglePhotos: null,
          selectedStyle: null,
          selectedColor: null,
          selectedViewAngle: 'front',
          generatedResults: { front: null, side: null, back: null },
          isGenerating: false,
        }),
    }),
    {
      name: 'merror-storage',
      partialize: (state) => ({ history: state.history }),
    }
  )
);
