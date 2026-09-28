'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { apiClient } from '@/services/api-client';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { ROUTES } from '@/lib/routes';
import { UpdateOrderPayload, Order } from '@/types/order.types';

export function useUpdateOrder(orderId: string) {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: UpdateOrderPayload) => {
            const { data } = await apiClient.patch<Order>(API_ENDPOINTS.orders.update(orderId), payload);
            return data;
        },
        onMutate: () => {
            const toastId = toast.loading('Saving changes...');
            return { toastId };
        },
        onSuccess: (data, _variables, context) => {
            toast.success('Order updated!', { id: context?.toastId });
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            queryClient.invalidateQueries({ queryKey: ['orders', orderId] });
            router.push(ROUTES.admin.orders.detail(orderId));
        },
        onError: (error: Error, _variables, context) => {
            toast.error(error.message || 'Failed to update order.', { id: context?.toastId });
        },
    });
}