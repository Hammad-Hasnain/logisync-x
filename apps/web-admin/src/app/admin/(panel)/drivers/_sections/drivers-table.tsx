'use client';

import { Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StateMessage } from '@/components/ui/state-message';
import { useDrivers } from '@/hooks/queries/use-drivers';
import { FLEET_STATUS_BADGE_VARIANT, IDENTITY_STATUS_BADGE_VARIANT } from '@/lib/driver-status-styles';
import { ROUTES } from '@/lib/routes';

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
                    <TableHeaderCell>License</TableHeaderCell>
                    <TableHeaderCell>Vehicle</TableHeaderCell>
                    <TableHeaderCell>Fleet Status</TableHeaderCell>
                    <TableHeaderCell>Account Status</TableHeaderCell>
                    <TableHeaderCell className="text-right">Actions</TableHeaderCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {drivers.map((driver) => (
                    <TableRow key={driver.id}>
                        <TableCell className="font-medium">{driver.name}</TableCell>
                        <TableCell>{driver.licenseNumber}</TableCell>
                        <TableCell>{driver.vehicleNumber}</TableCell>
                        <TableCell>
                            <Badge variant={FLEET_STATUS_BADGE_VARIANT[driver.fleetStatus]}>{driver.fleetStatus}</Badge>
                        </TableCell>
                        <TableCell>
                            <Badge variant={IDENTITY_STATUS_BADGE_VARIANT[driver.identityStatus]}>
                                {driver.identityStatus}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => router.push(ROUTES.admin.drivers.detail(driver.id))}>
                                <Eye size={18} />
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}