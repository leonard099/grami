import { Controller, Get, Post, Put, Param, Body, Query, ParseIntPipe } from '@nestjs/common';
import { CultivosService } from './cultivos.service';
import { CreateCultivoDto } from './dto/create-cultivo.dto';
import { EstadoCultivo } from './cultivo.entity';

@Controller('cultivos')
export class CultivosController {
  constructor(private readonly svc: CultivosService) {}

  @Get()
  findAll(@Query('pacienteId') pacienteId?: string) {
    return this.svc.findAll(pacienteId ? parseInt(pacienteId) : undefined);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.svc.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateCultivoDto) {
    return this.svc.create(dto);
  }

  @Put(':id/avanzar')
  avanzarEstado(@Param('id', ParseIntPipe) id: number) {
    return this.svc.avanzarEstado(id);
  }

  @Put(':id/estado')
  setEstado(@Param('id', ParseIntPipe) id: number, @Body('estado') estado: EstadoCultivo) {
    return this.svc.setEstado(id, estado);
  }

  @Put(':id/reabrir')
  reabrir(@Param('id', ParseIntPipe) id: number, @Body('motivo') motivo: string) {
    return this.svc.reabrir(id, motivo);
  }
}
