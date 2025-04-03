export const AppRoutes = {
  // Основные маршруты
  home: () => '/',
  login: () => '/login',
  
  // Staff
  staff: {
    root: () => '/staff',
  },
  
  // OptionHub
  optionHub: {
    root: () => '/optionhub',
    requests: () => '/optionhub/requests',
    analytics: () => '/optionhub/analytics',
    settings: () => '/optionhub/settings',
  },

  // Профиль
  profile: {
    root: () => '/profile',
    settings: () => '/profile/settings',
  },

  // Настройки
  settings: () => '/settings',
}; 