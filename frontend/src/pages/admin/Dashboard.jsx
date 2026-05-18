import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  Users, 
  ClipboardList, 
  Clock, 
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  ArrowUpRight,
  MoreVertical,
  Activity,
  PlusCircle,
  User
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import { useTheme } from '../../hooks/useTheme';

const COLORS = ['#0ea5e9', '#6366f1', '#f59e0b', '#ef4444', '#10b981'];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { theme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/analytics/stats');
        setStats(response.data);
      } catch (err) {
        console.error('Failed to fetch stats', err);
        setError('Failed to load system analytics. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      <p className="text-slate-500 font-medium animate-pulse">Analyzing system data...</p>
    </div>
  );

  if (error || !stats) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-8 text-center">
      <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-2xl text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/20">
        <AlertCircle size={48} className="mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">Error Loading Dashboard</h2>
        <p className="max-w-md">{error || 'Unable to retrieve statistics at this time.'}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all"
        >
          Retry
        </button>
      </div>
    </div>
  );

  const summaryCards = [
    { label: 'Total Requests', value: stats?.total || 0, icon: ClipboardList, trend: '+12%', color: 'from-blue-500 to-blue-600', shadow: 'shadow-blue-200 dark:shadow-none' },
    { label: 'Pending', value: stats?.pending || 0, icon: Clock, trend: '-5%', color: 'from-amber-500 to-amber-600', shadow: 'shadow-amber-200 dark:shadow-none' },
    { label: 'Resolved', value: stats?.resolved || 0, icon: CheckCircle2, trend: '+18%', color: 'from-emerald-500 to-emerald-600', shadow: 'shadow-emerald-200 dark:shadow-none' },
    { label: 'Active Users', value: stats?.totalUsers || 0, icon: Users, trend: '+8%', color: 'from-violet-500 to-violet-600', shadow: 'shadow-violet-200 dark:shadow-none' },
  ];

  const recentActivities = [
    { id: 1, user: 'John Doe', action: 'submitted a new request', time: '2 mins ago', type: 'new' },
    { id: 2, user: 'Staff Sarah', action: 'marked request #452 as resolved', time: '15 mins ago', type: 'resolve' },
    { id: 3, user: 'Admin Mike', action: 'updated system configuration', time: '1 hour ago', type: 'admin' },
    { id: 4, user: 'Jane Smith', action: 'reported an urgent plumbing issue', time: '3 hours ago', type: 'urgent' },
  ];

  return (
    <div className="space-y-8 pb-12 transition-colors duration-300">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Analytics Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-lg">Monitor and manage dormitory maintenance efficiently.</p>
        </motion.div>
        <div className="flex items-center gap-3">
           <button 
             onClick={() => window.print()}
             className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm">
             Download Report
           </button>
           <button 
             onClick={() => navigate('/admin/users')}
             className="px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 dark:shadow-none">
             Manage Staff
           </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-col justify-between group hover:border-primary-100 dark:hover:border-primary-900 transition-colors cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className={`bg-gradient-to-br ${card.color} p-3 rounded-2xl shadow-lg ${card.shadow} text-white`}>
                <card.icon size={24} />
              </div>
              <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-lg text-xs font-bold">
                <TrendingUp size={12} />
                {card.trend}
              </div>
            </div>
            <div className="mt-6">
              <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">{card.label}</p>
              <div className="flex items-end gap-2 mt-1">
                <p className="text-3xl font-black text-slate-900 dark:text-white">{card.value}</p>
                <div className="mb-1 text-slate-400 dark:text-slate-500 group-hover:text-primary-500 transition-colors">
                  <ArrowUpRight size={20} />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Category Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Requests by Category</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Distribution of maintenance tasks across departments.</p>
            </div>
            <button className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-slate-400 dark:text-slate-500">
              <MoreVertical size={20} />
            </button>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.byCategory || []}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} />
                <XAxis 
                  dataKey="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: theme === 'dark' ? '#94a3b8' : '#64748b', fontSize: 12, fontWeight: 500}} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: theme === 'dark' ? '#94a3b8' : '#64748b', fontSize: 12, fontWeight: 500}} 
                  dx={-10}
                />
                <Tooltip 
                  cursor={{stroke: '#0ea5e9', strokeWidth: 2}}
                  contentStyle={{
                    borderRadius: '16px', 
                    border: 'none', 
                    backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff',
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                    color: theme === 'dark' ? '#ffffff' : '#000000'
                  }}
                  itemStyle={{ color: '#0ea5e9' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="_count._all" 
                  stroke="#0ea5e9" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorCount)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Chart */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-col">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Priority Distribution</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Overview of task urgency levels.</p>
          <div className="h-64 flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats?.byPriority || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={8}
                  dataKey="_count._all"
                >
                  {(stats?.byPriority || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    borderRadius: '16px', 
                    border: 'none', 
                    backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff',
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 space-y-3">
            {(stats?.byPriority || []).map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase">{item.priority}</span>
                </div>
                <span className="text-sm font-bold text-slate-900 dark:text-white">{item._count._all}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity & Quick Stats */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
          <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-lg">
                 <Activity size={20} />
               </div>
               <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Activity</h2>
            </div>
            <button className="text-sm font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700">View All</button>
          </div>
          <div className="p-4 sm:p-8 space-y-6">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  activity.type === 'new' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' :
                  activity.type === 'resolve' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' :
                  'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}>
                  {activity.type === 'new' ? <PlusCircle size={20} /> :
                   activity.type === 'resolve' ? <CheckCircle2 size={20} /> :
                   <User size={20} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-snug">
                    <span className="font-bold text-slate-900 dark:text-white">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Health / Quick Stats */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 rounded-3xl p-8 text-white shadow-2xl transition-all duration-300">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
            <AlertCircle size={24} className="text-primary-400" />
            System Health
          </h2>
          <div className="space-y-8">
             <div>
               <div className="flex justify-between mb-2">
                 <span className="text-sm font-medium text-slate-400">Response Rate</span>
                 <span className="text-sm font-bold text-primary-400">94%</span>
               </div>
               <div className="w-full h-2 bg-slate-700 dark:bg-slate-800 rounded-full overflow-hidden">
                 <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '94%' }}
                    transition={{ duration: 1 }}
                    className="h-full bg-primary-500 rounded-full" 
                  />
               </div>
             </div>
             <div>
               <div className="flex justify-between mb-2">
                 <span className="text-sm font-medium text-slate-400">Staff Efficiency</span>
                 <span className="text-sm font-bold text-emerald-400">88%</span>
               </div>
               <div className="w-full h-2 bg-slate-700 dark:bg-slate-800 rounded-full overflow-hidden">
                 <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '88%' }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="h-full bg-emerald-500 rounded-full" 
                  />
               </div>
             </div>
             <div>
               <div className="flex justify-between mb-2">
                 <span className="text-sm font-medium text-slate-400">Student Satisfaction</span>
                 <span className="text-sm font-bold text-violet-400">92%</span>
               </div>
               <div className="w-full h-2 bg-slate-700 dark:bg-slate-800 rounded-full overflow-hidden">
                 <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '92%' }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="h-full bg-violet-500 rounded-full" 
                  />
               </div>
             </div>

             <div className="pt-6 border-t border-slate-700 dark:border-slate-800">
                <div className="bg-slate-700/50 dark:bg-slate-800/50 p-4 rounded-2xl flex items-center gap-4">
                   <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center">
                      <CheckCircle2 size={24} />
                   </div>
                   <div>
                      <p className="text-sm font-bold">All Systems Normal</p>
                      <p className="text-xs text-slate-400">Last check: 1 min ago</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default AdminDashboard;


