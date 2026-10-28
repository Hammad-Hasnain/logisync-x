'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Pencil } from 'lucide-react';
import { PageHeader } from '@/components/organisms/page-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
// import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { DetailRow } from '@/components/ui/detail-row';
import { StateMessage } from '@/components/ui/state-message';
import { useDriver } from '@/hooks/queries/use-driver';
// import { useUpdateIdentityStatus } from '@/hooks/mutations/use-update-identity-status';
// import { useUpdateDutyStatus } from '@/hooks/mutations/use-update-duty-status'; 
// import { IdentityStatus } from '@/enums/identity-status.enum';
// import { DutyStatus } from '@/enums/duty-status.enum';
import { ROUTES } from '@/lib/routes';
import { DRIVER_DUTY_STATUS_BADGE_VARIANT, IDENTITY_STATUS_BADGE_VARIANT } from '@/lib/driver-status-styles';

export default function DriverDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    const { data: driver, isLoading } = useDriver(id);
    // const { mutate: updateIdentityStatus, isPending: isIdentityPending } = useUpdateIdentityStatus();
    // const { mutate: updateDutyStatus, isPending: isDutyPending } = useUpdateDutyStatus();

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
                <Card className="md:col-span-2 p-6 space-y-4">
                    <h3 className="text-sm font-semibold text-foreground/70 uppercase tracking-wider mb-3">Profile</h3>
                    <DetailRow label="Name" value={driver.name} />
                    <DetailRow label="Email" value={driver.email} />
                    <DetailRow label="Phone" value={driver.phone} />
                    <DetailRow label="Vehicle Number" value={driver.vehicleNumber} />
                    <DetailRow
                        label="Duty Status"
                        value={<Badge variant={DRIVER_DUTY_STATUS_BADGE_VARIANT[driver.dutyStatus]}>{driver.dutyStatus}</Badge>}
                    />
                </Card>

                {/* Right: quick action */}
                <Card className="p-6 h-fit space-y-6">
                    <div>
                        <h3 className="text-sm font-semibold text-foreground/70 uppercase tracking-wider mb-2">Account Status</h3>
                        <div className="mb-3">
                            <Badge variant={IDENTITY_STATUS_BADGE_VARIANT[driver.status] ?? 'gray'}>
                                {driver.status}
                            </Badge>
                        </div>
                        {/* <Select
                            value={driver.status}
                            disabled={isIdentityPending}
                            onChange={(e) => updateIdentityStatus({ driverId: driver.id, status: e.target.value as IdentityStatus })}
                        >
                            {Object.values(IdentityStatus).map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </Select> */}
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-foreground/70 uppercase tracking-wider mb-2">
                            Duty Status
                        </h3>
                        <div className="mb-3">
                            <Badge variant={DRIVER_DUTY_STATUS_BADGE_VARIANT[driver.dutyStatus]}>
                                {driver.dutyStatus}
                            </Badge>
                        </div>
                        {/* <Select
                            value={driver.dutyStatus}
                            disabled={isDutyPending}
                            onChange={(e) => updateDutyStatus({ driverId: driver.id, dutyStatus: e.target.value as DutyStatus })}
                        >
                            {Object.values(DutyStatus).map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </Select> */}
                    </div>
                </Card>
            </div>
        </>
    );
}