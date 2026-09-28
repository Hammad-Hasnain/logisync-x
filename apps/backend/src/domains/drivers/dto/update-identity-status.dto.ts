import { IsEnum } from 'class-validator';
import { IdentityStatus } from 'src/shared/enums/identity-status.enum';

export class UpdateIdentityStatusDto {
    @IsEnum(IdentityStatus)
    status!: IdentityStatus;
}