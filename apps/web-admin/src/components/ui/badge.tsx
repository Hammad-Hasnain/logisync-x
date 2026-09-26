import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

const badgeVariants = cva('inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium', {
    variants: {
        variant: {
            gray: 'bg-secondary/10 text-foreground/60',
            blue: 'bg-secondary/15 text-primary',
            cyan: 'bg-accent/15 text-accent',
            green: 'bg-emerald-100 text-emerald-700',
            red: 'bg-red-100 text-red-600',
            yellow: 'bg-amber-100 text-amber-700',
        },
    },
    defaultVariants: { variant: 'gray' },
});

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> { }

export function Badge({ className, variant, ...props }: BadgeProps) {
    return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}