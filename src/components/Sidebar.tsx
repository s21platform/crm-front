import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { menuItems } from '../config/menu.config';

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  // Фильтруем пункты меню: показываем базовые пункты и те, к которым есть доступ
  const availableMenuItems = menuItems.filter(item => 
    !item.requiredPermission || // базовые пункты меню
    user?.permissions?.access?.includes(item.requiredPermission) // пункты с проверкой прав
  );

  // Не показываем сайдбар, если нет пользователя или доступных пунктов меню
  if (!user || availableMenuItems.length === 0) {
    return null;
  }

  return (
    <div className="bg-white h-full w-64 border-r border-gray-200">
      <div className="p-4">
        <nav className="space-y-1">
          {availableMenuItems.map((item) => {
            const isActive = location.pathname === item.path; // Точное совпадение для путей
            
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`
                  flex items-center px-4 py-2 text-sm font-medium rounded-md
                  ${isActive
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                {/* Если добавите иконки, их можно разместить здесь */}
                {item.title}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar; 