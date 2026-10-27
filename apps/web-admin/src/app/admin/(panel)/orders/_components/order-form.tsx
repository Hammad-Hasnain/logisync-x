'use client';

import { Card } from '@/components/ui/card';
import { FormField } from '@/components/forms/form-field';
import { TextareaField } from '@/components/forms/textarea-field';
import { Button } from '@/components/ui/button';
import { CreateOrderPayload } from '@/types/order.types';

interface OrderFormProps {
    mode: 'create' | 'edit';
    trackingId?: string;
    values: CreateOrderPayload;
    onChange: (field: string, value: string | number) => void;
    onSubmit: (e: React.SubmitEvent) => void;
    isSubmitting: boolean;
}

export function OrderForm({ mode, trackingId, values, onChange, onSubmit, isSubmitting }: OrderFormProps) {
    const isCreate = mode === 'create';

    return (
        <Card hoverable className="m-auto mt-6 w-full max-w-2xl">
            <form onSubmit={onSubmit} className="space-y-6">
                {!isCreate && trackingId && (
                    <FormField id="trackingId" label="Tracking ID" value={trackingId} disabled />
                )}

                <FormField
                    id="customerName"
                    label="Customer Name"
                    placeholder="Ahmed Ali"
                    value={values.customerName}
                    onChange={(e) => onChange('customerName', e.target.value)}
                    required
                />

                <TextareaField
                    id="deliveryAddress"
                    label="Delivery Address"
                    placeholder="House 42, Street 5, DHA Phase 6, Karachi"
                    value={values.deliveryAddress}
                    onChange={(e) => onChange('deliveryAddress', e.target.value)}
                    required
                />

                <FormField
                    id="pickupLocation"
                    label="Pickup Location"
                    placeholder="Main Warehouse, Karachi"
                    value={values.pickupLocation ?? ''}
                    onChange={(e) => onChange('pickupLocation', e.target.value)}
                />

                <Button type="submit" isLoading={isSubmitting} className="w-full mt-2">
                    {isCreate ? 'Create Order' : 'Save Changes'}
                </Button>
            </form>
        </Card>
    );
}