'use client';

import { FormField } from '@/components/forms/form-field';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CreateDriverPayload, UpdateDriverPayload } from '@/types/driver.types';

interface DriverFormProps {
    mode: 'create' | 'edit';
    values: CreateDriverPayload | UpdateDriverPayload;
    onChange: (field: string, value: string) => void;
    onSubmit: (e: React.SubmitEvent) => void;
    isSubmitting: boolean;
}

export function DriverForm({ mode, values, onChange, onSubmit, isSubmitting }: DriverFormProps) {
    const isCreate = mode === 'create';
    const createValues = values as CreateDriverPayload;

    return (
        <Card hoverable className="m-auto mt-6 w-full max-w-2xl">
            <form onSubmit={onSubmit} className="space-y-6">
                <FormField
                    id="name"
                    label="Full Name"
                    value={values.name}
                    onChange={(e) => onChange('name', e.target.value)}
                    required
                />

                <FormField
                    id="email"
                    label="Email"
                    type="email"
                    readOnly={!isCreate}
                    value={values.email}
                    onChange={(e) => onChange('email', e.target.value)}
                    required
                />

                {/* Password sirf Create mode mein dikhega */}
                {isCreate && (
                    <FormField
                        id="password"
                        label="Password"
                        type="password"
                        value={createValues.password ?? ''}
                        onChange={(e) => onChange('password', e.target.value)}
                        required
                    />
                )}

                <FormField
                    id="phone"
                    label="Phone"
                    type="tel"
                    value={values.phone}
                    onChange={(e) => onChange('phone', e.target.value)}
                    required
                />

                <FormField
                    id="vehicleNumber"
                    label="Vehicle Number"
                    value={values.vehicleNumber}
                    onChange={(e) => onChange('vehicleNumber', e.target.value)}
                    required
                />

                {!isCreate && (
                    <p className="text-xs text-foreground/40">
                        Email can't be changed right now.
                    </p>
                )}

                <Button type="submit" isLoading={isSubmitting} className="w-full mt-2">
                    {isCreate ? 'Create Driver' : 'Save Changes'}
                </Button>
            </form>
        </Card>
    );
}