import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, Star, Shield, Zap, Database, Server } from 'lucide-react';

const HERO_BG = 'https://images.pexels.com/photos/19606035/pexels-photo-19606035.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1080&w=1920';

const stats = [
  { value: '99.99%', label: 'Uptime SLA' },
  { value: 'HA', label: 'PostgreSQL' },
  { value: '< 50ms', label: 'API Latency' },
  { value: '∞', label: 'Scalability' },
];

const features = [
  { icon: Database, title: 'PostgreSQL HA', desc: 'Streaming Replication & Auto Failover', color: 'from-blue-500 to-cyan-500' },
  { icon: Server, title: 'Microservice', desc: 'API Gateway & Load Balancer', color: 'from-purple-500 to-pink-500' },
  { icon: Shield, title: 'Auto Failover', desc: 'Zero downtime with instant failover', color: 'from-emerald-500 to-teal-500' },
  { icon: Zap, title: 'Real-time Monitor', desc: 'Live system metrics & logs', color: 'from-orange-500 to-amber-500' },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={HERO_BG}
          alt="Premium Restaurant"
          className="w-full h-full object-cover"
        />
        <div className="hero-overlay absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a1a]/80 via-transparent to-[#0a0a1a]" />
      </div>

      {/* Animated orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 -left-20 w-96 h-96 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)' }}
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)' }}
        />
      </div>

      {/* Dot pattern */}
      <div className="absolute inset-0 dot-pattern opacity-30 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-32 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 glass border border-white/10 rounded-full px-4 py-2 mb-8 text-sm"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-glow" />
          <span className="text-white/70">Enterprise Restaurant Management System</span>
          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight mb-6 leading-tight"
        >
          The Future of{' '}
          <span className="gradient-text">Digital</span>
          <br />
          Restaurant Management
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Enterprise-grade restaurant management powered by microservices, High Availability PostgreSQL,
          auto failover, and real-time monitoring. Scale without limits.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link to="/menu">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="btn-primary px-8 py-4 rounded-2xl text-base font-bold shadow-2xl shadow-purple-500/30 flex items-center gap-2"
            >
              Explore Menu
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </Link>
          <Link to="/register">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="btn-secondary px-8 py-4 rounded-2xl text-base font-bold flex items-center gap-2"
            >
              Get Started Free
            </motion.button>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto mb-20"
        >
          {stats.map(({ value, label }, i) => (
            <div key={i} className="glass rounded-2xl p-4 border border-white/5 text-center">
              <div className="text-2xl font-black gradient-text">{value}</div>
              <div className="text-xs text-white/40 mt-1 font-medium">{label}</div>
            </div>
          ))}
        </motion.div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {features.map(({ icon: Icon, title, desc, color }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
              whileHover={{ scale: 1.03, y: -4 }}
              className="glass rounded-2xl p-5 border border-white/5 text-left card-hover"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3 shadow-lg`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">{title}</h3>
              <p className="text-xs text-white/40 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/30"
      >
        <div className="w-px h-10 bg-gradient-to-b from-transparent to-white/20" />
        <span className="text-xs">Scroll</span>
      </motion.div>
    </section>
  );
}
