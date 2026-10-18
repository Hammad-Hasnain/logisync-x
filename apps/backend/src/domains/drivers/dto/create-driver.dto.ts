import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { IdentityStatus } from 'src/shared/enums/identity-status.enum';

export class CreateDriverDto {
    @IsString({ message: 'Driver operation profile identity name must contain plain standard alphabetic character variables.' })
    @IsNotEmpty({ message: 'Driver operation profile identity name field cannot be left blank.' })
    name!: string;

    @IsEmail({}, { message: 'Please provide a valid corporate onboarding driver email address layout.' })
    @IsNotEmpty({ message: 'Corporate onboarding driver email address field cannot be left blank.' })
    email!: string;

    @IsString({ message: 'Driver access credential account password must be valid plain string text.' })
    @IsNotEmpty({ message: 'Driver access credential account password field cannot be left blank.' })
    @Length(6, 20, { message: 'Driver password validation criteria must range between 6 to 20 characters.' })
    password!: string;

    @IsString({ message: 'Primary contact phone telephone string sequence parameter must be valid numeric text.' })
    @IsNotEmpty({ message: 'Primary contact phone telephone string sequence field cannot be left blank.' })
    phone!: string;

    @IsString({ message: 'Enterprise asset deployment vehicle number registration indicator must be valid alphanumeric text.' })
    @IsNotEmpty({ message: 'Enterprise asset deployment vehicle number registration indicator field cannot be left blank.' })
    vehicleNumber!: string;

    @IsOptional()
    @IsEnum(IdentityStatus, { message: 'Provided configuration state status level must follow standard identity states.' })
    status?: IdentityStatus;
}
