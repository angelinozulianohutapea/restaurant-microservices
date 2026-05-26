import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CartProvider } from './hooks/useCart';
import ToastProvider from './components/Toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Menu from './pages/Menu';
import Order from './pages/Order';
import Payment from './pages/Payment';
import Monitoring from './pages/Monitoring';

function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
    >
      {children}
    </motion.div>
  );
}

function AppLayout() {
  return (
    <div className="gradient-bg min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
            <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
            <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
            <Route path="/menu" element={<PageWrapper><Menu /></PageWrapper>} />
            <Route path="/order" element={<PageWrapper><Order /></PageWrapper>} />
            <Route path="/payment" element={<PageWrapper><Payment /></PageWrapper>} />
            <Route path="/monitoring" element={<PageWrapper><Monitoring /></PageWrapper>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <CartProvider>
          <AppLayout />
        </CartProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
