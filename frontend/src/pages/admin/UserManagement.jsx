import { useState, useEffect } from 'react';
import { Users, Plus, Trash2, Mail, Shield, Building, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'STUDENT',
    dormInfo: ''
  });

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (err) {
      console.error('Failed to fetch users', err);
      setError('Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setError('');
    
    try {
      const payload = { ...formData };
      if (payload.role !== 'STUDENT') {
        payload.dormInfo = null; // Only students need dorm info
      }
      
      const response = await api.post('/users', payload);
      setUsers(prev => [response.data, ...prev]);
      
      // Reset form & close modal
      setFormData({ name: '', email: '', password: '', role: 'STUDENT', dormInfo: '' });
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to create user');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await api.delete(`/users/${id}`);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const roleColors = {
    ADMIN: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    STAFF: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
    STUDENT: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white">User Management</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Add, edit, and remove system users.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-primary-500/30 dark:shadow-none"
        >
          <Plus size={20} />
          Add New User
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30 rounded-xl flex items-center gap-3 font-semibold">
          <AlertCircle size={20} /> {error}
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/40 dark:shadow-none">
        {loading ? (
          <div className="flex justify-center items-center py-24">
             <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                  <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Name & Email</th>
                  <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Role</th>
                  <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Location Details</th>
                  <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {users.map((user) => (
                    <motion.tr 
                      key={user.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group"
                    >
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800 dark:text-white">{user.name}</span>
                          <span className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                             <Mail size={12} /> {user.email}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center w-max gap-1.5 ${roleColors[user.role]}`}>
                          <Shield size={12} /> {user.role}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        {user.dormInfo ? (
                          <span className="text-sm font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                            <Building size={14} className="text-slate-400" /> {user.dormInfo}
                          </span>
                        ) : (
                          <span className="text-sm text-slate-400 dark:text-slate-600 italic">N/A</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button 
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                          title="Delete User"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-100 dark:border-slate-800"
            >
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Create New User</h2>
              <form onSubmit={handleCreateUser} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl focus:outline-none focus:border-primary-500 font-semibold dark:text-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
                  <input 
                    required
                    type="email" 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl focus:outline-none focus:border-primary-500 font-semibold dark:text-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Password</label>
                  <input 
                    required
                    type="password" 
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl focus:outline-none focus:border-primary-500 font-semibold dark:text-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">System Role</label>
                  <select 
                    value={formData.role}
                    onChange={e => setFormData({...formData, role: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl focus:outline-none focus:border-primary-500 font-semibold dark:text-white transition-colors"
                  >
                    <option value="STUDENT">Student</option>
                    <option value="STAFF">Maintenance Staff</option>
                    <option value="ADMIN">Administrator</option>
                  </select>
                </div>
                
                {formData.role === 'STUDENT' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Dormitory Info</label>
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. Block A, Room 101"
                      value={formData.dormInfo}
                      onChange={e => setFormData({...formData, dormInfo: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl focus:outline-none focus:border-primary-500 font-semibold dark:text-white transition-colors"
                    />
                  </div>
                )}

                <div className="flex items-center gap-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={actionLoading}
                    className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                  >
                    {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    Create User
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default UserManagement;
