import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Paciente } from './modules/pacientes/paciente.entity';
import { Cultivo } from './modules/cultivos/cultivo.entity';
import { EsquemaSiembra } from './modules/medios-cultivo/esquema-siembra.entity';
import { SeguimientoAislamiento } from './modules/seguimiento/seguimiento-aislamiento.entity';
import { PacientesModule } from './modules/pacientes/pacientes.module';
import { CultivosModule } from './modules/cultivos/cultivos.module';
import { MediosCultivoModule } from './modules/medios-cultivo/medios-cultivo.module';
import { SeguimientoModule } from './modules/seguimiento/seguimiento.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST', 'localhost'),
        port: parseInt(config.get('DB_PORT', '5432')),
        username: config.get('DB_USER', 'postgres'),
        password: config.get('DB_PASSWORD', ''),
        database: config.get('DB_NAME', 'grami'),
        entities: [Paciente, Cultivo, EsquemaSiembra, SeguimientoAislamiento],
        synchronize: config.get('NODE_ENV') !== 'production',
        logging: config.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),
    PacientesModule,
    CultivosModule,
    MediosCultivoModule,
    SeguimientoModule,
  ],
})
export class AppModule {}
