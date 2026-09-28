import { OrderStatus } from "@/enums/order-status.enum";

export interface CreateOrderPayload {
    trackingId: string;
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

export interface Order extends CreateOrderPayload {
    id: string;
    status: OrderStatus;
    assignedDriverId: string | null;
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