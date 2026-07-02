import { Controller, Get, Post, Put, Param, Body, Query, ParseIntPipe } from '@nestjs/common';
import { PacientesService } from './pacientes.service';
import { CreatePacienteDto } from './dto/create-paciente.dto';

@Controller('pacientes')
export class PacientesController {
  constructor(private readonly svc: PacientesService) {}

  @Get('buscar')
  buscar(@Query('q') q: string) {
    return this.svc.buscar(q);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.svc.findOne(id);
  }

  @Post()
  create(@Body() dto: CreatePacienteDto) {
    return this.svc.create(dto);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: CreatePacienteDto) {
    return this.svc.update(id, dto);
  }
}
