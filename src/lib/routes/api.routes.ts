export const ApiRoutes = {
  // Профиль
  profile: () => '/api/profile',
  
  // Опции
  optionRequests: {
    list: () => '/api/option_requests',
    details: (id: number) => `/api/option_requests/${id}`,
  },

  // Аутентификация
  auth: {
    login: () => '/api/auth/login',
    logout: () => '/api/auth/logout',
    refresh: () => '/api/auth/refresh',
  },

  // Настройки
  settings: {
    get: () => '/api/settings',
    update: () => '/api/settings',
  },
}; 