/**
 * Seed inicial de esquemas de siembra.
 * Ejecutar con: npx ts-node src/database/seed-esquemas.ts
 */
import 'dotenv/config';
import { AppDataSource } from './data-source';
import { EsquemaSiembra } from '../modules/medios-cultivo/esquema-siembra.entity';

const RECUENTO_UFC = [
  '≥ 100.000 UFC/mL',
  '10.000 – 100.000 UFC/mL',
  '1.000 – 10.000 UFC/mL',
  '< 1.000 UFC/mL',
  'Sin desarrollo',
  'Contaminación',
];

const RANGOS_CELULAS = ['0-1', '1-3', '3-5', '5-7', '7-10', '10-20', '20-30', '> 30'];

const COLORES_CPS = [
  { valor: 'rosa', label: 'Rosa', color: '#F48FB1', germen: 'Escherichia coli' },
  { valor: 'azul_kes', label: 'Azul (KES)', color: '#90CAF9', germen: 'Klebsiella / Enterobacter / Serratia' },
  { valor: 'azul_entero', label: 'Azul turquesa', color: '#80DEEA', germen: 'Enterococcus spp.' },
  { valor: 'verde', label: 'Verde', color: '#A5D6A7', germen: 'Pseudomonas aeruginosa' },
  { valor: 'blanco', label: 'Blanco / incoloro', color: '#F5F5F5', germen: 'Levadura / Acinetobacter / Staphylococcus' },
  { valor: 'dorado', label: 'Dorado / caramelo', color: '#FFD54F', germen: 'Staphylococcus aureus' },
  { valor: 'amarillo', label: 'Amarillo', color: '#FFF176', germen: 'Proteus spp.' },
];

const esquemas = [
  {
    tipoEstudio: 'urocultivo',
    nombreDisplay: 'Urocultivo',
    medios: [
      { medio: 'CLDE', cantidad: '1/2 placa' },
      { medio: 'CPS', cantidad: '1/12 placa' },
    ],
    instrucciones: 'Sembrar por agotamiento. Incubar 37°C 24-48h.',
    diasResolucionEsperados: 2,
    camposCultivoPrimario: [
      { clave: 'recuento_ufc', label: 'Recuento de colonias', tipo: 'selector', opciones: RECUENTO_UFC, obligatorio: true },
      { clave: 'color_cps', label: 'Color en CPS', tipo: 'color_selector', colores: COLORES_CPS, obligatorio: false },
      { clave: 'leucocitos', label: 'Leucocitos', tipo: 'rango', opciones: RANGOS_CELULAS, obligatorio: false, grupo: 'Examen directo' },
      { clave: 'hematies', label: 'Hematíes', tipo: 'rango', opciones: RANGOS_CELULAS, obligatorio: false, grupo: 'Examen directo' },
      { clave: 'celulas_epiteliales', label: 'Células epiteliales', tipo: 'rango', opciones: RANGOS_CELULAS, obligatorio: false, grupo: 'Examen directo' },
      { clave: 'piocitos', label: 'Piocitos', tipo: 'cruces', obligatorio: false, grupo: 'Examen directo' },
      { clave: 'levaduras', label: 'Levaduras', tipo: 'cruces', obligatorio: false, grupo: 'Examen directo' },
      { clave: 'bacteriuria', label: 'Bacteriuria', tipo: 'cruces', obligatorio: false, grupo: 'Examen directo' },
      { clave: 'cristales', label: 'Cristales', tipo: 'cruces', obligatorio: false, grupo: 'Examen directo' },
      { clave: 'observaciones_directo', label: 'Observaciones', tipo: 'texto', obligatorio: false, grupo: 'Examen directo' },
    ],
  },
  {
    tipoEstudio: 'hemocultivo',
    nombreDisplay: 'Hemocultivo',
    medios: [
      { medio: 'Frasco aerobio BacT/ALERT', cantidad: '1 frasco' },
      { medio: 'Frasco anaerobio BacT/ALERT', cantidad: '1 frasco' },
    ],
    instrucciones: 'Cargar 8-10 mL por frasco. Incubar en sistema automatizado.',
    diasResolucionEsperados: 5,
    camposCultivoPrimario: [],
  },
  {
    tipoEstudio: 'secrecion',
    nombreDisplay: 'Secreción / Herida',
    medios: [
      { medio: 'CLDE', cantidad: '1 placa' },
      { medio: 'CNA', cantidad: '1 placa' },
      { medio: 'Caldo tioglicolato', cantidad: '1 tubo' },
    ],
    instrucciones: 'Incubar 37°C 24-48h. Subcultivar caldo a las 48h.',
    diasResolucionEsperados: 3,
    camposCultivoPrimario: [
      { clave: 'gram_directo', label: 'Gram directo', tipo: 'texto', obligatorio: true },
      { clave: 'fresco', label: 'Examen en fresco', tipo: 'texto', obligatorio: false },
    ],
  },
  {
    tipoEstudio: 'coprocultivo',
    nombreDisplay: 'Coprocultivo',
    medios: [
      { medio: 'MacConkey', cantidad: '1 placa' },
      { medio: 'SS agar', cantidad: '1 placa' },
      { medio: 'Caldo selenito', cantidad: '1 tubo' },
    ],
    instrucciones: 'Incubar 37°C 24h. Subcultivar selenito.',
    diasResolucionEsperados: 3,
    camposCultivoPrimario: [
      { clave: 'consistencia', label: 'Consistencia de materia fecal', tipo: 'selector', opciones: ['Formada', 'Blanda', 'Pastosa', 'Líquida'], obligatorio: false },
      { clave: 'leucocitos', label: 'Leucocitos en fresco', tipo: 'si_no', obligatorio: false },
      { clave: 'parasitologico', label: 'Observación parasitológica', tipo: 'texto', obligatorio: false },
    ],
  },
  {
    tipoEstudio: 'lcrcultivo',
    nombreDisplay: 'LCR - Cultivo',
    medios: [
      { medio: 'CLDE', cantidad: '1 placa' },
      { medio: 'Caldo BHI', cantidad: '1 tubo' },
    ],
    instrucciones: 'Procesar con urgencia. Examen directo con gram obligatorio. Incubar 37°C.',
    diasResolucionEsperados: 5,
    camposCultivoPrimario: [
      { clave: 'gram_directo', label: 'Gram directo', tipo: 'texto', obligatorio: true },
      { clave: 'fresco_hongos', label: 'Examen en fresco (hongos)', tipo: 'texto', obligatorio: false },
      { clave: 'celulas', label: 'Recuento de células', tipo: 'texto', obligatorio: false },
    ],
  },
  {
    tipoEstudio: 'microbiologico-general',
    nombreDisplay: 'Estudio microbiológico general',
    medios: [],
    instrucciones: 'Medios según tipo de muestra indicado.',
    diasResolucionEsperados: 3,
    requiereMaterial: true,
  },
  {
    tipoEstudio: 'chlamydia',
    nombreDisplay: 'Chlamydia trachomatis',
    medios: [
      { medio: 'Hisopado en medio de transporte', cantidad: '1 tubo' },
    ],
    instrucciones: 'Procesar por PCR. Indicar sitio de toma en el campo material.',
    diasResolucionEsperados: 2,
    requiereMaterial: true,
  },
  {
    tipoEstudio: 'micologico',
    nombreDisplay: 'Cultivo micológico',
    medios: [
      { medio: 'Agar Sabouraud', cantidad: '2 tubos' },
      { medio: 'Agar Sabouraud + cloranfenicol', cantidad: '1 tubo' },
    ],
    instrucciones: 'Incubar a 28°C y 37°C. Lectura semanal hasta los 30 días.',
    diasResolucionEsperados: 30,
    camposCultivoPrimario: [
      { clave: 'fresco_koh', label: 'Fresco con KOH', tipo: 'texto', obligatorio: false },
      { clave: 'calcofluor', label: 'Calcoflúor', tipo: 'texto', obligatorio: false },
      { clave: 'gram_directo', label: 'Gram directo', tipo: 'texto', obligatorio: false },
    ],
  },
  {
    tipoEstudio: 'anaerobios',
    nombreDisplay: 'Cultivo de anaerobios',
    medios: [
      { medio: 'Agar Brucella', cantidad: '1 placa' },
      { medio: 'Caldo tioglicolato', cantidad: '1 tubo' },
      { medio: 'CLDE (aerobiosis control)', cantidad: '1 placa' },
    ],
    instrucciones: 'Procesar en cámara anaerobia. Incubar 37°C 48-72h. Subcultivar si no hay desarrollo.',
    diasResolucionEsperados: 7,
  },
];

async function seed() {
  await AppDataSource.initialize();
  const repo = AppDataSource.getRepository(EsquemaSiembra);

  for (const e of esquemas) {
    const existe = await repo.findOneBy({ tipoEstudio: e.tipoEstudio });
    if (!existe) {
      await repo.save(repo.create(e));
      console.log(`Creado: ${e.nombreDisplay}`);
    } else {
      console.log(`Ya existe: ${e.nombreDisplay}`);
    }
  }

  await AppDataSource.destroy();
  console.log('Seed completado.');
}

seed().catch(console.error);
