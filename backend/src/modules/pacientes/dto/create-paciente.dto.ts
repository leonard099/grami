import { IsString, IsOptional, IsDateString, Length, IsIn } from 'class-validator';

export class CreatePacienteDto {
  @IsString()
  @Length(1, 200)
  nombre: string;

  @IsOptional()
  @IsString()
  @Length(1, 20)
  dni?: string;

  @IsOptional()
  @IsDateString()
  fechaNacimiento?: string;

  @IsOptional()
  @IsIn(['M', 'F', 'Otro'])
  sexo?: string;

  @IsOptional()
  @IsString()
  obraSocial?: string;

  @IsOptional()
  @IsString()
  nroAfiliado?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  telefono?: string;
}
