import { IsInt, IsOptional, IsString, IsArray } from 'class-validator';

export class CreateSeguimientoDto {
  @IsInt()
  cultivoId: number;

  @IsOptional()
  @IsInt()
  nroAislamiento?: number;

  @IsOptional()
  @IsString()
  morfologiaColonia?: string;

  @IsOptional()
  @IsString()
  gram?: string;

  @IsOptional()
  @IsString()
  examenFresco?: string;

  @IsOptional()
  @IsArray()
  pruebas?: { prueba: string; resultado: string; fecha?: string }[];

  @IsOptional()
  @IsString()
  sospecha?: string;

  @IsOptional()
  @IsString()
  identificacionDefinitiva?: string;

  @IsOptional()
  @IsString()
  antibiograma?: string;

  @IsOptional()
  @IsString()
  observaciones?: string;
}
