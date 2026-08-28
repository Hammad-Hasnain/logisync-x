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
}
