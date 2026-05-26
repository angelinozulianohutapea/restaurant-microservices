import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Database,
  Server,
  Shield,
  Activity,
  CheckCircle,
  ChevronRight,
  Layers,
  Globe
} from 'lucide-react';

import HeroSection from '../components/HeroSection';
import { getStats } from '../api/api';

const microservices = [
  {
    icon: Globe,
    title: 'API Gateway',
    desc: 'Single entry point routing all requests with rate limiting and authentication middleware.',
    color: 'from-purple-500 to-violet-600',
    status: 'online',
  },
  {
    icon: Database,
    title: 'PostgreSQL HA',
    desc: 'Primary-standby setup with streaming replication for zero data loss.',
    color: 'from-blue-500 to-cyan-600',
    status: 'online',
  },
  {
    icon: Shield,
    title: 'Auto Failover',
    desc: 'Automatic failover with Patroni/pg_auto_failover for seamless recovery.',
    color: 'from-emerald-500 to-teal-600',
    status: 'online',
  },
  {
    icon: Server,
    title: 'NGINX LB',
    desc: 'Load balancer distributing traffic across multiple backend instances.',
    color: 'from-orange-500 to-amber-600',
    status: 'online',
  },
  {
    icon: Activity,
    title: 'Monitoring',
    desc: 'Real-time metrics, alerts, and system health dashboard with Prometheus.',
    color: 'from-pink-500 to-rose-600',
    status: 'online',
  },
  {
    icon: Layers,
    title: 'Docker Stack',
    desc: 'Containerized microservices with Docker Compose orchestration.',
    color: 'from-cyan-500 to-blue-600',
    status: 'online',
  },
];

const dbFeatures = [
  {
    title: 'Streaming Replication',
    desc: 'Continuous WAL streaming from primary to standby nodes',
  },
  {
    title: 'Auto Failover',
    desc: 'Automatic leader election with sub-second detection',
  },
  {
    title: 'Connection Pooling',
    desc: 'PgBouncer for efficient connection management',
  },
  {
    title: 'Point-in-Time Recovery',
    desc: 'Full PITR capability with WAL archiving',
  },
  {
    title: 'Read Replicas',
    desc: 'Scale read operations across multiple standbys',
  },
  {
    title: 'Health Monitoring',
    desc: 'Continuous health checks with automatic intervention',
  },
];

export default function Home() {
  const [sysStats, setSysStats] = useState(null);

  const [dbStatus, setDbStatus] = useState({
    primaryNode: 'db-primary',
    standbyNode: 'db-replica',
    primaryStatus: 'online',
    standbyStatus: 'online',
    replication: 'active',
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getStats();

        setSysStats(res.data);

        /*
          contoh response backend:

          {
            primary: "db-primary",
            standby: "db-replica",
            replication: "active",
            primaryStatus: "online",
            standbyStatus: "online"
          }

          saat failover:

          {
            primary: "db-replica",
            standby: "db-primary",
            replication: "active",
            primaryStatus: "online",
            standbyStatus: "online"
          }
        */

        setDbStatus({
          primaryNode: res.data.primary || 'db-primary',
          standbyNode: res.data.standby || 'db-replica',
          primaryStatus: res.data.primaryStatus || 'online',
          standbyStatus: res.data.standbyStatus || 'online',
          replication: res.data.replication || 'active',
        });
      } catch (error) {
        console.log(error);

        setDbStatus((prev) => ({
          ...prev,
          primaryStatus: 'offline',
        }));
      }
    };

    fetchStats();

    // auto refresh tiap 3 detik
    const interval = setInterval(fetchStats, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="gradient-bg min-h-screen">
      <HeroSection />

      {/* Architecture */}
      <section className="py-24 px-4 sm:px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-xs font-semibold tracking-widest text-purple-400 uppercase mb-3 block">
            Architecture
          </span>

          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Enterprise{' '}
            <span className="gradient-text">Microservice</span> Stack
          </h2>

          <p className="text-white/50 max-w-xl mx-auto">
            Built on battle-tested infrastructure with high availability,
            auto-scaling, and zero-downtime deployments.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {microservices.map(
            ({ icon: Icon, title, desc, color, status }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className="glass rounded-2xl p-6 border border-white/5 card-hover"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  <span className="badge-online text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-glow" />
                    {status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-2">
                  {title}
                </h3>

                <p className="text-sm text-white/40 leading-relaxed">
                  {desc}
                </p>
              </motion.div>
            )
          )}
        </div>
      </section>

      {/* PostgreSQL HA */}
      <section className="py-24 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="glass rounded-3xl border border-blue-500/10 p-8 sm:p-12 overflow-hidden relative">
          <div
            className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
            style={{
              background:
                'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)',
            }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-xs font-semibold tracking-widest text-blue-400 uppercase mb-3 block">
                  High Availability
                </span>

                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  PostgreSQL{' '}
                  <span className="gradient-text">
                    High Availability
                  </span>{' '}
                  Database
                </h2>

                <p className="text-white/50 mb-8 leading-relaxed">
                  Automatic failover with real-time replication between
                  PostgreSQL nodes.
                </p>

                {/* DATABASE STATUS */}
                <div className="space-y-3 mb-8">
                  {[
                    {
                      label: `${dbStatus.primaryNode} (PRIMARY)`,
                      status: dbStatus.primaryStatus,
                      detail: 'Port :5432',
                    },
                    {
                      label: `${dbStatus.standbyNode} (REPLICA)`,
                      status: dbStatus.standbyStatus,
                      detail: 'Port :5433',
                    },
                    {
                      label: 'Replication',
                      status:
                        dbStatus.replication === 'active'
                          ? 'online'
                          : 'offline',
                      detail: 'Streaming WAL · Real-time sync',
                    },
                  ].map(({ label, status, detail }) => (
                    <div
                      key={label}
                      className="flex items-center justify-between glass rounded-xl p-3 border border-white/5"
                    >
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {label}
                        </p>

                        <p className="text-xs text-white/30 font-mono">
                          {detail}
                        </p>
                      </div>

                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1 ${
                          status === 'online'
                            ? 'badge-online'
                            : 'badge-offline'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            status === 'online'
                              ? 'bg-emerald-400 pulse-glow'
                              : 'bg-red-400'
                          }`}
                        />

                        {status === 'online'
                          ? 'Active'
                          : 'Inactive'}
                      </span>
                    </div>
                  ))}
                </div>

                <Link to="/monitoring">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="btn-primary px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-purple-500/20"
                  >
                    View Live Dashboard
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                </Link>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3"
            >
              {dbFeatures.map(({ title, desc }, i) => (
                <div
                  key={i}
                  className="glass rounded-xl p-4 border border-white/5"
                >
                  <div className="flex items-start gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />

                    <h4 className="text-sm font-semibold text-white">
                      {title}
                    </h4>
                  </div>

                  <p className="text-xs text-white/40 leading-relaxed pl-6">
                    {desc}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}