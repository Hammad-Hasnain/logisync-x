'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient } from '@/services/api-client';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { Driver } from '@/types/driver.types';
import { IdentityStatus } from '@/enums/identity-status.enum';

export function useUpdateIdentityStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ driverId, status }: { driverId: string; status: IdentityStatus }) => {
            const { data } = await apiClient.patch<Driver>(
                API_ENDPOINTS.drivers.updateIdentityStatus(driverId),
                { status },
            );
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['drivers'] });
            toast.success('Driver status updated');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to update status');
        },
    });
}