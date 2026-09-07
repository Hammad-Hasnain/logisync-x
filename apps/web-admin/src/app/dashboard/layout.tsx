'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, FilePlus2, Users, ShieldAlert, LogOut } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [adminName, setAdminName] = useState('Administrator');

    useEffect(() => {
        // 🛡️ SECURITY SEED PIPELINE: Kick out unauthorized traffic instantly
        const token = window.sessionStorage.getItem('admin_token');
        const profileStr = window.sessionStorage.getItem('admin_profile');

        if (!token || !profileStr) {
            window.sessionStorage.clear();
            router.push('/login');
            return;
        }

        const profile = JSON.parse(profileStr);
        setAdminName(profile.name || 'Admin Officer');
    }, [router]);

    const handleClearSession = () => {
        window.sessionStorage.clear();
        router.push('/login');
    };

    return (
        <div className="min-h-screen bg-slate-900 flex text-slate-100 font-sans">

            {/* 🧭 LEFT SIDEBAR CONTAINER */}
            <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col justify-between shrink-0">
                <div>
                    {/* Identity Header */}
                    <div className="p-6 border-b border-slate-700 flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center font-bold text-white text-sm tracking-wider">
                            LS
                        </div>
                        <div>
                            <h1 className="text-sm font-bold tracking-tight text-slate-200">LogiSync-X</h1>
                            <p className="text-[10px] text-blue-500 font-semibold tracking-widest uppercase">Fleet Engine</p>
                        </div>
                    </div>

                    {/* Navigation Action Links Grid */}
                    <nav className="p-4 space-y-1.5">
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium bg-blue-600 text-white cursor-pointer transition-colors shadow-md shadow-blue-600/10"
                        >
                            <LayoutDashboard size={18} />
                            <span>Fleet Overview</span>
                        </button>

                        <button
                            onClick={() => router.push('/dashboard/orders')}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 cursor-pointer transition-colors"
                        >
                            <FilePlus2 size={18} />
                            <span>Dispatch Orders</span>
                        </button>

                        <button
                            onClick={() => router.push('/dashboard/drivers')}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 cursor-pointer transition-colors"
                        >
                            <Users size={18} />
                            <span>Active Fleet</span>
                        </button>
                    </nav>
                </div>

                {/* 👤 BOTTOM ACCOUNT CONTEXT RETAINER */}
                <div className="p-4 border-t border-slate-700 space-y-3">
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center border border-slate-600 text-xs font-bold text-slate-300">
                            AD
                        </div>
                        <div className="truncate">
                            <p className="text-xs font-semibold text-slate-300 truncate">{adminName}</p>
                            <p className="text-[10px] text-slate-500 font-medium tracking-wide">Terminal Controller</p>
                        </div>
                    </div>

                    <button
                        onClick={handleClearSession}
                        className="w-full flex items-center gap-2.5 justify-center px-3 py-2 text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/10 rounded-lg cursor-pointer transition-colors"
                    >
                        <LogOut size={14} />
                        <span>Terminate Session</span>
                    </button>
                </div>
            </aside>

            {/* 🖥️ RIGHT WORKSPACE GRID INGESTION CANVAS */}
            <main className="flex-1 flex flex-col min-w-0 bg-slate-900 overflow-y-auto">
                <header className="h-16 bg-slate-800/50 border-b border-slate-800/80 px-8 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-semibold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
                        <ShieldAlert size={14} />
                        <span>Live Telemetry Secure Stream Active</span>
                    </div>
                    <p className="text-xs font-medium text-slate-400">System Time: {new Date().toLocaleDateString()}</p>
                </header>

                {/* Dynamic Inner Page Content Rendering Portal */}
                <div className="p-8 max-w-[1600px] w-full mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
