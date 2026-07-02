import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Paciente } from './paciente.entity';
import { CreatePacienteDto } from './dto/create-paciente.dto';

@Injectable()
export class PacientesService {
  constructor(
    @InjectRepository(Paciente)
    private readonly repo: Repository<Paciente>,
  ) {}

  async buscar(q: string): Promise<Paciente[]> {
    if (!q || q.trim().length < 2) return [];
    const termino = q.trim();
    // Si es numérico, busca por DNI exacto o que empiece con ese número
    if (/^\d+$/.test(termino)) {
      return this.repo.find({
        where: { dni: ILike(`${termino}%`) },
        order: { nombre: 'ASC' },
        take: 20,
      });
    }
    // Si es texto, busca por nombre
    return this.repo.find({
      where: { nombre: ILike(`%${termino}%`) },
      order: { nombre: 'ASC' },
      take: 20,
    });
  }

  async findOne(id: number): Promise<Paciente> {
    const p = await this.repo.findOne({ where: { id }, relations: ['cultivos'] });
    if (!p) throw new NotFoundException(`Paciente #${id} no encontrado`);
    return p;
  }

  async create(dto: CreatePacienteDto): Promise<Paciente> {
    if (dto.dni) {
      const existe = await this.repo.findOneBy({ dni: dto.dni });
      if (existe) throw new ConflictException(`Ya existe un paciente con DNI ${dto.dni}`);
    }
    return this.repo.save(this.repo.create(dto));
  }

  async update(id: number, dto: Partial<CreatePacienteDto>): Promise<Paciente> {
    const p = await this.findOne(id);
    Object.assign(p, dto);
    return this.repo.save(p);
  }
}
