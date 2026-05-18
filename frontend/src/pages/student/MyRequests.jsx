import { useState, useEffect } from 'react';
import { Search, Filter, Clock, CheckCircle2, AlertCircle, Wrench, Loader2, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';

const statusConfig = {
  PENDING: { label: 'Pending', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', icon: Clock },
  ASSIGNED: { label: 'Assigned', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: Wrench },
  IN_PROGRESS: { label: 'In Progress', color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400', icon: Wrench },
  COMPLETED: { label: 'Completed', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle2 },
  REJECTED: { label: 'Rejected', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: AlertCircle },
};

const priorityConfig = {
  LOW: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  MEDIUM: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  HIGH: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  URGENT: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      let url = `/requests?page=${page}&limit=8`;
      if (statusFilter) url += `&status=${statusFilter}`;
      const response = await api.get(url);
      const data = response.data.data || response.data;
      setRequests(Array.isArray(data) ? data : []);
      if (response.data.pagination) {
        setTotalPages(response.data.pagination.totalPages);
        setTotal(response.data.pagination.total);
      }
    } catch (err) {
      console.error('Failed to fetch requests', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [page, statusFilter]);

  const filtered = requests.filter(r =>
    r.title?.toLowerCase().includes(search.toLowerCase()) ||
    r.category?.toLowerCase().includes(search.toLowerCase()) ||
    r.dormInfo?.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white">My Requests</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">{total} total request{total !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search requests..."
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
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Request Cards */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
          <AlertCircle className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-500 dark:text-slate-400">No requests found</h3>
          <p className="text-slate-400 dark:text-slate-500 mt-1">Try changing your search or filter.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          <AnimatePresence>
            {filtered.map((request, index) => {
              const status = statusConfig[request.status] || statusConfig.PENDING;
              const StatusIcon = status.icon;
              return (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5 hover:shadow-lg transition-all cursor-pointer group"
                  onClick={() => setSelectedRequest(selectedRequest?.id === request.id ? null : request)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-slate-800 dark:text-white truncate">{request.title}</h3>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${status.color} flex items-center gap-1 shrink-0`}>
                          <StatusIcon className="w-3 h-3" />
                          {status.label}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                        <span className="font-semibold">{request.category}</span>
                        <span>•</span>
                        <span>{request.dormInfo}</span>
                        <span>•</span>
                        <span>{formatDate(request.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${priorityConfig[request.priority] || priorityConfig.LOW}`}>
                        {request.priority}
                      </span>
                      <Eye className="w-4 h-4 text-slate-400 group-hover:text-primary-500 transition-colors" />
                    </div>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {selectedRequest?.id === request.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{request.description}</p>
                          {request.staff && (
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-3">
                              <span className="font-bold">Assigned to:</span> {request.staff.name}
                            </p>
                          )}
                          {request.notes && (
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                              <span className="font-bold">Notes:</span> {request.notes}
                            </p>
                          )}
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-4">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
          >
            <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>
          <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
          >
            <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>
        </div>
      )}
    </div>
  );
};

export default MyRequests;
