import { useState, useEffect } from 'react';
import { ClipboardList, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import api from '../../services/api';

const StaffHistory = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // Fetch all assigned tasks, then we will filter on the frontend for now,
        // or the backend can filter by status. We'll fetch all and filter RESOLVED.
        const response = await api.get('/requests');
        const data = response.data.data || response.data;
        
        // Filter only resolved tasks
        const resolvedTasks = (Array.isArray(data) ? data : []).filter(
          task => task.status === 'RESOLVED'
        );
        setTasks(resolvedTasks);
      } catch (err) {
        console.error('Failed to fetch history', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Task History</h1>
        <p className="text-slate-500 dark:text-slate-400">A log of all the maintenance requests you have successfully resolved.</p>
      </div>

      <div className="grid gap-6">
        {loading ? (
          <div className="text-center py-20 text-slate-500">Loading history...</div>
        ) : tasks.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 p-12 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-center">
            <ClipboardList className="mx-auto text-slate-300 dark:text-slate-600 w-12 h-12 mb-4" />
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">No completed tasks</h3>
            <p className="text-slate-500 dark:text-slate-400">Your resolved tasks will appear here.</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm opacity-80">
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 flex items-center gap-1">
                      <CheckCircle2 size={12} /> RESOLVED
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-500">
                      Completed on {new Date(task.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white line-through decoration-slate-300 dark:decoration-slate-600">{task.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                    <span className="font-medium text-slate-700 dark:text-slate-300">{task.dormInfo}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StaffHistory;
