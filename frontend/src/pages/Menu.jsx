import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, SlidersHorizontal, RefreshCw, UtensilsCrossed, ShoppingCart, X } from 'lucide-react';
import { getMenus } from '../api/api';
import { useCart } from '../hooks/useCart';
import { useToast } from '../components/Toast';
import MenuCard from '../components/MenuCard';
import CartSidebar from '../components/CartSidebar';
import { SkeletonCard } from '../components/LoadingSpinner';

const CATEGORIES = ['All', 'Makanan', 'Minuman', 'Dessert', 'Snack'];

// Demo menus shown when API is not reachable
const demoMenus = [
  { id: 1, menu_name: 'Nasi Goreng Spesial', category: 'Makanan', description: 'Nasi goreng dengan telur, ayam, dan sayuran pilihan. Disajikan dengan kerupuk dan acar.', price: 35000, stock: 20, status: 'available', image_url: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 2, menu_name: 'Ayam Bakar Kecap', category: 'Makanan', description: 'Ayam bakar dengan bumbu kecap manis, rempah pilihan, dan lalapan segar.', price: 45000, stock: 15, status: 'available', image_url: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 3, menu_name: 'Es Teh Manis', category: 'Minuman', description: 'Teh manis segar dengan es batu pilihan.', price: 10000, stock: 50, status: 'available', image_url: 'https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 4, menu_name: 'Soto Ayam', category: 'Makanan', description: 'Soto ayam dengan kuah bening, soun, dan perkedel kentang.', price: 30000, stock: 4, status: 'available', image_url: 'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 5, menu_name: 'Jus Alpukat', category: 'Minuman', description: 'Jus alpukat segar dengan susu dan gula aren.', price: 20000, stock: 30, status: 'available', image_url: 'https://images.pexels.com/photos/775033/pexels-photo-775033.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 6, menu_name: 'Pisang Goreng Keju', category: 'Dessert', description: 'Pisang goreng renyah dengan topping keju mozzarella melted.', price: 25000, stock: 0, status: 'unavailable', image_url: 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 7, menu_name: 'Mie Goreng Seafood', category: 'Makanan', description: 'Mie goreng dengan cumi, udang, dan sayuran. Bumbu spesial chef.', price: 50000, stock: 12, status: 'available', image_url: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 8, menu_name: 'Kopi Susu Gula Aren', category: 'Minuman', description: 'Espresso dengan susu segar dan gula aren asli. Signature drink.', price: 28000, stock: 25, status: 'available', image_url: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 9, menu_name: 'Keripik Tempe', category: 'Snack', description: 'Keripik tempe homemade renyah dengan bumbu balado atau original.', price: 15000, stock: 3, status: 'available', image_url: 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 10, menu_name: 'Es Krim Coklat', category: 'Dessert', description: 'Es krim premium rasa coklat dengan topping sprinkle dan wafer.', price: 22000, stock: 18, status: 'available', image_url: 'https://images.pexels.com/photos/1362534/pexels-photo-1362534.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 11, menu_name: 'Gado-Gado', category: 'Makanan', description: 'Sayuran rebus dengan bumbu kacang spesial dan kerupuk.', price: 28000, stock: 10, status: 'available', image_url: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 12, menu_name: 'Lemon Tea', category: 'Minuman', description: 'Teh segar dengan perasan lemon asli dan madu.', price: 18000, stock: 40, status: 'available', image_url: 'https://images.pexels.com/photos/1187766/pexels-photo-1187766.jpeg?auto=compress&cs=tinysrgb&w=400' },
];

export default function Menu() {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [cartOpen, setCartOpen] = useState(false);
  const { addToCart, cartCount } = useCart();
  const toast = useToast();

  const fetchMenus = async () => {
    setLoading(true);
    try {
      const res = await getMenus();
      const data = Array.isArray(res.data) ? res.data : res.data?.data || res.data?.menus || [];
      setMenus(data.length > 0 ? data : demoMenus);
    } catch {
      setMenus(demoMenus);
      toast.info('Using demo data — API not reachable');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMenus(); }, []);

  const filtered = useMemo(() => {
    let result = [...menus];
    if (activeCategory !== 'All') {
      result = result.filter((m) => m.category?.toLowerCase() === activeCategory.toLowerCase());
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((m) =>
        m.menu_name?.toLowerCase().includes(q) ||
        m.description?.toLowerCase().includes(q) ||
        m.category?.toLowerCase().includes(q)
      );
    }
    if (sortBy === 'price-asc') result.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') result.sort((a, b) => b.price - a.price);
    if (sortBy === 'name') result.sort((a, b) => a.menu_name?.localeCompare(b.menu_name));
    if (sortBy === 'stock') result.sort((a, b) => b.stock - a.stock);
    return result;
  }, [menus, search, activeCategory, sortBy]);

  const handleAddToCart = (menu) => {
    addToCart(menu);
    toast.success(`${menu.menu_name} added to cart! 🛒`);
  };

  return (
    <div className="gradient-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white">Our Menu</h1>
              <p className="text-white/40 mt-1">
                {loading ? 'Loading...' : `${filtered.length} of ${menus.length} items`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={fetchMenus}
                className="p-2.5 rounded-xl btn-secondary text-white/60 hover:text-white"
                title="Refresh"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={() => setCartOpen(true)}
                className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl btn-primary shadow-lg shadow-purple-500/20 text-sm font-semibold"
              >
                <ShoppingCart className="w-4 h-4" />
                Cart
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full text-[10px] font-bold flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Search & Sort */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search menu items..."
                className="w-full input-glass rounded-xl pl-10 pr-10 py-3 text-sm"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="relative">
              <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-glass rounded-xl pl-9 pr-4 py-3 text-sm appearance-none cursor-pointer"
              >
                <option value="default" className="bg-[#0d0d2b]">Default</option>
                <option value="price-asc" className="bg-[#0d0d2b]">Price: Low to High</option>
                <option value="price-desc" className="bg-[#0d0d2b]">Price: High to Low</option>
                <option value="name" className="bg-[#0d0d2b]">Name A-Z</option>
                <option value="stock" className="bg-[#0d0d2b]">Most Stock</option>
              </select>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat
                    ? 'btn-primary shadow-lg shadow-purple-500/20'
                    : 'btn-secondary'
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <UtensilsCrossed className="w-16 h-16 text-white/10 mx-auto mb-4" />
            <p className="text-white/40 text-lg font-medium">No menu items found</p>
            <p className="text-white/20 text-sm mt-1">Try adjusting your search or filters</p>
            <button onClick={() => { setSearch(''); setActiveCategory('All'); }} className="mt-4 text-purple-400 text-sm hover:text-purple-300">
              Clear filters
            </button>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeCategory}-${search}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
            >
              {filtered.map((menu, i) => (
                <MenuCard
                  key={menu.id}
                  menu={menu}
                  onAddToCart={handleAddToCart}
                  delay={i * 0.04}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
