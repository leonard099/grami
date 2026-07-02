import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

// Pacientes
export const buscarPacientes = (q: string) =>
  api.get('/pacientes/buscar', { params: { q } }).then(r => r.data);

export const crearPaciente = (data: object) =>
  api.post('/pacientes', data).then(r => r.data);

export const getPaciente = (id: number) =>
  api.get(`/pacientes/${id}`).then(r => r.data);

// Cultivos
export const getCultivos = (pacienteId?: number) =>
  api.get('/cultivos', { params: pacienteId ? { pacienteId } : {} }).then(r => r.data);

export const getCultivo = (id: number) =>
  api.get(`/cultivos/${id}`).then(r => r.data);

export const crearCultivo = (data: object) =>
  api.post('/cultivos', data).then(r => r.data);

export const cerrarCultivo = (id: number) =>
  api.put(`/cultivos/${id}/cerrar`).then(r => r.data);

export const reabrirCultivo = (id: number, motivo: string) =>
  api.put(`/cultivos/${id}/reabrir`, { motivo }).then(r => r.data);

// Esquemas
export const getEsquemas = () =>
  api.get('/esquemas').then(r => r.data);

export const getEsquema = (tipo: string) =>
  api.get(`/esquemas/${tipo}`).then(r => r.data);

// Seguimientos
export const getSeguimientos = (cultivoId: number) =>
  api.get(`/seguimientos/cultivo/${cultivoId}`).then(r => r.data);

export const crearSeguimiento = (data: object) =>
  api.post('/seguimientos', data).then(r => r.data);

export const actualizarSeguimiento = (id: number, data: object) =>
  api.put(`/seguimientos/${id}`, data).then(r => r.data);
