import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { ReactNode } from 'react';

interface StateMessageProps {
    variant?: 'loading' | 'empty' | 'error';
    message: string;
    icon?: ReactNode;
    className?: string;
}

export function StateMessage({ variant = 'empty', message, icon, className }: StateMessageProps) {
    return (
        <div className={cn('flex flex-col items-center justify-center text-center py-12 gap-2', className)}>
            {variant === 'loading' ? (
                <Loader2 size={20} className="animate-spin text-foreground/40" />
            ) : (
                icon
            )}
            <p
                className={cn(
                    'text-sm',
                    variant === 'error' ? 'text-red-500' : 'text-foreground/50',
                )}
            >
                {message}
            </p>
        </div>
    );
}