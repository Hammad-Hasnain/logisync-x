'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { PageHeader } from '@/components/organisms/page-header';
import { OrderForm } from '../../_components/order-form';
import { Button } from '@/components/ui/button';
import { StateMessage } from '@/components/ui/state-message';
import { useOrder } from '@/hooks/queries/use-order';
import { useUpdateOrder } from '@/hooks/mutations/use-update-order';
import { UpdateOrderPayload } from '@/types/order.types';
import { ROUTES } from '@/lib/routes';

export default function EditOrderPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    const { data: order, isLoading } = useOrder(id);
    const { mutate: updateOrder, isPending } = useUpdateOrder(id);

    const [form, setForm] = useState<UpdateOrderPayload | null>(null);

    useEffect(() => {
        if (order) {
            setForm({
                senderName: order.senderName,
                senderPhone: order.senderPhone,
                receiverName: order.receiverName,
                receiverPhone: order.receiverPhone,
                originAddress: order.originAddress,
                destinationAddress: order.destinationAddress,
                parcelDescription: order.parcelDescription,
                weightKg: order.weightKg,
                billingAmount: order.billingAmount,
            });
        }
    }, [order]);

    if (isLoading || !form) return <StateMessage variant="loading" message="Loading order..." />;
    if (!order) return <StateMessage variant="empty" message="Order not found." />;

    const handleChange = (field: string, value: string | number) => {
        setForm((prev) => (prev ? { ...prev, [field]: value } : prev));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateOrder(form);
    };

    return (
        <>
            <PageHeader
                title={`Edit ${order.trackingId}`}
                subtitle="Update shipment details."
                action={
                    <Button variant="ghost" size="icon" onClick={() => router.push(ROUTES.admin.orders.detail(id))}>
                        <ArrowLeft size={20} />
                    </Button>
                }
            />
            <OrderForm
                mode="edit"
                values={{ ...form, trackingId: order.trackingId } as any}
                onChange={handleChange}
                onSubmit={handleSubmit}
                isSubmitting={isPending}
            />
        </>
    );
}