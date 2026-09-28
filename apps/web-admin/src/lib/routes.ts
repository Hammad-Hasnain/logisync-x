export const ROUTES = {
    admin: {
        login: '/admin/login',
        dashboard: '/admin/dashboard',
        orders: {
            list: '/admin/orders',
            new: '/admin/orders/new',
            detail: (id: string) => `/admin/orders/${id}`,
            edit: (id: string) => `/admin/orders/${id}/edit`,
        },
        drivers: {
            list: '/admin/drivers',
            new: '/admin/drivers/new',
            detail: (id: string) => `/admin/drivers/${id}`,
            edit: (id: string) => `/admin/drivers/${id}/edit`,
        },
    },
} as const;