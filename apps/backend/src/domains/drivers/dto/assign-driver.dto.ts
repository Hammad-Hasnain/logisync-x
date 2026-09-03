import { IsMongoId, IsNotEmpty } from 'class-validator';

export class AssignDriverDto {
    @IsMongoId({ message: 'A valid 24-character hexadecimal MongoDB ObjectId string is required to assign a driver.' })
    @IsNotEmpty({ message: 'The assigned driver identity token cannot be omitted.' })
    driverId!: string;
}
