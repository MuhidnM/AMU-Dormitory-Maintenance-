import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Hammer, Loader2, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import loginBg from '../assets/amu-building-2.png';
import amuLogo from '../assets/amu-logo.png';

const schema = z.object({
  name: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  dormInfo: z.string().min(2, 'Dormitory information is required'),
});

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [studentCount, setStudentCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/auth/public-stats')
      .then(res => setStudentCount(res.data.studentCount))
      .catch(console.error);
  }, []);

  const setAuth = useAuthStore((state) => state.setAuth);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/auth/register', data);
      const { user, token } = response.data;
      setAuth(user, token);
      navigate('/student');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex bg-slate-300 dark:bg-slate-950 overflow-hidden transition-colors duration-300">

      {/* Left Side: Image/Branding Section */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden lg:block lg:w-1/2 relative bg-slate-100 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/40 to-slate-900/80 z-10" />
        <img
          src={loginBg}
          alt="Dormitory Maintenance"
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />

        <div className="relative z-20 h-full flex flex-col justify-between p-16 text-white">
          <div className="flex items-center gap-3">
            <img src={amuLogo} alt="AMU Logo" className="w-10 h-10 object-contain drop-shadow-md" />
            <span className="font-bold text-xl tracking-tight">AMU Dormitory Maintenance Request System</span>
          </div>

          <div className="max-w-lg">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-5xl font-bold leading-tight"
            >
              Efficient Maintenance, <br />
              for Better Dormitory <br />
              Living.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mt-6 text-lg text-white/90 leading-relaxed font-medium"
            >
              Our system ensures your maintenance requests are handled swiftly and professionally, making your stay comfortable and worry-free.
            </motion.p>
          </div>

          <div className="flex items-center gap-4">
            <p className="text-lg text-white/90">
              Users <span className="font-bold text-xl">{studentCount}</span> Registered this Year
            </p>
          </div>
        </div>
      </motion.div>

      {/* Right Side: Form Section */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full lg:w-1/2 flex justify-center p-6 sm:p-12 md:p-20 relative z-10 bg-slate-300 dark:bg-slate-950 overflow-y-auto"
      >
        <div className="max-w-md w-full my-auto py-6">
          <div className="mb-10 flex flex-col items-center text-center">
            <motion.img
              src={amuLogo}
              alt="AMU Logo"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="w-14 h-14 object-contain mb-6 drop-shadow-md"
            />
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Create Account</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-3 text-lg">Join the AMU Maintenance System</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm mb-6 border border-red-100 dark:border-red-900/30 flex items-center gap-3"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-red-600 dark:bg-red-400" />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 ml-1">Full Name</label>
              <input
                {...register('name')}
                className={`w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-2 rounded-2xl focus:outline-none focus:ring-4 transition-all duration-200 dark:text-white dark:placeholder-slate-500 ${errors.name ? 'border-red-500 focus:ring-red-100' : 'border-slate-100 dark:border-slate-700 focus:border-primary-500 focus:ring-primary-50'
                  }`}
                placeholder="John Doe"
              />
              {errors.name && <p className="text-red-500 text-xs mt-2 ml-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 ml-1">Email Address</label>
              <input
                {...register('email')}
                className={`w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-2 rounded-2xl focus:outline-none focus:ring-4 transition-all duration-200 dark:text-white dark:placeholder-slate-500 ${errors.email ? 'border-red-500 focus:ring-red-100' : 'border-slate-100 dark:border-slate-700 focus:border-primary-500 focus:ring-primary-50'
                  }`}
                placeholder="student@amu.edu"
              />
              {errors.email && <p className="text-red-500 text-xs mt-2 ml-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 ml-1">Dormitory Info</label>
              <input
                {...register('dormInfo')}
                className={`w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-2 rounded-2xl focus:outline-none focus:ring-4 transition-all duration-200 dark:text-white dark:placeholder-slate-500 ${errors.dormInfo ? 'border-red-500 focus:ring-red-100' : 'border-slate-100 dark:border-slate-700 focus:border-primary-500 focus:ring-primary-50'
                  }`}
                placeholder="Block B, Room 204"
              />
              {errors.dormInfo && <p className="text-red-500 text-xs mt-2 ml-1">{errors.dormInfo.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 ml-1">Password</label>
              <input
                {...register('password')}
                type="password"
                className={`w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-2 rounded-2xl focus:outline-none focus:ring-4 transition-all duration-200 dark:text-white dark:placeholder-slate-500 ${errors.password ? 'border-red-500 focus:ring-red-100' : 'border-slate-100 dark:border-slate-700 focus:border-primary-500 focus:ring-primary-50'
                  }`}
                placeholder="••••••••"
              />
              {errors.password && <p className="text-red-500 text-xs mt-2 ml-1">{errors.password.message}</p>}
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-primary-200 dark:shadow-none disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group mt-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : (
                <>
                  Create Account
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-10 text-center text-slate-500 dark:text-slate-400">
            Already have an account? {' '}
            <Link to="/login" className="text-primary-600 dark:text-primary-400 font-bold hover:text-primary-700 transition-colors">
              Sign in
            </Link>
          </div>

          <div className="mt-8 flex justify-center border-t border-slate-200 dark:border-slate-800 pt-6">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors text-sm font-semibold"
            >
              <ArrowLeft size={16} /> Back to Home
            </Link>
          </div>
        </div>

        {/* Footer info for mobile */}
        <div className="absolute bottom-6 left-0 right-0 text-center lg:hidden">
          <p className="text-xs text-slate-400">© 2026 AMU Dormitory Maintenance System</p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
