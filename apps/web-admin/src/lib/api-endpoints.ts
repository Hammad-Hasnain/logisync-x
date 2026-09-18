export const API_ENDPOINTS = {
    admin: {
        login: '/admins/login',
        signup: '/admins/signup',
        profile: (id: string) => `/admins/${id}`,
    },
    orders: {},
    drivers: {},
} as const;