import React from 'react';
import { cn } from '../../utils/cn';
import { NavPage } from '../../types';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  FileText,
  ChefHat,
  Zap,
} from 'lucide-react';

interface NavItem {
  id: NavPage;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  badgeColor?: string;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { id: 'orders', label: 'Orders', icon: <ShoppingCart size={18} /> },
  { id: 'stock', label: 'Stock', icon: <Package size={18} /> },
];

interface SidebarProps {
  activePage: NavPage;
  onNavigate: (page: NavPage) => void;
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ activePage, onNavigate, collapsed, onToggle }: SidebarProps) {
  return (
    <aside className={cn(
      'fixed left-0 top-0 h-screen bg-slate-900 flex flex-col z-40 transition-all duration-300',
      collapsed ? 'w-16' : 'w-60'
    )}>
      {/* Logo */}
      <div className={cn(
        'flex items-center gap-3 px-4 py-5 border-b border-slate-800',
        collapsed && 'justify-center px-0'
      )}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-900/40">
          <ChefHat size={18} className="text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-white font-bold text-sm truncate">RestoAdmin</p>
            <p className="text-slate-400 text-xs truncate">Microservices</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto overflow-x-hidden scrollbar-none">
        {!collapsed && (
          <p className="text-slate-500 text-[10px] font-semibold uppercase tracking-wider px-3 mb-3">Main Menu</p>
        )}
        {navItems.map((item) => {
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              title={collapsed ? item.label : undefined}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group relative',
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/40'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100',
                collapsed && 'justify-center px-0'
              )}
            >
              <span className={cn('flex-shrink-0', isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200')}>
                {item.icon}
              </span>
              {!collapsed && (
                <>
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span className={cn('ml-auto text-[9px] font-bold text-white px-1.5 py-0.5 rounded-md', item.badgeColor)}>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
              {/* Tooltip for collapsed */}
              {collapsed && (
                <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap border border-slate-700 shadow-xl z-50 transition-opacity duration-150">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-slate-800 p-3 space-y-1">
        {/* System status indicator */}
        {!collapsed && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/60">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-300 truncate">All Systems</p>
              <p className="text-[10px] text-emerald-400 truncate">Operational</p>
            </div>
            <Zap size={12} className="text-amber-400 flex-shrink-0 ml-auto" />
          </div>
        )}

        {/* Toggle button */}
        <button
          onClick={onToggle}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-slate-500 hover:bg-slate-800 hover:text-slate-300 transition-all',
            collapsed && 'justify-center px-0'
          )}
        >
          <span className="flex-shrink-0">
            {collapsed ? (
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            ) : (
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M11 19l-7-7 7-7M19 19l-7-7 7-7" />
              </svg>
            )}
          </span>
          {!collapsed && <span>Collapse sidebar</span>}
        </button>
      </div>
    </aside>
  );
}
