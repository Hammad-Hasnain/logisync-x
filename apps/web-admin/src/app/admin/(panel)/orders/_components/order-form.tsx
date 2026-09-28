'use client';

import { Card } from '@/components/ui/card';
import { FormField } from '@/components/forms/form-field';
import { TextareaField } from '@/components/forms/textarea-field';
import { Button } from '@/components/ui/button';
import { CreateOrderPayload, UpdateOrderPayload } from '@/types/order.types';

interface OrderFormProps {
    mode: 'create' | 'edit';
    trackingId?: string; //
    values: CreateOrderPayload | UpdateOrderPayload;
    onChange: (field: string, value: string | number) => void;
    onSubmit: (e: React.SubmitEvent) => void;
    isSubmitting: boolean;
}

export function OrderForm({ mode, values, onChange, onSubmit, isSubmitting }: OrderFormProps) {
    const isCreate = mode === 'create';
    const createValues = values as CreateOrderPayload;

    return (
        <Card hoverable className="m-auto mt-6 w-full max-w-2xl">
            <form onSubmit={onSubmit} className="space-y-6">
                {isCreate ? (
                    <FormField
                        id="trackingId"
                        label="Tracking ID"
                        placeholder="LGS-10293"
                        value={createValues.trackingId}
                        onChange={(e) => onChange('trackingId', e.target.value)}
                        required
                    />
                ) : (
                    <FormField id="trackingId" label="Tracking ID" value={createValues.trackingId ?? ''} disabled />
                )}

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        id="senderName"
                        label="Sender Name"
                        value={values.senderName}
                        onChange={(e) => onChange('senderName', e.target.value)}
                        required
                    />
                    <FormField
                        id="senderPhone"
                        label="Sender Phone"
                        type="tel"
                        value={values.senderPhone}
                        onChange={(e) => onChange('senderPhone', e.target.value)}
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        id="receiverName"
                        label="Receiver Name"
                        value={values.receiverName}
                        onChange={(e) => onChange('receiverName', e.target.value)}
                        required
                    />
                    <FormField
                        id="receiverPhone"
                        label="Receiver Phone"
                        type="tel"
                        value={values.receiverPhone}
                        onChange={(e) => onChange('receiverPhone', e.target.value)}
                        required
                    />
                </div>

                <TextareaField
                    id="originAddress"
                    label="Origin Address"
                    value={values.originAddress}
                    onChange={(e) => onChange('originAddress', e.target.value)}
                    required
                />

                <TextareaField
                    id="destinationAddress"
                    label="Destination Address"
                    value={values.destinationAddress}
                    onChange={(e) => onChange('destinationAddress', e.target.value)}
                    required
                />

                <TextareaField
                    id="parcelDescription"
                    label="Parcel Description"
                    value={values.parcelDescription}
                    onChange={(e) => onChange('parcelDescription', e.target.value)}
                    required
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        id="weightKg"
                        label="Weight (kg)"
                        type="number"
                        min={0}
                        step="0.1"
                        value={values.weightKg}
                        onChange={(e) => onChange('weightKg', Number(e.target.value))}
                        required
                    />
                    <FormField
                        id="billingAmount"
                        label="Billing Amount (PKR)"
                        type="number"
                        min={0}
                        value={values.billingAmount}
                        onChange={(e) => onChange('billingAmount', Number(e.target.value))}
                        required
                    />
                </div>

                <Button type="submit" isLoading={isSubmitting} className="w-full mt-2">
                    {isCreate ? 'Create Order' : 'Save Changes'}
                </Button>
            </form>
        </Card>
    );
}