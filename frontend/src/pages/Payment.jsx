import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard, QrCode, Banknote, ChevronRight, ArrowLeft,
  CheckCircle, Copy, Receipt, Loader2, AlertCircle, Lock
} from 'lucide-react';
import { createPayment, formatRupiah, isAuthenticated } from '../api/api';
import { useToast } from '../components/Toast';

const paymentMethods = [
  {
    id: 'qris', label: 'QRIS', icon: QrCode,
    desc: 'Scan QR Code with any e-wallet', color: 'from-orange-500 to-pink-500',
  },
  {
    id: 'cash', label: 'Cash', icon: Banknote,
    desc: 'Pay directly at the counter', color: 'from-emerald-500 to-teal-500',
  },
  {
    id: 'debit', label: 'Debit / ATM', icon: CreditCard,
    desc: 'Bank transfer or ATM card', color: 'from-blue-500 to-cyan-500',
  },
];

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  // Data order dari halaman sebelumnya — TIDAK BISA DIUBAH USER
  const orderData = location.state?.order;
  const orderId = orderData?.id || '';
  const amount = orderData?.total || '';

  const [method, setMethod] = useState('qris');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const authenticated = isAuthenticated();

  // Jika tidak ada data order (akses langsung ke /payment)
  const noOrderData = !orderId || !amount;

  const handlePay = async () => {
    if (!authenticated) {
      toast.warning('Please login to make a payment.');
      navigate('/login');
      return;
    }
    if (noOrderData) {
      toast.error('No order data found. Please place an order first.');
      navigate('/menu');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        order_id: Number(orderId),
        amount: Number(amount),
        payment_method: method,
      };
      const res = await createPayment(payload);
      const txData = res.data;
      setSuccess({
        tx_code: txData?.transaction_code || txData?.id || `TXN${Date.now()}`,
        amount: Number(amount),
        method,
        order_id: orderId,
        data: txData,
      });
      toast.success('Payment successful! 🎉');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(String(code));
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="gradient-bg min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <button onClick={() => navigate(-1)} className="p-2.5 rounded-xl btn-secondary">
            <ArrowLeft className="w-4 h-4 text-white/60" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">Payment</h1>
            <p className="text-white/40 text-sm">Complete your transaction</p>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {!success ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-5"
            >
              {/* Tidak ada data order */}
              {noOrderData && (
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">No order found</p>
                    <p className="text-xs text-red-400/70 mt-0.5">Please place an order first before making a payment.</p>
                  </div>
                  <button
                    onClick={() => navigate('/menu')}
                    className="ml-auto btn-primary px-4 py-2 rounded-xl text-xs font-semibold flex-shrink-0"
                  >
                    Go to Menu
                  </button>
                </div>
              )}

              {/* Order Info Card — READONLY */}
              <div className="glass-dark rounded-3xl border border-white/5 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Order Details</h3>
                  <span className="flex items-center gap-1 text-xs text-white/30 bg-white/5 px-2.5 py-1 rounded-full">
                    <Lock className="w-3 h-3" />
                    Locked
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-white/40 uppercase tracking-wider mb-2 block">Order ID</label>
                    <div className="w-full input-glass rounded-xl px-4 py-3 text-sm text-white/60 cursor-not-allowed select-none">
                      {orderId || '—'}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-white/40 uppercase tracking-wider mb-2 block">Amount (IDR)</label>
                    <div className="w-full input-glass rounded-xl px-4 py-3 text-sm text-white/60 cursor-not-allowed select-none">
                      {amount ? formatRupiah(Number(amount)) : '—'}
                    </div>
                  </div>
                </div>
                {amount && (
                  <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 text-center">
                    <p className="text-xs text-white/40 mb-1">Total to Pay</p>
                    <p className="text-3xl font-black gradient-text">{formatRupiah(Number(amount))}</p>
                    <p className="text-xs text-white/20 mt-1">Amount is fixed and cannot be changed</p>
                  </div>
                )}
              </div>

              {/* Payment Methods */}
              <div className="glass-dark rounded-3xl border border-white/5 p-6">
                <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Select Payment Method</h3>
                <div className="space-y-3">
                  {paymentMethods.map((m) => {
                    const Icon = m.icon;
                    const selected = method === m.id;
                    return (
                      <motion.button
                        key={m.id}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => setMethod(m.id)}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all ${selected
                            ? 'border-purple-500/40 bg-purple-500/10'
                            : 'border-white/5 bg-white/3 hover:border-white/10 hover:bg-white/5'
                          }`}
                      >
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center shadow-lg flex-shrink-0`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-left flex-1">
                          <p className="text-sm font-bold text-white">{m.label}</p>
                          <p className="text-xs text-white/40 mt-0.5">{m.desc}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${selected ? 'border-purple-400 bg-purple-500' : 'border-white/20'
                          }`}>
                          {selected && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* QRIS Display */}
              {method === 'qris' && amount && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="glass-dark rounded-3xl border border-orange-500/20 p-6 text-center"
                >
                  <p className="text-sm text-white/50 mb-4">Scan QR Code below to pay</p>
                  <div className="w-40 h-40 mx-auto bg-white rounded-2xl flex items-center justify-center mb-4 p-3">
                    <div className="grid grid-cols-5 gap-0.5 w-full h-full">
                      {Array.from({ length: 25 }).map((_, i) => (
                        <div key={i} className={`rounded-sm ${Math.random() > 0.5 ? 'bg-black' : 'bg-white'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-white/30">RestoApp · {formatRupiah(Number(amount))}</p>
                </motion.div>
              )}

              {/* Pay Button */}
              <motion.button
                whileHover={{ scale: noOrderData ? 1 : 1.02 }}
                whileTap={{ scale: noOrderData ? 1 : 0.98 }}
                onClick={handlePay}
                disabled={loading || noOrderData}
                className="w-full btn-primary py-5 rounded-2xl font-bold text-lg shadow-2xl shadow-purple-500/30 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <Receipt className="w-5 h-5" />
                    Pay {amount ? formatRupiah(Number(amount)) : 'Now'}
                  </>
                )}
              </motion.button>

              {!authenticated && (
                <div className="flex items-center gap-2.5 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  You need to login before making a payment.
                </div>
              )}
            </motion.div>
          ) : (
            /* Success */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="glass-dark rounded-3xl border border-emerald-500/20 p-10 text-center shadow-2xl"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
                className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-2xl shadow-emerald-500/30"
              >
                <CheckCircle className="w-12 h-12 text-white" />
              </motion.div>

              <h2 className="text-3xl font-bold text-white mb-2">Payment Successful!</h2>
              <p className="text-white/50 mb-8">Your order has been confirmed.</p>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="glass rounded-2xl p-4 border border-white/5">
                  <p className="text-xs text-white/30 mb-1">Transaction Code</p>
                  <div className="flex items-center justify-center gap-1">
                    <span className="font-mono text-sm font-bold text-purple-300">{success.tx_code}</span>
                    <button onClick={() => copyCode(success.tx_code)} className="p-1 rounded text-white/30 hover:text-white/60">
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <div className="glass rounded-2xl p-4 border border-white/5">
                  <p className="text-xs text-white/30 mb-1">Order ID</p>
                  <p className="font-bold text-white">#{success.order_id}</p>
                </div>
                <div className="glass rounded-2xl p-4 border border-white/5">
                  <p className="text-xs text-white/30 mb-1">Amount Paid</p>
                  <p className="font-bold gradient-text">{formatRupiah(success.amount)}</p>
                </div>
                <div className="glass rounded-2xl p-4 border border-white/5">
                  <p className="text-xs text-white/30 mb-1">Method</p>
                  <p className="font-bold text-white capitalize">{success.method}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/order')}
                  className="btn-primary px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                >
                  Back to home
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/menu')}
                  className="btn-secondary px-6 py-3 rounded-xl font-semibold"
                >
                  Order Again
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}