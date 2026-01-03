import React from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../../../assets/icon/actlogo.png';

const navItems = [
  { label: 'Dashboard', to: '/adminSide/dashboard' },
  { label: 'Projects', to: '/adminSide/projects' },
  { label: 'Tasks', to: '/adminSide/tasks' },
  { label: 'Users', to: '/adminSide/users' },
  { label: 'Settings', to: '/adminSide/settings' },
];

const Sidebar = () => {
  return (
    <aside className="flex h-screen w-64 flex-col bg-white px-4 py-6 shadow-sm">
      <div className="mb-8 flex items-center gap-3 px-2">
        <img src={logo} alt="TaskRush logo" className="h-10 w-10 rounded-lg object-contain" />
        <div>
          <p className="text-2xl font-bold text-slate-900">
            Task<span className="ml-0.5 rounded-md font-bold text-indigo-600">Rush</span>
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
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto rounded-lg bg-slate-100 px-2 py-2 text-xs text-slate-500">
        <p className="mt-1 text-[10px] text-slate-400">Copyright © 2026 TaskRush. All rights reserved.</p>
      </div>
    </aside>
  );
};

export default Sidebar;
