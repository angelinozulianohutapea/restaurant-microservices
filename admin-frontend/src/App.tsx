import { useState, useCallback } from 'react';

import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';

import { DashboardPage } from './pages/DashboardPage';
import { OrdersPage } from './pages/OrdersPage';
import { StockPage } from './pages/StockPage';

import { NavPage } from './types';

// =============================================
// PAGE RENDERER
// =============================================

function renderPage(
  page: NavPage,
  refetchKey: number
) {

  const key =
    `${page}-${refetchKey}`;

  switch (page) {

    case 'dashboard':

      return (
        <DashboardPage key={key} />
      );

    case 'orders':

      return (
        <OrdersPage key={key} />
      );

    case 'stock':

      return (
        <StockPage key={key} />
      );

    default:

      return (
        <DashboardPage key={key} />
      );
  }
}

// =============================================
// APP
// =============================================

export default function App() {

  // =========================================
  // STATES
  // =========================================

  const [
    activePage,
    setActivePage,
  ] = useState<NavPage>(
    'dashboard'
  );

  const [
    sidebarCollapsed,
    setSidebarCollapsed,
  ] = useState(false);

  const [
    refetchKey,
    setRefetchKey,
  ] = useState(0);

  // =========================================
  // REFRESH
  // =========================================

  const handleRefresh =
    useCallback(() => {

      setRefetchKey(
        (k) => k + 1
      );

    }, []);

  // =========================================
  // SIDEBAR WIDTH
  // =========================================

  const sidebarWidth =
    sidebarCollapsed
      ? '4rem'
      : '15rem';

  // =========================================
  // RENDER
  // =========================================

  return (

    <div className="min-h-screen bg-slate-50 font-sans">

      {/* SIDEBAR */}

      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        collapsed={sidebarCollapsed}
        onToggle={() =>
          setSidebarCollapsed(
            (c) => !c
          )
        }
      />

      {/* MAIN */}

      <div
        className="transition-all duration-300 min-h-screen"
        style={{
          marginLeft: sidebarWidth,
        }}
      >

        {/* TOPBAR */}

        <Topbar
          page={activePage}
          onRefresh={handleRefresh}
          sidebarCollapsed={sidebarCollapsed}
        />

        {/* CONTENT */}

        <main className="pt-16 min-h-screen">

          <div className="p-6 max-w-[1400px] mx-auto">

            {renderPage(
              activePage,
              refetchKey
            )}

          </div>

        </main>

      </div>

    </div>
  );
}