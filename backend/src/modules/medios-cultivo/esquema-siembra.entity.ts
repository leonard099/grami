import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('esquemas_siembra')
export class EsquemaSiembra {
  @PrimaryGeneratedColumn()
  id: number;

  /** Clave única del tipo de estudio — coincide con Cultivo.tipoEstudio */
  @Column({ unique: true, length: 100 })
  tipoEstudio: string;

  /** Nombre legible, ej: "Urocultivo" */
  @Column({ length: 150 })
  nombreDisplay: string;

  /**
   * Lista de medios con cantidad a sembrar.
   * Ej: [{ medio: "CLDE", cantidad: "1/2 placa" }, { medio: "CPS", cantidad: "1/12 placa" }]
   */
  @Column({ type: 'jsonb' })
  medios: { medio: string; cantidad: string; descripcion?: string }[];

  /** Si true, el formulario de ingreso muestra el campo "Material / muestra" */
  @Column({ default: false })
  requiereMaterial: boolean;

  @Column({ nullable: true, length: 300 })
  instrucciones: string;

  /**
   * Días esperados para el cierre del cultivo.
   * Dispara la alerta visual en el dashboard cuando se supera este plazo.
   * Ej: urocultivo = 2, micológico = 30, anaerobios = 7.
   */
  @Column({ default: 3 })
  diasResolucionEsperados: number;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn()
  creadoEn: Date;
}
