import { IsNotEmpty, IsMongoId } from 'class-validator';

export class AssignDriverDto {
    @IsNotEmpty({ message: 'Fleet driver identifier reference parameter cannot be left blank.' })
    @IsMongoId({ message: 'Assigned dynamic fleet driver identifier must be a valid Mongo Object ID layout.' })
    driverId!: string;
}
