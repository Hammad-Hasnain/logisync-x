'use client';

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/organisms/page-header';
import { OrderForm } from '../_components/order-form';
import { Button } from '@/components/ui/button';
import { useCreateOrder } from '@/hooks/mutations/use-create-order';
import { CreateOrderPayload } from '@/types/order.types';
import { ROUTES } from '@/lib/routes';

const initialFormState: CreateOrderPayload = {
    trackingId: '',
    senderName: '',
    senderPhone: '',
    receiverName: '',
    receiverPhone: '',
    originAddress: '',
    destinationAddress: '',
    parcelDescription: '',
    weightKg: 0,
    billingAmount: 0,
};

export default function CreateOrderPage() {
    const router = useRouter();
    const [form, setForm] = useState<CreateOrderPayload>(initialFormState);
    const { mutate: createOrder, isPending } = useCreateOrder();

    const handleChange = (field: string, value: string | number) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        createOrder(form);
    };

    return (
        <>
            <PageHeader
                title="New Order"
                subtitle="Create a new shipment order."
                action={
                    <Button variant="ghost" size="icon" onClick={() => router.push(ROUTES.admin.orders.list)}>
                        <ArrowLeft size={20} />
                    </Button>
                }
            />
            <OrderForm mode="create" values={form} onChange={handleChange} onSubmit={handleSubmit} isSubmitting={isPending} />
        </>
    );
}