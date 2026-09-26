import { OrderStatus } from "@/enums/order-status.enum";

export const ORDER_STATUS_BADGE_VARIANT: Record<OrderStatus, 'gray' | 'blue' | 'cyan' | 'green' | 'red' | 'yellow'> = {
    [OrderStatus.PENDING]: 'gray',
    [OrderStatus.PICKED_UP]: 'yellow',
    [OrderStatus.IN_TRANSIT]: 'cyan',
    [OrderStatus.DELIVERED]: 'green',
    [OrderStatus.CANCELLED]: 'red',
};