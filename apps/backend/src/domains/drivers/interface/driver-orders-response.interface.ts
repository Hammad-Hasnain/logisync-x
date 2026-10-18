import { OrderStatus } from 'src/shared/enums/order-status.enum';

export interface IDriverOrderItemResponse {
    id: string;
    customerName: string;
    deliveryAddress: string;
    pickupLocation: string;
    status: OrderStatus;
    trackingId: string;
    createdAt: Date | string;
    updatedAt: Date | string;
}
