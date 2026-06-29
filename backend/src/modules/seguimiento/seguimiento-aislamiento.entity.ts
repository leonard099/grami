import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import { Cultivo } from '../cultivos/cultivo.entity';

@Entity('seguimiento_aislamientos')
export class SeguimientoAislamiento {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cultivo, (c) => c.seguimientos)
  @JoinColumn({ name: 'cultivoId' })
  cultivo: Cultivo;

  @Column()
  cultivoId: number;

  /** Número de aislamiento dentro del cultivo: 1, 2, 3... */
  @Column({ default: 1 })
  nroAislamiento: number;

  /** Descripción morfológica en placa */
  @Column({ nullable: true, length: 500 })
  morfologiaColonia: string;

  /** Resultado del gram */
  @Column({ nullable: true, length: 300 })
  gram: string;

  /** Resultado del examen en fresco */
  @Column({ nullable: true, length: 300 })
  examenFresco: string;

  /**
   * Pruebas realizadas al aislamiento.
   * Ej: [{ prueba: "Catalasa", resultado: "+" }, { prueba: "Oxidasa", resultado: "-" }]
   */
  @Column({ type: 'jsonb', nullable: true })
  pruebas: { prueba: string; resultado: string; fecha?: string }[];

  /** Identificación presuntiva / sospecha diagnóstica */
  @Column({ nullable: true, length: 300 })
  sospecha: string;

  /** Identificación definitiva (una vez confirmada) */
  @Column({ nullable: true, length: 300 })
  identificacionDefinitiva: string;

  /** Referencia al antibiograma si aplica */
  @Column({ nullable: true, length: 200 })
  antibiograma: string;

  @Column({ nullable: true, length: 1000 })
  observaciones: string;

  @CreateDateColumn()
  creadoEn: Date;

  @UpdateDateColumn()
  actualizadoEn: Date;
}
