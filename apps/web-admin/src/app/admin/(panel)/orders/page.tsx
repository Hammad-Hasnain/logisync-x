'use client'

import { PageHeader } from "@/components/organisms/page-header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function OrdersPage() {
    return (
        <>
            <PageHeader
                title="Orders"
                subtitle="Overview of your orders."
                action={
                    <Button variant="ghost" size="icon" onClick={() => console.log('create order')}>
                        <Plus size={20} />
                    </Button>
                }
            />
        </>
    );
}