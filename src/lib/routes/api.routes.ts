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
    login: () => '/adm/auth/login',
    logout: () => '/adm/auth/logout',
    refresh: () => '/adm/auth/refresh',
  },

  // Настройки
  settings: {
    get: () => '/api/settings',
    update: () => '/api/settings',
  },
}; 