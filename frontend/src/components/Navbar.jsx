import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChefHat, LayoutDashboard, UtensilsCrossed, ShoppingCart,
  CreditCard, Activity, LogIn, UserPlus, LogOut, User,
  Menu, X, Bell, ChevronDown
} from 'lucide-react';
import { clearAuthSession, getAuthUser, isAuthenticated } from '../api/api';
import { useCart } from '../hooks/useCart';
import { useToast } from './Toast';

const navLinks = [
  { path: '/', label: 'Home', icon: ChefHat },
  { path: '/menu', label: 'Menu', icon: UtensilsCrossed },
  { path: '/order', label: 'Orders', icon: ShoppingCart },
  { path: '/payment', label: 'Payment', icon: CreditCard },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const toast = useToast();
  const authenticated = isAuthenticated();
  const user = getAuthUser();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    clearAuthSession();
    toast.success('Logged out successfully. See you soon! 👋');
    navigate('/login');
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'navbar-glass shadow-2xl shadow-black/20' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:shadow-purple-500/50 transition-all duration-300 group-hover:scale-110">
                <ChefHat className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="text-lg font-bold gradient-text">RestoApp</span>
                <div className="text-[10px] text-white/30 font-medium -mt-0.5 tracking-widest uppercase">Enterprise</div>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(({ path, label, icon: Icon }) => {
                const active = location.pathname === path;
                return (
                  <Link
                    key={path}
                    to={path}
                    className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      active
                        ? 'text-white bg-white/10'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                    {active && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/20"
                        transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-2">
              {/* Cart Icon */}
              {authenticated && (
                <Link to="/order" className="relative p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all duration-200">
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <motion.span
                      key={cartCount}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full text-[10px] font-bold flex items-center justify-center text-white"
                    >
                      {cartCount > 9 ? '9+' : cartCount}
                    </motion.span>
                  )}
                </Link>
              )}

              {authenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdown(!userDropdown)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/30 transition-all duration-200"
                  >
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xs font-bold">
                      {user?.full_name?.charAt(0)?.toUpperCase() || user?.username?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <span className="hidden sm:block text-sm text-white/80 max-w-[100px] truncate">
                      {user?.full_name || user?.username || 'User'}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-white/50 transition-transform ${userDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {userDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-52 glass-dark rounded-2xl border border-white/10 p-1.5 shadow-2xl shadow-black/40"
                        onMouseLeave={() => setUserDropdown(false)}
                      >
                        <div className="px-3 py-2 border-b border-white/5 mb-1">
                          <p className="text-sm font-semibold text-white truncate">{user?.full_name || 'User'}</p>
                          <p className="text-xs text-white/40 truncate">{user?.email || ''}</p>
                        </div>
                        <Link
                          to="/monitoring"
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all"
                          onClick={() => setUserDropdown(false)}
                        >
                          <Activity className="w-4 h-4" />
                          Dashboard
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link
                    to="/login"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-all"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium btn-primary shadow-lg shadow-purple-500/20"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    Register
                  </Link>
                </div>
              )}

              {/* Mobile Toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
              >
                {mobileOpen ? <X className="w-4 h-4 text-white" /> : <Menu className="w-4 h-4 text-white" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden navbar-glass border-t border-white/5"
            >
              <div className="px-4 py-4 space-y-1">
                {navLinks.map(({ path, label, icon: Icon }) => {
                  const active = location.pathname === path;
                  return (
                    <Link
                      key={path}
                      to={path}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        active
                          ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-white border border-purple-500/20'
                          : 'text-white/60 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </Link>
                  );
                })}
                <div className="pt-2 border-t border-white/5 flex gap-2">
                  {authenticated ? (
                    <button
                      onClick={handleLogout}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm text-red-400 bg-red-500/10 border border-red-500/20"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  ) : (
                    <>
                      <Link to="/login" className="flex-1 text-center py-2.5 rounded-xl text-sm btn-secondary font-medium">
                        Login
                      </Link>
                      <Link to="/register" className="flex-1 text-center py-2.5 rounded-xl text-sm btn-primary font-medium">
                        Register
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
