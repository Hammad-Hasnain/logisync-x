import { LayoutDashboard, Package, Users } from 'lucide-react';
import { Role } from '@/enums/role.enum';
import { ROUTES } from '@/lib/routes';

export const navItems = [
    { label: 'Dashboard', href: ROUTES.admin.dashboard, icon: LayoutDashboard, roles: [Role.ADMIN, Role.EDITOR] },
    { label: 'Orders', href: ROUTES.admin.orders, icon: Package, roles: [Role.ADMIN, Role.EDITOR] },
    { label: 'Drivers', href: ROUTES.admin.drivers, icon: Users, roles: [Role.ADMIN, Role.EDITOR] },
];