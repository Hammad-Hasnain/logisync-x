import { OrderStatus } from "@/enums/order-status.enum";

export interface CreateOrderPayload {
    customerName: string;
    deliveryAddress: string;
    pickupLocation?: string;
}

export interface Order extends CreateOrderPayload {
    id: string;
    status: OrderStatus;
    assignedDriverId: string | null;
    driverName: string | null;
    driverVehicleNumber: string | null;
    trackingId: string;
    createdAt: string;
    updatedAt: string;
}

export interface UpdateOrderPayload extends Partial<CreateOrderPayload> { }