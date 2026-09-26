'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient } from '@/services/api-client';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { Order } from '@/types/order.types';
import { OrderStatus } from '@/enums/order-status.enum';

export function useUpdateOrderStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ orderId, status }: { orderId: string; status: OrderStatus }) => {
            const { data } = await apiClient.patch<Order>(API_ENDPOINTS.orders.updateStatus(orderId), { status });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            toast.success('Status updated');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to update status');
        },
    });
}