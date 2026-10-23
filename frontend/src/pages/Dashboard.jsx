import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/ui/Sidebar';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50/70 w-full flex flex-col md:flex-row">
      <Sidebar />
      <main className="flex-1 w-full min-w-0">
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;