import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import { Card } from '../ui/card';

interface PageHeaderProps {
    title: string;
    subtitle: string;
    action?: ReactNode;
    className?: string;
}

export function PageHeader({ title, subtitle, action, className }: PageHeaderProps) {
    return (
        <Card
            className={cn(
                'flex justify-between items-center',
                className,
            )}
        >
            <div>
                <h1 className="text-2xl font-bold text-foreground">{title}</h1>
                <p className="text-foreground/60 mt-1">{subtitle}</p>
            </div>
            {action}
        </Card>
    );
}