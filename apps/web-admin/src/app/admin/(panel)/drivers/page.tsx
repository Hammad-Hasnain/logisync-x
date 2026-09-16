'use client';

import { PageHeader } from '@/components/organisms/page-header';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

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
        </>
    );
}