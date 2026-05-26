import { motion } from 'framer-motion';
import { ShoppingCart, Package, Tag, Star, AlertTriangle } from 'lucide-react';
import { formatRupiah } from '../api/api';

const categoryColors = {
  makanan: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  minuman: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  dessert: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  snack: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  default: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
};

export default function MenuCard({ menu, onAddToCart, delay = 0 }) {
  const {
    id,
    menu_name,
    category,
    description,
    price,
    stock,
    status,
    image_url,
  } = menu;

  const isOutOfStock = status === 'unavailable' || stock === 0;
  const isLowStock = stock > 0 && stock <= 5;
  const catKey = category?.toLowerCase() || 'default';
  const catColor = categoryColors[catKey] || categoryColors.default;

  const placeholderImg = `https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={`menu-card rounded-2xl overflow-hidden flex flex-col ${isOutOfStock ? 'opacity-60' : ''}`}
    >
      {/* Image */}
      <div className="relative overflow-hidden h-44 bg-gradient-to-br from-purple-900/20 to-blue-900/20">
        <img
          src={image_url || placeholderImg}
          alt={menu_name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => { e.target.src = placeholderImg; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Badges overlay */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${catColor} backdrop-blur-sm`}>
            {category || 'General'}
          </span>
        </div>

        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <span className="text-xs font-bold text-red-300 bg-red-500/20 border border-red-500/30 px-3 py-1.5 rounded-full">
              OUT OF STOCK
            </span>
          </div>
        )}

        {isLowStock && !isOutOfStock && (
          <div className="absolute top-3 right-3">
            <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-300 bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 rounded-full backdrop-blur-sm">
              <AlertTriangle className="w-2.5 h-2.5" />
              Low Stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        <div>
          <h3 className="font-semibold text-white text-sm leading-tight line-clamp-1 mb-1">{menu_name}</h3>
          <p className="text-xs text-white/40 line-clamp-2 leading-relaxed">{description || 'Delicious menu item from our kitchen.'}</p>
        </div>

        {/* Stock */}
        <div className="flex items-center gap-1.5 text-xs text-white/40">
          <Package className="w-3 h-3" />
          <span>Stock: </span>
          <span className={`font-semibold ${isLowStock ? 'text-amber-400' : 'text-white/60'}`}>{stock}</span>
          {/* Stock bar */}
          <div className="flex-1 ml-1 h-1 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((stock / 50) * 100, 100)}%` }}
              transition={{ delay: delay + 0.3, duration: 0.6 }}
              className={`h-full rounded-full ${
                isLowStock ? 'bg-amber-500' : 'bg-gradient-to-r from-purple-500 to-blue-500'
              }`}
            />
          </div>
        </div>

        {/* Price & Button */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
          <div>
            <span className="text-xs text-white/30">Price</span>
            <div className="text-base font-bold gradient-text">{formatRupiah(price)}</div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => !isOutOfStock && onAddToCart(menu)}
            disabled={isOutOfStock}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              isOutOfStock
                ? 'bg-white/5 text-white/20 cursor-not-allowed'
                : 'btn-primary shadow-lg shadow-purple-500/20'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            {isOutOfStock ? 'Unavailable' : 'Add to Cart'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
