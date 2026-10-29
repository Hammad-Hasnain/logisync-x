import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BreakdownRow } from '@/components/ui/breakdown-row';
import { IdentityStatus } from '@/enums/identity-status.enum';
import { DashboardAnalytics } from '@/types/dashboard.types';
import { DRIVER_DUTY_STATUS_BADGE_VARIANT, IDENTITY_STATUS_BADGE_VARIANT } from '@/lib/driver-status-styles';
import { DutyStatus } from '@/enums/duty-status.enum';

const FLEET_ROWS: { key: keyof DashboardAnalytics; status: DutyStatus }[] = [
    { key: 'availableDrivers', status: DutyStatus.AVAILABLE },
    { key: 'onTripDrivers', status: DutyStatus.ON_TRIP },
    { key: 'offlineDrivers', status: DutyStatus.OFFLINE },
];

const ACCOUNT_ROWS: { key: keyof DashboardAnalytics; status: IdentityStatus }[] = [
    { key: 'activeDrivers', status: IdentityStatus.ACTIVE },
    { key: 'pendingDrivers', status: IdentityStatus.PENDING },
    { key: 'deactiveDrivers', status: IdentityStatus.DEACTIVE },
];

export function DriversOverview({ analytics }: { analytics: DashboardAnalytics }) {
    return (
        <Card hoverable className="p-6">
            <h3 className="text-sm font-semibold text-foreground/70 uppercase tracking-wider mb-3">Driver Duty status</h3>
            {FLEET_ROWS.map(({ key, status }) => (
                <BreakdownRow
                    key={key}
                    badge={<Badge variant={DRIVER_DUTY_STATUS_BADGE_VARIANT[status]}>{status}</Badge>}
                    count={analytics[key]}
                />
            ))}

            <h3 className="text-sm font-semibold text-foreground/70 uppercase tracking-wider mt-6 mb-3">
                Account status
            </h3>
            {ACCOUNT_ROWS.map(({ key, status }) => (
                <BreakdownRow
                    key={key}
                    badge={<Badge variant={IDENTITY_STATUS_BADGE_VARIANT[status]}>{status}</Badge>}
                    count={analytics[key]}
                />
            ))}
        </Card>
    );
}