import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateDriverDto {
    @IsString()
    @IsNotEmpty({ message: 'Driver registration requires a valid name string.' })
    name!: string;

    @IsEmail({}, { message: 'Please provide a valid structural email configuration.' })
    email!: string;

    @IsString()
    @MinLength(6, { message: 'Security password hash payload must be at least 6 characters long.' })
    password!: string;

    @IsString()
    @IsNotEmpty({ message: 'Contact phone configuration string cannot be omitted.' })
    phone!: string;

    @IsString()
    @IsNotEmpty({ message: 'Driver professional license configuration number is required.' })
    licenseNumber!: string;

    @IsString()
    @IsNotEmpty({ message: 'Target vehicle license plate identification registry token is required.' })
    currentVehicleNumber!: string;
}
