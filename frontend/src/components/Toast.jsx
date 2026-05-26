import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useState, useEffect, createContext, useContext, useCallback } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (msg, dur) => addToast(msg, 'success', dur),
    error: (msg, dur) => addToast(msg, 'error', dur),
    warning: (msg, dur) => addToast(msg, 'warning', dur),
    info: (msg, dur) => addToast(msg, 'info', dur),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <ToastItem key={t.id} toast={t} onRemove={removeToast} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onRemove }) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), toast.duration);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove]);

  const config = {
    success: {
      icon: CheckCircle,
      color: 'text-emerald-400',
      border: 'border-emerald-500/30',
      bg: 'from-emerald-900/40 to-emerald-800/20',
      glow: 'shadow-emerald-500/20',
    },
    error: {
      icon: XCircle,
      color: 'text-red-400',
      border: 'border-red-500/30',
      bg: 'from-red-900/40 to-red-800/20',
      glow: 'shadow-red-500/20',
    },
    warning: {
      icon: AlertTriangle,
      color: 'text-amber-400',
      border: 'border-amber-500/30',
      bg: 'from-amber-900/40 to-amber-800/20',
      glow: 'shadow-amber-500/20',
    },
    info: {
      icon: Info,
      color: 'text-blue-400',
      border: 'border-blue-500/30',
      bg: 'from-blue-900/40 to-blue-800/20',
      glow: 'shadow-blue-500/20',
    },
  };

  const c = config[toast.type] || config.info;
  const Icon = c.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 500, damping: 40 }}
      className={`pointer-events-auto bg-gradient-to-r ${c.bg} backdrop-blur-xl border ${c.border} rounded-2xl p-4 shadow-2xl ${c.glow} flex items-start gap-3`}
    >
      <Icon className={`${c.color} w-5 h-5 flex-shrink-0 mt-0.5`} />
      <p className="text-white/90 text-sm flex-1 leading-relaxed">{toast.message}</p>
      <button
        onClick={() => onRemove(toast.id)}
        className="text-white/40 hover:text-white/80 transition-colors flex-shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
}

export default ToastProvider;
