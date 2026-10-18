import { DutyStatus } from 'src/shared/enums/duty-status.enum';
import { IdentityStatus } from 'src/shared/enums/identity-status.enum';
import { Role } from 'src/shared/enums/role.enum';

export interface IDriverResponse {
    id: string;
    name: string;
    email: string;
    phone: string;
    status: IdentityStatus;
    role: Role.DRIVER;
    vehicleNumber: string;
    dutyStatus: DutyStatus;
    createdAt: Date | string;
    updatedAt: Date | string;
}
