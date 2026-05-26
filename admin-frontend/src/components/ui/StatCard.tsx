import React from 'react';
import { cn } from '../../utils/cn';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: { value: number; label: string };
  color?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'sky' | 'violet';
  loading?: boolean;
}

const colorMap = {
  indigo: { bg: 'bg-indigo-600', light: 'bg-indigo-50', text: 'text-indigo-600', ring: 'ring-indigo-100' },
  emerald: { bg: 'bg-emerald-600', light: 'bg-emerald-50', text: 'text-emerald-600', ring: 'ring-emerald-100' },
  amber: { bg: 'bg-amber-500', light: 'bg-amber-50', text: 'text-amber-600', ring: 'ring-amber-100' },
  rose: { bg: 'bg-rose-600', light: 'bg-rose-50', text: 'text-rose-600', ring: 'ring-rose-100' },
  sky: { bg: 'bg-sky-600', light: 'bg-sky-50', text: 'text-sky-600', ring: 'ring-sky-100' },
  violet: { bg: 'bg-violet-600', light: 'bg-violet-50', text: 'text-violet-600', ring: 'ring-violet-100' },
};

export function StatCard({ title, value, subtitle, icon, trend, color = 'indigo', loading = false }: StatCardProps) {
  const c = colorMap[color];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col gap-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 font-medium">{title}</p>
          {loading ? (
            <div className="mt-2 h-8 w-28 bg-slate-100 rounded-lg animate-pulse" />
          ) : (
            <p className="mt-1 text-2xl font-bold text-slate-900 tracking-tight">{value}</p>
          )}
          {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
        </div>
        <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center ring-4', c.light, c.ring)}>
          <span className={cn('text-lg', c.text)}>{icon}</span>
        </div>
      </div>

      {trend && (
        <div className="flex items-center gap-1.5">
          <span className={cn(
            'text-xs font-semibold px-1.5 py-0.5 rounded-md',
            trend.value >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
          )}>
            {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
          <span className="text-xs text-slate-400">{trend.label}</span>
        </div>
      )}
    </div>
  );
}
