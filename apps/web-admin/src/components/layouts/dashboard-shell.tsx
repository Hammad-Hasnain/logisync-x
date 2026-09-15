'use client';

import { ReactNode } from 'react';
import { Topbar } from '@/components/organisms/topbar';
import { Sidebar } from '@/components/organisms/sidebar';

export function DashboardShell({ children }: { children: ReactNode }) {
    return (
        <div className="h-screen w-screen overflow-hidden flex flex-col bg-background">
            <Topbar />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <main className="flex-1 overflow-y-auto p-6">{children}</main>
            </div>
        </div>
    );
}