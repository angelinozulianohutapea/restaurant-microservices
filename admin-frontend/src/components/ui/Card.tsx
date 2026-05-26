import React from 'react';
import { cn } from '../../utils/cn';

// =============================================
// CARD
// =============================================

interface CardProps {

  children: React.ReactNode;

  className?: string;

  hover?: boolean;

  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({
  children,
  className,
  hover = false,
  padding = 'md',
}: CardProps) {

  const paddings = {

    none: '',

    sm: 'p-4',

    md: 'p-6',

    lg: 'p-8',
  };

  return (

    <div
      className={cn(

        // BASE
        'bg-white rounded-2xl border border-slate-200/80',

        // MODERN SHADOW
        'shadow-sm shadow-slate-200/50',

        // TRANSITION
        'transition-all duration-300 ease-out',

        // HOVER EFFECT
        hover && [

          'hover:shadow-xl',

          'hover:shadow-slate-200/60',

          'hover:-translate-y-1',

          'hover:border-slate-300',

          'cursor-pointer',
        ],

        // PADDING
        paddings[padding],

        // CUSTOM
        className
      )}
    >

      {children}

    </div>
  );
}

// =============================================
// CARD HEADER
// =============================================

interface CardHeaderProps {

  title: string;

  subtitle?: string;

  action?: React.ReactNode;

  icon?: React.ReactNode;
}

export function CardHeader({
  title,
  subtitle,
  action,
  icon,
}: CardHeaderProps) {

  return (

    <div className="flex items-start justify-between gap-4 mb-6">

      {/* LEFT */}

      <div className="flex items-center gap-3 min-w-0">

        {icon && (

          <div
            className={cn(

              'w-10 h-10 rounded-2xl',

              'bg-gradient-to-br from-slate-100 to-slate-50',

              'border border-slate-200',

              'flex items-center justify-center',

              'text-slate-600',

              'shadow-sm'
            )}
          >

            {icon}

          </div>
        )}

        <div className="min-w-0">

          <h3
            className={cn(

              'text-base font-semibold',

              'text-slate-900',

              'truncate'
            )}
          >

            {title}

          </h3>

          {subtitle && (

            <p
              className={cn(

                'text-sm text-slate-500',

                'mt-0.5',

                'line-clamp-2'
              )}
            >

              {subtitle}

            </p>
          )}

        </div>

      </div>

      {/* RIGHT */}

      {action && (

        <div className="flex-shrink-0">

          {action}

        </div>
      )}

    </div>
  );
}