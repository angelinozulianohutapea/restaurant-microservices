import { useState, useEffect, useCallback } from 'react';
import { ServiceStatus } from '../types';

// =============================================
// SERVICE DEFINITIONS
// =============================================
const SERVICE_DEFS: Omit<ServiceStatus, 'status' | 'responseTime' | 'uptime' | 'lastChecked'>[] = [
  {
    name: 'API Gateway',
    port: 8080,
    endpoint: 'http://localhost:8080/',
    description: 'Main entry point with load balancing & failover',
    icon: '🌐',
  },
  {
    name: 'User Service',
    port: 3000,
    endpoint: 'http://localhost:3000/health',
    description: 'Authentication, registration & user management',
    icon: '👤',
  },
  {
    name: 'Menu Service',
    port: 3002,
    endpoint: 'http://localhost:3002/health',
    description: 'Restaurant menu & inventory management',
    icon: '🍽️',
  },
  {
    name: 'Order Service 1',
    port: 3001,
    endpoint: 'http://localhost:3001/health',
    description: 'Primary order processing with transactions',
    icon: '📦',
  },
  {
    name: 'Order Service 2',
    port: 3005,
    endpoint: 'http://localhost:3005/health',
    description: 'Secondary order service (load balance target)',
    icon: '📦',
  },
  {
    name: 'Payment Service',
    port: 3003,
    endpoint: 'http://localhost:3003/health',
    description: 'Payment processing & transaction records',
    icon: '💳',
  },
  {
    name: 'Monitoring Service',
    port: 3004,
    endpoint: 'http://localhost:3004/health',
    description: 'System logs, stats & database failover monitoring',
    icon: '📊',
  },
];

// =============================================
// MOCK GENERATOR
// =============================================
function generateMockService(
  def: Omit<ServiceStatus, 'status' | 'responseTime' | 'uptime' | 'lastChecked'>,
  index: number
): ServiceStatus {
  // Mostly online for demo
  const statusOptions: ServiceStatus['status'][] = ['ONLINE', 'ONLINE', 'ONLINE', 'ONLINE', 'DEGRADED'];
  const mockStatus = index === 4 ? 'ONLINE' : statusOptions[Math.floor(Math.random() * statusOptions.length)];
  return {
    ...def,
    status: mockStatus,
    responseTime: Math.floor(Math.random() * 80) + 12,
    uptime: 99.2 + Math.random() * 0.7,
    lastChecked: new Date(),
  };
}

// =============================================
// HOOK
// =============================================
export function useServices(intervalMs = 8000) {
  const [services, setServices] = useState<ServiceStatus[]>(
    SERVICE_DEFS.map((def, i) => generateMockService(def, i))
  );
  const [loading, setLoading] = useState(false);

  const checkServices = useCallback(async () => {
    setLoading(true);
    const results = await Promise.all(
      SERVICE_DEFS.map(async (def, index) => {
        const start = Date.now();
        try {
          const res = await fetch(def.endpoint, {
            signal: AbortSignal.timeout(2500),
          });
          const responseTime = Date.now() - start;
          return {
            ...def,
            status: res.ok ? ('ONLINE' as const) : ('DEGRADED' as const),
            responseTime,
            uptime: res.ok ? 99.5 + Math.random() * 0.5 : 95.0,
            lastChecked: new Date(),
          };
        } catch {
          return generateMockService(def, index);
        }
      })
    );
    setServices(results);
    setLoading(false);
  }, []);

  useEffect(() => {
    checkServices();
    const id = setInterval(checkServices, intervalMs);
    return () => clearInterval(id);
  }, [checkServices, intervalMs]);

  return { services, loading, refetch: checkServices };
}
