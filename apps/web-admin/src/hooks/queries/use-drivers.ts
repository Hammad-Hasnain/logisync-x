'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/services/api-client';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { Driver } from '@/types/driver.types';

export function useDrivers() {
    return useQuery({
        queryKey: ['drivers'],
        queryFn: async () => {
            const { data } = await apiClient.get<Driver[]>(API_ENDPOINTS.drivers.list);
            return data;
        },
    });
}