import { type ReactNode } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { StatCard } from '../components/ui/StatCard';
import { Card, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useStats } from '../hooks/useStats';
import { useOrders } from '../hooks/useOrders';
import { useServices } from '../hooks/useServices';
import {
  ShoppingCart, TrendingUp, Activity, Users,
  Package, AlertTriangle, CheckCircle2, XCircle
} from 'lucide-react';

// =============================================
// REVENUE CHART DATA (Generated mock)
// =============================================
const generateChartData = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
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
// RECENT ACTIVITY ITEM
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
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

// =============================================
// COMPONENT
// =============================================
export function DashboardPage() {
  const { stats, loading } = useStats();
  const { orders } = useOrders();
  const { services } = useServices();

  const onlineCount = services.filter(s => s.status === 'ONLINE').length;
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Orders"
          value={loading ? '—' : stats.total_orders.toLocaleString('id-ID')}
          subtitle="All time orders"
          icon={<ShoppingCart size={20} />}
          color="indigo"
          trend={{ value: 12.4, label: 'vs last week' }}
          loading={loading}
        />
        <StatCard
          title="Total Revenue"
          value={loading ? '—' : `Rp ${(stats.total_revenue / 1000000).toFixed(1)}M`}
          subtitle={`${stats.total_payments} payments`}
          icon={<TrendingUp size={20} />}
          color="emerald"
          trend={{ value: 8.7, label: 'vs last week' }}
          loading={loading}
        />
        <StatCard
          title="Active Services"
          value={`${onlineCount} / ${services.length}`}
          subtitle="Microservices online"
          icon={<Activity size={20} />}
          color="sky"
          trend={{ value: onlineCount === services.length ? 0 : -1, label: 'service issues' }}
        />
        <StatCard
          title="Total Users"
          value={loading ? '—' : stats.total_users.toLocaleString('id-ID')}
          subtitle="Registered customers"
          icon={<Users size={20} />}
          color="violet"
          trend={{ value: 5.2, label: 'vs last week' }}
          loading={loading}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Revenue Chart */}
        <Card className="xl:col-span-2" padding="md">
          <CardHeader
            title="Revenue & Orders"
            subtitle="Last 7 days performance"
            action={
              <Badge variant="info" dot>Live</Badge>
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

        {/* Service Status Quick View */}
        <Card padding="md">
          <CardHeader
            title="Service Status"
            subtitle="Microservice health"
            action={<Badge variant="success" dot>All checked</Badge>}
          />
          <div className="space-y-2">
            {services.map((svc) => (
              <div key={svc.name} className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                <span className="text-base flex-shrink-0">{svc.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-800 truncate">{svc.name}</p>
                  <p className="text-[10px] text-slate-400">{svc.responseTime}ms</p>
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
        {/* Recent Orders */}
        <Card className="xl:col-span-2" padding="md">
          <CardHeader
            title="Recent Orders"
            subtitle="Latest customer transactions"
            icon={<ShoppingCart size={16} />}
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
                  <p className="text-sm font-semibold text-slate-800">Rp {order.total_price.toLocaleString('id-ID')}</p>
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

        {/* Quick Stats */}
        <Card padding="md">
          <CardHeader title="Quick Stats" subtitle="Today's summary" />
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-indigo-50">
              <div className="flex items-center gap-2">
                <Package size={16} className="text-indigo-600" />
                <span className="text-sm text-slate-700">Menu Items</span>
              </div>
              <span className="text-sm font-bold text-indigo-700">{stats.total_menu}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50">
              <div className="flex items-center gap-2">
                <AlertTriangle size={16} className="text-amber-600" />
                <span className="text-sm text-slate-700">Low Stock</span>
              </div>
              <span className="text-sm font-bold text-amber-700">{stats.low_stock_items} items</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50">
              <div className="flex items-center gap-2">
                <Activity size={16} className="text-emerald-600" />
                <span className="text-sm text-slate-700">DB Status</span>
              </div>
              <Badge variant="success" dot>{stats.database_role}</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-slate-600" />
                <span className="text-sm text-slate-700">Uptime</span>
              </div>
              <span className="text-sm font-bold text-slate-700">
                {Math.floor(stats.uptime / 3600)}h {Math.floor((stats.uptime % 3600) / 60)}m
              </span>
            </div>

            {/* Activity Feed */}
            <div className="border-t border-slate-100 pt-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Recent Activity</p>
              <div className="divide-y divide-slate-100">
                <ActivityItem
                  icon={<ShoppingCart size={12} className="text-indigo-600" />}
                  iconBg="bg-indigo-50"
                  title="New order placed"
                  subtitle="Nasi Goreng × 2"
                  time={timeAgo(orders[0]?.created_at || new Date().toISOString())}
                />
                <ActivityItem
                  icon={<TrendingUp size={12} className="text-emerald-600" />}
                  iconBg="bg-emerald-50"
                  title="Payment received"
                  subtitle="TRX-1716834521"
                  time="5m ago"
                />
                <ActivityItem
                  icon={<AlertTriangle size={12} className="text-amber-600" />}
                  iconBg="bg-amber-50"
                  title="Low stock alert"
                  subtitle="Bakso Urat (2 left)"
                  time="12m ago"
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
