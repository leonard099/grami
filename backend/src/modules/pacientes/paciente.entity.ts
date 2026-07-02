import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Cultivo } from '../cultivos/cultivo.entity';

@Entity('pacientes')
export class Paciente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 100 })
  apellido: string;

  @Column({ length: 20, unique: true })
  dni: string;

  @Column({ nullable: true })
  fechaNacimiento: Date;

  @Column({ nullable: true, length: 10 })
  sexo: string; // M / F / Otro

  @Column({ nullable: true, length: 200 })
  obraSocial: string;

  @Column({ nullable: true, length: 100 })
  nroAfiliado: string;

  @Column({ nullable: true, length: 150 })
  email: string;

  @Column({ nullable: true, length: 30 })
  telefono: string;

  @CreateDateColumn()
  creadoEn: Date;

  @UpdateDateColumn()
  actualizadoEn: Date;

  @OneToMany(() => Cultivo, (cultivo) => cultivo.paciente)
  cultivos: Cultivo[];
}
