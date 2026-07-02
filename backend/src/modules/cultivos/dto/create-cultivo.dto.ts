import { IsString, IsInt, IsOptional, Length } from 'class-validator';

export class CreateCultivoDto {
  @IsInt()
  pacienteId: number;

  @IsString()
  @Length(1, 100)
  tipoEstudio: string;

  @IsOptional()
  @IsString()
  material?: string;

  @IsOptional()
  @IsString()
  observacionesClinicas?: string;

  @IsOptional()
  @IsString()
  medicoSolicitante?: string;

  @IsOptional()
  @IsString()
  servicio?: string;
}
