import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, ManyToOne, OneToMany, JoinColumn,
} from 'typeorm';
import { Paciente } from '../pacientes/paciente.entity';
import { SeguimientoAislamiento } from '../seguimiento/seguimiento-aislamiento.entity';

export enum EstadoCultivo {
  PENDIENTE = 'pendiente',
  RECEPCIONADO = 'recepcionado',
  SEMBRADO = 'sembrado',
  EN_LECTURA = 'en_lectura',
  CERRADO = 'cerrado',
}

@Entity('cultivos')
export class Cultivo {
  @PrimaryGeneratedColumn()
  id: number;

  /** Código de barras / ID legible para impresión */
  @Column({ unique: true, length: 50 })
  codigoBarras: string;

  @ManyToOne(() => Paciente, (p) => p.cultivos, { eager: true })
  @JoinColumn({ name: 'pacienteId' })
  paciente: Paciente;

  @Column()
  pacienteId: number;

  /** Ej: "urocultivo", "hemocultivo", "secrecion", etc. */
  @Column({ length: 100 })
  tipoEstudio: string;

  /** Material / muestra: ej. "orina espontanea", "sangre periferica" */
  @Column({ nullable: true, length: 200 })
  material: string;

  @Column({ nullable: true, length: 500 })
  observacionesClinicas: string;

  @Column({ nullable: true, length: 100 })
  medicoSolicitante: string;

  @Column({ nullable: true, length: 100 })
  servicio: string;

  @Column({ nullable: true, length: 150 })
  centroDerivante: string;

  @Column({ type: 'enum', enum: EstadoCultivo, default: EstadoCultivo.PENDIENTE })
  estado: EstadoCultivo;

  @Column({ nullable: true })
  fechaCierre: Date;

  /** Medios sembrados (guardados como JSON snapshot del esquema) */
  @Column({ type: 'jsonb', nullable: true })
  mediosSembrados: { medio: string; cantidad: string }[];

  @CreateDateColumn()
  fechaApertura: Date;

  @UpdateDateColumn()
  actualizadoEn: Date;

  @OneToMany(() => SeguimientoAislamiento, (s) => s.cultivo, { cascade: true })
  seguimientos: SeguimientoAislamiento[];
}
