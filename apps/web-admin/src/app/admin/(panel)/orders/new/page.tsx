'use client';

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { PageHeader } from '@/components/organisms/page-header';
import { FormField } from '@/components/forms/form-field';
import { TextareaField } from '@/components/forms/textarea-field';
import { Button } from '@/components/ui/button';
import { useCreateOrder } from '@/hooks/mutations/use-create-order';
import { CreateOrderPayload } from '@/types/order.types';
import { useRouter } from 'next/navigation';
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

    const handleChange = (field: keyof CreateOrderPayload, value: string | number) => {
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

            <form onSubmit={handleSubmit} className="m-auto p-4 rounded-4xl hover:shadow-around/20 transition-all duration-300 ease-in-out mt-6 space-y-6 w-full">
                <FormField
                    id="trackingId"
                    label="Tracking ID"
                    placeholder="LGS-10293"
                    value={form.trackingId}
                    onChange={(e) => handleChange('trackingId', e.target.value)}
                    required
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        id="senderName"
                        label="Sender Name"
                        value={form.senderName}
                        onChange={(e) => handleChange('senderName', e.target.value)}
                        required
                    />
                    <FormField
                        id="senderPhone"
                        label="Sender Phone"
                        type="tel"
                        value={form.senderPhone}
                        onChange={(e) => handleChange('senderPhone', e.target.value)}
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        id="receiverName"
                        label="Receiver Name"
                        value={form.receiverName}
                        onChange={(e) => handleChange('receiverName', e.target.value)}
                        required
                    />
                    <FormField
                        id="receiverPhone"
                        label="Receiver Phone"
                        type="tel"
                        value={form.receiverPhone}
                        onChange={(e) => handleChange('receiverPhone', e.target.value)}
                        required
                    />
                </div>

                <TextareaField
                    id="originAddress"
                    label="Origin Address"
                    value={form.originAddress}
                    onChange={(e) => handleChange('originAddress', e.target.value)}
                    required
                />

                <TextareaField
                    id="destinationAddress"
                    label="Destination Address"
                    value={form.destinationAddress}
                    onChange={(e) => handleChange('destinationAddress', e.target.value)}
                    required
                />

                <TextareaField
                    id="parcelDescription"
                    label="Parcel Description"
                    value={form.parcelDescription}
                    onChange={(e) => handleChange('parcelDescription', e.target.value)}
                    required
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        id="weightKg"
                        label="Weight (kg)"
                        type="number"
                        min={0}
                        step="0.1"
                        value={form.weightKg}
                        onChange={(e) => handleChange('weightKg', Number(e.target.value))}
                        required
                    />
                    <FormField
                        id="billingAmount"
                        label="Billing Amount (PKR)"
                        type="number"
                        min={0}
                        value={form.billingAmount}
                        onChange={(e) => handleChange('billingAmount', Number(e.target.value))}
                        required
                    />
                </div>

                <Button type="submit" isLoading={isPending} className="w-full mt-2">
                    Create Order
                </Button>
            </form>
        </>
    );
}