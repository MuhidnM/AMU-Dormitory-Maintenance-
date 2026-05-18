import { useState, useEffect, useRef } from 'react';
import { Bell, Search, User, Menu, Moon, Sun, CheckCheck } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useTheme } from '../hooks/useTheme';
import api from '../services/api';
import socketService from '../services/socket';

const Navbar = ({ onMenuClick }) => {
  const { user } = useAuthStore();
  const { theme, toggleTheme } = useTheme();

  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      try {
        const response = await api.get('/notifications');
        setNotifications(response.data);
      } catch (err) {
        console.error('Failed to fetch notifications', err);
      }
    };

    fetchNotifications();

    socketService.connect(user.id);
    socketService.on('notification', (newNotif) => {
      setNotifications(prev => [newNotif, ...prev]);
    });

    return () => {
      socketService.off('notification');
      socketService.disconnect();
    };
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 fixed top-0 right-0 left-0 lg:left-64 z-40 px-4 sm:px-8 flex items-center justify-between transition-all duration-300">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400 transition-colors"
        >
          <Menu size={24} />
        </button>

        <div className="relative hidden md:block w-72 lg:w-96">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Search requests..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-50 dark:focus:ring-primary-900/20 focus:border-primary-500 transition-all duration-200 text-sm text-slate-900 dark:text-white dark:placeholder-slate-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-6">
        <button 
          onClick={toggleTheme}
          className="p-2 text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl transition-all duration-200"
        >
          {theme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
        </button>

        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="relative p-2 text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl transition-all duration-200"
          >
            <Bell size={22} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white dark:border-slate-900 font-bold">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Dropdown */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none z-50 overflow-hidden transform origin-top-right transition-all">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900">
                <h3 className="font-bold text-slate-800 dark:text-white">Notifications</h3>
                {unreadCount > 0 && (
                  <button 
                    onClick={handleMarkAllAsRead}
                    className="text-xs text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1 font-medium"
                  >
                    <CheckCheck size={14} /> Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-[60vh] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 dark:text-slate-400 flex flex-col items-center">
                    <Bell size={24} className="mb-2 opacity-20" />
                    <p className="text-sm">No notifications yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {notifications.map((notif) => (
                      <div 
                        key={notif.id}
                        className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex gap-3 ${!notif.read ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''}`}
                      >
                        <div className="flex-1">
                          <p className={`text-sm ${!notif.read ? 'text-slate-900 dark:text-white font-semibold' : 'text-slate-600 dark:text-slate-400'}`}>
                            {notif.message}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            {new Date(notif.createdAt).toLocaleDateString()} at {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          {!notif.read && (
                            <button 
                              onClick={() => handleMarkAsRead(notif.id)}
                              className="text-xs text-primary-600 dark:text-primary-400 font-medium mt-2 hover:underline inline-block"
                            >
                              Mark as read
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 border-l border-slate-200 dark:border-slate-800 pl-4 sm:pl-6 ml-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">{user?.name}</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider mt-1">{user?.role}</p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center rounded-xl font-bold shadow-lg shadow-primary-500/20 transform transition-transform hover:scale-105 cursor-pointer">
            {user?.name?.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;


