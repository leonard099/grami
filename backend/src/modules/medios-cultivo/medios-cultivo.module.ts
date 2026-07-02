import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EsquemaSiembra } from './esquema-siembra.entity';
import { MediosCultivoService } from './medios-cultivo.service';
import { MediosCultivoController } from './medios-cultivo.controller';

@Module({
  imports: [TypeOrmModule.forFeature([EsquemaSiembra])],
  providers: [MediosCultivoService],
  controllers: [MediosCultivoController],
  exports: [MediosCultivoService],
})
export class MediosCultivoModule {}
