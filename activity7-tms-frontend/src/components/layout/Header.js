import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useNavigate} from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [isConfirmingLogout, setIsConfirmingLogout] = useState(false);

  const syncUserInfo = useCallback(() => {
    if (typeof window === 'undefined') {
      return;
    }

    setUserName(localStorage.getItem('userName') ?? '');
    setUserRole(localStorage.getItem('userRole') ?? '');
  }, []);

  useEffect(() => {
    syncUserInfo();

    const handleStorage = () => syncUserInfo();
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [syncUserInfo]);

  const initials = useMemo(() => {
    if (!userName) {
      return 'U';
    }

    return userName
      .split(' ')
      .filter(Boolean)
      .map((part) => part[0]?.toUpperCase())
      .slice(0, 2)
      .join('') || 'U';
  }, [userName]);

  const clearSession = useCallback(() => {
    if (typeof window === 'undefined') {
      return;
    }

    localStorage.removeItem('accessToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    navigate('/login', {replace: true});
  }, [navigate]);

  const handleConfirmLogout = useCallback(() => {
    clearSession();
    setIsConfirmingLogout(false);
  }, [clearSession]);

  const handleCancelLogout = useCallback(() => {
    setIsConfirmingLogout(false);
  }, [navigate]);

  const handleLogoutClick = useCallback(() => {
    setIsConfirmingLogout(true);
  }, []);

  return (
    <header className="flex items-center justify-between bg-white px-6 py-4 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500 font-semibold text-white">
          T
        </div>
        <div>
          <p className="text-sm text-slate-500">Task Management</p>
          <h1 className="text-lg font-semibold text-slate-900">Team Workspace</h1>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-slate-900">{userName || 'Unknown User'}</p>
          <p className="text-xs text-slate-500">{userRole || 'Role unavailable'}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-600">
          {initials}
        </div>
        <div className="relative">
          <button
            type="button"
            onClick={handleLogoutClick}
            className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
          >
            Logout
          </button>
          {isConfirmingLogout && (
            <div className="absolute right-0 top-12 w-56 rounded-lg border border-slate-200 bg-white p-4 shadow-lg">
              <p className="mb-3 text-sm text-slate-700">Are you sure you want to log out?</p>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCancelLogout}
                  className="rounded-md border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmLogout}
                  className="rounded-md bg-red-500 px-3 py-1 text-xs font-medium text-white transition hover:bg-red-600"
                >
                  Confirm
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
