import { IsNotEmpty, IsNumber, IsArray, IsDateString, IsMongoId, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CoordinateTelemetryDto {
    @IsNumber({}, { message: 'Latitude spatial coordinate vector location parameters must be a numeric floating value.' })
    @IsNotEmpty({ message: 'Geographic viewport anchor latitude data cannot be left blank.' })
    lat!: number;

    @IsNumber({}, { message: 'Longitude spatial coordinate vector location parameters must be a numeric floating value.' })
    @IsNotEmpty({ message: 'Geographic viewport anchor longitude data cannot be left blank.' })
    lng!: number;

    @IsDateString({}, { message: 'Telemetry hardware trace physical capture checkpoint timestamp must be valid ISO sequence.' })
    @IsNotEmpty({ message: 'Telemetry capture timestamp variable field metadata configuration is mandatory.' })
    timestamp!: string;
}

export class BatchSyncTelemetryDto {
    @IsNotEmpty({ message: 'Target package logistic system tracker identification validation reference cannot be blank.' })
    @IsMongoId({ message: 'Target processing tracking order reference key must be a structural Mongo Hex Object ID.' })
    orderId!: string;

    @IsArray({ message: 'Localized mobile physical hardware data buffers queue parameters must map to structural list arrays.' })
    @ValidateNested({ each: true })
    @Type(() => CoordinateTelemetryDto)
    coordinates!: CoordinateTelemetryDto[];
}
