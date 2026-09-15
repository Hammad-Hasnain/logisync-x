import { DashboardShell } from '@/components/layouts/dashboard-shell';

export default function PanelLayout({ children }: { children: React.ReactNode }) {
    return <DashboardShell>{children}</DashboardShell>;
}