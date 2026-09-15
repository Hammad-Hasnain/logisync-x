'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Package, Users, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { navItems } from '@/config/nav-items';
import { useAuth } from '@/hooks/use-auth';

export function Sidebar() {
    const pathname = usePathname();
    const { hasAnyRole, admin, logout } = useAuth();

    return (
        <aside className="w-[280px] p-4">
            <div className='h-full transition-all duration-300 ease-in-out rounded-4xl hover:shadow-around/20 overflow-y-auto flex flex-col'>
                {/* Nav items */}
                <nav className="flex-1 py-4 px-3 space-y-1 shadow">
                    {navItems
                        .filter((item) => hasAnyRole(item.roles))
                        .map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        'flex items-center gap-3 px-3 py-2.5 rounded-full text-sm font-medium transition-colors',
                                        isActive
                                            ? 'bg-primary/10 text-primary'
                                            : 'text-foreground/70 hover:bg-secondary/5 hover:text-foreground',
                                    )}
                                >
                                    <item.icon size={18} />
                                    {item.label}
                                </Link>
                            );
                        })}
                </nav>

                {/* Bottom section — user info + logout */}
                <div className="border-t border-secondary/10 p-3 shrink-0">
                    <div className="flex items-center gap-3 px-3 py-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold">
                            {admin?.name?.[0]?.toUpperCase() ?? 'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{admin?.name}</p>
                            <p className="text-xs text-foreground/50 truncate">{admin?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="w-full flex items-center cursor-pointer gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors mt-1"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </div>
        </aside>
    );
}