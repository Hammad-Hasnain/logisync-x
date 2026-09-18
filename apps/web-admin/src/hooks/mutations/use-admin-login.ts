'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { apiClient } from '@/services/api-client';
import { AdminLoginResponse } from '@/types/admin.types';
import { Role } from '@/enums/role.enum';
import { useAuth } from '@/hooks/use-auth';
import { API_ENDPOINTS } from '@/lib/api-endpoints';

interface LoginCredentials {
    email: string;
    password: string;
}

export function useAdminLogin() {
    const router = useRouter();
    const { login } = useAuth();

    return useMutation({
        mutationFn: async (credentials: LoginCredentials) => {
            const { data } = await apiClient.post<AdminLoginResponse>(API_ENDPOINTS.admin.login, credentials);

            if (!data.admin.roles.includes(Role.ADMIN)) {
                throw new Error('Access Denied: This account has no admin access.');
            }

            return data;
        },

        onMutate: () => {
            const toastId = toast.loading('Initializing authentication stream...');
            return { toastId };
        },

        onSuccess: (data, _variables, context) => {
            login(data.accessToken, data.admin);
            toast.success(`Welcome back, ${data.admin.name}!`, { id: context?.toastId });
            router.push('/admin/dashboard');
        },

        onError: (error: Error, _variables, context) => {
            toast.error(error.message || 'Authentication failed.', { id: context?.toastId });
        },
    });
}