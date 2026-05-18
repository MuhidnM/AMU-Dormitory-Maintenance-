import { useState, useEffect } from 'react';
import { 
  PlusCircle, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ArrowUpRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const StudentDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await api.get('/requests?limit=5');
        // Handle both old array format and new paginated format for robustness
        const data = response.data.data || response.data;
        setRequests(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch requests', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const stats = [
    { label: 'Total Requests', value: requests.length, icon: Clock, color: 'bg-blue-500' },
    { label: 'Resolved', value: requests.filter(r => r.status === 'RESOLVED').length, icon: CheckCircle2, color: 'bg-green-500' },
    { label: 'Pending', value: requests.filter(r => r.status === 'PENDING').length, icon: AlertCircle, color: 'bg-amber-500' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white transition-colors">My Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400">Welcome to AMU Dormitory Maintenance System</p>
        </div>
        <Link 
          to="/student/new-request" 
          className="bg-primary-600 text-white px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-primary-700 transition-all shadow-lg shadow-primary-200"
        >
          <PlusCircle size={20} />
          New Request
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-all duration-300">
            <div className={`${stat.color} p-3 rounded-xl text-white shadow-lg shadow-${stat.color.split('-')[1]}-200 dark:shadow-none`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Requests */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-all duration-300">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">Recent Requests</h2>
          <Link to="/student/requests" className="text-primary-600 dark:text-primary-400 text-sm font-semibold hover:underline flex items-center gap-1">
            View All <ArrowUpRight size={14} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-sm">
              <tr>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Title</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Priority</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-400 dark:text-slate-500">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
                      Loading your requests...
                    </div>
                  </td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-400 dark:text-slate-500">
                    <AlertCircle size={32} className="mx-auto mb-2 opacity-20" />
                    No requests found. Start by creating one!
                  </td>
                </tr>
              ) : (
                requests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                    <td className="px-6 py-4 font-medium text-slate-800 dark:text-white">{req.title}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{req.category}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        req.priority === 'URGENT' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                        req.priority === 'HIGH' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' :
                        req.priority === 'MEDIUM' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                        'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        {req.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        req.status === 'RESOLVED' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                        req.status === 'PENDING' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' :
                        req.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                        'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-500 text-sm">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};


export default StudentDashboard;
