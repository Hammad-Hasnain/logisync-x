import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Role } from 'src/shared/enums/role.enum';

export class CreateIdentityDto {
    @IsEmail({}, { message: 'A structurally accurate email format is required.' })
    @IsNotEmpty({ message: 'Identity email cannot be empty.' })
    email!: string;

    @IsString()
    @IsNotEmpty({ message: 'A valid plain-text password is required.' })
    @MinLength(6, { message: 'Security passwords must consist of at least 6 characters.' })
    password!: string;

    @IsString()
    @IsNotEmpty({ message: 'Contact phone configuration string cannot be omitted.' })
    phone!: string;

    @IsEnum(Role, { message: 'Supplied profile parameter must match a valid system clearance Role tag.' })
    @IsNotEmpty({ message: 'Primary authorization role type selection is required.' })
    role!: Role;
}
