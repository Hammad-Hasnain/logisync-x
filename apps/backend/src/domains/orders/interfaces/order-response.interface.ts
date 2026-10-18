import { OrderStatus } from 'src/shared/enums/order-status.enum';

export interface IOrderResponse {
    id: string;
    customerName: string;
    assignedDriverId: string | null;
    driverName: string | null;
    driverVehicleNumber: string | null;
    deliveryAddress: string;
    pickupLocation: string;
    status: OrderStatus;
    trackingId: string;
    createdAt: Date | string;
    updatedAt: Date | string;
}
