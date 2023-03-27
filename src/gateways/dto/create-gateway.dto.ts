import { IsNotEmpty, IsString, IsArray, IsOptional } from 'class-validator';

export class CreateGatewayDto {
  @IsString()
  @IsNotEmpty()
  readonly serialId: string;

  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly ipv4Address: string;

  @IsOptional()
  @IsArray()
  readonly peripheralDevices?: string[];
}

export class GatewayFiltersDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly serialId?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  //* Here we do not need to validate it because
  //* we may want to search like "192.168" and bring all matching result
  readonly ipv4Address?: string;

  @IsOptional()
  @IsArray()
  readonly peripheralDevices?: string[];

  @IsOptional()
  readonly page?: number;

  @IsOptional()
  readonly skip?: number;

  @IsOptional()
  readonly limit?: number;

  @IsOptional()
  readonly sort?: any;
}
