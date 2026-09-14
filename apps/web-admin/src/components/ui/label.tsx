import { cn } from '@/lib/utils';
import { LabelHTMLAttributes } from 'react';

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
    return (
        <label
            className={cn('block text-xs font-semibold uppercase tracking-wider text-foreground/60 mb-2', className)}
            {...props}
        />
    );
}