import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingCart, Plus, Minus, Trash2, Package, Clock3, CheckCircle,
  ChevronRight, ArrowLeft, Receipt, Loader2
} from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { createOrder, getAuthUser, isAuthenticated, formatRupiah } from '../api/api';
import { useToast } from '../components/Toast';

export default function Order() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();
  const user = getAuthUser();
  const authenticated = isAuthenticated();

  const handleCheckout = async () => {
    if (!authenticated) {
      toast.warning('Please login to place an order.');
      navigate('/login');
      return;
    }
    if (cartItems.length === 0) {
      toast.warning('Your cart is empty!');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        user_id: user?.id || 1,
        items: cartItems.map((item) => ({
          menu_id: item.id,
          quantity: item.quantity,
        })),
      };
      const res = await createOrder(payload);
      const orderId = res.data?.id || res.data?.order_id || res.data?.data?.id || Date.now();
      setOrderSuccess({
        id: orderId,
        total: cartTotal,
        items: cartItems.length,
        data: res.data,
      });
      clearCart();
      toast.warning('Order created. Please complete payment.');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const goToPayment = () => {
    navigate('/payment', { state: { order: orderSuccess } });
  };

  return (
    <div className="gradient-bg min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <button
            onClick={() => navigate('/menu')}
            className="p-2.5 rounded-xl btn-secondary"
          >
            <ArrowLeft className="w-4 h-4 text-white/60" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">Your Order</h1>
            <p className="text-white/40 text-sm">{cartItems.length} item(s) in cart</p>
          </div>
        </motion.div>

        {/* Success State */}
        <AnimatePresence mode="wait">
          {orderSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-dark rounded-3xl border border-emerald-500/20 p-10 text-center shadow-2xl"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
                className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shadow-2xl shadow-yellow-500/30"
              >
                <Clock3 className="w-12 h-12 text-white animate-pulse" />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <h2 className="text-4xl font-bold text-white mb-3">Waiting for Payment</h2>
                <p className="text-white/50 mb-8">Your order has been submitted successfully.</p>

                <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto mb-8">
                  <div className="glass rounded-2xl p-4 border border-white/5">
                    <p className="text-xs text-white/30 mb-1">Order ID</p>
                    <p className="text-base font-bold text-white">#{orderSuccess.id}</p>
                  </div>
                  <div className="glass rounded-2xl p-4 border border-white/5">
                    <p className="text-xs text-white/30 mb-1">Items</p>
                    <p className="text-base font-bold text-white">{orderSuccess.items}</p>
                  </div>
                  <div className="glass rounded-2xl p-4 border border-white/5">
                    <p className="text-xs text-white/30 mb-1">Total</p>
                    <p className="text-sm font-bold gradient-text">{formatRupiah(orderSuccess.total)}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={goToPayment}
                    className="btn-primary px-8 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30"
                  >
                    <Receipt className="w-4 h-4" />
                    Pay Now
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate('/menu')}
                    className="btn-secondary px-8 py-3.5 rounded-xl font-semibold"
                  >
                    Order More
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div key="cart" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {cartItems.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-dark rounded-3xl border border-white/5 p-16 text-center"
                >
                  <Package className="w-20 h-20 text-white/10 mx-auto mb-5" />
                  <h3 className="text-xl font-bold text-white mb-2">Cart is empty</h3>
                  <p className="text-white/40 mb-8">Add some delicious items from our menu!</p>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate('/menu')}
                    className="btn-primary px-8 py-3.5 rounded-xl font-semibold flex items-center gap-2 mx-auto"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Browse Menu
                  </motion.button>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Cart Items */}
                  <div className="lg:col-span-2 space-y-3">
                    <AnimatePresence>
                      {cartItems.map((item, i) => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20, height: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="glass-dark rounded-2xl border border-white/5 p-4 flex items-center gap-4"
                        >
                          {/* Image */}
                          <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-white/5">
                            <img
                              src={item.image_url || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=100'}
                              alt={item.menu_name}
                              className="w-full h-full object-cover"
                              onError={(e) => { e.target.src = 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=100'; }}
                            />
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-white truncate">{item.menu_name}</h4>
                            <p className="text-xs text-white/40 mb-2">{item.category}</p>
                            <p className="text-sm font-bold text-purple-400">{formatRupiah(item.price)}</p>
                          </div>

                          {/* Quantity */}
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-purple-500/20 flex items-center justify-center text-white/60 hover:text-white transition-all border border-white/10"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-8 text-center text-sm font-bold text-white">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={item.quantity >= item.stock}
                              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-purple-500/20 flex items-center justify-center text-white/60 hover:text-white transition-all border border-white/10 disabled:opacity-30"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Subtotal */}
                          <div className="flex flex-col items-end gap-2 flex-shrink-0">
                            <p className="text-sm font-bold text-white">{formatRupiah(item.price * item.quantity)}</p>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Order Summary */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-dark rounded-2xl border border-white/5 p-6 h-fit sticky top-24"
                  >
                    <h3 className="text-base font-bold text-white mb-5">Order Summary</h3>

                    <div className="space-y-3 mb-5">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-white/50 truncate max-w-[150px]">
                            {item.menu_name} ×{item.quantity}
                          </span>
                          <span className="text-white/70 flex-shrink-0 ml-2">{formatRupiah(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-white/5 pt-4 space-y-2 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/40">Subtotal</span>
                        <span className="text-white/60">{formatRupiah(cartTotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/40">Tax (10%)</span>
                        <span className="text-white/60">{formatRupiah(cartTotal * 0.1)}</span>
                      </div>
                      <div className="flex justify-between font-bold border-t border-white/5 pt-2 mt-2">
                        <span className="text-white">Total</span>
                        <span className="gradient-text text-lg">{formatRupiah(cartTotal)}</span>
                      </div>
                    </div>

                    {!authenticated && (
                      <p className="text-xs text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-lg p-2.5 mb-4 text-center">
                        ⚠️ Login required to checkout
                      </p>
                    )}

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCheckout}
                      disabled={loading}
                      className="w-full btn-primary py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-purple-500/30 disabled:opacity-70"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Placing Order...
                        </>
                      ) : (
                        <>
                          Place Order
                          <ChevronRight className="w-4 h-4" />
                        </>
                      )}
                    </motion.button>
                  </motion.div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
