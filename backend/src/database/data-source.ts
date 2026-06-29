import { DataSource } from 'typeorm';
import { Paciente } from '../modules/pacientes/paciente.entity';
import { Cultivo } from '../modules/cultivos/cultivo.entity';
import { EsquemaSiembra } from '../modules/medios-cultivo/esquema-siembra.entity';
import { SeguimientoAislamiento } from '../modules/seguimiento/seguimiento-aislamiento.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'grami',
  entities: [Paciente, Cultivo, EsquemaSiembra, SeguimientoAislamiento],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
});
