'use client';

import { PageHeader } from '@/components/organisms/page-header';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { DriversTable } from './_sections/drivers-table';
import { ROUTES } from '@/lib/routes';
import { useRouter } from 'next/navigation';

export default function DriversPage() {
    const router = useRouter()

    return (
        <>
            <PageHeader
                title="Drivers"
                subtitle="Manage your fleet drivers."
                action={
                    <Button variant="ghost" size="icon" onClick={() => router.push(ROUTES.admin.drivers.new)}>
                        <Plus size={20} />
                    </Button>
                }
            />
            <div className="mt-6">
                <DriversTable />
            </div>
        </>
    );
}