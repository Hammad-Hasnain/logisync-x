import { IsEmail, IsNotEmpty, IsString, IsEnum, Length, IsOptional } from 'class-validator';
import { IdentityStatus } from 'src/shared/enums/identity-status.enum';
import { Role } from 'src/shared/enums/role.enum';

export class CreateIdentityDto {
    @IsEmail({}, { message: 'Please provide a valid corporate email address layout.' })
    @IsNotEmpty({ message: 'Identity corporate email address field cannot be left blank.' })
    email!: string;

    @IsString({ message: 'Authentication security password must be valid plain string text.' })
    @IsNotEmpty({ message: 'Authentication security password field cannot be left blank.' })
    @Length(6, 20, { message: 'Security password parameters must range securely between 6 to 20 characters.' })
    password!: string;

    @IsString({ message: 'Primary contact phone parameter must contain valid numeric string structures.' })
    @IsNotEmpty({ message: 'Primary contact phone sequence field cannot be left blank.' })
    phone!: string;

    @IsEnum(Role, { message: 'Assigned account permission privilege role level must map strictly onto system DRIVER or ADMIN roles.' })
    @IsNotEmpty({ message: 'Account organizational authentication role level cannot be left blank.' })
    role!: Role;

    @IsOptional()
    @IsEnum(IdentityStatus, { message: 'Provided configuration state status level must follow standard identity states.' })
    status?: IdentityStatus;
}
