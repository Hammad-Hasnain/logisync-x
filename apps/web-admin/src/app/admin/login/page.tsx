'use client';

import React, { useState } from 'react';
import { LogIn, KeyRound, Mail } from 'lucide-react';
import { AuthLayout } from '@/components/layouts/auth-layout';
import { FormField } from '@/components/forms/form-field';
import { Button } from '@/components/ui/button';
import { useAdminLogin } from '@/hooks/mutations/use-admin-login';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { mutate: login, isPending: loading } = useAdminLogin();

    const handleLoginSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        login({ email, password });
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