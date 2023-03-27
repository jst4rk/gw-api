import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDeviceDto {
  @IsNumber()
  @IsNotEmpty()
  readonly uid: number;

  @IsString()
  @IsNotEmpty()
  readonly vendor: string;

  @IsNotEmpty()
  readonly createdAt: Date;

  @IsString()
  @IsNotEmpty()
  readonly status: string;
}

export class DeviceFiltersDto {
  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  readonly uid?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly vendor?: string;

  @IsOptional()
  @IsNotEmpty()
  readonly createdAt?: Date;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly status?: string;

  @IsOptional()
  readonly page?: number;

  @IsOptional()
  readonly skip?: number;

  @IsOptional()
  readonly limit?: number;

  @IsOptional()
  readonly sort?: any;
}
