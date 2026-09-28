export const API_ENDPOINTS = {
    admin: {
        login: '/admins/login',
        signup: '/admins/signup',
        profile: (id: string) => `/admins/${id}`,
    },
    orders: {
        list: '/orders',
        create: '/orders/create',
        update: (id: string) => `/orders/${id}`,
        detail: (id: string) => `/orders/${id}`,
        assignDriver: (id: string) => `/orders/${id}/assign-driver`,
        updateStatus: (id: string) => `/orders/${id}/status`,
    },
    drivers: {
        list: '/drivers',
        lookup: '/drivers/lookup',
        create: '/drivers/signup',
        update: (id: string) => `/drivers/${id}`,
        detail: (id: string) => `/drivers/${id}`,
        updateIdentityStatus: (id: string) => `/drivers/${id}/identity-status`,
    },
} as const;