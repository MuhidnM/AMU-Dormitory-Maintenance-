import { useState, useEffect } from 'react';
import { ClipboardList, Clock, CheckCircle2, AlertCircle, Wrench, ChevronDown, ChevronUp, Search, Filter, Loader2, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';

const AdminRequests = () => {
  const [requests, setRequests] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch Staff for Assignment Dropdowns
        const staffRes = await api.get('/users?role=STAFF');
        setStaff(staffRes.data);

        // Fetch Requests
        let url = `/requests?page=${page}&limit=10`;
        if (statusFilter) url += `&status=${statusFilter}`;
        const reqRes = await api.get(url);
        
        const data = reqRes.data.data || reqRes.data;
        setRequests(Array.isArray(data) ? data : []);
        if (reqRes.data.pagination) {
          setTotalPages(reqRes.data.pagination.totalPages);
          setTotal(reqRes.data.pagination.total);
        }
      } catch (err) {
        console.error('Failed to fetch data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page, statusFilter]);

  const filtered = requests.filter(r =>
    r.title?.toLowerCase().includes(search.toLowerCase()) ||
    r.category?.toLowerCase().includes(search.toLowerCase()) ||
    r.student?.name?.toLowerCase().includes(search.toLowerCase()) ||
    r.dormInfo?.toLowerCase().includes(search.toLowerCase())
  );

  const assignRequest = async (requestId, staffId) => {
    if (!staffId) return;
    setUpdating(requestId);
    try {
      await api.patch(`/requests/${requestId}/assign`, { staffId });
      
      // Update local state
      const assignedStaff = staff.find(s => s.id === staffId);
      setRequests(prev => prev.map(req => {
        if (req.id === requestId) {
          return { ...req, status: 'ASSIGNED', staffId, staff: assignedStaff };
        }
        return req;
      }));
    } catch (err) {
      console.error('Failed to assign request', err);
    } finally {
      setUpdating(null);
    }
  };

  const statusConfig = {
    PENDING: { label: 'Pending', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', icon: Clock },
    ASSIGNED: { label: 'Assigned', color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400', icon: UserPlus },
    IN_PROGRESS: { label: 'In Progress', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: Wrench },
    RESOLVED: { label: 'Resolved', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle2 },
    REJECTED: { label: 'Rejected', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: AlertCircle },
  };

  const priorityConfig = {
    LOW: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
    MEDIUM: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    HIGH: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    URGENT: 'bg-red-500 text-white dark:bg-red-600',
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white">Request Management</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Review, assign, and track maintenance issues.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by title, student, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-500 transition-all font-semibold dark:text-white dark:placeholder-slate-500"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-500 transition-all font-semibold dark:text-white appearance-none cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
          <ClipboardList className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-500 dark:text-slate-400">No requests found</h3>
        </div>
      ) : (
        <div className="grid gap-4">
          <AnimatePresence>
            {filtered.map((req) => {
              const status = statusConfig[req.status] || statusConfig.PENDING;
              const StatusIcon = status.icon;
              return (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5 shadow-sm overflow-hidden"
                >
                  <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
                    
                    {/* Left: Info */}
                    <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setSelectedRequest(selectedRequest?.id === req.id ? null : req)}>
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${status.color} flex items-center gap-1 shrink-0`}>
                          <StatusIcon className="w-3 h-3" />
                          {status.label}
                        </span>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${priorityConfig[req.priority] || priorityConfig.LOW}`}>
                          {req.priority}
                        </span>
                        <h3 className="font-bold text-slate-800 dark:text-white truncate hover:text-primary-600 transition-colors">
                          {req.title}
                        </h3>
                        {selectedRequest?.id === req.id ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{req.student?.name}</span>
                        <span>•</span>
                        <span className="font-medium text-slate-600 dark:text-slate-400">{req.dormInfo}</span>
                        <span>•</span>
                        <span>{new Date(req.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Right: Assignment */}
                    <div className="flex items-center gap-3 w-full lg:w-auto shrink-0 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                      <div className="flex flex-col w-full sm:w-48">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Assign To Staff</label>
                        <select
                          className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
                          value={req.staffId || ''}
                          onChange={(e) => assignRequest(req.id, e.target.value)}
                          disabled={updating === req.id || req.status === 'RESOLVED'}
                        >
                          <option value="" disabled>Select Staff</option>
                          {staff.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                          ))}
                        </select>
                      </div>
                      {updating === req.id && <Loader2 className="w-5 h-5 text-primary-500 animate-spin" />}
                    </div>
                  </div>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {selectedRequest?.id === req.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700 grid md:grid-cols-2 gap-8">
                          <div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Description</h4>
                            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                              {req.description}
                            </p>
                          </div>
                          <div className="space-y-4">
                            {req.attachments?.length > 0 && (
                              <div>
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Attached Images</h4>
                                <div className="flex gap-2 overflow-x-auto">
                                  {req.attachments.map((img, i) => (
                                    <img key={i} src={`http://localhost:5000${img.url}`} className="h-20 w-20 object-cover rounded-lg border border-slate-200 dark:border-slate-700" alt="Attachment" />
                                  ))}
                                </div>
                              </div>
                            )}
                            {req.notes && (
                              <div>
                                <h4 className="text-xs font-bold text-green-500 uppercase tracking-wider mb-2">Resolution Notes</h4>
                                <p className="text-green-700 dark:text-green-400 text-sm bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30 p-3 rounded-lg">
                                  {req.notes}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default AdminRequests;
