export interface Paciente {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  fechaNacimiento?: string;
  sexo?: string;
  obraSocial?: string;
  nroAfiliado?: string;
}

export interface MedioSembrado {
  medio: string;
  cantidad: string;
}

export type EstadoCultivo = 'abierto' | 'cerrado';

export interface Cultivo {
  id: number;
  codigoBarras: string;
  paciente: Paciente;
  tipoEstudio: string;
  material?: string;
  observacionesClinicas?: string;
  medicoSolicitante?: string;
  servicio?: string;
  estado: EstadoCultivo;
  fechaApertura: string;
  fechaCierre?: string;
  mediosSembrados?: MedioSembrado[];
  seguimientos?: SeguimientoAislamiento[];
}

export interface Prueba {
  prueba: string;
  resultado: string;
  fecha?: string;
}

export interface SeguimientoAislamiento {
  id: number;
  cultivoId: number;
  nroAislamiento: number;
  morfologiaColonia?: string;
  gram?: string;
  examenFresco?: string;
  pruebas?: Prueba[];
  sospecha?: string;
  identificacionDefinitiva?: string;
  antibiograma?: string;
  observaciones?: string;
  creadoEn: string;
  actualizadoEn: string;
}

export type TipoCampo =
  | 'texto'
  | 'si_no'
  | 'selector'
  | 'rango'
  | 'cruces'
  | 'numerico'
  | 'color_selector'
  | 'checklist';

export interface ColorOpcion {
  valor: string;
  label: string;
  color: string;
  germen: string;
}

export interface CampoCultivoPrimario {
  clave: string;
  label: string;
  tipo: TipoCampo;
  grupo?: string;
  opciones?: string[];
  colores?: ColorOpcion[];
  obligatorio?: boolean;
  apareceEnInforme?: boolean;
}

export interface EsquemaSiembra {
  id: number;
  tipoEstudio: string;
  nombreDisplay: string;
  medios: MedioSembrado[];
  instrucciones?: string;
  diasResolucionEsperados: number;
  requiereMaterial: boolean;
  camposCultivoPrimario: CampoCultivoPrimario[];
  activo: boolean;
}
