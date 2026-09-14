import { cn } from '@/lib/utils';
import { InputHTMLAttributes, forwardRef, ReactNode } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    icon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, icon, ...props }, ref) => {
        return (
            <div className="relative">
                {icon && (
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-foreground/40">
                        {icon}
                    </span>
                )}
                <input
                    ref={ref}
                    className={cn(
                        'w-full bg-background border border-secondary/30 rounded-lg py-2.5 pr-4 text-foreground placeholder-foreground/40 focus:outline-none focus:border-primary transition-colors',
                        icon ? 'pl-10' : 'pl-4',
                        className,
                    )}
                    {...props}
                />
            </div>
        );
    },
);
Input.displayName = 'Input';