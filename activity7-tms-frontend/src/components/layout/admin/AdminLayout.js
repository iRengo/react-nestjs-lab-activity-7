import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import Sidebar from './AdminSidebar';

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-[#FCFCFC]">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto px-8 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
