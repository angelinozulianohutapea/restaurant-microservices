import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Trash2, Plus, Minus, ChevronRight, Package } from 'lucide-react';
import { formatRupiah } from '../api/api';
import { useCart } from '../hooks/useCart';
import { useNavigate } from 'react-router-dom';

export default function CartSidebar({ isOpen, onClose }) {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose();
    navigate('/order');
  };

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-96 z-50 cart-sidebar flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                  <ShoppingCart className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Shopping Cart</h3>
                  <p className="text-xs text-white/40">{cartItems.length} item(s)</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-white/60 hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <AnimatePresence>
                {cartItems.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-64 text-center"
                  >
                    <Package className="w-16 h-16 text-white/10 mb-4" />
                    <p className="text-white/40 font-medium">Cart is empty</p>
                    <p className="text-white/20 text-sm mt-1">Add some delicious items!</p>
                  </motion.div>
                ) : (
                  cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20, height: 0 }}
                      className="glass rounded-2xl p-3.5 flex items-center gap-3"
                    >
                      {/* Image */}
                      <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-white/5">
                        <img
                          src={item.image_url || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=100'}
                          alt={item.menu_name}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.src = 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=100'; }}
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{item.menu_name}</p>
                        <p className="text-xs text-purple-400 font-semibold">{formatRupiah(item.price)}</p>
                        {/* Qty controls */}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 rounded-lg bg-white/10 hover:bg-purple-500/30 flex items-center justify-center text-white/70 hover:text-white transition-all"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-semibold text-white w-5 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                            className="w-6 h-6 rounded-lg bg-white/10 hover:bg-purple-500/30 flex items-center justify-center text-white/70 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Subtotal & Remove */}
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
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-4 border-t border-white/5 space-y-3">
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-white/50">Total</span>
                  <span className="text-xl font-bold gradient-text">{formatRupiah(cartTotal)}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCheckout}
                  className="w-full btn-primary py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30"
                >
                  Proceed to Checkout
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
                <button
                  onClick={clearCart}
                  className="w-full text-xs text-white/30 hover:text-red-400 transition-colors py-1"
                >
                  Clear Cart
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
