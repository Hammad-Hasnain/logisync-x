'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient } from '@/services/api-client';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { Order } from '@/types/order.types';

export function useAssignDriver() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ orderId, driverId }: { orderId: string; driverId: string }) => {
            const { data } = await apiClient.patch<Order>(API_ENDPOINTS.orders.assignDriver(orderId), { driverId });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            toast.success('Driver assigned');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to assign driver');
        },
    });
}