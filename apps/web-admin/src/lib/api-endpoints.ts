export const API_ENDPOINTS = {
    admin: {
        login: '/admins/login',
        signup: '/admins/signup',
        profile: (id: string) => `/admins/${id}`,
    },
    orders: {
        list: '/orders',
        create: '/orders/create',
        detail: (id: string) => `/orders/${id}`,
        assignDriver: (id: string) => `/orders/${id}/assign-driver`,
        updateStatus: (id: string) => `/orders/${id}/status`,
    },
    drivers: {
        lookup: '/drivers/lookup',
    },
} as const;