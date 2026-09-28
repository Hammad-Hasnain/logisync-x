'use client';

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/organisms/page-header';
import { Button } from '@/components/ui/button';
import { useCreateDriver } from '@/hooks/mutations/use-create-driver';
import { CreateDriverPayload } from '@/types/driver.types';
import { ROUTES } from '@/lib/routes';
import { DriverForm } from '../_components/driver-form';

const initialState: CreateDriverPayload = {
    name: '',
    email: '',
    password: '',
    phone: '',
    licenseNumber: '',
    vehicleNumber: '',
};

export default function CreateDriverPage() {
    const router = useRouter();
    const [form, setForm] = useState<CreateDriverPayload>(initialState);
    const { mutate: createDriver, isPending } = useCreateDriver();

    const handleChange = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        createDriver(form);
    };

    return (
        <>
            <PageHeader
                title="New Driver"
                subtitle="Register a new fleet driver."
                action={
                    <Button variant="ghost" size="icon" onClick={() => router.push(ROUTES.admin.drivers.list)}>
                        <ArrowLeft size={20} />
                    </Button>
                }
            />
            <div className="mt-6">
                <DriverForm mode="create" values={form} onChange={handleChange} onSubmit={handleSubmit} isSubmitting={isPending} />
            </div>
        </>
    );
}