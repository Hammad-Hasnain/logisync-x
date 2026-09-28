'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { PageHeader } from '@/components/organisms/page-header';
import { Button } from '@/components/ui/button';
import { StateMessage } from '@/components/ui/state-message';
import { useDriver } from '@/hooks/queries/use-driver';
import { useUpdateDriver } from '@/hooks/mutations/use-update-driver';
import { UpdateDriverPayload } from '@/types/driver.types';
import { ROUTES } from '@/lib/routes';
import { DriverForm } from '../../_components/driver-form';

export default function EditDriverPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    const { data: driver, isLoading } = useDriver(id);
    const { mutate: updateDriver, isPending } = useUpdateDriver(id);

    const [form, setForm] = useState<UpdateDriverPayload | null>(null);

    useEffect(() => {
        if (driver) {
            setForm({ name: driver.name, licenseNumber: driver.licenseNumber, vehicleNumber: driver.vehicleNumber });
        }
    }, [driver]);

    if (isLoading || !form) return <StateMessage variant="loading" message="Loading driver..." />;
    if (!driver) return <StateMessage variant="empty" message="Driver not found." />;

    const handleChange = (field: string, value: string) => {
        setForm((prev) => (prev ? { ...prev, [field]: value } : prev));
    };

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        updateDriver(form);
    };

    return (
        <>
            <PageHeader
                title={`Edit ${driver.name}`}
                subtitle="Update driver profile."
                action={
                    <Button variant="ghost" size="icon" onClick={() => router.push(ROUTES.admin.drivers.detail(id))}>
                        <ArrowLeft size={20} />
                    </Button>
                }
            />
            <div className="mt-6">
                <DriverForm mode="edit" values={form} onChange={handleChange} onSubmit={handleSubmit} isSubmitting={isPending} />
            </div>
        </>
    );
}