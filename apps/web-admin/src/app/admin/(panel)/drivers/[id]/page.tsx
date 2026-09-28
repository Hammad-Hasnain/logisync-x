'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
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

export default function DriverDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    const { data: driver, isLoading } = useDriver(id);
    const { mutate: updateStatus, isPending } = useUpdateIdentityStatus();

    if (isLoading) return <StateMessage variant="loading" message="Loading driver..." />;
    if (!driver) return <StateMessage variant="empty" message="Driver not found." />;

    return (
        <>
            <PageHeader
                title={driver.name}
                subtitle="Driver profile and account status."
                action={
                    <Button variant="ghost" size="icon" onClick={() => router.push(ROUTES.admin.drivers.list)}>
                        <ArrowLeft size={20} />
                    </Button>
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

                {/* Right: quick action — sirf identity status editable */}
                <Card className="p-6 h-fit space-y-3">
                    <h3 className="text-sm font-semibold text-foreground/70 uppercase tracking-wider">Account Status</h3>
                    <Badge variant={IDENTITY_STATUS_BADGE_VARIANT[driver.identityStatus]}>{driver.identityStatus}</Badge>
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
                </Card>
            </div>
        </>
    );
}