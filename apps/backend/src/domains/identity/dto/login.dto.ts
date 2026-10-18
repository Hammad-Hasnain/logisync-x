import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
    @IsEmail({}, { message: 'A structurally accurate email format is required.' })
    @IsNotEmpty({ message: 'Authorization identity email cannot be empty.' })
    email!: string;

    @IsString()
    @IsNotEmpty({ message: 'Authentication password configuration string cannot be omitted.' })
    @MinLength(6, { message: 'Security password must consist of at least 6 characters.' })
    password!: string;
}
