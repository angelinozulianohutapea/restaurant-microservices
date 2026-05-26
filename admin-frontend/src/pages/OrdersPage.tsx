import { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useOrders } from '../hooks/useOrders';
import { useStats } from '../hooks/useStats';
import { Search, RefreshCw, Filter, ShoppingCart, TrendingUp, Clock, CheckCircle2 } from 'lucide-react';

const statusVariant = (status: string): 'success' | 'warning' | 'neutral' => {
  if (status === 'completed' || status === 'paid') return 'success';
  if (status === 'created' || status === 'unpaid') return 'warning';
  return 'neutral';
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function OrdersPage() {
  const { orders, loading, refetch } = useOrders();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'paid' | 'unpaid'>('all');

  const filtered = orders.filter(o => {
    const matchSearch = !search ||
      o.full_name.toLowerCase().includes(search.toLowerCase()) ||
      o.menu_name.toLowerCase().includes(search.toLowerCase()) ||
      String(o.id).includes(search);
    const matchStatus = filterStatus === 'all' || o.payment_status === filterStatus;
    return matchSearch && matchStatus;
  });

  const { stats } = useStats();
  const totalRevenue = stats.total_revenue;
  const unpaidCount = orders.filter(o => o.payment_status === 'unpaid').length;
  const paidCount = orders.filter(o => o.payment_status === 'paid').length;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Orders', value: orders.length, icon: <ShoppingCart size={18} />, color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
          { label: 'Paid', value: paidCount, icon: <CheckCircle2 size={18} />, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
          { label: 'Pending', value: unpaidCount, icon: <Clock size={18} />, color: 'bg-amber-50 text-amber-700 border-amber-200' },
          { label: 'Revenue', value: `Rp ${(totalRevenue / 1000000).toFixed(2)}M`, icon: <TrendingUp size={18} />, color: 'bg-violet-50 text-violet-700 border-violet-200' },
        ].map(item => (
          <div key={item.label} className={`flex items-center gap-3 p-4 rounded-2xl border ${item.color}`}>
            {item.icon}
            <div>
              <p className="text-lg font-bold leading-tight">{item.value}</p>
              <p className="text-xs font-medium opacity-70">{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <Card padding="none">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 border-b border-slate-100">
          <div className="flex-1 relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, menu, or order ID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
              {(['all', 'paid', 'unpaid'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilterStatus(f)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    filterStatus === f
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
            <Button
              variant="secondary"
              size="sm"
              icon={<RefreshCw size={13} className={loading ? 'animate-spin' : ''} />}
              onClick={refetch}
            >
              Refresh
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['Order ID', 'Customer', 'Menu', 'Qty', 'Total', 'Order Status', 'Payment', 'Time'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-sm text-slate-400">
                    No orders found
                  </td>
                </tr>
              ) : (
                filtered.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-4 py-3.5">
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
                        #{order.id}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center flex-shrink-0">
                          <span className="text-[10px] font-bold text-white">
                            {order.full_name.charAt(0)}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-slate-800 whitespace-nowrap">{order.full_name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm text-slate-700 whitespace-nowrap">{order.menu_name}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded-lg">
                        ×{order.quantity}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm font-semibold text-slate-800 whitespace-nowrap">
                        Rp {order.total_price.toLocaleString('id-ID')}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge variant={statusVariant(order.order_status)}>
                        {order.order_status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge variant={statusVariant(order.payment_status)} dot>
                        {order.payment_status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs text-slate-400 whitespace-nowrap">{timeAgo(order.created_at)}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50/60">
          <p className="text-xs text-slate-500">
            Showing <span className="font-semibold text-slate-700">{filtered.length}</span> of <span className="font-semibold text-slate-700">{orders.length}</span> orders
          </p>
          <div className="flex items-center gap-1">
            <Filter size={12} className="text-slate-400" />
            <span className="text-xs text-slate-400">Filter: {filterStatus}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
