'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { apiClient } from '@/services/api-client';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { ROUTES } from '@/lib/routes';
import { CreateOrderPayload, Order } from '@/types/order.types';

export function useCreateOrder() {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: CreateOrderPayload) => {
            const { data } = await apiClient.post<Order>(API_ENDPOINTS.orders.create, payload);
            return data;
        },

        onMutate: () => {
            const toastId = toast.loading('Creating order...');
            return { toastId };
        },

        onSuccess: (data, _variables, context) => {
            toast.success(`Order ${data.trackingId} created!`, { id: context?.toastId });
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            router.push(ROUTES.admin.orders.list);
        },

        onError: (error: Error, _variables, context) => {
            toast.error(error.message || 'Failed to create order.', { id: context?.toastId });
        },
    });
}