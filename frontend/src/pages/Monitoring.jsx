import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Database,
  Server,
  Users,
  ShoppingBag,
  CreditCard,
  UtensilsCrossed,
  AlertTriangle,
  RefreshCw,
  Shield,
  CheckCircle,
  XCircle,
  TrendingUp,
  Wifi,
  WifiOff,
  BarChart2,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  getStats,
  getOrders,
  getPayments,
  getLogs,
  getDbStatus,
  formatRupiah,
} from '../api/api';
import StatsCard from '../components/StatsCard';
import MonitoringCard from '../components/MonitoringCard';
import { useToast } from '../components/Toast';

/* =========================================================
   DEMO DATA
   ========================================================= */
const demoStats = {
  total_users: 248,
  total_menu: 34,
  total_orders: 1847,
  total_payments: 1623,
  total_revenue: 89540000,
  low_stock_items: 4,
};

const demoOrders = Array.from({ length: 8 }, (_, i) => ({
  id: 1847 - i,
  user_id: Math.floor(Math.random() * 50) + 1,
  total: Math.floor(Math.random() * 150000) + 25000,
  status: ['pending', 'processing', 'completed'][Math.floor(Math.random() * 3)],
  created_at: new Date(Date.now() - i * 3600000).toISOString(),
}));

const demoPayments = Array.from({ length: 6 }, (_, i) => ({
  id: 1623 - i,
  order_id: 1847 - i,
  amount: Math.floor(Math.random() * 150000) + 25000,
  payment_method: ['qris', 'cash', 'debit'][Math.floor(Math.random() * 3)],
  status: 'success',
  created_at: new Date(Date.now() - i * 3600000).toISOString(),
}));

const demoLogs = [
  {
    id: 1,
    level: 'info',
    message: 'API Gateway healthy',
    timestamp: new Date().toISOString(),
  },
];

const chartData = Array.from({ length: 7 }, (_, i) => ({
  day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
  orders: Math.floor(Math.random() * 100) + 150,
  payments: Math.floor(Math.random() * 90) + 120,
}));

/* =========================================================
   STATUS COLORS
   ========================================================= */
const statusColors = {
  completed: 'badge-online',
  success: 'badge-online',
  processing: 'badge-warning',
  pending: 'badge-warning',
  failed: 'badge-offline',
};

const logColors = {
  info: 'text-blue-400',
  success: 'text-emerald-400',
  warning: 'text-amber-400',
  error: 'text-red-400',
};

/* =========================================================
   TIME AGO
   ========================================================= */
function TimeAgo({ date }) {
  if (!date) return 'unknown';
  const secs = Math.floor((Date.now() - new Date(date)) / 1000);
  if (secs < 60) return `${secs}s ago`;
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  return `${Math.floor(secs / 86400)}d ago`;
}

/* =========================================================
   TOOLTIP
   ========================================================= */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-dark border border-white/10 rounded-xl p-3 text-xs shadow-xl">
      <p className="text-white/60 mb-2 font-semibold">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="font-medium">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

/* =========================================================
   COMPONENT
   ========================================================= */
export default function Monitoring() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(demoStats);
  const [orders, setOrders] = useState(demoOrders);
  const [payments, setPayments] = useState(demoPayments);
  const [logs, setLogs] = useState(demoLogs);
  const [dbStatus, setDbStatus] = useState({
    primary: { host: '10.95.249.151', port: 5432, status: 'online', role: 'primary' },
    replica: { host: '10.95.249.152', port: 5433, status: 'online', role: 'standby' },
    replication: { status: 'healthy', lag: '0ms' },
    failover: { enabled: true },
  });

  /* =========================================================
     FETCH DATA
     ========================================================= */
  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const results = await Promise.allSettled([
        getStats(),
        getOrders(),
        getPayments(),
        getLogs(),
        getDbStatus(),
      ]);

      const [statsRes, ordersRes, paymentsRes, logsRes, dbRes] = results;

      /* STATS */
      if (statsRes.status === 'fulfilled') {
        setStats(statsRes.value?.data || demoStats);
      }

      /* ORDERS */
      if (ordersRes.status === 'fulfilled') {
        const orderData = ordersRes.value?.data;
        setOrders(
          Array.isArray(orderData) ? orderData : orderData?.data || demoOrders
        );
      }

      /* PAYMENTS */
      if (paymentsRes.status === 'fulfilled') {
        const paymentData = paymentsRes.value?.data;
        setPayments(
          Array.isArray(paymentData) ? paymentData : paymentData?.data || demoPayments
        );
      }

      /* LOGS */
      if (logsRes.status === 'fulfilled') {
        const logData = logsRes.value?.data;
        const mappedLogs = Array.isArray(logData)
          ? logData.map((log) => ({
              id: log.id,
              level: log.log_level || log.level || 'info',
              message: log.message,
              timestamp: log.created_at || log.timestamp,
            }))
          : demoLogs;
        setLogs(mappedLogs);
      }

      /* DB STATUS */
      if (dbRes.status === 'fulfilled') {
        setDbStatus((prev) => dbRes.value?.data || prev);
      }

      setLastRefresh(new Date());
    } catch (err) {
      console.error('fetchAll error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /* =========================================================
     AUTO REFRESH
     ========================================================= */
  useEffect(() => {
    fetchAll();
    const interval = setInterval(() => {
      fetchAll();
    }, 5000);
    return () => clearInterval(interval);
  }, [fetchAll]);

  /* =========================================================
     SERVICES
     ========================================================= */
  const services = [
    {
      service: 'PostgreSQL Primary',
      detail: `${dbStatus.primary.host}:${dbStatus.primary.port}`,
      latency: '2ms',
      status: dbStatus.primary.status,
    },
    {
      service: 'PostgreSQL Replica',
      detail: `${dbStatus.replica.host}:${dbStatus.replica.port}`,
      latency: '3ms',
      status: dbStatus.replica.status,
    },
    {
      service: 'Streaming Replication',
      detail: `Lag ${dbStatus.replication.lag}`,
      latency: '1ms',
      status: dbStatus.replication.status === 'healthy' ? 'online' : 'offline',
    },
    {
      service: 'Auto Failover',
      detail: 'Patroni enabled',
      latency: '—',
      status: dbStatus.failover.enabled ? 'online' : 'offline',
    },
  ];

  /* =========================================================
     TABS
     ========================================================= */
  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart2 },
    { id: 'services', label: 'Services', icon: Server },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'logs', label: 'Logs', icon: Activity },
  ];

  return (
    <div className="gradient-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-emerald-400 uppercase tracking-wider">
                Live Monitoring
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              System Monitoring
            </h1>
            <p className="text-white/40 text-sm mt-1">
              Last refresh: {lastRefresh.toLocaleTimeString()}
            </p>
          </div>
          <button
            onClick={fetchAll}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl btn-secondary text-sm font-semibold disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </motion.div>

        {/* STATS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <StatsCard icon={Users} label="Users" value={stats.total_users || 0} variant="purple" />
          <StatsCard icon={UtensilsCrossed} label="Menu" value={stats.total_menu || 0} variant="blue" />
          <StatsCard icon={ShoppingBag} label="Orders" value={stats.total_orders || 0} variant="cyan" />
          <StatsCard icon={CreditCard} label="Payments" value={stats.total_payments || 0} variant="emerald" />
          <StatsCard icon={TrendingUp} label="Revenue" value={stats.total_revenue ? `${(stats.total_revenue / 1000000).toFixed(1)}M` : '0'} variant="amber" />
          <StatsCard icon={AlertTriangle} label="Low Stock" value={stats.low_stock_items || 0} variant="rose" />
        </div>

        {/* TABS */}
        <div className="flex gap-1 glass rounded-2xl p-1 border border-white/5 mb-6 overflow-x-auto">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === id
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* OVERVIEW */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* CHART */}
              <div className="glass rounded-2xl border border-white/5 p-5">
                <h3 className="text-sm font-bold text-white mb-4">Weekly Orders</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="day" tick={{ fill: 'rgba(255,255,255,0.3)' }} />
                    <YAxis tick={{ fill: 'rgba(255,255,255,0.3)' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="orders"
                      stroke="#7c3aed"
                      fillOpacity={1}
                      fill="url(#colorOrders)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* DB STATUS */}
              <div className="glass rounded-2xl border border-white/5 p-5">
                <div className="flex items-center gap-2 mb-5">
                  <Database className="w-5 h-5 text-blue-400" />
                  <h3 className="text-white font-bold">PostgreSQL HA Status</h3>
                </div>
                <div className="space-y-4">
                  {/* PRIMARY */}
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <div className="flex items-center gap-3">
                      {dbStatus.primary.status === 'online' ? (
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400" />
                      )}
                      <div>
                        <p className="text-white font-medium">Primary Database</p>
                        <p className="text-xs text-white/30">
                          {dbStatus.primary.host}:{dbStatus.primary.port}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-400 uppercase">
                      {dbStatus.primary.role}
                    </span>
                  </div>
                  {/* REPLICA */}
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <div className="flex items-center gap-3">
                      {dbStatus.replica.status === 'online' ? (
                        <CheckCircle className="w-5 h-5 text-cyan-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400" />
                      )}
                      <div>
                        <p className="text-white font-medium">Replica Database</p>
                        <p className="text-xs text-white/30">
                          {dbStatus.replica.host}:{dbStatus.replica.port}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-cyan-400 uppercase">
                      {dbStatus.replica.role}
                    </span>
                  </div>
                  {/* REPLICATION */}
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <div className="flex items-center gap-3">
                      {dbStatus.replication.status === 'healthy' ? (
                        <Wifi className="w-5 h-5 text-blue-400" />
                      ) : (
                        <WifiOff className="w-5 h-5 text-red-400" />
                      )}
                      <div>
                        <p className="text-white font-medium">Streaming Replication</p>
                        <p className="text-xs text-white/30">WAL Lag: {dbStatus.replication.lag}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-blue-400 uppercase">
                      {dbStatus.replication.status}
                    </span>
                  </div>
                  {/* FAILOVER */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-purple-400" />
                      <div>
                        <p className="text-white font-medium">Auto Failover</p>
                        <p className="text-xs text-white/30">Patroni enabled</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-purple-400 uppercase">
                      {dbStatus.failover.enabled ? 'enabled' : 'disabled'}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* SERVICES */}
          {activeTab === 'services' && (
            <motion.div
              key="services"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {services.map((s, i) => (
                <MonitoringCard key={i} {...s} delay={i * 0.05} />
              ))}
            </motion.div>
          )}

          {/* ORDERS */}
          {activeTab === 'orders' && (
            <motion.div
              key="orders"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="glass rounded-2xl border border-white/5 overflow-hidden"
            >
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left p-4 text-white/40">Order</th>
                    <th className="text-left p-4 text-white/40">Total</th>
                    <th className="text-left p-4 text-white/40">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-white/5">
                      <td className="p-4 text-white">#{order.id}</td>
                      <td className="p-4 text-white">{formatRupiah(order.total)}</td>
                      <td className="p-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${statusColors[order.status]}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}

          {/* PAYMENTS */}
          {activeTab === 'payments' && (
            <motion.div
              key="payments"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="glass rounded-2xl border border-white/5 overflow-hidden"
            >
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left p-4 text-white/40">Payment</th>
                    <th className="text-left p-4 text-white/40">Amount</th>
                    <th className="text-left p-4 text-white/40">Method</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((pay) => (
                    <tr key={pay.id} className="border-b border-white/5">
                      <td className="p-4 text-white">#{pay.id}</td>
                      <td className="p-4 text-white">{formatRupiah(pay.amount)}</td>
                      <td className="p-4 text-white/60 uppercase">{pay.payment_method}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}

          {/* LOGS */}
          {activeTab === 'logs' && (
            <motion.div
              key="logs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="glass rounded-2xl border border-white/5 p-4 space-y-2"
            >
              {logs.map((log, i) => (
                <div key={log.id || i} className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-2 text-xs mb-1">
                    <span className="text-white/30">
                      <TimeAgo date={log.timestamp} />
                    </span>
                    <span className={`uppercase font-bold ${logColors[log.level]}`}>
                      [{log.level}]
                    </span>
                  </div>
                  <p className="text-sm text-white/70">{log.message}</p>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}