import { DutyStatus } from 'src/shared/enums/duty-status.enum';

export interface IDriverDropdownResponse {
    id: string;
    name: string;
    dutyStatus: DutyStatus;
}
