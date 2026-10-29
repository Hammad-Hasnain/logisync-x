export interface DashboardAnalytics {
    totalOrders: number;
    pendingOrders: number;
    assignedOrders: number;
    pickedUpOrders: number;
    inTransitOrders: number;
    deliveredOrders: number;
    cancelledOrders: number;

    totalDrivers: number;
    availableDrivers: number;
    onTripDrivers: number;
    offlineDrivers: number;
    activeDrivers: number;
    pendingDrivers: number;
    deactiveDrivers: number;
}