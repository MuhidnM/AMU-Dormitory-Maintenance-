import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Trophy, TrendingUp, AlertCircle, Loader2, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../services/api';

const DetailedAnalytics = () => {
  const [performance, setPerformance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const response = await api.get('/analytics/performance');
        // Sort by resolution rate and total resolved to find the "top performers"
        const sortedData = response.data.sort((a, b) => {
           if (b.resolutionRate !== a.resolutionRate) {
             return b.resolutionRate - a.resolutionRate;
           }
           return b.totalResolved - a.totalResolved;
        });
        setPerformance(sortedData);
      } catch (err) {
        console.error('Failed to fetch performance stats', err);
        setError('Failed to load performance data.');
      } finally {
        setLoading(false);
      }
    };
    fetchPerformance();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center py-32">
      <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
    </div>
  );

  if (error) return (
    <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-2xl text-red-600 dark:text-red-400 flex flex-col items-center justify-center py-20">
      <AlertCircle size={40} className="mb-4" />
      <h3 className="font-bold text-lg">{error}</h3>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white">Detailed Analytics</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Deep dive into staff performance and resolution metrics.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Leaderboard / Top Performers */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200 dark:shadow-none relative overflow-hidden">
             <div className="absolute top-0 right-0 p-6 opacity-20">
               <Trophy size={120} />
             </div>
             <h2 className="text-xl font-bold mb-6 flex items-center gap-2 relative z-10">
               <Award /> Top Performers
             </h2>
             <div className="space-y-4 relative z-10">
               {performance.slice(0, 3).map((staff, idx) => (
                 <div key={staff.id} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-center justify-between border border-white/10">
                   <div className="flex items-center gap-3">
                     <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${idx === 0 ? 'bg-yellow-400 text-yellow-900' : idx === 1 ? 'bg-slate-300 text-slate-800' : 'bg-amber-600 text-white'}`}>
                       {idx + 1}
                     </div>
                     <div>
                       <p className="font-bold">{staff.name}</p>
                       <p className="text-xs text-indigo-200">{staff.totalResolved} tasks resolved</p>
                     </div>
                   </div>
                   <div className="text-right">
                     <p className="font-black text-lg">{Math.round(staff.resolutionRate)}%</p>
                     <p className="text-[10px] uppercase tracking-wider text-indigo-200">Rate</p>
                   </div>
                 </div>
               ))}
               {performance.length === 0 && (
                 <p className="text-indigo-200 italic">No staff performance data available yet.</p>
               )}
             </div>
          </div>
        </div>

        {/* Bar Chart: Assigned vs Resolved */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Staff Workload Distribution</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">Compare total tasks assigned vs successfully resolved per staff member.</p>
          
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={-10} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="totalAssigned" name="Assigned" fill="#94a3b8" radius={[4, 4, 0, 0]} barSize={32} />
                <Bar dataKey="totalResolved" name="Resolved" fill="#10b981" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
           <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
             <TrendingUp className="text-primary-500" /> Complete Performance Breakdown
           </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50">
                <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Staff Member</th>
                <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Assigned</th>
                <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Resolved</th>
                <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Pending Actions</th>
                <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Resolution Rate</th>
              </tr>
            </thead>
            <tbody>
              {performance.map((staff, idx) => {
                const pending = staff.totalAssigned - staff.totalResolved;
                return (
                  <motion.tr 
                    key={staff.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
                    <td className="py-4 px-6 font-bold text-slate-800 dark:text-white">{staff.name}</td>
                    <td className="py-4 px-6 font-medium text-slate-600 dark:text-slate-400">{staff.totalAssigned}</td>
                    <td className="py-4 px-6 font-bold text-emerald-600 dark:text-emerald-400">{staff.totalResolved}</td>
                    <td className="py-4 px-6 font-medium text-amber-600 dark:text-amber-400">{pending > 0 ? pending : '-'}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              staff.resolutionRate > 80 ? 'bg-emerald-500' : 
                              staff.resolutionRate > 50 ? 'bg-amber-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.round(staff.resolutionRate)}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                          {Math.round(staff.resolutionRate)}%
                        </span>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
              {performance.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-500">No staff data available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DetailedAnalytics;
