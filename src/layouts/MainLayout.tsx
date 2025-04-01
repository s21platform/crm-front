import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../contexts/AuthContext';

const MainLayout: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex">
        {/* Показываем сайдбар только если у пользователя есть доступные сервисы */}
        {user && user.permissions.access.length > 0 && <Sidebar />}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout; 