import { useState, useEffect } from 'react';
import { Hammer, CheckCircle2, Clock, ChevronDown, ChevronUp, ExternalLink, Image as ImageIcon, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';

const StaffDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get('/requests');
        const data = response.data.data || response.data;
        const activeTasks = (Array.isArray(data) ? data : []).filter(
          task => task.status !== 'RESOLVED' && task.status !== 'REJECTED'
        );
        setTasks(activeTasks);
      } catch (err) {
        console.error('Failed to fetch tasks', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const updateStatus = async (id, status, resolutionNotes = null) => {
    setUpdating(id);
    try {
      const payload = { status };
      if (resolutionNotes) {
        payload.notes = resolutionNotes;
      }
      
      await api.patch(`/requests/${id}/status`, payload);
      
      if (status === 'RESOLVED') {
        // Remove from active tasks
        setTasks(prev => prev.filter(t => t.id !== id));
      } else {
        // Update status in place
        setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
      }
      
      setSelectedTask(null);
      setNotes('');
    } catch (err) {
      console.error('Update failed', err);
    } finally {
      setUpdating(null);
    }
  };

  const statusColors = {
    PENDING: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
    ASSIGNED: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
    IN_PROGRESS: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    RESOLVED: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    REJECTED: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">My Tasks</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage and resolve your assigned maintenance requests.</p>
      </div>

      <div className="grid gap-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 p-12 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-center">
            <Hammer className="mx-auto text-slate-300 dark:text-slate-600 w-12 h-12 mb-4" />
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">No tasks assigned yet</h3>
            <p className="text-slate-500 dark:text-slate-400">You'll be notified when new requests are assigned to you.</p>
          </div>
        ) : (
          <AnimatePresence>
            {tasks.map((task) => (
              <motion.div 
                key={task.id} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm"
              >
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                  <div className="flex-1 space-y-2 cursor-pointer w-full" onClick={() => setSelectedTask(selectedTask?.id === task.id ? null : task)}>
                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${statusColors[task.status]}`}>
                        {task.status}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        task.priority === 'URGENT' ? 'bg-red-500 text-white dark:bg-red-600' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        {task.priority} Priority
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-slate-800 dark:text-white hover:text-primary-600 transition-colors">{task.title}</h3>
                      {selectedTask?.id === task.id ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1"><Clock size={14} /> {new Date(task.createdAt).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">{task.dormInfo}</span>
                      {task.attachments?.length > 0 && (
                        <span className="flex items-center gap-1 text-primary-600 dark:text-primary-400"><ImageIcon size={14} /> {task.attachments.length} Images</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
                    {task.status === 'ASSIGNED' && (
                      <button
                        onClick={(e) => { e.stopPropagation(); updateStatus(task.id, 'IN_PROGRESS'); }}
                        disabled={updating === task.id}
                        className="flex-1 md:flex-none px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {updating === task.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Start Work'}
                      </button>
                    )}
                    {task.status === 'IN_PROGRESS' && selectedTask?.id !== task.id && (
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedTask(task); }}
                        className="flex-1 md:flex-none px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 transition-all"
                      >
                        Resolve Task
                      </button>
                    )}
                  </div>
                </div>

                {/* Expanded Details Section */}
                <AnimatePresence>
                  {selectedTask?.id === task.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                        <div className="grid md:grid-cols-2 gap-8">
                          
                          {/* Left: Request Info */}
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Description</h4>
                              <p className="text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
                                {task.description}
                              </p>
                            </div>

                            {task.attachments?.length > 0 && (
                              <div>
                                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Attached Images</h4>
                                <div className="flex gap-3 overflow-x-auto pb-2">
                                  {task.attachments.map((img, i) => (
                                    <img 
                                      key={i} 
                                      src={`http://localhost:5000${img.url}`} 
                                      alt="Attachment" 
                                      className="h-24 w-24 object-cover rounded-xl border border-slate-200 dark:border-slate-700"
                                    />
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Right: Resolution Input */}
                          {task.status === 'IN_PROGRESS' && (
                            <div className="bg-green-50 dark:bg-green-900/10 p-5 rounded-2xl border border-green-100 dark:border-green-900/30">
                              <h4 className="text-sm font-bold text-green-800 dark:text-green-400 mb-3 flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4" /> Finalize Resolution
                              </h4>
                              <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Briefly describe what was fixed (e.g., Replaced lightbulb, unclogged drain)..."
                                className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-green-200 dark:border-green-800/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 mb-4 text-sm dark:text-white resize-none"
                                rows="3"
                              />
                              <button
                                onClick={() => updateStatus(task.id, 'RESOLVED', notes)}
                                disabled={updating === task.id || !notes.trim()}
                                className="w-full py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                              >
                                {updating === task.id ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm & Mark Resolved'}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default StaffDashboard;
