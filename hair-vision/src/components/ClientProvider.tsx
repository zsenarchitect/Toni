'use client';

import { useSyncExternalStore } from 'react';

interface ClientProviderProps {
  children: React.ReactNode;
}

// Custom hook for hydration state
function useHydration() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export function ClientProvider({ children }: ClientProviderProps) {
  const isHydrated = useHydration();

  // Show loading or placeholder during hydration
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-12 h-12 bg-gray-200 rounded-xl mb-4 mx-auto" />
          <div className="h-4 w-32 bg-gray-200 rounded mx-auto" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
