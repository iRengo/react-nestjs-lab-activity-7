import React from 'react';

const ProfileSection = ({ formData, onChange, isLoading }) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Profile Information</h2>
      {isLoading ? (
        <p className="text-sm text-slate-500 dark:text-slate-300">Loading profile...</p>
      ) : (
        <div className="grid gap-4 pt-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="userId">
                User ID
              </label>
              <input
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/40"
                id="userId"
                name="userId"
                type="text"
                value={formData.userId}
                onChange={onChange}
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="role">
                Role
              </label>
              <input
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/40"
                id="role"
                name="role"
                type="text"
                value={formData.role ?? ''}
                onChange={onChange}
                disabled
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="firstName">
                First Name
              </label>
              <input
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/40"
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={onChange}
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="lastName">
                Last Name
              </label>
              <input
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/40"
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={onChange}
                disabled
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="email">
              Email Address
            </label>
            <input
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/40"
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={onChange}
              disabled
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSection;
