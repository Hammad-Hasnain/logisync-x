'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn, KeyRound, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '@/services/api-client';
import { AdminLoginResponse } from '@/types/admin.types';
import { Role } from '@/enums/role.enum';
import { AuthLayout } from '@/components/layouts/auth-layout';
import { FormField } from '@/components/forms/form-field';
import { Button } from '@/components/ui/button';

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const toastId = toast.loading('Initializing authentication stream...');

        try {
            const { data } = await apiClient.post<AdminLoginResponse>('/admins/login', { email, password });

            if (!data.admin.roles.includes(Role.ADMIN)) {
                throw new Error('Access Denied: ...');
            }

            window.sessionStorage.setItem('admin_token', data.accessToken);
            window.sessionStorage.setItem('admin_profile', JSON.stringify(data.admin));
            toast.success(`Welcome back, ${data.admin.name}!`, { id: toastId });
            router.push('/dashboard');
        } catch (error) {
            toast.error((error as Error).message || 'Authentication failed.', { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            icon={<LogIn size={32} />}
            title="LogiSync-X Control Gate"
            subtitle="Sign in to initialize enterprise terminal dispatch systems."
        >
            <form onSubmit={handleLoginSubmit} className="space-y-5">
                <FormField
                    id="email"
                    label="Corporate Email Address"
                    type="email"
                    icon={<Mail size={18} />}
                    placeholder="admin@logisync.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <FormField
                    id="password"
                    label="Security Authorization Password"
                    type="password"
                    icon={<KeyRound size={18} />}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <Button type="submit" isLoading={loading} className="w-full mt-2">
                    Authenticate Security Stream
                </Button>
            </form>
        </AuthLayout>
    );
}