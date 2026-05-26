import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Copy, QrCode, Banknote, CreditCard, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { formatRupiah } from '../api/api';
import { useToast } from './Toast';

export default function PaymentModal({ isOpen, onClose, order, onPayment }) {
  const [method, setMethod] = useState('qris');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [txCode, setTxCode] = useState('');
  const toast = useToast();

  const methods = [
    { id: 'qris', label: 'QRIS', icon: QrCode, desc: 'Scan QR Code', color: 'from-orange-500 to-pink-500' },
    { id: 'cash', label: 'Cash', icon: Banknote, desc: 'Pay at Counter', color: 'from-emerald-500 to-teal-500' },
    { id: 'debit', label: 'Debit Card', icon: CreditCard, desc: 'Bank Transfer', color: 'from-blue-500 to-cyan-500' },
  ];

  const handlePay = async () => {
    setLoading(true);
    try {
      const result = await onPayment({ payment_method: method });
      const code = result?.data?.transaction_code || result?.data?.id || `TXN${Date.now()}`;
      setTxCode(code);
      setSuccess(true);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setTxCode('');
    setMethod('qris');
    onClose();
  };

  const copyCode = () => {
    navigator.clipboard.writeText(String(txCode));
    toast.success('Transaction code copied!');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 30 }}
            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
            className="relative w-full max-w-md glass-dark rounded-3xl border border-white/10 overflow-hidden"
          >
            {!success ? (
              <>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                  <div>
                    <h3 className="text-lg font-bold text-white">Select Payment</h3>
                    <p className="text-xs text-white/40 mt-0.5">Order #{order?.id}</p>
                  </div>
                  <button onClick={handleClose} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Amount */}
                <div className="px-6 py-4 text-center">
                  <p className="text-xs text-white/40 mb-1">Total Amount</p>
                  <p className="text-3xl font-bold gradient-text">{formatRupiah(order?.total || 0)}</p>
                </div>

                {/* Methods */}
                <div className="px-6 space-y-2 pb-4">
                  <p className="text-xs text-white/40 uppercase tracking-wider mb-3">Payment Method</p>
                  {methods.map((m) => {
                    const Icon = m.icon;
                    return (
                      <motion.button
                        key={m.id}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => setMethod(m.id)}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                          method === m.id
                            ? 'border-purple-500/50 bg-purple-500/10'
                            : 'border-white/5 bg-white/3 hover:border-white/10 hover:bg-white/5'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-left flex-1">
                          <p className="text-sm font-semibold text-white">{m.label}</p>
                          <p className="text-xs text-white/40">{m.desc}</p>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                          method === m.id ? 'border-purple-400 bg-purple-400' : 'border-white/20'
                        }`}>
                          {method === m.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Pay Button */}
                <div className="px-6 pb-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handlePay}
                    disabled={loading}
                    className="w-full btn-primary py-4 rounded-2xl font-bold text-base shadow-xl shadow-purple-500/30 flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>Pay {formatRupiah(order?.total || 0)}</>
                    )}
                  </motion.button>
                </div>
              </>
            ) : (
              /* Success State */
              <div className="p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-xl shadow-emerald-500/30"
                >
                  <CheckCircle className="w-10 h-10 text-white" />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <h3 className="text-2xl font-bold text-white mb-2">Payment Successful!</h3>
                  <p className="text-white/50 text-sm mb-6">Your order has been confirmed and is being processed.</p>

                  {/* Transaction Code */}
                  <div className="glass rounded-2xl p-4 mb-6 border border-emerald-500/20">
                    <p className="text-xs text-white/40 mb-2">Transaction Code</p>
                    <div className="flex items-center justify-center gap-2">
                      <span className="font-mono text-lg font-bold gradient-text">{txCode}</span>
                      <button onClick={copyCode} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs mb-6">
                    <div className="glass rounded-xl p-3 border border-white/5">
                      <p className="text-white/40 mb-1">Amount</p>
                      <p className="font-bold text-white">{formatRupiah(order?.total || 0)}</p>
                    </div>
                    <div className="glass rounded-xl p-3 border border-white/5">
                      <p className="text-white/40 mb-1">Method</p>
                      <p className="font-bold text-white capitalize">{method}</p>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleClose}
                    className="w-full btn-primary py-3.5 rounded-xl font-semibold shadow-lg shadow-purple-500/30"
                  >
                    Done
                  </motion.button>
                </motion.div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
