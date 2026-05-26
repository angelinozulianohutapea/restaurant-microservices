import { useState, useCallback } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { DashboardPage } from './pages/DashboardPage';
import { MonitoringPage } from './pages/MonitoringPage';
import { OrdersPage } from './pages/OrdersPage';
import { StockPage } from './pages/StockPage';
import { DatabasePage } from './pages/DatabasePage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { LogsPage } from './pages/LogsPage';
import { SettingsPage } from './pages/SettingsPage';
import { NavPage } from './types';

// =============================================
// PAGE RENDERER
// =============================================
function renderPage(page: NavPage, refetchKey: number) {
  const key = `${page}-${refetchKey}`;
  switch (page) {
    case 'dashboard':   return <DashboardPage key={key} />;
    case 'monitoring':  return <MonitoringPage key={key} />;
    case 'orders':      return <OrdersPage key={key} />;
    case 'stock':       return <StockPage key={key} />;
    case 'database':    return <DatabasePage key={key} />;
    case 'analytics':   return <AnalyticsPage key={key} />;
    case 'logs':        return <LogsPage key={key} />;
    case 'settings':    return <SettingsPage key={key} />;
    default:            return <DashboardPage key={key} />;
  }
}

// =============================================
// APP
// =============================================
export default function App() {
  const [activePage, setActivePage] = useState<NavPage>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [refetchKey, setRefetchKey] = useState(0);

  const handleRefresh = useCallback(() => {
    setRefetchKey(k => k + 1);
  }, []);

  const sidebarWidth = sidebarCollapsed ? '4rem' : '15rem';

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(c => !c)}
      />

      {/* Main Content */}
      <div
        className="transition-all duration-300 min-h-screen"
        style={{ marginLeft: sidebarWidth }}
      >
        {/* Topbar */}
        <Topbar
          page={activePage}
          onRefresh={handleRefresh}
          sidebarCollapsed={sidebarCollapsed}
          demoMode={true}
        />

        {/* Page Content */}
        <main
          className="pt-16 min-h-screen"
        >
          <div className="p-6 max-w-[1400px] mx-auto">
            {renderPage(activePage, refetchKey)}
          </div>
        </main>
      </div>
    </div>
  );
}
