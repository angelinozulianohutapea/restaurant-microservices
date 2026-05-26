import { useState } from 'react';
import { Bell, RefreshCw, Search, User } from 'lucide-react';
import { NavPage } from '../../types';

const pageTitles: Record<NavPage, { title: string; subtitle: string }> = {
  dashboard: { title: 'Dashboard', subtitle: 'Restaurant operations overview' },
  monitoring: { title: 'Service Monitoring', subtitle: 'Real-time microservice health status' },
  orders: { title: 'Orders', subtitle: 'All customer orders and transactions' },
  stock: { title: 'Stock Management', subtitle: 'Menu inventory and stock control' },
  database: { title: 'Database', subtitle: 'PostgreSQL primary & replica status' },
  analytics: { title: 'Analytics', subtitle: 'Revenue, orders & performance insights' },
  logs: { title: 'System Logs', subtitle: 'Microservice activity and event logs' },
  settings: { title: 'Settings', subtitle: 'System configuration and preferences' },
};

interface TopbarProps {
  page: NavPage;
  onRefresh?: () => void;
  sidebarCollapsed: boolean;
  demoMode?: boolean;
}

export function Topbar({ page, onRefresh, sidebarCollapsed, demoMode }: TopbarProps) {
  const { title, subtitle } = pageTitles[page];
  const [spinning, setSpinning] = useState(false);

  const handleRefresh = () => {
    setSpinning(true);
    onRefresh?.();
    setTimeout(() => setSpinning(false), 800);
  };

  return (
    <header
      className="fixed top-0 right-0 h-16 bg-white border-b border-slate-200 flex items-center z-30 transition-all duration-300"
      style={{ left: sidebarCollapsed ? '4rem' : '15rem' }}
    >
      <div className="flex items-center justify-between w-full px-6">
        {/* Left: Title */}
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-base font-bold text-slate-900 leading-tight">{title}</h1>
            <p className="text-xs text-slate-500 leading-tight">{subtitle}</p>
          </div>
          {demoMode && (
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Demo Mode
            </span>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 w-48">
            <Search size={14} className="text-slate-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent text-sm text-slate-600 placeholder-slate-400 outline-none w-full"
            />
          </div>

          {/* Refresh */}
          <button
            onClick={handleRefresh}
            className="w-9 h-9 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <RefreshCw size={15} className={spinning ? 'animate-spin' : ''} />
          </button>

          {/* Notifications */}
          <button className="relative w-9 h-9 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors">
            <Bell size={15} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
          </button>

          {/* Avatar */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200 ml-1">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <User size={14} className="text-white" />
            </div>
            <div className="hidden md:block">
              <p className="text-xs font-semibold text-slate-900 leading-tight">Admin</p>
              <p className="text-[10px] text-slate-400 leading-tight">Super Admin</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
