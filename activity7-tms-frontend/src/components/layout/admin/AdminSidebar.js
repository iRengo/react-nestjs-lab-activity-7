import React from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../../../assets/icon/actlogo.png';
import darkLogo from '../../../assets/icon/actlogo-dark.png';
import { useTheme } from '../../../hooks/useTheme';

const navItems = [
  { label: 'Dashboard', to: '/adminSide/dashboard' },
  { label: 'Projects', to: '/adminSide/projects' },
  { label: 'Tasks', to: '/adminSide/tasks' },
  { label: 'Users', to: '/adminSide/users' },
  { label: 'Settings', to: '/adminSide/settings' },
];

const Sidebar = () => {
  const { theme } = useTheme();
  const logoSrc = theme === 'dark' ? darkLogo : logo;

  return (
    <aside className="flex h-screen w-64 flex-col bg-white px-4 py-6 shadow-sm transition-colors dark:bg-slate-900 dark:shadow-slate-900/30">
      <div className="mb-8 flex items-center gap-3 px-2">
        <img src={logoSrc} alt="TaskRush logo" className="h-10 w-10 rounded-lg object-contain transition-all" />
        <div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            Task<span className="ml-0.5 rounded-md font-bold text-indigo-600 dark:text-indigo-300">Rush</span>
          </p>
        </div>
      </div>
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto rounded-lg bg-slate-100 px-2 py-2 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-300">
        <p className="mt-1 text-[10px] text-slate-400 dark:text-slate-400">Copyright © 2026 TaskRush. All rights reserved.</p>
      </div>
    </aside>
  );
};

export default Sidebar;
