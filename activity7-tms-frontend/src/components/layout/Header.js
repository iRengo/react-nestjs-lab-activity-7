import React from 'react';

const Header = () => {
  return (
    <header className="flex items-center justify-between bg-white px-6 py-4 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-indigo-500 text-white flex items-center justify-center font-semibold">
          T
        </div>
        <div>
          <p className="text-sm text-slate-500">Task Management</p>
          <h1 className="text-lg font-semibold text-slate-900">Team Workspace</h1>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
        >
          Quick Action
        </button>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium text-slate-900">Alex Johnson</p>
            <p className="text-xs text-slate-500">Product Manager</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-600">
            AJ
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
