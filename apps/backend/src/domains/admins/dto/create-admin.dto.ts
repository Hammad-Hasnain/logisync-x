import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { IdentityStatus } from 'src/shared/enums/identity-status.enum';

export class CreateAdminDto {
    @IsString({ message: 'Administrative profile user full name must contain plain standard alphabetic character variables.' })
    @IsNotEmpty({ message: 'Administrative profile user full name field cannot be left blank.' })
    name!: string;

    @IsEmail({}, { message: 'Please provide a valid corporate onboarding administrator email address layout.' })
    @IsNotEmpty({ message: 'Corporate onboarding administrator email address field cannot be left blank.' })
    email!: string;

    @IsString({ message: 'Administrative access credential account password must be valid plain string text.' })
    @IsNotEmpty({ message: 'Administrative access credential account password field cannot be left blank.' })
    @Length(6, 20, { message: 'Administrative password validation criteria must range between 6 to 20 characters.' })
    password!: string;

    @IsString({ message: 'Primary contact phone telephone string sequence parameter must be valid numeric text.' })
    @IsNotEmpty({ message: 'Primary contact phone telephone string sequence field cannot be left blank.' })
    phone!: string;

    @IsOptional()
    @IsEnum(IdentityStatus, { message: 'Provided configuration state status level must follow standard identity states.' })
    status?: IdentityStatus;
}
