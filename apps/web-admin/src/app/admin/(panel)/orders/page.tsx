'use client'

import { PageHeader } from "@/components/organisms/page-header";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { OrdersTable } from "./_sections/orders-table";

export default function OrdersPage() {
    const router = useRouter()

    return (
        <>
            <PageHeader
                title="Orders"
                subtitle="Overview of your orders."
                action={
                    <Button variant="ghost" size="icon" onClick={() => router.push(ROUTES.admin.orders.new)}>
                        <Plus size={20} />
                    </Button>
                }
            />

            <div className="mt-6">
                <OrdersTable />
            </div>
        </>
    );
}