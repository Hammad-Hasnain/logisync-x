import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';

export function AuthLayout({
    icon,
    title,
    subtitle,
    children,
}: {
    icon: ReactNode;
    title: string;
    subtitle: string;
    children: ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background flex flex-col justify-center items-center px-4">
            <div className="max-w-md w-full">
                <Card>
                    <div className="flex flex-col items-center mb-8">
                        <div className="p-3 bg-primary/10 text-primary rounded-lg mb-3">{icon}</div>
                        <h2 className="text-2xl font-bold text-foreground tracking-tight">{title}</h2>
                        <p className="text-sm text-foreground/70 mt-1 text-center">{subtitle}</p>
                    </div>
                    {children}
                </Card>
            </div>
        </div>
    );
}