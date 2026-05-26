import { useState, useEffect, useCallback } from 'react';
import { Stats } from '../types';
import { API } from '../config/api';

// =============================================
// MOCK STATS FOR DEMO (when backend unavailable)
// =============================================
const MOCK_STATS: Stats = {
  total_users: 124,
  total_menu: 38,
  total_orders: 1847,
  total_payments: 1632,
  total_revenue: 18574000,
  low_stock_items: 5,
  database_role: 'PRIMARY',
  database_host: '10.95.249.151',
  database_port: 5432,
  replication_status: 'STREAMING',
  failover_status: 'NORMAL',
  database_status: 'ONLINE',
  microservice: 'RUNNING',
  uptime: 86400,
  timestamp: new Date().toISOString(),
};

export function useStats(autoRefresh = true, intervalMs = 5000) {
  const [stats, setStats] = useState<Stats>(MOCK_STATS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usingMock, setUsingMock] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(API.stats, { signal: AbortSignal.timeout(3000) });
      if (!res.ok) throw new Error('Stats fetch failed');
      const data = await res.json();
      setStats(data);
      setUsingMock(false);
      setError(null);
    } catch {
      // Simulate slight variation in mock data for realism
      setStats(prev => ({
        ...MOCK_STATS,
        total_orders: prev.total_orders + Math.floor(Math.random() * 2),
        total_revenue: prev.total_revenue + Math.floor(Math.random() * 50000),
        uptime: prev.uptime + 5,
        timestamp: new Date().toISOString(),
      }));
      setUsingMock(true);
      setError('Backend unavailable — showing demo data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    if (!autoRefresh) return;
    const id = setInterval(fetchStats, intervalMs);
    return () => clearInterval(id);
  }, [fetchStats, autoRefresh, intervalMs]);

  return { stats, loading, error, usingMock, refetch: fetchStats };
}
