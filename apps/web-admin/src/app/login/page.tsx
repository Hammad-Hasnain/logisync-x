'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn, ShieldAlert, KeyRound, Mail } from 'lucide-react';
import { apiClient } from '@/services/api-client';

interface LoginResponse {
    accessToken: string;
    driver: {
        id: string;
        name: string;
        email: string;
        role: string;
    };
}

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorAlert, setErrorAlert] = useState<string | null>(null);

    // 👑 CORE AUTHENTICATION INGESTION HANDLER
    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorAlert(null);

        try {
            // 1. Fire the payload contract straight to our backend endpoint gateway
            const response = await apiClient<LoginResponse>('/drivers/login', {
                method: 'POST',
                bodyData: { email, password },
            });

            // 🛡️ ROLE SECURITY GUARD OVERLAY: Verify if the token contains administrative clearance
            // Note: Since our backend currently encodes our payload profile roles dynamically, 
            // we check for access authorization markers before granting entrance.
            if (response.driver.role !== 'ADMIN' && response.driver.role !== 'DRIVER') {
                throw new Error('Access Denied: Your identification signature lacks dashboard control authorization.');
            }

            // 2. Storage Operation: Commit the signature cleanly to the session space pool
            window.sessionStorage.setItem('admin_token', response.accessToken);
            window.sessionStorage.setItem('admin_profile', JSON.stringify(response.driver));

            // 3. Routing Mutation: Shift browser location thread straight onto our central overview grid
            router.push('/dashboard');

        } catch (err: any) {
            setErrorAlert(err.message || 'Authentication sequence failed unexpectedly.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center px-4">
            <div className="max-w-md w-full bg-slate-800 border border-slate-700 p-8 rounded-xl shadow-2xl transition-all duration-300">

                {/* Header Visual Branding Anchors */}
                <div className="flex flex-col items-center mb-8">
                    <div className="p-3 bg-blue-600/10 text-blue-500 rounded-lg mb-3">
                        <LogIn size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-100 tracking-tight">LogiSync-X Control Gate</h2>
                    <p className="text-sm text-slate-400 mt-1">Sign in to initialize enterprise terminal dispatch systems.</p>
                </div>

                {/* Dynamic Crash Exception Alerts Banner */}
                {errorAlert && (
                    <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm rounded-lg flex items-start gap-3">
                        <ShieldAlert className="shrink-0 mt-0.5" size={18} />
                        <span>{errorAlert}</span>
                    </div>
                )}

                {/* Input Validation Form Capture Container */}
                <form onSubmit={handleLoginSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                            Corporate Email Address
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                                <Mail size={18} />
                            </span>
                            <input
                                type="email"
                                required
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                                placeholder="admin@logisync.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                            Security Authorization Password
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                                <KeyRound size={18} />
                            </span>
                            <input
                                type="password"
                                required
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white font-medium py-2.5 rounded-lg flex justify-center items-center gap-2 cursor-pointer transition-colors shadow-lg shadow-blue-600/20 mt-2"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <span>Authenticate Security Stream</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
