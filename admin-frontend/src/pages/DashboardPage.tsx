import {
  Activity,
  Users,
  ShoppingCart,
  DollarSign,
  Database,
  Server,
  AlertTriangle,
} from 'lucide-react';

import { Card, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

import { useStats } from '../hooks/useStats';
import { useOrders } from '../hooks/useOrders';
import { useServices } from '../hooks/useServices';

// =============================================
// KPI CARD
// =============================================

function KPICard({
  title,
  value,
  subtitle,
  icon,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
}) {

  return (

    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-xs text-slate-500 font-medium">
            {title}
          </p>

          <p className="text-2xl font-bold text-slate-900 mt-1">
            {value}
          </p>

          <p className="text-xs text-slate-400 mt-2">
            {subtitle}
          </p>

        </div>

        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">

          {icon}

        </div>

      </div>

    </div>
  );
}

// =============================================
// MAIN DASHBOARD
// =============================================

export function DashboardPage() {

  const { stats, loading } =
    useStats();

  const { orders } =
    useOrders();

  const { services } =
    useServices();

  // =========================================
  // ONLINE SERVICES
  // =========================================

  const onlineServices =
    services.filter(
      (s) => s.status === 'ONLINE'
    ).length;

  // =========================================
  // RECENT ORDERS
  // =========================================

  const recentOrders =
    orders.slice(0, 5);

  // =========================================
  // LOADING
  // =========================================

  if (loading) {

    return (

      <div className="p-6 text-slate-500">

        Loading dashboard...

      </div>
    );
  }

  // =========================================
  // RENDER
  // =========================================

  return (

    <div className="space-y-6">

      {/* KPI SECTION */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

        <KPICard
          title="Total Revenue"
          value={`Rp ${(stats?.total_revenue || 0).toLocaleString('id-ID')}`}
          subtitle={`${stats?.total_payments || 0} pembayaran`}
          icon={<DollarSign size={18} />}
        />

        <KPICard
          title="Total Orders"
          value={`${stats?.total_orders || 0}`}
          subtitle="Realtime order data"
          icon={<ShoppingCart size={18} />}
        />

        <KPICard
          title="Registered Users"
          value={`${stats?.total_users || 0}`}
          subtitle="Total users system"
          icon={<Users size={18} />}
        />

        <KPICard
          title="Database Status"
          value={stats?.database_status || 'UNKNOWN'}
          subtitle={stats?.database_role || '-'}
          icon={<Database size={18} />}
        />

      </div>

      {/* INFRASTRUCTURE */}

      <div className="grid grid-cols-1 gap-4">

        <Card padding="md">

          <CardHeader
            title="Infrastructure"
            subtitle="Microservices status"
            icon={<Server size={16} />}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200">

              <div>

                <p className="text-sm font-medium text-slate-700">
                  Services Online
                </p>

                <p className="text-xs text-slate-400">
                  Active microservices
                </p>

              </div>

              <Badge
                variant={
                  onlineServices >= 5
                    ? 'success'
                    : 'danger'
                }
              >
                {onlineServices}/7
              </Badge>

            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200">

              <div>

                <p className="text-sm font-medium text-slate-700">
                  Database Role
                </p>

                <p className="text-xs text-slate-400">
                  Active database node
                </p>

              </div>

              <Badge
                variant={
                  stats?.database_role === 'PRIMARY'
                    ? 'success'
                    : 'warning'
                }
              >
                {stats?.database_role || 'UNKNOWN'}
              </Badge>

            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200">

              <div>

                <p className="text-sm font-medium text-slate-700">
                  Replication
                </p>

                <p className="text-xs text-slate-400">
                  PostgreSQL streaming
                </p>

              </div>

              <Badge
                variant={
                  stats?.replication_status === 'STREAMING'
                    ? 'success'
                    : 'danger'
                }
              >
                {stats?.replication_status || 'DOWN'}
              </Badge>

            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200">

              <div>

                <p className="text-sm font-medium text-slate-700">
                  Failover Status
                </p>

                <p className="text-xs text-slate-400">
                  Automatic DB failover
                </p>

              </div>

              <Badge
                variant={
                  stats?.failover_status === 'NORMAL'
                    ? 'success'
                    : 'warning'
                }
              >
                {stats?.failover_status || 'UNKNOWN'}
              </Badge>

            </div>

          </div>

        </Card>

      </div>

      {/* RECENT ORDERS */}

      <Card padding="md">

        <CardHeader
          title="Recent Orders"
          subtitle="Realtime customer transactions"
          icon={<Activity size={16} />}
          action={
            <Badge
              variant="info"
              dot
            >
              Live
            </Badge>
          }
        />

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b border-slate-200">

                <th className="text-left py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Customer
                </th>

                <th className="text-left py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Menu
                </th>

                <th className="text-left py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Total
                </th>

                <th className="text-left py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Status
                </th>

              </tr>

            </thead>

            <tbody>

              {recentOrders.length > 0 ? (

                recentOrders.map((order) => (

                  <tr
                    key={order.id}
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                  >

                    <td className="py-3 text-sm text-slate-700">
                      {order.full_name}
                    </td>

                    <td className="py-3 text-sm text-slate-700">
                      {order.menu_name}
                    </td>

                    <td className="py-3 text-sm font-medium text-slate-900">
                      Rp {Number(order.total_price).toLocaleString('id-ID')}
                    </td>

                    <td className="py-3">

                      <Badge
                        variant={
                          order.payment_status === 'paid'
                            ? 'success'
                            : 'warning'
                        }
                      >
                        {order.payment_status}
                      </Badge>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan={4}
                    className="py-8 text-center text-slate-400"
                  >

                    <div className="flex flex-col items-center gap-2">

                      <AlertTriangle
                        size={20}
                      />

                      <p>
                        No order data available
                      </p>

                    </div>

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </Card>

    </div>
  );
}