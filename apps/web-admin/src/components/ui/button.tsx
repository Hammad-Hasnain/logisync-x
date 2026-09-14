import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

const buttonVariants = cva(
    'inline-flex items-center justify-center rounded-lg font-medium transition-opacity disabled:opacity-50 disabled:cursor-not-allowed',
    {
        variants: {
            variant: {
                primary: 'bg-accent text-white hover:opacity-90 shadow-lg shadow-accent/20',
                secondary: 'bg-secondary/10 text-primary hover:bg-secondary/20',
                outline: 'border border-secondary/30 text-foreground hover:bg-secondary/5',
            },
            size: {
                sm: 'py-1.5 px-3 text-sm',
                md: 'py-2.5 px-4 text-sm',
                lg: 'py-3 px-6 text-base',
            },
        },
        defaultVariants: {
            variant: 'primary',
            size: 'md',
        },
    },
);

export interface ButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, isLoading, children, disabled, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(buttonVariants({ variant, size }), 'flex items-center gap-2 cursor-pointer', className)}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                    children
                )}
            </button>
        );
    },
);
Button.displayName = 'Button';