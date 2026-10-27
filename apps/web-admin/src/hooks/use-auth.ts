'use client';

import { useAtom, useAtomValue } from 'jotai';
import { adminAtom, isAuthenticatedAtom, authLoadingAtom } from '@/store/auth-atoms';
import { useRouter } from 'next/navigation';
import { AdminProfile } from '@/types/admin.types';

export function useAuth() {
    const [admin, setAdmin] = useAtom(adminAtom);
    const isAuthenticated = useAtomValue(isAuthenticatedAtom);
    const [isLoading, setIsLoading] = useAtom(authLoadingAtom);
    const router = useRouter()

    const login = (token: string, adminProfile: AdminProfile) => {
        window.sessionStorage.setItem('admin_token', token);
        window.sessionStorage.setItem('admin_profile', JSON.stringify(adminProfile));
        setAdmin(adminProfile);
    };

    const logout = () => {
        window.sessionStorage.removeItem('admin_token');
        window.sessionStorage.removeItem('admin_profile');
        setAdmin(null);
        router.push('/admin/login')
    };


    return { admin, isAuthenticated, isLoading, setIsLoading, login, logout };
}