import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cultivo } from './cultivo.entity';
import { EsquemaSiembra } from '../medios-cultivo/esquema-siembra.entity';
import { CultivosService } from './cultivos.service';
import { CultivosController } from './cultivos.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Cultivo, EsquemaSiembra])],
  providers: [CultivosService],
  controllers: [CultivosController],
  exports: [CultivosService],
})
export class CultivosModule {}
