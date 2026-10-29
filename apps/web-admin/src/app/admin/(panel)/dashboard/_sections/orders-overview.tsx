import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BreakdownRow } from '@/components/ui/breakdown-row';
import { DashboardAnalytics } from '@/types/dashboard.types';
import { ORDER_STATUS_BADGE_VARIANT } from '@/lib/order-status-styles';
import { OrderStatus } from '@/enums/order-status.enum';

const ORDER_ROWS: { key: keyof DashboardAnalytics; status: OrderStatus }[] = [
    { key: 'pendingOrders', status: OrderStatus.PENDING },
    { key: 'assignedOrders', status: OrderStatus.ASSIGNED },
    { key: 'pickedUpOrders', status: OrderStatus.PICKED_UP },
    { key: 'inTransitOrders', status: OrderStatus.IN_TRANSIT },
    { key: 'deliveredOrders', status: OrderStatus.DELIVERED },
    { key: 'cancelledOrders', status: OrderStatus.CANCELLED },
];

export function OrdersOverview({ analytics }: { analytics: DashboardAnalytics }) {
    return (
        <Card hoverable className="p-6">
            <h3 className="text-sm font-semibold text-foreground/70 uppercase tracking-wider mb-3">Orders by status</h3>
            {ORDER_ROWS.map(({ key, status }) => (
                <BreakdownRow
                    key={key}
                    badge={<Badge variant={ORDER_STATUS_BADGE_VARIANT[status]}>{status}</Badge>}
                    count={analytics[key]}
                    total={analytics.totalOrders}
                />
            ))}
        </Card>
    );
}