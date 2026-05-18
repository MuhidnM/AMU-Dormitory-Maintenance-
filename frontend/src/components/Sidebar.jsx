import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ClipboardList, 
  PlusCircle, 
  Users, 
  BarChart3, 
  Settings,
  LogOut,
  Hammer,
  X
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import amuLogo from '../assets/amu-logo.png';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const menuItems = {
    STUDENT: [
      { name: 'Dashboard', path: '/student', icon: LayoutDashboard },
      { name: 'New Request', path: '/student/new-request', icon: PlusCircle },
      { name: 'My Requests', path: '/student/requests', icon: ClipboardList },
    ],
    STAFF: [
      { name: 'Tasks', path: '/staff', icon: Hammer },
      { name: 'History', path: '/staff/history', icon: ClipboardList },
    ],
    ADMIN: [
      { name: 'Overview', path: '/admin', icon: LayoutDashboard },
      { name: 'Requests', path: '/admin/requests', icon: ClipboardList },
      { name: 'User Management', path: '/admin/users', icon: Users },
      { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    ]
  };

  const items = menuItems[user?.role] || [];

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: '-100%' },
  };

  return (
    <>
      <motion.aside
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
        transition={{ type: 'spring', damping: 20, stiffness: 150 }}
        className={`fixed top-0 left-0 bottom-0 w-64 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 z-50 flex flex-col lg:translate-x-0 transition-none border-r border-slate-200 dark:border-slate-800`}
        style={{
           // On desktop, we want it to be visible always, but variants will handle mobile
           transform: typeof window !== 'undefined' && window.innerWidth >= 1024 ? 'none' : undefined
        }}
      >
        {/* Force override for desktop */}
        <div className="hidden lg:flex flex-col h-full w-full">
           <SidebarContent items={items} location={location} logout={logout} setIsOpen={setIsOpen} />
        </div>

        {/* Mobile View Content */}
        <div className="lg:hidden flex flex-col h-full w-full">
           <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={amuLogo} alt="AMU Logo" className="w-8 h-8 object-contain drop-shadow-md" />
                <span className="font-bold text-xl text-slate-900 dark:text-white">AMU</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                <X size={20} />
              </button>
           </div>
           <SidebarLinks items={items} location={location} setIsOpen={setIsOpen} />
           <SidebarFooter logout={logout} />
        </div>
      </motion.aside>

      {/* Static Sidebar for Desktop */}
      <aside className="hidden lg:flex fixed top-0 left-0 bottom-0 w-64 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 z-30 flex-col border-r border-slate-200 dark:border-slate-800">
        <SidebarContent items={items} location={location} logout={logout} />
      </aside>
    </>
  );
};

const SidebarContent = ({ items, location, logout }) => (
  <>
    <div className="p-8 flex items-center gap-3">
      <img src={amuLogo} alt="AMU Logo" className="w-10 h-10 object-contain drop-shadow-md" />
      <span className="font-bold text-xl text-slate-900 dark:text-white tracking-tight">AMU</span>
    </div>

    <SidebarLinks items={items} location={location} />
    <SidebarFooter logout={logout} />
  </>
);

const SidebarLinks = ({ items, location, setIsOpen }) => (
  <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
    {items.map((item) => {
      const Icon = item.icon;
      const isActive = location.pathname === item.path;
      return (
        <Link
          key={item.path}
          to={item.path}
          onClick={() => setIsOpen && setIsOpen(false)}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
            isActive 
              ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20 font-semibold' 
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <Icon size={20} className={`${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500 group-hover:text-primary-600 dark:group-hover:text-primary-400'} transition-colors`} />
          {item.name}
        </Link>
      );
    })}
  </nav>
);

const SidebarFooter = ({ logout }) => (
  <div className="p-4 border-t border-slate-200 dark:border-slate-800/50">
    <button 
      onClick={logout}
      className="flex items-center gap-3 w-full px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-white hover:bg-red-50 dark:hover:bg-red-500/10 hover:border-red-200 dark:hover:border-red-500/20 border border-transparent rounded-xl transition-all"
    >
      <LogOut size={20} />
      <span className="font-medium">Logout</span>
    </button>
  </div>
);

export default Sidebar;

