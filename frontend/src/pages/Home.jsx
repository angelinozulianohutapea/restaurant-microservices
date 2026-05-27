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
    desc: 'Pusat akses utama untuk mengatur seluruh permintaan sistem.',
    color: 'from-purple-500 to-violet-600',
  },
  {
    icon: Database,
    title: 'PostgreSQL Database',
    desc: 'Database utama dan cadangan dengan sinkronisasi otomatis.',
    color: 'from-blue-500 to-cyan-600',
  },
  {
    icon: Shield,
    title: 'Auto Failover',
    desc: 'Sistem otomatis mengganti server ketika terjadi gangguan.',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    icon: Server,
    title: 'Load Balancer',
    desc: 'Membagi trafik ke beberapa backend agar sistem tetap stabil.',
    color: 'from-orange-500 to-amber-600',
  },
  {
    icon: Activity,
    title: 'Monitoring System',
    desc: 'Pemantauan sistem secara real-time.',
    color: 'from-pink-500 to-rose-600',
  },
  {
    icon: Layers,
    title: 'Docker Container',
    desc: 'Seluruh layanan berjalan menggunakan container Docker.',
    color: 'from-cyan-500 to-blue-600',
  },
];

const dbFeatures = [
  {
    title: 'Replikasi Streaming',
    desc: 'Sinkronisasi data otomatis dari database utama ke cadangan.',
  },
  {
    title: 'Perpindahan Otomatis',
    desc: 'Pergantian server otomatis dengan deteksi cepat.',
  },
  {
    title: 'Pengelolaan Koneksi',
    desc: 'Manajemen koneksi database lebih efisien.',
  },
  {
    title: 'Pemulihan Data',
    desc: 'Pemulihan database berdasarkan waktu tertentu.',
  },
  {
    title: 'Server Pembaca',
    desc: 'Membagi proses pembacaan data ke beberapa server.',
  },
  {
    title: 'Pemantauan Kesehatan',
    desc: 'Pemeriksaan kesehatan sistem secara terus menerus.',
  },
];

export default function Home() {
  const [sysStats, setSysStats] = useState(null);

  const [dbStatus, setDbStatus] = useState({
    primaryNode: 'db-primary',
    standbyNode: 'db-replica',
    replication: 'aktif',
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getStats();

        setSysStats(res.data);

        setDbStatus({
          primaryNode: res.data.primary || 'db-primary',
          standbyNode: res.data.standby || 'db-replica',
          replication: res.data.replication || 'aktif',
        });
      } catch (error) {
        console.log(error);
      }
    };

    fetchStats();

    const interval = setInterval(fetchStats, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="gradient-bg min-h-screen">
      <HeroSection />

      {/* Arsitektur */}
      <section className="py-24 px-4 sm:px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-xs font-semibold tracking-widest text-purple-400 uppercase mb-3 block">
            Arsitektur
          </span>

          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Sistem <span className="gradient-text">Microservice</span>
          </h2>

          <p className="text-white/50 max-w-xl mx-auto">
            Dibangun menggunakan infrastruktur modern dengan performa tinggi,
            stabil, dan mendukung sistem berjalan tanpa gangguan.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {microservices.map(
            ({ icon: Icon, title, desc, color }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className="glass rounded-2xl p-6 border border-white/5 card-hover"
              >
                <div className="mb-4">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
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

      {/* Database PostgreSQL */}
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
                  Database
                </span>

                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  Database PostgreSQL{' '}
                  <span className="gradient-text">
                    Ketersediaan Tinggi
                  </span>
                </h2>

                <p className="text-white/50 mb-8 leading-relaxed">
                  Sistem database dengan sinkronisasi otomatis antar server
                  untuk menjaga kestabilan data.
                </p>

                <div className="space-y-3 mb-8">
                  {[
                    {
                      label: `${dbStatus.primaryNode} (UTAMA)`,
                      detail: 'Port :5432',
                    },
                    {
                      label: `${dbStatus.standbyNode} (CADANGAN)`,
                      detail: 'Port :5433',
                    },
                    {
                      label: 'Replikasi',
                      detail: 'Sinkronisasi data secara real-time',
                    },
                  ].map(({ label, detail }) => (
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
                    </div>
                  ))}
                </div>

                <Link to="/monitoring">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="btn-primary px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-purple-500/20"
                  >
                    Lihat Dashboard
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