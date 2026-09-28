'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { apiClient } from '@/services/api-client';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { ROUTES } from '@/lib/routes';
import { UpdateDriverPayload, Driver } from '@/types/driver.types';

export function useUpdateDriver(driverId: string) {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: UpdateDriverPayload) => {
            const { data } = await apiClient.patch<Driver>(API_ENDPOINTS.drivers.update(driverId), payload);
            return data;
        },
        onMutate: () => {
            const toastId = toast.loading('Saving changes...');
            return { toastId };
        },
        onSuccess: (data, _variables, context) => {
            toast.success('Driver updated!', { id: context?.toastId });
            queryClient.invalidateQueries({ queryKey: ['drivers'] });
            queryClient.invalidateQueries({ queryKey: ['drivers', driverId] });
            router.push(ROUTES.admin.drivers.detail(driverId));
        },
        onError: (error: Error, _variables, context) => {
            toast.error(error.message || 'Failed to update driver.', { id: context?.toastId });
        },
    });
}