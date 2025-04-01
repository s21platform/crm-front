import { AppRoutes } from '../lib/routes';

export interface MenuItem {
  id: string;
  title: string;
  path: string;
  icon?: string; // Можно добавить иконки позже
  requiredPermission?: string; // Делаем опциональным для базовых пунктов меню
}

export const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    path: '/', // Корневой путь для дашборда
  },
  {
    id: 'optionhub',
    title: 'OptionHub',
    path: AppRoutes.optionHub.root(),
    requiredPermission: 'optionhub'
  },
  // Добавьте другие пункты меню здесь
  // Например:
  // {
  //   id: 'analytics',
  //   title: 'Аналитика',
  //   path: AppRoutes.analytics.root(),
  //   requiredPermission: 'analytics'
  // }
]; 