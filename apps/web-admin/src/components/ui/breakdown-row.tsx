import { ReactNode } from 'react';

interface BreakdownRowProps {
    badge: ReactNode;
    count: number;
    total?: number;
}

export function BreakdownRow({ badge, count, total }: BreakdownRowProps) {
    const percent = total ? Math.round((count / total) * 100) : null;

    return (
        <div className="py-2.5 border-b border-secondary/10 last:border-0">
            <div className="flex items-center justify-between">
                {badge}
                <span className="text-sm font-semibold text-foreground">{count}</span>
            </div>
            {percent !== null && (
                <div className="mt-2 h-1.5 w-full rounded-full bg-secondary/10">
                    <div className="h-full rounded-full bg-primary/60" style={{ width: `${percent}%` }} />
                </div>
            )}
        </div>
    );
}