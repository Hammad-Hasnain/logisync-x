
export const API_ENDPOINTS = {
    identity: {
        login: '/identity/login',
    },
    admin: {
        signup: '/admins/signup',
        dashboardAnalytics: '/admins/dashboard/analytics',
        profile: (id: string) => `/admins/${id}`,
    },
    orders: {
        list: '/orders',
        create: '/orders',
        update: (id: string) => `/orders/${id}`,
        detail: (id: string) => `/orders/${id}`,
        assignDriver: (id: string) => `/orders/${id}/assign-driver`,
        updateStatus: (id: string) => `/orders/${id}/status`,
    },
    drivers: {
        list: '/drivers',
        lookup: '/drivers/dropdown',
        create: '/drivers',
        update: (id: string) => `/drivers/${id}`,
        detail: (id: string) => `/drivers/${id}`,
        updateIdentityStatus: (id: string) => `/drivers/${id}/identity-status`,
        updateFleetStatus: (id: string) => `/drivers/${id}/fleet-status`,
    },
} as const;