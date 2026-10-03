'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { ROUTES } from '@/lib/routes';
import { StateMessage } from '@/components/ui/state-message';

export function RequireAuth({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace(ROUTES.admin.login);
        }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading) return <StateMessage variant="loading" message="Checking session..." />;
    if (!isAuthenticated) return null; // redirect 

    return <>{children}</>;
}