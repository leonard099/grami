import { Controller, Get, Param } from '@nestjs/common';
import { MediosCultivoService } from './medios-cultivo.service';

@Controller('esquemas')
export class MediosCultivoController {
  constructor(private readonly svc: MediosCultivoService) {}

  @Get()
  findAll() {
    return this.svc.findAll();
  }

  @Get(':tipo')
  findByTipo(@Param('tipo') tipo: string) {
    return this.svc.findByTipo(tipo);
  }
}
