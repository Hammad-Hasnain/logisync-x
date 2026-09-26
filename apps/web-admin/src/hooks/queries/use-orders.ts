'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/services/api-client';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { Order } from '@/types/order.types';

export function useOrders() {
    return useQuery({
        queryKey: ['orders'],
        queryFn: async () => {
            const { data } = await apiClient.get<Order[]>(API_ENDPOINTS.orders.list);
            return data;
        },
    });
}