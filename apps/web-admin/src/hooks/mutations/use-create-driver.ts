'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { apiClient } from '@/services/api-client';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { ROUTES } from '@/lib/routes';
import { CreateDriverPayload, Driver } from '@/types/driver.types';

export function useCreateDriver() {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: CreateDriverPayload) => {
            const { data } = await apiClient.post<Driver>(API_ENDPOINTS.drivers.create, payload);
            return data;
        },
        onMutate: () => {
            const toastId = toast.loading('Creating driver...');
            return { toastId };
        },
        onSuccess: (data, _variables, context) => {
            toast.success(`Driver ${data.name} created!`, { id: context?.toastId });
            queryClient.invalidateQueries({ queryKey: ['drivers'] });
            router.push(ROUTES.admin.drivers.list);
        },
        onError: (error: Error, _variables, context) => {
            toast.error(error.message || 'Failed to create driver.', { id: context?.toastId });
        },
    });
}