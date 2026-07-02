import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cultivo, EstadoCultivo } from './cultivo.entity';
import { EsquemaSiembra } from '../medios-cultivo/esquema-siembra.entity';
import { CreateCultivoDto } from './dto/create-cultivo.dto';

@Injectable()
export class CultivosService {
  constructor(
    @InjectRepository(Cultivo) private readonly cultivoRepo: Repository<Cultivo>,
    @InjectRepository(EsquemaSiembra) private readonly esquemaRepo: Repository<EsquemaSiembra>,
  ) {}

  async findAll(pacienteId?: number): Promise<Cultivo[]> {
    const where: any = {};
    if (pacienteId) where.pacienteId = pacienteId;
    return this.cultivoRepo.find({
      where,
      relations: ['paciente', 'seguimientos'],
      order: { fechaApertura: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Cultivo> {
    const c = await this.cultivoRepo.findOne({
      where: { id },
      relations: ['paciente', 'seguimientos'],
    });
    if (!c) throw new NotFoundException(`Cultivo #${id} no encontrado`);
    return c;
  }

  async create(dto: CreateCultivoDto): Promise<Cultivo> {
    // Generar código de barras: tipo + timestamp
    const codigo = `${dto.tipoEstudio.toUpperCase().slice(0, 3)}-${Date.now()}`;

    // Obtener medios del esquema correspondiente
    const esquema = await this.esquemaRepo.findOneBy({ tipoEstudio: dto.tipoEstudio });
    const mediosSembrados = esquema?.medios ?? [];

    const cultivo = this.cultivoRepo.create({
      ...dto,
      codigoBarras: codigo,
      mediosSembrados,
    });
    return this.cultivoRepo.save(cultivo);
  }

  async cerrar(id: number): Promise<Cultivo> {
    const c = await this.findOne(id);
    if (c.estado === EstadoCultivo.CERRADO) {
      throw new BadRequestException('El cultivo ya está cerrado');
    }
    c.estado = EstadoCultivo.CERRADO;
    c.fechaCierre = new Date();
    return this.cultivoRepo.save(c);
  }

  async reabrir(id: number, motivo: string): Promise<Cultivo> {
    const c = await this.findOne(id);
    if (c.estado === EstadoCultivo.ABIERTO) {
      throw new BadRequestException('El cultivo ya está abierto');
    }
    c.estado = EstadoCultivo.ABIERTO;
    c.fechaCierre = null;
    // Guardamos el motivo en observaciones clínicas (extenderemos con tabla de auditoría luego)
    c.observacionesClinicas = `${c.observacionesClinicas || ''}\n[REAPERTURA] ${motivo}`.trim();
    return this.cultivoRepo.save(c);
  }
}
