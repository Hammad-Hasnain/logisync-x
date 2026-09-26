import { cn } from '@/lib/utils';
import { TextareaHTMLAttributes, forwardRef } from 'react';

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, ...props }, ref) => {
        return (
            <textarea
                ref={ref}
                rows={3}
                className={cn(
                    'w-full bg-background border border-secondary/30 rounded-lg py-2.5 px-4 text-foreground placeholder-foreground/40 focus:outline-none focus:border-primary transition-colors resize-none',
                    className,
                )}
                {...props}
            />
        );
    },
);
Textarea.displayName = 'Textarea';