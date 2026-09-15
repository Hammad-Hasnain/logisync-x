import { LayoutDashboard, Package, Users } from 'lucide-react';
import { Role } from '@/enums/role.enum';

export const navItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard, roles: [Role.ADMIN, Role.EDITOR] },
    { label: 'Orders', href: '/admin/orders', icon: Package, roles: [Role.ADMIN, Role.EDITOR] },
    { label: 'Drivers', href: '/admin/drivers', icon: Users, roles: [Role.ADMIN, Role.EDITOR] },
];