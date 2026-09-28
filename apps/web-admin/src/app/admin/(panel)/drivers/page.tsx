'use client';

import { PageHeader } from '@/components/organisms/page-header';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { DriversTable } from './_sections/drivers-table';

export default function DriversPage() {
    return (
        <>
            <PageHeader
                title="Drivers"
                subtitle="Manage your fleet drivers."
                action={
                    <Button variant="ghost" size="icon" onClick={() => console.log('create driver')}>
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