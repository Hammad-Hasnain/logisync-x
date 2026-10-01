'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Pencil } from 'lucide-react';
import { PageHeader } from '@/components/organisms/page-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { DetailRow } from '@/components/ui/detail-row';
import { StateMessage } from '@/components/ui/state-message';
import { useDriver } from '@/hooks/queries/use-driver';
import { useUpdateIdentityStatus } from '@/hooks/mutations/use-update-identity-status';
import { IdentityStatus } from '@/enums/identity-status.enum';
import { FLEET_STATUS_BADGE_VARIANT, IDENTITY_STATUS_BADGE_VARIANT } from '@/lib/driver-status-styles';
import { ROUTES } from '@/lib/routes';
import { useUpdateFleetStatus } from '@/hooks/mutations/use-update-fleet-status';
import { FleetStatus } from '@/enums/fleet-status.enum';

export default function DriverDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    const { data: driver, isLoading } = useDriver(id);
    const { mutate: updateStatus, isPending } = useUpdateIdentityStatus();
    const { mutate: updateFleetStatus, isPending: isFleetPending } = useUpdateFleetStatus();

    if (isLoading) return <StateMessage variant="loading" message="Loading driver..." />;
    if (!driver) return <StateMessage variant="empty" message="Driver not found." />;

    return (
        <>
            <PageHeader
                title={driver.name}
                subtitle="Driver profile and account status."
                action={
                    <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => router.push(ROUTES.admin.drivers.edit(driver.id))}>
                            <Pencil size={18} />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => router.push(ROUTES.admin.drivers.list)}>
                            <ArrowLeft size={20} />
                        </Button>
                    </div>
                }
            />

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left: read-only profile info */}
                <Card className="md:col-span-2 p-6">
                    <h3 className="text-sm font-semibold text-foreground/70 uppercase tracking-wider mb-3">Profile</h3>
                    <DetailRow label="Name" value={driver.name} />
                    <DetailRow label="Email" value={driver.email} />
                    <DetailRow label="Phone" value={driver.phone} />
                    <DetailRow label="License Number" value={driver.licenseNumber} />
                    <DetailRow label="Vehicle Number" value={driver.vehicleNumber} />
                    <DetailRow
                        label="Fleet Status"
                        value={<Badge variant={FLEET_STATUS_BADGE_VARIANT[driver.fleetStatus]}>{driver.fleetStatus}</Badge>}
                    />
                </Card>

                {/* Right: quick action */}
                <Card className="p-6 h-fit space-y-3">
                    <div>
                        <h3 className="text-sm font-semibold text-foreground/70 uppercase tracking-wider mb-2">Account Status</h3>
                        <div className="mb-3">
                            <Badge variant={IDENTITY_STATUS_BADGE_VARIANT[driver.identityStatus]}>{driver.identityStatus}</Badge>
                        </div>
                        <Select
                            value={driver.identityStatus}
                            disabled={isPending}
                            onChange={(e) => updateStatus({ driverId: driver.id, status: e.target.value as IdentityStatus })}
                        >
                            {Object.values(IdentityStatus).map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </Select>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-foreground/70 uppercase tracking-wider mb-2">
                            Fleet Status
                        </h3>
                        <div className="mb-3">
                            <Badge variant={FLEET_STATUS_BADGE_VARIANT[driver.fleetStatus]}>
                                {driver.fleetStatus}
                            </Badge>
                        </div>
                        <Select
                            value={driver.fleetStatus}
                            disabled={isFleetPending}
                            onChange={(e) => updateFleetStatus({ driverId: driver.id, status: e.target.value as FleetStatus })}
                        >
                            {Object.values(FleetStatus).map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </Select>
                    </div>
                </Card>

            </div>
        </>
    );
}