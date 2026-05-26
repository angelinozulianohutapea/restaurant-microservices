import { useState, useEffect, useCallback } from 'react';
import { Log } from '../types';
import { API } from '../config/api';

const MOCK_LOGS: Log[] = [
  { id: 100, service_name: 'order-service-1', log_level: 'INFO', message: 'Order #1847 created successfully. Total: Rp 54.000', created_at: new Date(Date.now() - 60000).toISOString() },
  { id: 99, service_name: 'payment-service', log_level: 'INFO', message: 'Payment TRX-1716834521001 processed for order #1846', created_at: new Date(Date.now() - 120000).toISOString() },
  { id: 98, service_name: 'gateway', log_level: 'INFO', message: 'Load balancer routing request to order-service-2', created_at: new Date(Date.now() - 180000).toISOString() },
  { id: 97, service_name: 'order-service-2', log_level: 'INFO', message: 'TRANSACTION COMMIT — Order #1846', created_at: new Date(Date.now() - 240000).toISOString() },
  { id: 96, service_name: 'monitoring-service', log_level: 'INFO', message: 'Database PRIMARY node healthy. Replication STREAMING active.', created_at: new Date(Date.now() - 300000).toISOString() },
  { id: 95, service_name: 'menu-service', log_level: 'WARN', message: 'Low stock alert: Bakso Urat has only 2 units remaining', created_at: new Date(Date.now() - 600000).toISOString() },
  { id: 94, service_name: 'user-service', log_level: 'INFO', message: 'New user registered: rizky.pratama@email.com', created_at: new Date(Date.now() - 900000).toISOString() },
  { id: 93, service_name: 'order-service-1', log_level: 'ERROR', message: 'SERVER GAGAL: http://order-service-1:3001 — failover to order-service-2', created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: 92, service_name: 'monitoring-service', log_level: 'WARN', message: 'Primary DB latency spike detected: 450ms (threshold: 200ms)', created_at: new Date(Date.now() - 7200000).toISOString() },
  { id: 91, service_name: 'payment-service', log_level: 'INFO', message: 'Payment TRX-1716834520998 processed for order #1844', created_at: new Date(Date.now() - 10800000).toISOString() },
  { id: 90, service_name: 'gateway', log_level: 'INFO', message: 'Health check passed. All services ONLINE.', created_at: new Date(Date.now() - 14400000).toISOString() },
  { id: 89, service_name: 'menu-service', log_level: 'INFO', message: 'Menu item added: Pisang Goreng (category: Snack)', created_at: new Date(Date.now() - 18000000).toISOString() },
];

export function useLogs(intervalMs = 10000) {
  const [logs, setLogs] = useState<Log[]>(MOCK_LOGS);
  const [loading, setLoading] = useState(false);
  const [usingMock, setUsingMock] = useState(true);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(API.log, { signal: AbortSignal.timeout(3000) });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setLogs(data.data || data);
      setUsingMock(false);
    } catch {
      // Add a fresh mock log entry each refresh
      setLogs(prev => [
        {
          id: prev[0].id + 1,
          service_name: ['gateway', 'order-service-1', 'monitoring-service', 'payment-service'][Math.floor(Math.random() * 4)],
          log_level: 'INFO',
          message: `Heartbeat check — all systems nominal at ${new Date().toLocaleTimeString()}`,
          created_at: new Date().toISOString(),
        },
        ...prev.slice(0, 49),
      ]);
      setUsingMock(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
    const id = setInterval(fetchLogs, intervalMs);
    return () => clearInterval(id);
  }, [fetchLogs, intervalMs]);

  return { logs, loading, usingMock, refetch: fetchLogs };
}
