'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient } from '@/services/api-client';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { Driver } from '@/types/driver.types';
import { FleetStatus } from '@/enums/fleet-status.enum';

export function useUpdateFleetStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ driverId, status }: { driverId: string; status: FleetStatus }) => {
            const { data } = await apiClient.patch<Driver>(
                API_ENDPOINTS.drivers.updateFleetStatus(driverId),
                { status },
            );
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['drivers'] });
            toast.success('Fleet status updated successfully');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to update fleet status');
        },
    });
}
