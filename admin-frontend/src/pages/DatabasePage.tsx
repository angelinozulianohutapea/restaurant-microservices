import { useState, useEffect } from 'react';
import { Card, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Database, Activity, Server, RefreshCw, GitBranch, Zap, HardDrive, Users } from 'lucide-react';
import { useStats } from '../hooks/useStats';

// =============================================
// MOCK DB STATUS
// =============================================
interface DBNodeStatus {
  role: string;
  host: string;
  port: number;
  status: 'ONLINE' | 'OFFLINE';
  connections: number;
  maxConnections: number;
  replicationLag: string;
  walLsn: string;
  size: string;
  uptime: string;
}

function useMockDBStatus() {
  const [primary, setPrimary] = useState<DBNodeStatus>({
    role: 'PRIMARY',
    host: '10.95.249.151',
    port: 5432,
    status: 'ONLINE',
    connections: 12,
    maxConnections: 100,
    replicationLag: '0ms',
    walLsn: '0/15D6A28',
    size: '184 MB',
    uptime: '4d 13h 22m',
  });

  const [replica, setReplica] = useState<DBNodeStatus>({
    role: 'REPLICA',
    host: '10.95.249.151',
    port: 5433,
    status: 'ONLINE',
    connections: 4,
    maxConnections: 100,
    replicationLag: '12ms',
    walLsn: '0/15D6A10',
    size: '184 MB',
    uptime: '4d 13h 18m',
  });

  // Simulate live updates
  useEffect(() => {
    const id = setInterval(() => {
      setPrimary(p => ({
        ...p,
        connections: Math.max(8, Math.min(25, p.connections + Math.floor(Math.random() * 3) - 1)),
        replicationLag: '0ms',
      }));
      setReplica(r => ({
        ...r,
        connections: Math.max(2, Math.min(12, r.connections + Math.floor(Math.random() * 3) - 1)),
        replicationLag: `${Math.floor(Math.random() * 30) + 5}ms`,
      }));
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return { primary, replica };
}

// =============================================
// METRIC ROW
// =============================================
function MetricRow({ label, value, icon }: { label: string; value: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
      <div className="flex items-center gap-2">
        {icon && <span className="text-slate-400">{icon}</span>}
        <span className="text-xs text-slate-500">{label}</span>
      </div>
      <span className="text-xs font-semibold text-slate-800">{value}</span>
    </div>
  );
}

// =============================================
// CONNECTION METER
// =============================================
function ConnectionMeter({ used, max }: { used: number; max: number }) {
  const pct = Math.round((used / max) * 100);
  const color = pct > 80 ? 'bg-red-500' : pct > 60 ? 'bg-amber-500' : 'bg-emerald-500';
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500">Active Connections</span>
        <span className="text-xs font-semibold text-slate-700">{used} / {max}</span>
      </div>
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-[10px] text-slate-400">{pct}% utilization</p>
    </div>
  );
}

// =============================================
// DB NODE CARD
// =============================================
function DBNodeCard({ node, isActive }: { node: DBNodeStatus; isActive: boolean }) {
  const isOnline = node.status === 'ONLINE';
  return (
    <div className={`bg-white rounded-2xl border p-5 shadow-sm ${
      isActive ? 'border-indigo-300 ring-1 ring-indigo-200' : 'border-slate-200'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
            node.role === 'PRIMARY' ? 'bg-indigo-50' : 'bg-violet-50'
          }`}>
            <Database size={20} className={node.role === 'PRIMARY' ? 'text-indigo-600' : 'text-violet-600'} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-sm">{node.role}</h3>
              {isActive && (
                <span className="text-[9px] font-bold bg-indigo-600 text-white px-1.5 py-0.5 rounded-md">ACTIVE</span>
              )}
            </div>
            <p className="text-xs text-slate-500">{node.host}:{node.port}</p>
          </div>
        </div>
        <Badge variant={isOnline ? 'success' : 'danger'} dot>
          {node.status}
        </Badge>
      </div>

      <ConnectionMeter used={node.connections} max={node.maxConnections} />

      <div className="mt-4 space-y-0">
        <MetricRow label="Replication Lag" value={node.replicationLag} icon={<GitBranch size={12} />} />
        <MetricRow label="WAL LSN" value={<span className="font-mono text-[10px]">{node.walLsn}</span>} icon={<Activity size={12} />} />
        <MetricRow label="Database Size" value={node.size} icon={<HardDrive size={12} />} />
        <MetricRow label="Server Uptime" value={node.uptime} icon={<Zap size={12} />} />
      </div>
    </div>
  );
}

// =============================================
// REPLICATION STATUS
// =============================================
function ReplicationStatus({ primary, replica }: { primary: DBNodeStatus; replica: DBNodeStatus }) {
  const [pulse, setPulse] = useState(true);

  useEffect(() => {
    const id = setInterval(() => setPulse(p => !p), 1500);
    return () => clearInterval(id);
  }, []);

  return (
    <Card padding="md">
      <CardHeader
        title="Replication Flow"
        subtitle="Streaming WAL replication"
        icon={<GitBranch size={16} />}
      />
      <div className="flex flex-col items-center gap-4">
        {/* Primary */}
        <div className="w-full flex items-center gap-3 p-3.5 bg-indigo-50 border border-indigo-200 rounded-xl">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
            <Database size={16} className="text-indigo-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-indigo-800">Primary</p>
            <p className="text-xs text-indigo-500">{primary.host}:{primary.port}</p>
          </div>
          <Badge variant="success" dot>WRITE</Badge>
        </div>

        {/* Arrow */}
        <div className="flex flex-col items-center gap-1">
          <div className={`w-0.5 h-4 bg-gradient-to-b from-indigo-400 to-violet-400 transition-opacity ${pulse ? 'opacity-100' : 'opacity-30'}`} />
          <span className="text-[10px] font-bold bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">STREAMING</span>
          <div className={`w-0.5 h-4 bg-gradient-to-b from-violet-400 to-indigo-400 transition-opacity ${!pulse ? 'opacity-100' : 'opacity-30'}`} />
        </div>

        {/* Replica */}
        <div className="w-full flex items-center gap-3 p-3.5 bg-violet-50 border border-violet-200 rounded-xl">
          <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
            <Database size={16} className="text-violet-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-violet-800">Replica</p>
            <p className="text-xs text-violet-500">{replica.host}:{replica.port}</p>
          </div>
          <Badge variant="info" dot>READ</Badge>
        </div>

        {/* Stats */}
        <div className="w-full grid grid-cols-2 gap-2 mt-1">
          <div className="bg-slate-50 rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-slate-800">{replica.replicationLag}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Replication Lag</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-emerald-600">99.9%</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Sync Rate</p>
          </div>
        </div>
      </div>
    </Card>
  );
}

// =============================================
// TABLE STATS
// =============================================
const TABLE_STATS = [
  { name: 'users', rows: 124, size: '48 KB', indexes: 3, lastVacuum: '2h ago' },
  { name: 'menus', rows: 38, size: '32 KB', indexes: 2, lastVacuum: '2h ago' },
  { name: 'orders', rows: 1847, size: '512 KB', indexes: 4, lastVacuum: '1h ago' },
  { name: 'payments', rows: 1632, size: '384 KB', indexes: 3, lastVacuum: '1h ago' },
  { name: 'logs', rows: 8420, size: '2.1 MB', indexes: 2, lastVacuum: '30m ago' },
];

// =============================================
// MAIN COMPONENT
// =============================================
export function DatabasePage() {
  const { primary, replica } = useMockDBStatus();
  const { stats } = useStats();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  return (
    <div className="space-y-6">
      {/* Top row: Node Cards */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-slate-700">Database Cluster</h2>
          <Badge variant="success" dot>Streaming</Badge>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 transition-colors"
        >
          <RefreshCw size={12} className={refreshing ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DBNodeCard node={primary} isActive={stats.database_role === 'PRIMARY'} />
        <DBNodeCard node={replica} isActive={stats.database_role === 'REPLICA'} />
      </div>

      {/* Middle row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Replication */}
        <ReplicationStatus primary={primary} replica={replica} />

        {/* Failover Config */}
        <Card padding="md">
          <CardHeader
            title="Failover Config"
            subtitle="Auto-promotion rules"
            icon={<Server size={16} />}
          />
          <div className="space-y-3">
            {[
              { key: 'Failover Mode', value: 'Automatic', ok: true },
              { key: 'Health Check', value: 'Every 3 sec', ok: true },
              { key: 'Failover Timeout', value: '30 seconds', ok: true },
              { key: 'Max Lag Threshold', value: '100ms', ok: true },
              { key: 'Replica Promotion', value: 'Auto', ok: true },
              { key: 'Write Redirect', value: 'Auto via App', ok: true },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                <span className="text-xs text-slate-500">{item.key}</span>
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${item.ok ? 'bg-emerald-400' : 'bg-red-400'}`} />
                  <span className="text-xs font-semibold text-slate-700">{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* System Stats */}
        <Card padding="md">
          <CardHeader
            title="System Stats"
            subtitle="Live database metrics"
            icon={<Activity size={16} />}
          />
          <div className="space-y-3">
            {[
              { label: 'Total Users', value: stats.total_users, icon: <Users size={12} /> },
              { label: 'Total Menu Items', value: stats.total_menu, icon: <Database size={12} /> },
              { label: 'Total Orders', value: stats.total_orders, icon: <Database size={12} /> },
              { label: 'Total Payments', value: stats.total_payments, icon: <Database size={12} /> },
              { label: 'Low Stock Items', value: stats.low_stock_items, icon: <Zap size={12} /> },
              { label: 'DB Role', value: stats.database_role, icon: <Server size={12} /> },
            ].map(item => (
              <MetricRow
                key={item.label}
                label={item.label}
                value={typeof item.value === 'number' ? item.value.toLocaleString('id-ID') : item.value}
                icon={item.icon}
              />
            ))}
          </div>
        </Card>
      </div>

      {/* Table Stats */}
      <Card padding="none">
        <div className="p-5 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900 text-sm">Table Statistics</h3>
          <p className="text-xs text-slate-500 mt-0.5">Row counts and storage for database: <span className="font-medium text-slate-700">restoran</span></p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['Table', 'Rows', 'Size', 'Indexes', 'Last Vacuum'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {TABLE_STATS.map(row => (
                <tr key={row.name} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-mono text-sm font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">{row.name}</span>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-700">{row.rows.toLocaleString('id-ID')}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{row.size}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-lg font-medium">{row.indexes} idx</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">{row.lastVacuum}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
