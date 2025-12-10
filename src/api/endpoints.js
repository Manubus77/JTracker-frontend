export const endpoints = {
  auth: {
    register: '/auth/register',
    login: '/auth/login',
    me: '/auth/me',
    refresh: '/auth/refresh',
    logout: '/auth/logout',
  },
  applications: '/applications',
}

export const applicationById = (id) => `${endpoints.applications}/${id}`

