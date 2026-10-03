'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { ROUTES } from '@/lib/routes';

export function GuestOnly({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            router.replace(ROUTES.admin.dashboard);
        }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading || isAuthenticated) return null;

    return <>{children}</>;
}