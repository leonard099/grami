import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SeguimientoAislamiento } from './seguimiento-aislamiento.entity';
import { CreateSeguimientoDto } from './dto/create-seguimiento.dto';

@Injectable()
export class SeguimientoService {
  constructor(
    @InjectRepository(SeguimientoAislamiento)
    private readonly repo: Repository<SeguimientoAislamiento>,
  ) {}

  findByCultivo(cultivoId: number): Promise<SeguimientoAislamiento[]> {
    return this.repo.find({
      where: { cultivoId },
      order: { nroAislamiento: 'ASC' },
    });
  }

  async findOne(id: number): Promise<SeguimientoAislamiento> {
    const s = await this.repo.findOneBy({ id });
    if (!s) throw new NotFoundException(`Aislamiento #${id} no encontrado`);
    return s;
  }

  async create(dto: CreateSeguimientoDto): Promise<SeguimientoAislamiento> {
    // Calcular número de aislamiento automáticamente si no se provee
    if (!dto.nroAislamiento) {
      const ultimo = await this.repo.findOne({
        where: { cultivoId: dto.cultivoId },
        order: { nroAislamiento: 'DESC' },
      });
      dto.nroAislamiento = (ultimo?.nroAislamiento ?? 0) + 1;
    }
    return this.repo.save(this.repo.create(dto));
  }

  async update(id: number, dto: Partial<CreateSeguimientoDto>): Promise<SeguimientoAislamiento> {
    const s = await this.findOne(id);
    Object.assign(s, dto);
    return this.repo.save(s);
  }

  async remove(id: number): Promise<void> {
    const s = await this.findOne(id);
    await this.repo.remove(s);
  }
}
