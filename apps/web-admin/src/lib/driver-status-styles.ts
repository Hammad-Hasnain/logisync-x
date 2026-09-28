import { FleetStatus } from '@/enums/fleet-status.enum';
import { IdentityStatus } from '@/enums/identity-status.enum';
import { BadgeProps } from '@/components/ui/badge';

type BadgeVariant = NonNullable<BadgeProps['variant']>;

export const FLEET_STATUS_BADGE_VARIANT: Record<FleetStatus, BadgeVariant> = {
    [FleetStatus.ONLINE]: 'green',
    [FleetStatus.OFFLINE]: 'gray',
    [FleetStatus.ON_TRIP]: 'cyan',
    [FleetStatus.ON_BREAK]: 'yellow',
    [FleetStatus.MAINTENANCE]: 'red',
};

export const IDENTITY_STATUS_BADGE_VARIANT: Record<IdentityStatus, BadgeVariant> = {
    [IdentityStatus.PENDING]: 'yellow',
    [IdentityStatus.ACTIVE]: 'green',
    [IdentityStatus.SUSPENDED]: 'red',
    [IdentityStatus.LOCKED]: 'red',
    [IdentityStatus.DEACTIVATED]: 'gray',
};