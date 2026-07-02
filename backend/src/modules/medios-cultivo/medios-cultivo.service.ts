import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EsquemaSiembra } from './esquema-siembra.entity';

@Injectable()
export class MediosCultivoService {
  constructor(
    @InjectRepository(EsquemaSiembra)
    private readonly repo: Repository<EsquemaSiembra>,
  ) {}

  findAll(): Promise<EsquemaSiembra[]> {
    return this.repo.find({ where: { activo: true }, order: { nombreDisplay: 'ASC' } });
  }

  async findByTipo(tipoEstudio: string): Promise<EsquemaSiembra> {
    const e = await this.repo.findOneBy({ tipoEstudio });
    if (!e) throw new NotFoundException(`Esquema "${tipoEstudio}" no encontrado`);
    return e;
  }
}
