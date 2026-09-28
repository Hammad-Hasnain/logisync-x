'use client';

import { useDriversLookup } from '@/hooks/queries/use-drivers-lookup';
import { useOrders } from '@/hooks/queries/use-orders';
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ORDER_STATUS_BADGE_VARIANT } from '@/lib/order-status-styles';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/routes';
import { useRouter } from 'next/navigation';
import { Eye, Pencil } from 'lucide-react';
import { StateMessage } from '@/components/ui/state-message';

export function OrdersTable() {
    const router = useRouter();

    const { data: orders, isLoading } = useOrders();
    const { data: drivers } = useDriversLookup();

    if (isLoading) return <StateMessage variant="loading" message="Loading orders..." />;
    if (!orders?.length) return <StateMessage variant="empty" message="No orders yet." />;

    const driverName = (id: string | null) => drivers?.find((d) => d.id === id)?.name ?? 'Unassigned';

    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableHeaderCell>Tracking ID</TableHeaderCell>
                    <TableHeaderCell>Sender</TableHeaderCell>
                    <TableHeaderCell>Receiver</TableHeaderCell>
                    <TableHeaderCell>Status</TableHeaderCell>
                    <TableHeaderCell>Driver</TableHeaderCell>
                    <TableHeaderCell>Amount</TableHeaderCell>
                    <TableHeaderCell className="text-right">Actions</TableHeaderCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {orders.map((order) => (
                    <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.trackingId}</TableCell>
                        <TableCell>{order.senderName}</TableCell>
                        <TableCell>{order.receiverName}</TableCell>
                        <TableCell>
                            <Badge variant={ORDER_STATUS_BADGE_VARIANT[order.status]}>{order.status}</Badge>
                        </TableCell>
                        <TableCell>{driverName(order.assignedDriverId)}</TableCell>
                        <TableCell>Rs. {order.billingAmount.toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                                <Button variant="ghost" size="icon" onClick={() => router.push(ROUTES.admin.orders.detail(order.id))}>
                                    <Eye size={18} />
                                </Button>
                                <Button variant="success" size="icon" onClick={() => router.push(ROUTES.admin.orders.edit(order.id))}>
                                    <Pencil size={18} />
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}