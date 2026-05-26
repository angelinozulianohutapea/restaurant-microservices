import { motion } from 'framer-motion';

export default function LoadingSpinner({ size = 'md', text = '' }) {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="relative">
        <motion.div
          className={`${sizes[size]} rounded-full border-2 border-purple-500/20`}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          style={{
            borderTopColor: '#7c3aed',
            borderRightColor: '#3b82f6',
          }}
        />
        <div
          className={`absolute inset-0 ${sizes[size]} rounded-full`}
          style={{
            background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)',
          }}
        />
      </div>
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-sm text-white/50"
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}

export function FullPageLoader({ text = 'Loading...' }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center gradient-bg">
      <div className="flex flex-col items-center gap-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="relative"
        >
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <span className="text-3xl">🍽️</span>
          </div>
          <motion.div
            className="absolute -inset-2 rounded-2xl border-2 border-purple-500/30"
            animate={{ scale: [1, 1.1, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
        <LoadingSpinner size="lg" text={text} />
      </div>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="menu-card rounded-2xl overflow-hidden">
      <div className="shimmer h-48 w-full" />
      <div className="p-4 space-y-3">
        <div className="shimmer h-4 w-3/4 rounded-full" />
        <div className="shimmer h-3 w-1/2 rounded-full" />
        <div className="shimmer h-3 w-full rounded-full" />
        <div className="shimmer h-3 w-2/3 rounded-full" />
        <div className="flex justify-between items-center mt-4">
          <div className="shimmer h-5 w-1/3 rounded-full" />
          <div className="shimmer h-8 w-24 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
