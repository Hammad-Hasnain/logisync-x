export const ROUTES = {
    admin: {
        login: '/admin/login',
        dashboard: '/admin/dashboard',
        orders: '/admin/orders',
        drivers: '/admin/drivers',
        driverDetail: (id: string) => `/admin/drivers/${id}`,
    },
} as const;