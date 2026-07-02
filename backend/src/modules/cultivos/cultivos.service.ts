import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cultivo, EstadoCultivo } from './cultivo.entity';
import { EsquemaSiembra } from '../medios-cultivo/esquema-siembra.entity';
import { CreateCultivoDto } from './dto/create-cultivo.dto';

const FLUJO_ESTADOS = [
  EstadoCultivo.PENDIENTE,
  EstadoCultivo.RECEPCIONADO,
  EstadoCultivo.SEMBRADO,
  EstadoCultivo.EN_LECTURA,
  EstadoCultivo.CERRADO,
];

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
    const now = Date.now();
    const num = String(now).slice(-4);
    const codigo = `GR-${num.padStart(4, '0')}${Math.floor(Math.random() * 10)}`;

    const esquema = await this.esquemaRepo.findOneBy({ tipoEstudio: dto.tipoEstudio });
    const mediosSembrados = esquema?.medios ?? [];

    const cultivo = this.cultivoRepo.create({
      ...dto,
      codigoBarras: codigo,
      mediosSembrados,
    });
    return this.cultivoRepo.save(cultivo);
  }

  async avanzarEstado(id: number): Promise<Cultivo> {
    const c = await this.findOne(id);
    const idx = FLUJO_ESTADOS.indexOf(c.estado);
    if (idx === FLUJO_ESTADOS.length - 1) throw new BadRequestException('El cultivo ya esta cerrado');
    c.estado = FLUJO_ESTADOS[idx + 1];
    if (c.estado === EstadoCultivo.CERRADO) c.fechaCierre = new Date();
    return this.cultivoRepo.save(c);
  }

  async setEstado(id: number, estado: EstadoCultivo): Promise<Cultivo> {
    const c = await this.findOne(id);
    c.estado = estado;
    if (estado === EstadoCultivo.CERRADO) c.fechaCierre = new Date();
    else c.fechaCierre = null;
    return this.cultivoRepo.save(c);
  }

  async reabrir(id: number, motivo: string): Promise<Cultivo> {
    const c = await this.findOne(id);
    if (c.estado !== EstadoCultivo.CERRADO) throw new BadRequestException('El cultivo no esta cerrado');
    c.estado = EstadoCultivo.EN_LECTURA;
    c.fechaCierre = null;
    c.observacionesClinicas = `${c.observacionesClinicas || ''}\n[REAPERTURA] ${motivo}`.trim();
    return this.cultivoRepo.save(c);
  }
}
