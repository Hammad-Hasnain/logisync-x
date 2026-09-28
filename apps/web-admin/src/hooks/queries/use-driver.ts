'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/services/api-client';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { Driver } from '@/types/driver.types';

export function useDriver(driverId: string) {
    return useQuery({
        queryKey: ['drivers', driverId],
        queryFn: async () => {
            const { data } = await apiClient.get<Driver>(API_ENDPOINTS.drivers.detail(driverId));
            return data;
        },
        enabled: !!driverId,
    });
}