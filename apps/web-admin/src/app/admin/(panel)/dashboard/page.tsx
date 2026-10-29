'use client';

import { PageHeader } from '@/components/organisms/page-header';
import { StateMessage } from '@/components/ui/state-message';
import { useDashboardAnalytics } from '@/hooks/queries/use-dashboard-analytics';
import { StatsOverview } from './_sections/stats-overview';
import { OrdersOverview } from './_sections/orders-overview';
import { DriversOverview } from './_sections/drivers-overview';

export default function DashboardPage() {
    const { data: analytics, isLoading, error } = useDashboardAnalytics();

    return (
        <>
            <PageHeader title="Dashboard" subtitle="Overview of your logistics operations." />

            <div className="mt-6 space-y-6">
                {isLoading && <StateMessage variant="loading" message="Loading analytics..." />}
                {error && <StateMessage variant="error" message={error.message} />}

                {analytics && (
                    <>
                        <StatsOverview analytics={analytics} />
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <OrdersOverview analytics={analytics} />
                            <DriversOverview analytics={analytics} />
                        </div>
                    </>
                )}
            </div>
        </>
    );
}