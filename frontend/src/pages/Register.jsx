import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User, AtSign, Mail, Phone, MapPin, Lock, Eye, EyeOff,
  Loader2, ChefHat, ChevronRight, AlertCircle, CheckCircle
} from 'lucide-react';
import { registerUser } from '../api/api';
import { useToast } from '../components/Toast';

const fields = [
  { name: 'full_name', label: 'Full Name', icon: User, type: 'text', placeholder: 'John Doe', autoComplete: 'name' },
  { name: 'username', label: 'Username', icon: AtSign, type: 'text', placeholder: 'johndoe', autoComplete: 'username' },
  { name: 'email', label: 'Email Address', icon: Mail, type: 'email', placeholder: 'john@example.com', autoComplete: 'email' },
  { name: 'phone', label: 'Phone Number', icon: Phone, type: 'tel', placeholder: '+62 812 3456 7890', autoComplete: 'tel' },
  { name: 'address', label: 'Address', icon: MapPin, type: 'text', placeholder: 'Jl. Sudirman No. 1, Jakarta', autoComplete: 'street-address' },
];

function PasswordStrength({ password }) {
  const checks = [
    { label: 'Min 8 chars', ok: password.length >= 8 },
    { label: 'Uppercase', ok: /[A-Z]/.test(password) },
    { label: 'Number', ok: /\d/.test(password) },
    { label: 'Symbol', ok: /[!@#$%^&*]/.test(password) },
  ];
  const strength = checks.filter((c) => c.ok).length;
  const colors = ['', 'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-emerald-500'];
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`flex-1 h-1 rounded-full transition-all duration-300 ${i <= strength ? colors[strength] : 'bg-white/10'}`} />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {checks.map(({ label, ok }) => (
            <span key={label} className={`text-[10px] flex items-center gap-1 ${ok ? 'text-emerald-400' : 'text-white/20'}`}>
              <CheckCircle className="w-2.5 h-2.5" />
              {label}
            </span>
          ))}
        </div>
        {strength > 0 && (
          <span className={`text-[10px] font-semibold ${strength === 4 ? 'text-emerald-400' : strength >= 2 ? 'text-amber-400' : 'text-red-400'}`}>
            {labels[strength]}
          </span>
        )}
      </div>
    </div>
  );
}

export default function Register() {
  const [form, setForm] = useState({
    full_name: '', username: '', email: '', phone: '', address: '', password: ''
  });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();
  const toast = useToast();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    setApiError('');
  };

  const validate = () => {
    const errs = {};
    if (!form.full_name.trim()) errs.full_name = 'Full name is required';
    if (!form.username.trim()) errs.username = 'Username is required';
    else if (form.username.length < 3) errs.username = 'Min 3 characters';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email format';
    if (!form.phone.trim()) errs.phone = 'Phone is required';
    if (!form.address.trim()) errs.address = 'Address is required';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 8) errs.password = 'Min 8 characters';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    setApiError('');
    try {
      await registerUser(form);
      toast.success('Account created successfully! Please login. 🎉');
      navigate('/login');
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data?.error || 'Registration failed. Please try again.';
      setApiError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gradient-bg min-h-screen flex items-center justify-center px-4 py-24">
      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-80 h-80 rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.4) 0%, transparent 70%)' }} />
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.4) 0%, transparent 70%)' }} />
      </div>

      <div className="relative w-full max-w-lg">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 shadow-2xl shadow-purple-500/30 mb-4">
            <ChefHat className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white mb-1">Create Account</h1>
          <p className="text-white/40 text-sm">Join RestoApp Enterprise today</p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-dark rounded-3xl border border-white/10 p-8 shadow-2xl shadow-black/30"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* API Error */}
            {apiError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex items-center gap-2.5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {apiError}
              </motion.div>
            )}

            {/* Regular Fields */}
            {fields.map(({ name, label, icon: Icon, type, placeholder, autoComplete }) => (
              <div key={name}>
                <label className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2 block">{label}</label>
                <div className="relative">
                  <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type={type}
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    className={`w-full input-glass rounded-xl pl-10 pr-4 py-3 text-sm ${errors[name] ? 'border-red-500/50' : ''}`}
                  />
                </div>
                {errors[name] && (
                  <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors[name]}
                  </p>
                )}
              </div>
            ))}

            {/* Password */}
            <div>
              <label className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type={showPw ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full input-glass rounded-xl pl-10 pr-12 py-3 text-sm ${errors.password ? 'border-red-500/50' : ''}`}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.password}
                </p>
              )}
              <PasswordStrength password={form.password} />
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full btn-primary py-4 rounded-xl font-bold text-base shadow-xl shadow-purple-500/30 flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>

          {/* Login Link */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-white/20">Already have an account?</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>
          <Link to="/login">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full btn-secondary py-3 rounded-xl font-semibold text-sm"
            >
              Sign In Instead
            </motion.button>
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-xs text-white/20 mt-6"
        >
          By registering, you agree to our Terms of Service & Privacy Policy
        </motion.p>
      </div>
    </div>
  );
}
