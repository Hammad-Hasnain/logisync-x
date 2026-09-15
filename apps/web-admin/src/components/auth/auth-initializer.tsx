'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';

export function AuthInitializer({ children }: { children: React.ReactNode }) {
    const { login, logout, setIsLoading } = useAuth();

    useEffect(() => {
        const token = window.sessionStorage.getItem('admin_token');
        const profileRaw = window.sessionStorage.getItem('admin_profile');

        if (token && profileRaw) {
            login(token, JSON.parse(profileRaw));
        } else {
            logout(); // expired or missing — clean state
        }
        setIsLoading(false);
    }, []);

    return <>{children}</>;
}