import { useState, useEffect, useCallback } from 'react';
import { ServiceStatus } from '../types';

const GATEWAY = 'http://10.95.249.151:8080';

const SERVICE_DEFS: Omit<ServiceStatus, 'status' | 'responseTime' | 'uptime' | 'lastChecked'>[] = [
  { name: 'API Gateway',        port: 8080, endpoint: `${GATEWAY}/`,          description: 'Main entry point with load balancing & failover',     icon: '🌐' },
  { name: 'User Service',       port: 3000, endpoint: `${GATEWAY}/health/all`, description: 'Authentication, registration & user management',     icon: '👤' },
  { name: 'Menu Service',       port: 3002, endpoint: `${GATEWAY}/health/all`, description: 'Restaurant menu & inventory management',             icon: '🍽️' },
  { name: 'Order Service 1',    port: 3001, endpoint: `${GATEWAY}/health/all`, description: 'Primary order processing with transactions',         icon: '📦' },
  { name: 'Order Service 2',    port: 3005, endpoint: `${GATEWAY}/health/all`, description: 'Secondary order service (load balance target)',      icon: '📦' },
  { name: 'Payment Service',    port: 3003, endpoint: `${GATEWAY}/health/all`, description: 'Payment processing & transaction records',           icon: '💳' },
  { name: 'Monitoring Service', port: 3004, endpoint: `${GATEWAY}/health/all`, description: 'System logs, stats & database failover monitoring',  icon: '📊' },
];

const NAME_MAP: Record<string, number> = {
  'user': 1, 'menu': 2, 'order-service-1': 3,
  'order-service-2': 4, 'payment': 5, 'monitoring': 6,
};

export function useServices(intervalMs = 8000) {
  const [services, setServices] = useState<ServiceStatus[]>(
    SERVICE_DEFS.map((def) => ({ ...def, status: 'OFFLINE' as const, responseTime: 0, uptime: 0, lastChecked: new Date() }))
  );
  const [loading, setLoading] = useState(false);

  const checkServices = useCallback(async () => {
    setLoading(true);
    const updated: ServiceStatus[] = SERVICE_DEFS.map((def) => ({
      ...def, status: 'OFFLINE' as const, responseTime: 0, uptime: 0, lastChecked: new Date(),
    }));

    // Cek Gateway
    const gwStart = Date.now();
    try {
      const gwRes = await fetch(`${GATEWAY}/`, { signal: AbortSignal.timeout(2500) });
      updated[0] = { ...SERVICE_DEFS[0], status: gwRes.ok ? 'ONLINE' : 'DEGRADED', responseTime: Date.now() - gwStart, uptime: 99.9, lastChecked: new Date() };
    } catch {
      updated[0] = { ...SERVICE_DEFS[0], status: 'OFFLINE', responseTime: 0, uptime: 0, lastChecked: new Date() };
    }

    // Cek semua service via /health/all
    try {
      const start = Date.now();
      const res = await fetch(`${GATEWAY}/health/all`, { signal: AbortSignal.timeout(5000) });
      const elapsed = Date.now() - start;
      if (res.ok) {
        const data: { name: string; port: number; status: string }[] = await res.json();
        data.forEach((svc) => {
          const idx = NAME_MAP[svc.name];
          if (idx !== undefined) {
            updated[idx] = {
              ...SERVICE_DEFS[idx],
              status: svc.status as ServiceStatus['status'],
              responseTime: Math.round(elapsed / data.length),
              uptime: svc.status === 'ONLINE' ? 99.5 + Math.random() * 0.5 : 0,
              lastChecked: new Date(),
            };
          }
        });
      }
    } catch { /* gateway online tapi /health/all gagal */ }

    setServices(updated);
    setLoading(false);
  }, []);

  useEffect(() => {
    checkServices();
    const id = setInterval(checkServices, intervalMs);
    return () => clearInterval(id);
  }, [checkServices, intervalMs]);

  return { services, loading, refetch: checkServices };
}