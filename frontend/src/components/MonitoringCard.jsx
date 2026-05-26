import { motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';

export default function MonitoringCard({ service, status, latency, detail, delay = 0 }) {
  const statusConfig = {
    online: {
      icon: CheckCircle,
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10',
      border: 'border-emerald-500/20',
      dot: 'bg-emerald-400',
      label: 'Online',
    },
    offline: {
      icon: XCircle,
      color: 'text-red-400',
      bg: 'bg-red-400/10',
      border: 'border-red-500/20',
      dot: 'bg-red-400',
      label: 'Offline',
    },
    warning: {
      icon: AlertCircle,
      color: 'text-amber-400',
      bg: 'bg-amber-400/10',
      border: 'border-amber-500/20',
      dot: 'bg-amber-400',
      label: 'Warning',
    },
    unknown: {
      icon: Clock,
      color: 'text-white/40',
      bg: 'bg-white/5',
      border: 'border-white/10',
      dot: 'bg-white/30',
      label: 'Checking...',
    },
  };

  const cfg = statusConfig[status] || statusConfig.unknown;
  const Icon = cfg.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.3 }}
      className={`glass rounded-2xl p-4 border ${cfg.border} flex items-center gap-4`}
    >
      {/* Status Dot */}
      <div className="relative flex-shrink-0">
        <div className={`w-2.5 h-2.5 rounded-full ${cfg.dot} ${status === 'online' ? 'pulse-glow' : ''}`} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white truncate">{service}</p>
        {detail && <p className="text-xs text-white/40 truncate mt-0.5">{detail}</p>}
      </div>

      {/* Status Badge */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {latency && (
          <span className="text-xs text-white/30 font-mono">{latency}</span>
        )}
        <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg ${cfg.bg} ${cfg.color}`}>
          <Icon className="w-3 h-3" />
          {cfg.label}
        </span>
      </div>
    </motion.div>
  );
}
