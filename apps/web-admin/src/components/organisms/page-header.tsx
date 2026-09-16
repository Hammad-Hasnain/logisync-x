import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface PageHeaderProps {
    title: string;
    subtitle: string;
    action?: ReactNode;
    className?: string;
}

export function PageHeader({ title, subtitle, action, className }: PageHeaderProps) {
    return (
        <div
            className={cn(
                'flex justify-between items-center rounded-4xl p-4 hover:shadow-around/20 transition-all duration-300 ease-in-out',
                className,
            )}
        >
            <div>
                <h1 className="text-2xl font-bold text-foreground">{title}</h1>
                <p className="text-foreground/60 mt-1">{subtitle}</p>
            </div>
            {action}
        </div>
    );
}