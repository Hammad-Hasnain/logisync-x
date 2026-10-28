'use client';

import { Eye, Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StateMessage } from '@/components/ui/state-message';
import { useDrivers } from '@/hooks/queries/use-drivers';
import { ROUTES } from '@/lib/routes';
import { DRIVER_DUTY_STATUS_BADGE_VARIANT, IDENTITY_STATUS_BADGE_VARIANT } from '@/lib/driver-status-styles';

export function DriversTable() {
    const router = useRouter();
    const { data: drivers, isLoading } = useDrivers();

    if (isLoading) return <StateMessage variant="loading" message="Loading drivers..." />;
    if (!drivers?.length) return <StateMessage variant="empty" message="No drivers yet." />;

    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableHeaderCell>Name</TableHeaderCell>
                    <TableHeaderCell>Email</TableHeaderCell>
                    <TableHeaderCell>Phone</TableHeaderCell>
                    <TableHeaderCell>Vehicle</TableHeaderCell>
                    <TableHeaderCell>Duty Status</TableHeaderCell>
                    <TableHeaderCell>Account Status</TableHeaderCell>
                    <TableHeaderCell className="text-right">Actions</TableHeaderCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {drivers.map((driver) => (
                    <TableRow key={driver.id}>
                        <TableCell className="font-medium">{driver.name}</TableCell>
                        <TableCell>{driver.email}</TableCell>
                        <TableCell>{driver.phone}</TableCell>
                        <TableCell>{driver.vehicleNumber}</TableCell>
                        <TableCell>
                            <Badge variant={DRIVER_DUTY_STATUS_BADGE_VARIANT[driver.dutyStatus]}>
                                {driver.dutyStatus}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <Badge variant={IDENTITY_STATUS_BADGE_VARIANT[driver.status] ?? 'gray'}>
                                {driver.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                                <Button variant="ghost" size="icon" onClick={() => router.push(ROUTES.admin.drivers.detail(driver.id))}>
                                    <Eye size={18} />
                                </Button>
                                <Button variant="success" size="icon" onClick={() => router.push(ROUTES.admin.drivers.edit(driver.id))}>
                                    <Pencil size={18} />
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}