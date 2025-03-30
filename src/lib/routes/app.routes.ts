export const AppRoutes = {
  // Основные маршруты
  home: () => '/',
  login: () => '/login',
  
  // OptionHub
  optionHub: {
    root: () => '/option-hub',
    requests: () => '/option-hub/requests',
    analytics: () => '/option-hub/analytics',
    settings: () => '/option-hub/settings',
  },

  // Профиль
  profile: {
    root: () => '/profile',
    settings: () => '/profile/settings',
  },

  // Настройки
  settings: () => '/settings',
}; 