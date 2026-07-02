/**
 * Seed inicial de esquemas de siembra.
 * Ejecutar con: npx ts-node src/database/seed-esquemas.ts
 */
import 'dotenv/config';
import { AppDataSource } from './data-source';
import { EsquemaSiembra } from '../modules/medios-cultivo/esquema-siembra.entity';

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
