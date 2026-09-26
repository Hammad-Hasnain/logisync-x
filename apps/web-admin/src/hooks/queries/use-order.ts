'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/services/api-client';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { Order } from '@/types/order.types';

export function useOrder(orderId: string) {
    return useQuery({
        queryKey: ['orders', orderId],
        queryFn: async () => {
            const { data } = await apiClient.get<Order>(API_ENDPOINTS.orders.detail(orderId));
            return data;
        },
        enabled: !!orderId,
    });
}