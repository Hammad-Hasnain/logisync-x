import { IdentityStatus } from '@/enums/identity-status.enum';
import { BadgeProps } from '@/components/ui/badge';
import { DutyStatus } from '@/enums/duty-status.enum';

type BadgeVariant = NonNullable<BadgeProps['variant']>;

export const DRIVER_DUTY_STATUS_BADGE_VARIANT: Record<DutyStatus, 'gray' | 'blue' | 'green'> = {
    [DutyStatus.OFFLINE]: 'gray',
    [DutyStatus.AVAILABLE]: 'green',
    [DutyStatus.ON_TRIP]: 'blue',
};

export const IDENTITY_STATUS_BADGE_VARIANT: Record<IdentityStatus, BadgeVariant> = {
    [IdentityStatus.PENDING]: 'yellow',
    [IdentityStatus.ACTIVE]: 'green',
    [IdentityStatus.SUSPENDED]: 'red',
    [IdentityStatus.LOCKED]: 'red',
    [IdentityStatus.DEACTIVATED]: 'gray',
};