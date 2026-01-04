import React from 'react';

const PasswordSection = ({ formData, onChange }) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Password</h2>
      <p className="mb-4 text-sm text-slate-500 dark:text-slate-300">Choose a strong password to secure your account.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="password">
            New Password
          </label>
          <input
            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/40"
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={onChange}
            placeholder="Enter new password"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <input
            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/40"
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={onChange}
            placeholder="Re-enter new password"
          />
        </div>
      </div>
    </div>
  );
};

export default PasswordSection;
