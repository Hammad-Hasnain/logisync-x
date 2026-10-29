import { Package, PackageCheck, Users, UserCheck } from 'lucide-react';
import { StatCard } from '@/components/ui/stat-card';
import { DashboardAnalytics } from '@/types/dashboard.types';

export function StatsOverview({ analytics }: { analytics: DashboardAnalytics }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard label="Total Orders" value={analytics.totalOrders} icon={<Package size={22} />} />
            <StatCard label="Delivered" value={analytics.deliveredOrders} icon={<PackageCheck size={22} />} />
            <StatCard label="Total Drivers" value={analytics.totalDrivers} icon={<Users size={22} />} />
            <StatCard label="Available Drivers" value={analytics.availableDrivers} icon={<UserCheck size={22} />} />
        </div>
    );
}