'use client';

import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  selected?: boolean;
  variant?: 'raised' | 'inset';
}

export function Card({ className, selected, variant = 'raised', children, ...props }: CardProps) {
  const baseStyles = variant === 'inset' ? 'neo-card-inset' : 'neo-card';
  const selectedStyles = selected 
    ? 'neo-etching-glow border-[rgba(20,184,166,0.3)]' 
    : '';
  
  return (
    <div
      className={cn(
        baseStyles,
        selectedStyles,
        'transition-all duration-300',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <div className={cn('relative overflow-hidden rounded-t-xl', className)}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
      />
    </div>
  );
}

export function CardContent({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn('p-4', className)}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <h3 className={cn('font-semibold text-gray-900', className)}>
      {children}
    </h3>
  );
}

export function CardDescription({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <p className={cn('text-sm text-gray-500 mt-1', className)}>
      {children}
    </p>
  );
}
