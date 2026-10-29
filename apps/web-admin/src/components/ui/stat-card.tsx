import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';

interface StatCardProps {
    label: string;
    value: number | string;
    icon: ReactNode;
}

export function StatCard({ label, value, icon }: StatCardProps) {
    return (
        <Card hoverable className="p-5 flex items-center justify-between">
            <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-foreground/50">{label}</p>
                <p className="mt-1 text-3xl font-bold text-foreground">{value}</p>
            </div>
            <div className="p-3 rounded-full bg-primary/10 text-primary">{icon}</div>
        </Card>
    );
}