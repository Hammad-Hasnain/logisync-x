import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn('bg-white border border-secondary/20 p-8 rounded-xl shadow-xl', className)}
            {...props}
        />
    );
}