import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend, AreaChart, Area,
} from 'recharts';
import { Card, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useStats } from '../hooks/useStats';
import { useMenu } from '../hooks/useMenu';
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';

// =============================================
// DATA GENERATORS (chart simulasi)
// =============================================
const generateDailyRevenue = () => {
  const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
  return days.map((day, i) => ({
    day,
    revenue: Math.floor(800000 + Math.random() * 1200000 + (i === 5 || i === 6 ? 800000 : 0)),
    orders: Math.floor(50 + Math.random() * 80 + (i === 5 || i === 6 ? 40 : 0)),
  }));
};

const generateMonthlyRevenue = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu'];
  return months.map((month, i) => ({
    month,
    revenue: Math.floor(18000000 + Math.random() * 8000000 + i * 500000),
    prev: Math.floor(15000000 + Math.random() * 6000000 + i * 400000),
  }));
};

const PAYMENT_METHODS = [
  { name: 'Transfer Bank', value: 45, color: '#6366f1' },
  { name: 'E-Wallet', value: 30, color: '#10b981' },
  { name: 'Tunai', value: 15, color: '#f59e0b' },
  { name: 'QRIS', value: 10, color: '#8b5cf6' },
];

const HOURLY_DATA = Array.from({ length: 24 }, (_, h) => ({
  hour: `${h.toString().padStart(2, '0')}:00`,
  orders: h >= 7 && h <= 22
    ? Math.floor(10 + Math.random() * 40 + (h >= 11 && h <= 14 ? 30 : 0) + (h >= 18 && h <= 21 ? 25 : 0))
    : Math.floor(Math.random() * 3),
}));

const dailyData = generateDailyRevenue();
const monthlyData = generateMonthlyRevenue();

// =============================================
// TOOLTIP
// =============================================
const RevTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-slate-900 text-white rounded-xl p-3 shadow-xl text-xs">
        <p className="font-semibold mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }}>
            {p.name === 'revenue' ? `Rp ${p.value.toLocaleString('id-ID')}` : `${p.value} orders`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// =============================================
// TREND CARD
// =============================================
function TrendCard({
  title, value, sub, up, change
}: {
  title: string;
  value: string;
  sub?: string;
  up?: boolean;
  change?: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
      <p className="text-xs text-slate-500 font-medium">{title}</p>
      <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
      {change !== undefined && up !== undefined ? (
        <div className="flex items-center gap-1.5 mt-2">
          {up ? (
            <TrendingUp size={13} className="text-emerald-500" />
          ) : (
            <TrendingDown size={13} className="text-red-500" />
          )}
          <span className={`text-xs font-semibold ${up ? 'text-emerald-600' : 'text-red-600'}`}>{change}</span>
          <span className="text-xs text-slate-400">vs last month</span>
        </div>
      ) : sub ? (
        <p className="text-xs text-slate-400 mt-2">{sub}</p>
      ) : null}
    </div>
  );
}

// =============================================
// MAIN COMPONENT
// =============================================
export function AnalyticsPage() {
  const { stats, usingMock } = useStats();
  const { menu } = useMenu();

  // Hitung avg order value dari data real
  const avgOrderValue = stats.total_orders > 0
    ? Math.round(stats.total_revenue / stats.total_orders)
    : 0;

  // Top menu berdasarkan data real (urutkan by stock terendah sebagai proxy popularitas)
  const topMenus = [...menu]
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 6)
    .map((m, i, arr) => ({
      name: m.menu_name,
      stock: m.stock,
      price: m.price,
      percent: arr[0].stock > 0 ? Math.round((1 - m.stock / (arr[arr.length - 1].stock || 1)) * 100) : 100 - i * 15,
    }));

  // Format uptime
  const formatUptime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}j ${m}m`;
  };

  return (
    <div className="space-y-6">
      {/* Demo warning */}
      {usingMock && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 text-xs text-amber-700 font-medium">
          ⚠ Backend unavailable — menampilkan data demo
        </div>
      )}

      {/* KPI Cards — data real dari backend */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <TrendCard
          title="Total Revenue"
          value={`Rp ${stats.total_revenue.toLocaleString('id-ID')}`}
          sub={`${stats.total_payments} pembayaran`}
        />
        <TrendCard
          title="Total Orders"
          value={stats.total_orders.toLocaleString('id-ID')}
          sub={`${stats.total_users} users terdaftar`}
        />
        <TrendCard
          title="Avg Order Value"
          value={`Rp ${avgOrderValue.toLocaleString('id-ID')}`}
          sub="Per transaksi"
        />
        <TrendCard
          title="Total Menu"
          value={stats.total_menu.toString()}
          sub={`${stats.low_stock_items} item stok rendah`}
        />
      </div>

      {/* DB Status Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Database Role', value: stats.database_role, ok: stats.database_role === 'PRIMARY' },
          { label: 'Replication', value: stats.replication_status, ok: stats.replication_status === 'STREAMING' },
          { label: 'Failover', value: stats.failover_status, ok: stats.failover_status === 'NORMAL' },
          { label: 'Uptime', value: formatUptime(stats.uptime), ok: true },
        ].map(item => (
          <div key={item.label} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <p className="text-xs text-slate-500 font-medium">{item.label}</p>
            <p className={`text-sm font-bold mt-1 ${item.ok ? 'text-emerald-600' : 'text-red-600'}`}>
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <Card padding="md">
        <CardHeader
          title="Weekly Revenue vs Orders"
          subtitle="Simulasi perbandingan revenue dan order mingguan"
          action={<Badge variant="warning">Simulasi</Badge>}
          icon={<BarChart3 size={16} />}
        />
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` : `${v / 1000}K`}
              />
              <Tooltip content={<RevTooltip />} />
              <Bar dataKey="revenue" name="revenue" fill="#6366f1" radius={[6, 6, 0, 0]} opacity={0.85} />
              <Bar dataKey="orders" name="orders" fill="#10b981" radius={[6, 6, 0, 0]} opacity={0.85} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-indigo-500" /><span className="text-xs text-slate-500">Revenue</span></div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-emerald-500" /><span className="text-xs text-slate-500">Orders</span></div>
        </div>
      </Card>

      {/* Middle Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2" padding="md">
          <CardHeader
            title="Monthly Revenue Trend"
            subtitle="Simulasi revenue bulanan"
            action={<Badge variant="warning">Simulasi</Badge>}
          />
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradCurrent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradPrev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`}
                />
                <Tooltip content={<RevTooltip />} />
                <Area type="monotone" dataKey="revenue" name="revenue" stroke="#6366f1" strokeWidth={2.5} fill="url(#gradCurrent)" dot={{ r: 3, fill: '#6366f1' }} />
                <Area type="monotone" dataKey="prev" name="prev" stroke="#10b981" strokeWidth={2} strokeDasharray="5 3" fill="url(#gradPrev)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card padding="md">
          <CardHeader title="Payment Methods" subtitle="Distribusi metode pembayaran" action={<Badge variant="warning">Simulasi</Badge>} />
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={PAYMENT_METHODS} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                  {PAYMENT_METHODS.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [`${v}%`, '']} />
                <Legend formatter={(v) => <span className="text-xs text-slate-600">{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Menu List — data real */}
        <Card padding="md">
          <CardHeader title="Menu Stok Terendah" subtitle="Data real dari backend" action={<Badge variant="info" dot>Live</Badge>} />
          {topMenus.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">Tidak ada data menu</p>
          ) : (
            <div className="space-y-3">
              {topMenus.map((menu, i) => (
                <div key={menu.name} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className={`text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center ${
                        i === 0 ? 'bg-red-100 text-red-700' :
                        i === 1 ? 'bg-amber-100 text-amber-700' :
                        i === 2 ? 'bg-orange-100 text-orange-700' :
                        'bg-slate-100 text-slate-500'
                      }`}>{i + 1}</span>
                      <span className="text-sm font-medium text-slate-700">{menu.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-800">{menu.stock} stok</span>
                      <span className="text-[10px] text-slate-400 ml-1.5">Rp {menu.price.toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        menu.stock <= 2 ? 'bg-red-500' :
                        menu.stock <= 5 ? 'bg-amber-500' :
                        'bg-gradient-to-r from-indigo-500 to-violet-500'
                      }`}
                      style={{ width: `${Math.min(100, menu.stock * 2)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Hourly Traffic — simulasi */}
        <Card padding="md">
          <CardHeader title="Hourly Order Traffic" subtitle="Simulasi distribusi pesanan per jam" action={<Badge variant="warning">Simulasi</Badge>} />
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={HOURLY_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="hour"
                  tick={{ fontSize: 9, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                  interval={3}
                />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 12, color: '#fff', fontSize: 12 }}
                  formatter={(v) => [`${v} orders`, 'Orders']}
                />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 4, fill: '#6366f1' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}