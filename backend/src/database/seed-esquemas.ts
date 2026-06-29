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
  },
  {
    tipoEstudio: 'hemocultivo',
    nombreDisplay: 'Hemocultivo',
    medios: [
      { medio: 'Frasco aerobio BacT/ALERT', cantidad: '1 frasco' },
      { medio: 'Frasco anaerobio BacT/ALERT', cantidad: '1 frasco' },
    ],
    instrucciones: 'Cargar 8-10 mL por frasco. Incubar en sistema automatizado.',
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
  },
  {
    tipoEstudio: 'lcrcultivo',
    nombreDisplay: 'LCR - Cultivo',
    medios: [
      { medio: 'CLDE', cantidad: '1 placa' },
      { medio: 'Caldo BHI', cantidad: '1 tubo' },
    ],
    instrucciones: 'Procesar con urgencia. Examen directo con gram obligatorio. Incubar 37°C.',
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
