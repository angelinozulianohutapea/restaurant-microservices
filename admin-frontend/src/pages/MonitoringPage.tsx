import { useState, useEffect } from 'react';
import { Card, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useServices } from '../hooks/useServices';
import { ServiceStatus } from '../types';
import {
  Activity, RefreshCw, Wifi, WifiOff, AlertTriangle,
  Clock, Server, Zap, CheckCircle2,
} from 'lucide-react';

// =============================================
// SERVICE CARD
// =============================================
function ServiceCard({ service }: { service: ServiceStatus }) {
  const isOnline = service.status === 'ONLINE';
  const isDegraded = service.status === 'DEGRADED';

  return (
    <div className={`
      relative bg-white rounded-2xl border p-5 shadow-sm transition-all duration-200 hover:shadow-md
      ${isOnline ? 'border-slate-200' : isDegraded ? 'border-amber-200' : 'border-red-200'}
    `}>
      {/* Status indicator bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl ${
        isOnline ? 'bg-emerald-400' : isDegraded ? 'bg-amber-400' : 'bg-red-400'
      }`} />

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl ${
            isOnline ? 'bg-emerald-50' : isDegraded ? 'bg-amber-50' : 'bg-red-50'
          }`}>
            {service.icon}
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-sm">{service.name}</h3>
            <p className="text-xs text-slate-500">Port {service.port}</p>
          </div>
        </div>
        <Badge
          variant={isOnline ? 'success' : isDegraded ? 'warning' : 'danger'}
          dot
        >
          {service.status}
        </Badge>
      </div>

      <p className="text-xs text-slate-500 mb-4 leading-relaxed">{service.description}</p>

      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Zap size={11} className="text-amber-500" />
            <span className="text-[10px] text-slate-400 font-medium">Response</span>
          </div>
          <p className={`text-sm font-bold ${
            service.responseTime < 50 ? 'text-emerald-600' :
            service.responseTime < 100 ? 'text-amber-600' : 'text-red-600'
          }`}>{service.responseTime}ms</p>
        </div>
        <div className="text-center border-x border-slate-100">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Activity size={11} className="text-indigo-500" />
            <span className="text-[10px] text-slate-400 font-medium">Uptime</span>
          </div>
          <p className="text-sm font-bold text-slate-700">{service.uptime.toFixed(1)}%</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Clock size={11} className="text-slate-400" />
            <span className="text-[10px] text-slate-400 font-medium">Checked</span>
          </div>
          <p className="text-xs font-medium text-slate-600">
            {service.lastChecked.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </p>
        </div>
      </div>
    </div>
  );
}

// =============================================
// LOAD BALANCER VISUALIZATION
// =============================================
function LoadBalancerViz() {
  const [activeServer, setActiveServer] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActiveServer(prev => (prev + 1) % 2), 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <Card padding="md">
      <CardHeader
        title="Load Balancer"
        subtitle="Round-robin with failover"
        icon={<Server size={16} />}
      />
      <div className="flex flex-col items-center gap-3">
        {/* Gateway */}
        <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-2.5">
          <Wifi size={16} className="text-indigo-600" />
          <span className="text-sm font-semibold text-indigo-700">API Gateway :8080</span>
        </div>

        {/* Arrow + label */}
        <div className="flex items-center gap-2 text-slate-400">
          <div className="w-px h-6 bg-slate-200" />
          <span className="text-[10px] font-medium bg-slate-100 px-2 py-0.5 rounded">Round Robin</span>
          <div className="w-px h-6 bg-slate-200" />
        </div>

        {/* Servers */}
        <div className="grid grid-cols-2 gap-3 w-full">
          {[
            { label: 'Order Service 1', port: 3001 },
            { label: 'Order Service 2', port: 3005 },
          ].map((srv, i) => (
            <div
              key={i}
              className={`rounded-xl border p-3 text-center transition-all duration-300 ${
                activeServer === i
                  ? 'border-emerald-400 bg-emerald-50 shadow-md shadow-emerald-100'
                  : 'border-slate-200 bg-slate-50'
              }`}
            >
              {activeServer === i && (
                <div className="flex justify-center mb-1.5">
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold bg-emerald-500 text-white px-1.5 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                    ACTIVE
                  </span>
                </div>
              )}
              <p className={`text-xs font-semibold ${activeServer === i ? 'text-emerald-700' : 'text-slate-600'}`}>
                {srv.label}
              </p>
              <p className="text-[10px] text-slate-400">:{srv.port}</p>
            </div>
          ))}
        </div>

        {/* Failover indicator */}
        <div className="w-full flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
          <AlertTriangle size={13} className="text-amber-600 flex-shrink-0" />
          <p className="text-xs text-amber-700">
            <span className="font-semibold">Failover active:</span> Auto-switch on service failure
          </p>
        </div>
      </div>
    </Card>
  );
}

// =============================================
// MAIN COMPONENT
// =============================================
export function MonitoringPage() {
  const { services, loading, refetch } = useServices();

  const onlineCount = services.filter(s => s.status === 'ONLINE').length;
  const degradedCount = services.filter(s => s.status === 'DEGRADED').length;
  const offlineCount = services.filter(s => s.status === 'OFFLINE').length;
  const avgResponse = Math.round(services.reduce((a, s) => a + s.responseTime, 0) / services.length);

  return (
    <div className="space-y-6">
      {/* Summary Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Online', value: onlineCount, icon: <CheckCircle2 size={18} />, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
          { label: 'Degraded', value: degradedCount, icon: <AlertTriangle size={18} />, color: 'text-amber-600 bg-amber-50 border-amber-200' },
          { label: 'Offline', value: offlineCount, icon: <WifiOff size={18} />, color: 'text-red-600 bg-red-50 border-red-200' },
          { label: 'Avg Response', value: `${avgResponse}ms`, icon: <Zap size={18} />, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
        ].map((item) => (
          <div key={item.label} className={`flex items-center gap-3 p-4 rounded-2xl border ${item.color}`}>
            <span>{item.icon}</span>
            <div>
              <p className="text-xl font-bold">{item.value}</p>
              <p className="text-xs font-medium opacity-70">{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-slate-700">Microservices Health</h2>
          <Badge variant="info">{services.length} services</Badge>
        </div>
        <Button
          variant="secondary"
          size="sm"
          icon={<RefreshCw size={13} className={loading ? 'animate-spin' : ''} />}
          onClick={refetch}
          loading={loading}
        >
          Refresh
        </Button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {services.map((service) => (
          <ServiceCard key={service.name} service={service} />
        ))}
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <LoadBalancerViz />

        {/* Architecture Overview */}
        <Card padding="md">
          <CardHeader
            title="Architecture Overview"
            subtitle="Microservices topology"
            icon={<Server size={16} />}
          />
          <div className="space-y-3">
            {[
              { layer: 'Gateway Layer', items: ['API Gateway :8080'], color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
              { layer: 'Service Layer', items: ['User :3000', 'Menu :3002', 'Order-1 :3001', 'Order-2 :3005', 'Payment :3003', 'Monitoring :3004'], color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
              { layer: 'Data Layer', items: ['PostgreSQL Primary :5432', 'PostgreSQL Replica :5433'], color: 'bg-violet-100 text-violet-700 border-violet-200' },
            ].map((layer) => (
              <div key={layer.layer} className="space-y-1.5">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{layer.layer}</p>
                <div className="flex flex-wrap gap-1.5">
                  {layer.items.map((item) => (
                    <span key={item} className={`text-xs px-2.5 py-1 rounded-lg border font-medium ${layer.color}`}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-xs font-semibold text-slate-600 mb-1.5">Load Balancing Strategy</p>
            <div className="space-y-1">
              <p className="text-xs text-slate-500">• <span className="font-medium text-slate-700">Algorithm:</span> Round-Robin</p>
              <p className="text-xs text-slate-500">• <span className="font-medium text-slate-700">Failover:</span> Auto-switch on failure</p>
              <p className="text-xs text-slate-500">• <span className="font-medium text-slate-700">DB Replication:</span> Primary → Replica streaming</p>
              <p className="text-xs text-slate-500">• <span className="font-medium text-slate-700">DB Failover:</span> Auto-promote replica</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
