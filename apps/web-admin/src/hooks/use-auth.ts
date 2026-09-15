'use client';

import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { adminAtom, rolesAtom, isAuthenticatedAtom, authLoadingAtom, AdminProfile } from '@/store/auth-atoms';
import { Role } from '@/enums/role.enum';
import { useRouter } from 'next/navigation';

export function useAuth() {
    const [admin, setAdmin] = useAtom(adminAtom);
    const roles = useAtomValue(rolesAtom);
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

    const hasRole = (role: Role) => roles.includes(role);
    const hasAnyRole = (checkRoles: Role[]) => checkRoles.some((r) => roles.includes(r));

    return { admin, roles, isAuthenticated, isLoading, setIsLoading, login, logout, hasRole, hasAnyRole };
}