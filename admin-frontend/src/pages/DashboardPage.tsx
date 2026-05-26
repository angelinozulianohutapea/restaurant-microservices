import { type ReactNode } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { StatCard } from '../components/ui/StatCard';
import { Card, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useStats } from '../hooks/useStats';
import { useOrders } from '../hooks/useOrders';
import { useServices } from '../hooks/useServices';
import { useLogs } from '../hooks/useLogs';
import {
  ShoppingCart, TrendingUp, Activity, Users,
  Package, AlertTriangle, CheckCircle2, XCircle,
  Database, Wifi, RefreshCw
} from 'lucide-react';

// =============================================
// REVENUE CHART DATA (Generated mock)
// =============================================
const generateChartData = () => {
  const days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
  return days.map((day, i) => ({
    day,
    revenue: Math.floor(1200000 + Math.random() * 800000 + i * 200000),
    orders: Math.floor(80 + Math.random() * 60 + i * 10),
  }));
};

const chartData = generateChartData();

const formatRupiah = (val: number) => {
  if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
  if (val >= 1000) return `${(val / 1000).toFixed(0)}K`;
  return val.toString();
};

// =============================================
// CUSTOM TOOLTIP
// =============================================
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-slate-900 text-white rounded-xl p-3 shadow-xl text-xs">
        <p className="font-semibold mb-1">{label}</p>
        <p className="text-indigo-300">Revenue: Rp {payload[0]?.value?.toLocaleString('id-ID')}</p>
        <p className="text-emerald-300">Orders: {payload[1]?.value}</p>
      </div>
    );
  }
  return null;
};

// =============================================
// ACTIVITY ITEM
// =============================================
interface ActivityItemProps {
  icon: ReactNode;
  iconBg: string;
  title: string;
  subtitle: string;
  time: string;
}

function ActivityItem({ icon, iconBg, title, subtitle, time }: ActivityItemProps) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-800 truncate">{title}</p>
        <p className="text-xs text-slate-500 truncate">{subtitle}</p>
      </div>
      <span className="text-xs text-slate-400 flex-shrink-0">{time}</span>
    </div>
  );
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'baru saja';
  if (m < 60) return `${m}m lalu`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}j lalu`;
  return `${Math.floor(h / 24)}h lalu`;
}

// Log level badge color
function logLevelColor(level: string) {
  switch (level) {
    case 'ERROR': return 'text-red-600 bg-red-50';
    case 'WARN': return 'text-amber-600 bg-amber-50';
    default: return 'text-emerald-600 bg-emerald-50';
  }
}

// =============================================
// MOCK INDICATOR
// =============================================
function MockBadge({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
      <RefreshCw size={8} />
      Demo
    </span>
  );
}

// =============================================
// COMPONENT
// =============================================
export function DashboardPage() {
  const { stats, loading, usingMock: statsMock } = useStats();
  const { orders, usingMock: ordersMock } = useOrders();
  const { services } = useServices();
  const { logs } = useLogs();

  const onlineCount = services.filter(s => s.status === 'ONLINE').length;
  const degradedCount = services.filter(s => s.status === 'DEGRADED').length;
  const recentOrders = orders.slice(0, 5);

  // Recent logs for activity feed (top 3)
  const recentLogs = logs.slice(0, 3);

  return (
    <div className="space-y-6">

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Orders"
          value={loading ? '—' : stats.total_orders.toLocaleString('id-ID')}
          subtitle={`${stats.total_payments} pembayaran`}
          icon={<ShoppingCart size={20} />}
          color="indigo"
          trend={{ value: 12.4, label: 'vs minggu lalu' }}
          loading={loading}
        />
        <StatCard
          title="Total Revenue"
          value={loading ? '—' : `Rp ${(stats.total_revenue / 1000000).toFixed(1)}M`}
          subtitle="Pendapatan terkumpul"
          icon={<TrendingUp size={20} />}
          color="emerald"
          trend={{ value: 8.7, label: 'vs minggu lalu' }}
          loading={loading}
        />
        <StatCard
          title="Active Services"
          value={`${onlineCount} / ${services.length}`}
          subtitle={degradedCount > 0 ? `${degradedCount} degraded` : 'Semua microservice online'}
          icon={<Activity size={20} />}
          color="sky"
          trend={{ value: degradedCount > 0 ? -degradedCount : 0, label: 'service issues' }}
        />
        <StatCard
          title="Total Users"
          value={loading ? '—' : stats.total_users.toLocaleString('id-ID')}
          subtitle="Pelanggan terdaftar"
          icon={<Users size={20} />}
          color="violet"
          trend={{ value: 5.2, label: 'vs minggu lalu' }}
          loading={loading}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* Revenue Chart */}
        <Card className="xl:col-span-2" padding="md">
          <CardHeader
            title="Revenue & Orders"
            subtitle="Performa 7 hari terakhir"
            action={
              <div className="flex items-center gap-2">
                <MockBadge show={statsMock} />
                <Badge variant="info" dot>Live</Badge>
              </div>
            }
          />
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={formatRupiah} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2.5} fill="url(#colorRevenue)" dot={false} />
                <Area type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={2.5} fill="url(#colorOrders)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-indigo-500" />
              <span className="text-xs text-slate-500">Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-xs text-slate-500">Orders</span>
            </div>
          </div>
        </Card>

        {/* Service Status — 7 microservices dari useServices */}
        <Card padding="md">
          <CardHeader
            title="Service Status"
            subtitle="Health microservices"
            action={
              <Badge variant={onlineCount === services.length ? 'success' : 'warning'} dot>
                {onlineCount === services.length ? 'All online' : `${degradedCount} issue`}
              </Badge>
            }
          />
          <div className="space-y-1.5">
            {services.map((svc) => (
              <div key={svc.name} className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                <span className="text-base flex-shrink-0">{svc.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-800 truncate">{svc.name}</p>
                  <p className="text-[10px] text-slate-400">:{svc.port} · {svc.responseTime}ms</p>
                </div>
                {svc.status === 'ONLINE' ? (
                  <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
                ) : svc.status === 'DEGRADED' ? (
                  <AlertTriangle size={14} className="text-amber-500 flex-shrink-0" />
                ) : (
                  <XCircle size={14} className="text-red-500 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* Recent Orders — dari useOrders() */}
        <Card className="xl:col-span-2" padding="md">
          <CardHeader
            title="Recent Orders"
            subtitle="Transaksi pelanggan terbaru"
            icon={<ShoppingCart size={16} />}
            action={<MockBadge show={ordersMock} />}
          />
          <div className="divide-y divide-slate-100">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center gap-4 py-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-indigo-600">#{order.id}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{order.full_name}</p>
                  <p className="text-xs text-slate-500 truncate">{order.menu_name} × {order.quantity}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold text-slate-800">
                    Rp {order.total_price.toLocaleString('id-ID')}
                  </p>
                  <Badge
                    variant={order.payment_status === 'paid' ? 'success' : 'warning'}
                    size="sm"
                  >
                    {order.payment_status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Stats + Live Logs */}
        <Card padding="md">
          <CardHeader title="Quick Stats" subtitle="Ringkasan sistem" />
          <div className="space-y-3">

            {/* Menu Items */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-indigo-50">
              <div className="flex items-center gap-2">
                <Package size={16} className="text-indigo-600" />
                <span className="text-sm text-slate-700">Menu Items</span>
              </div>
              <span className="text-sm font-bold text-indigo-700">{stats.total_menu}</span>
            </div>

            {/* Low Stock */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50">
              <div className="flex items-center gap-2">
                <AlertTriangle size={16} className="text-amber-600" />
                <span className="text-sm text-slate-700">Low Stock</span>
              </div>
              <span className="text-sm font-bold text-amber-700">{stats.low_stock_items} item</span>
            </div>

            {/* Database Status — dari stats.database_role & replication_status */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50">
              <div className="flex items-center gap-2">
                <Database size={16} className="text-emerald-600" />
                <span className="text-sm text-slate-700">DB Role</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Badge variant="success" dot>{stats.database_role}</Badge>
              </div>
            </div>

            {/* Replication Status */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-sky-50">
              <div className="flex items-center gap-2">
                <Wifi size={16} className="text-sky-600" />
                <span className="text-sm text-slate-700">Replication</span>
              </div>
              <Badge
                variant={stats.replication_status === 'STREAMING' ? 'success' : 'warning'}
                size="sm"
              >
                {stats.replication_status}
              </Badge>
            </div>

            {/* Uptime */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
              <div className="flex items-center gap-2">
                <Activity size={16} className="text-slate-600" />
                <span className="text-sm text-slate-700">Uptime</span>
              </div>
              <span className="text-sm font-bold text-slate-700">
                {Math.floor(stats.uptime / 3600)}j {Math.floor((stats.uptime % 3600) / 60)}m
              </span>
            </div>

            {/* Live Log Feed — dari useLogs() */}
            <div className="border-t border-slate-100 pt-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Live Logs
              </p>
              <div className="divide-y divide-slate-100">
                {recentLogs.map((log) => (
                  <ActivityItem
                    key={log.id}
                    icon={
                      <span className={`text-[9px] font-bold px-1 rounded ${logLevelColor(log.log_level)}`}>
                        {log.log_level[0]}
                      </span>
                    }
                    iconBg={
                      log.log_level === 'ERROR' ? 'bg-red-50' :
                      log.log_level === 'WARN' ? 'bg-amber-50' : 'bg-emerald-50'
                    }
                    title={log.service_name}
                    subtitle={log.message}
                    time={timeAgo(log.created_at)}
                  />
                ))}
              </div>
            </div>

          </div>
        </Card>
      </div>
    </div>
  );
}