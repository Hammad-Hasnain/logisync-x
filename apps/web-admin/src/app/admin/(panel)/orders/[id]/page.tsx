'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Pencil } from 'lucide-react';
import { PageHeader } from '@/components/organisms/page-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { DetailRow } from '@/components/ui/detail-row';
import { useOrder } from '@/hooks/queries/use-order';
import { useDriversLookup } from '@/hooks/queries/use-drivers-lookup';
import { useAssignDriver } from '@/hooks/mutations/use-assign-driver';
import { useUpdateOrderStatus } from '@/hooks/mutations/use-update-order-status';
import { OrderStatus } from '@/enums/order-status.enum';
import { ORDER_STATUS_BADGE_VARIANT } from '@/lib/order-status-styles';
import { ROUTES } from '@/lib/routes';
import { StateMessage } from '@/components/ui/state-message';

export default function OrderDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    const { data: order, isLoading } = useOrder(id);
    const { data: drivers } = useDriversLookup();
    const { mutate: assignDriver, isPending: isAssigning } = useAssignDriver();
    const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateOrderStatus();

    if (isLoading) return <StateMessage variant="loading" message="Loading order..." />;
    if (!order) return <StateMessage variant="empty" message="Order not found." />;

    return (
        <>
            <PageHeader
                title={`Order ${order.trackingId}`}
                subtitle="Full shipment details and assignment."
                action={
                    <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => router.push(ROUTES.admin.orders.edit(order.id))}>
                            <Pencil size={18} />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => router.push(ROUTES.admin.orders.list)}>
                            <ArrowLeft size={20} />
                        </Button>
                    </div>
                }
            />

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left: shipment details, read-only */}
                <Card className="md:col-span-2 p-6">
                    <h3 className="text-sm font-semibold text-foreground/70 uppercase tracking-wider mb-3">Sender</h3>
                    <DetailRow label="Name" value={order.senderName} />
                    <DetailRow label="Phone" value={order.senderPhone} />
                    <DetailRow label="Address" value={order.originAddress} />

                    <h3 className="text-sm font-semibold text-foreground/70 uppercase tracking-wider mt-6 mb-3">Receiver</h3>
                    <DetailRow label="Name" value={order.receiverName} />
                    <DetailRow label="Phone" value={order.receiverPhone} />
                    <DetailRow label="Address" value={order.destinationAddress} />

                    <h3 className="text-sm font-semibold text-foreground/70 uppercase tracking-wider mt-6 mb-3">Parcel</h3>
                    <DetailRow label="Description" value={order.parcelDescription} />
                    <DetailRow label="Weight" value={`${order.weightKg} kg`} />
                    <DetailRow label="Billing Amount" value={`Rs. ${order.billingAmount.toLocaleString()}`} />
                </Card>

                {/* Right: editable — status + driver assignment */}
                <Card className="p-6 h-fit space-y-6">
                    <div>
                        <h3 className="text-sm font-semibold text-foreground/70 uppercase tracking-wider mb-2">Status</h3>
                        <div className="mb-3">
                            <Badge variant={ORDER_STATUS_BADGE_VARIANT[order.status]}>{order.status}</Badge>
                        </div>
                        <Select
                            value={order.status}
                            disabled={isUpdatingStatus}
                            onChange={(e) => updateStatus({ orderId: order.id, status: e.target.value as OrderStatus })}
                        >
                            {Object.values(OrderStatus).map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </Select>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-foreground/70 uppercase tracking-wider mb-2">
                            Assigned Driver
                        </h3>
                        <Select
                            value={order.assignedDriverId ?? ''}
                            disabled={isAssigning}
                            onChange={(e) => assignDriver({ orderId: order.id, driverId: e.target.value })}
                        >
                            <option value="" disabled>
                                Unassigned
                            </option>
                            {drivers?.map((driver) => (
                                <option key={driver.id} value={driver.id}>
                                    {driver.name}
                                </option>
                            ))}
                        </Select>
                    </div>
                </Card>
            </div>
        </>
    );
}