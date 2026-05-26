import { useState, useEffect, useCallback } from 'react';
import { Stats } from '../types';
import { API } from '../config/api';

const EMPTY_STATS: Stats = {
  total_users: 0,
  total_menu: 0,
  total_orders: 0,
  total_payments: 0,
  total_revenue: 0,
  low_stock_items: 0,
  database_role: 'UNKNOWN',
  database_host: '-',
  database_port: 0,
  replication_status: 'UNKNOWN',
  failover_status: 'UNKNOWN',
  database_status: 'OFFLINE',
  microservice: 'DOWN',
  uptime: 0,
  timestamp: '',
};

export function useStats(autoRefresh = true, intervalMs = 5000) {
  const [stats, setStats] = useState<Stats>(EMPTY_STATS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);

      const res = await fetch(API.stats, {
        signal: AbortSignal.timeout(5000),
      });

      if (!res.ok) {
        throw new Error(`Stats fetch failed (${res.status})`);
      }

      const data = await res.json();

      setStats({
        ...EMPTY_STATS,
        ...data,
      });

      setError(null);

    } catch (err) {
      console.error('Fetch Stats Error:', err);

      // tetap gunakan empty stats
      setStats(EMPTY_STATS);

      setError('Backend unavailable');
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

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
}