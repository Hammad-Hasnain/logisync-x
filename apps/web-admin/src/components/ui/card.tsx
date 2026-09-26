import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    hoverable?: boolean;
}

export function Card({ className, hoverable = false, ...props }: CardProps) {
    return (
        <div
            className={cn(
                'rounded-4xl p-4 transition-all duration-300 ease-in-out',
                hoverable
                    ? 'shadow-none hover:shadow-around/20'
                    : 'shadow-around/20',
                className
            )}
            {...props}
        />
    );
}
