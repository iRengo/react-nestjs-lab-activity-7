import React from 'react';
import { Outlet } from 'react-router-dom';
import UserHeader from './UserHeader';
import UserSidebar from './UserSidebar';

const UserLayout = () => {
  return (
    <div className="flex min-h-screen bg-[#F7F8FA]">
      <UserSidebar />
      <div className="flex flex-1 flex-col">
        <UserHeader />
        <main className="flex-1 overflow-y-auto px-6 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
