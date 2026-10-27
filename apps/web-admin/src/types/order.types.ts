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

export interface UpdateOrderPayload {
    senderName: string;
    senderPhone: string;
    receiverName: string;
    receiverPhone: string;
    originAddress: string;
    destinationAddress: string;
    parcelDescription: string;
    weightKg: number;
    billingAmount: number;
}