import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateAdminDto {
    @IsString()
    @IsNotEmpty({ message: 'Admin registration requires a valid name string.' })
    name!: string;

    @IsEmail({}, { message: 'Please provide a valid structural email configuration.' })
    email!: string;

    @IsString()
    @MinLength(6, { message: 'Security password hash payload must be at least 6 characters long.' })
    password!: string;

    @IsString()
    @IsNotEmpty({ message: 'Contact phone configuration string cannot be omitted.' })
    phone!: string;
}
