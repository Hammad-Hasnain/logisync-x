'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/services/api-client';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { DashboardAnalytics } from '@/types/dashboard.types';

export function useDashboardAnalytics() {
    return useQuery({
        queryKey: ['dashboard', 'analytics'],
        queryFn: async () => {
            const { data } = await apiClient.get<DashboardAnalytics>(API_ENDPOINTS.admin.dashboardAnalytics);
            return data;
        },
        staleTime: 0,
        refetchInterval: 30_000,
    });
}