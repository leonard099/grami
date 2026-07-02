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

  /**
   * Campos configurables del cultivo primario para este tipo de estudio.
   * Cada campo define qué se observa antes de trabajar los aislamientos.
   *
   * tipo: 'texto' | 'selector' | 'si_no'
   * opciones: solo para tipo 'selector'
   *
   * Ejemplos:
   *   urocultivo      → [{ clave: 'recuento', label: 'Recuento de colonias', tipo: 'selector', opciones: [...] }]
   *   lcr             → [{ clave: 'gram_directo', label: 'Gram directo', tipo: 'texto' },
   *                      { clave: 'fresco', label: 'Examen en fresco (hongos)', tipo: 'texto' }]
   *   hemocultivo     → []   (sin cultivo primario, el sistema automatizado reporta el crecimiento)
   *   micologico      → [{ clave: 'fresco_koh', label: 'Fresco con KOH', tipo: 'texto' },
   *                      { clave: 'calcofluor', label: 'Calcoflúor', tipo: 'texto' }]
   */
  /**
   * Campos configurables del cultivo primario por tipo de estudio.
   *
   * Tipos disponibles:
   *   'texto'          → campo de texto libre
   *   'si_no'          → botones Sí / No
   *   'selector'       → dropdown con opciones fijas
   *   'rango'          → dropdown con rangos numéricos (ej: leucocitos 0-1, 1-3, ...)
   *   'cruces'         → selector −/+/++/+++ (bacterias, cristales, levaduras, etc.)
   *   'numerico'       → campo numérico libre
   *   'color_selector' → selector de colores del medio cromogénico, cada opción tiene label + color + germen orientativo
   *   'checklist'      → selección múltiple (ej: descripción de microbiota)
   *
   * Los campos pueden agruparse con 'grupo' para mostrarlos bajo un subtítulo en el formulario.
   */
  @Column({ type: 'jsonb', default: [] })
  camposCultivoPrimario: {
    clave: string;
    label: string;
    tipo: 'texto' | 'si_no' | 'selector' | 'rango' | 'cruces' | 'numerico' | 'color_selector' | 'checklist';
    grupo?: string;
    opciones?: string[];
    colores?: { valor: string; label: string; color: string; germen: string }[];
    obligatorio?: boolean;
  }[];

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
