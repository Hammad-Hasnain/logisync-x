import { RequireAuth } from '@/components/auth/require-auth';
import { DashboardShell } from '@/components/layouts/dashboard-shell';

export default function PanelLayout({ children }: { children: React.ReactNode }) {
    return (
        <RequireAuth>
            <DashboardShell>{children}</DashboardShell>
        </RequireAuth>
    );
}