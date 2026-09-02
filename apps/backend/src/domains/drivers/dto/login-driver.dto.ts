import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDriverDto {
    @IsEmail({}, { message: 'Please specify a structurally accurate enterprise email configuration.' })
    email!: string;

    @IsString()
    @IsNotEmpty({ message: 'Authentication security password string cannot be omitted.' })
    @MinLength(6, { message: 'Passwords must consist of at least 6 structural characters.' })
    password!: string;
}
