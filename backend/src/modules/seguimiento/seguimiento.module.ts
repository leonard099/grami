import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeguimientoAislamiento } from './seguimiento-aislamiento.entity';
import { SeguimientoService } from './seguimiento.service';
import { SeguimientoController } from './seguimiento.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SeguimientoAislamiento])],
  providers: [SeguimientoService],
  controllers: [SeguimientoController],
  exports: [SeguimientoService],
})
export class SeguimientoModule {}
