import { useState, useEffect, useCallback } from 'react';
import { ServiceStatus } from '../types';

const GATEWAY = 'http://10.95.249.151:8080';

const SERVICE_DEFS: Omit<
  ServiceStatus,
  'status' | 'responseTime' | 'uptime' | 'lastChecked'
>[] = [
  {
    name: 'API Gateway',
    port: 8080,
    endpoint: `${GATEWAY}/`,
    description: 'Main entry point with load balancing & failover',
    icon: '🌐',
  },
  {
    name: 'User Service',
    port: 3000,
    endpoint: `${GATEWAY}/health/all`,
    description: 'Authentication, registration & user management',
    icon: '👤',
  },
  {
    name: 'Menu Service',
    port: 3002,
    endpoint: `${GATEWAY}/health/all`,
    description: 'Restaurant menu & inventory management',
    icon: '🍽️',
  },
  {
    name: 'Order Service 1',
    port: 3001,
    endpoint: `${GATEWAY}/health/all`,
    description: 'Primary order processing with transactions',
    icon: '📦',
  },
  {
    name: 'Order Service 2',
    port: 3005,
    endpoint: `${GATEWAY}/health/all`,
    description: 'Secondary order service (load balance target)',
    icon: '📦',
  },
  {
    name: 'Payment Service',
    port: 3003,
    endpoint: `${GATEWAY}/health/all`,
    description: 'Payment processing & transaction records',
    icon: '💳',
  },
  {
    name: 'Monitoring Service',
    port: 3004,
    endpoint: `${GATEWAY}/health/all`,
    description: 'System logs, stats & database monitoring',
    icon: '📊',
  },
];

const NAME_MAP: Record<string, number> = {
  user: 1,
  menu: 2,
  'order-service-1': 3,
  'order-service-2': 4,
  payment: 5,
  monitoring: 6,
};

export function useServices(intervalMs = 8000) {
  const [services, setServices] = useState<ServiceStatus[]>(
    SERVICE_DEFS.map((def) => ({
      ...def,
      status: 'OFFLINE',
      responseTime: 0,
      uptime: 0,
      lastChecked: new Date(),
    }))
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkServices = useCallback(async () => {
    setLoading(true);

    const updated: ServiceStatus[] = SERVICE_DEFS.map((def) => ({
      ...def,
      status: 'OFFLINE',
      responseTime: 0,
      uptime: 0,
      lastChecked: new Date(),
    }));

    // ─────────────────────────────────────────────
    // CHECK API GATEWAY
    // ─────────────────────────────────────────────
    const gatewayStart = Date.now();

    try {
      const gatewayRes = await fetch(`${GATEWAY}/`, {
        signal: AbortSignal.timeout(3000),
      });

      updated[0] = {
        ...SERVICE_DEFS[0],
        status: gatewayRes.ok ? 'ONLINE' : 'DEGRADED',
        responseTime: Date.now() - gatewayStart,
        uptime: gatewayRes.ok ? 100 : 0,
        lastChecked: new Date(),
      };
    } catch (err) {
      console.error('Gateway Check Error:', err);

      updated[0] = {
        ...SERVICE_DEFS[0],
        status: 'OFFLINE',
        responseTime: 0,
        uptime: 0,
        lastChecked: new Date(),
      };
    }

    // ─────────────────────────────────────────────
    // CHECK ALL SERVICES
    // ─────────────────────────────────────────────
    try {
      const start = Date.now();

      const res = await fetch(`${GATEWAY}/health/all`, {
        signal: AbortSignal.timeout(5000),
      });

      const elapsed = Date.now() - start;

      if (!res.ok) {
        throw new Error(`Health check failed (${res.status})`);
      }

      const data = await res.json();

      // support:
      // langsung array
      // atau { data: [...] }
      const servicesData = Array.isArray(data)
        ? data
        : Array.isArray(data.data)
        ? data.data
        : [];

      servicesData.forEach((svc: any) => {
        const idx = NAME_MAP[svc.name];

        if (idx !== undefined) {
          updated[idx] = {
            ...SERVICE_DEFS[idx],

            status:
              svc.status === 'ONLINE'
                ? 'ONLINE'
                : svc.status === 'DEGRADED'
                ? 'DEGRADED'
                : 'OFFLINE',

            responseTime:
              typeof svc.responseTime === 'number'
                ? svc.responseTime
                : Math.round(elapsed / servicesData.length),

            // gunakan uptime asli dari backend
            uptime:
              typeof svc.uptime === 'number'
                ? svc.uptime
                : svc.status === 'ONLINE'
                ? 100
                : 0,

            lastChecked: new Date(),
          };
        }
      });

      setError(null);

    } catch (err) {
      console.error('Services Check Error:', err);

      setError('Failed to check services');
    } finally {
      setServices(updated);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkServices();

    const id = setInterval(checkServices, intervalMs);

    return () => clearInterval(id);
  }, [checkServices, intervalMs]);

  return {
    services,
    loading,
    error,
    refetch: checkServices,
  };
}