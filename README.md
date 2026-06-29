# Grami — Sistema de Bacteriología

Sistema de gestión para el área de bacteriología de un laboratorio de análisis clínico.

## Stack

- **Backend:** NestJS · TypeORM · PostgreSQL
- **Frontend:** React · TypeScript

## Módulos

| Módulo | Descripción |
|---|---|
| Pacientes | Registro y búsqueda por nombre, DNI |
| Cultivos | Apertura, seguimiento y cierre; esquemas de medios automáticos según tipo de estudio |
| Medios de cultivo | Catálogo de medios y esquemas de siembra por tipo de estudio |
| Seguimiento | Hoja de seguimiento por aislamiento: gram, fresco, pruebas realizadas, sospecha diagnóstica |
| Informes | Informe preliminar (cultivo abierto) o informe final (cultivo cerrado) |
| Auth | Autenticación de usuarios del laboratorio |

## Esquemas de siembra (ejemplos)

| Tipo de estudio | Medios |
|---|---|
| Urocultivo | ½ placa CLDE + 1/12 placa CPS |
| Hemocultivo | Frasco aerobio + anaerobio |
| Secreción | Placa CLDE + placa CNA + Caldo tioglicolato |

## Estructura

```
grami/
├── backend/          # NestJS API
│   └── src/
│       ├── modules/
│       │   ├── pacientes/
│       │   ├── cultivos/
│       │   ├── medios-cultivo/
│       │   ├── seguimiento/
│       │   ├── informes/
│       │   └── auth/
│       ├── common/
│       └── database/
└── frontend/         # React
    └── src/
        ├── components/
        ├── pages/
        ├── hooks/
        ├── services/
        └── types/
```

## Desarrollo local

### Requisitos
- Node.js 18+
- PostgreSQL 14+

### Backend
```bash
cd backend
npm install
cp .env.example .env
npm run start:dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```
