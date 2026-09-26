import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { SelectHTMLAttributes, forwardRef } from 'react';

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({ className, children, ...props }, ref) => {
    return (
        <div className="relative inline-block w-full">
            <select
                ref={ref}
                className={cn(
                    'w-full appearance-none bg-white border border-secondary/30 rounded-lg py-2 pl-3 pr-9 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-colors cursor-pointer',
                    className,
                )}
                {...props}
            >
                {children}
            </select>
            <ChevronDown
                size={16}
                className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-foreground/40"
            />
        </div>
    );
});
Select.displayName = 'Select';