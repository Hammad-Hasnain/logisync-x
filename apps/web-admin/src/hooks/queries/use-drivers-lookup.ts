'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/services/api-client';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { DriverLookup } from '@/types/driver.types';

export function useDriversLookup() {
    return useQuery({
        queryKey: ['drivers', 'lookup'],
        queryFn: async () => {
            const { data } = await apiClient.get<DriverLookup[]>(API_ENDPOINTS.drivers.lookup);
            return data;
        },
        staleTime: 5 * 60 * 1000,
    });
}