export const ROUTES = {
    admin: {
        login: '/admin/login',
        dashboard: '/admin/dashboard',
        orders: {
            list: '/admin/orders',
            new: '/admin/orders/new',
            detail: (id: string) => `/admin/orders/${id}`,
        },
        drivers: {
            list: '/admin/drivers',
            detail: (id: string) => `/admin/drivers/${id}`,
        },
    },
} as const;