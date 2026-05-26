import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatsCard({ icon: Icon, label, value, sub, trend, trendValue, variant = 'purple', delay = 0 }) {
  const variants = {
    purple: { cls: 'stats-purple', iconBg: 'from-purple-600 to-purple-700', glow: 'shadow-purple-500/20' },
    blue: { cls: 'stats-blue', iconBg: 'from-blue-600 to-blue-700', glow: 'shadow-blue-500/20' },
    cyan: { cls: 'stats-cyan', iconBg: 'from-cyan-600 to-cyan-700', glow: 'shadow-cyan-500/20' },
    emerald: { cls: 'stats-emerald', iconBg: 'from-emerald-600 to-emerald-700', glow: 'shadow-emerald-500/20' },
    amber: { cls: 'stats-amber', iconBg: 'from-amber-600 to-amber-700', glow: 'shadow-amber-500/20' },
    rose: { cls: 'stats-rose', iconBg: 'from-rose-600 to-rose-700', glow: 'shadow-rose-500/20' },
  };

  const v = variants[variant] || variants.purple;
  const isUp = trend === 'up';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ scale: 1.02, y: -2 }}
      className={`${v.cls} rounded-2xl p-5 shadow-xl ${v.glow} backdrop-blur-sm cursor-default`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${v.iconBg} flex items-center justify-center shadow-lg`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg ${
            isUp ? 'text-emerald-400 bg-emerald-400/10' : 'text-red-400 bg-red-400/10'
          }`}>
            {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trendValue}
          </div>
        )}
      </div>
      <div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: delay + 0.2, duration: 0.4 }}
          className="text-2xl sm:text-3xl font-bold text-white mb-1"
        >
          {value}
        </motion.div>
        <div className="text-sm font-medium text-white/70">{label}</div>
        {sub && <div className="text-xs text-white/40 mt-1">{sub}</div>}
      </div>
    </motion.div>
  );
}
