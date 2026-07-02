import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { getCultivos, avanzarEstado } from '../services/api';
import type { Cultivo, EstadoCultivo } from '../types';
import s from './CultivosActivos.module.css';

const ESTADO_LABEL: Record<EstadoCultivo, string> = {
  pendiente: 'Pendiente',
  recepcionado: 'Recepcionado',
  sembrado: 'Sembrado',
  en_lectura: 'En lectura',
  cerrado: 'Cerrado',
};

const ESTADO_CLASS: Record<EstadoCultivo, string> = {
  pendiente: 'estadoPendiente',
  recepcionado: 'estadoRecepcionado',
  sembrado: 'estadoSembrado',
  en_lectura: 'estadoLectura',
  cerrado: 'estadoCerrado',
};

function diasDesde(fecha: string) {
  return Math.floor((Date.now() - new Date(fecha).getTime()) / 86_400_000);
}

export default function CultivosActivos() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [busqueda, setBusqueda] = useState('');

  const { data: cultivos = [], isLoading } = useQuery<Cultivo[]>({
    queryKey: ['cultivos'],
    queryFn: () => getCultivos(),
  });

  const mutAvanzar = useMutation({
    mutationFn: (id: number) => avanzarEstado(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cultivos'] }),
  });

  const abiertos = cultivos.filter(c => c.estado !== 'cerrado');
  const sinSiembra = cultivos.filter(c => c.estado === 'pendiente' || c.estado === 'recepcionado');
  const conAlerta = cultivos.filter(c => c.estado !== 'cerrado' && diasDesde(c.fechaApertura) >= 3);
  const cerradosHoy = cultivos.filter(c => {
    if (!c.fechaCierre) return false;
    return new Date(c.fechaCierre).toDateString() === new Date().toDateString();
  });

  const filtrados = abiertos.filter(c => {
    if (!busqueda) return true;
    const q = busqueda.toLowerCase();
    return (
      c.paciente?.nombre?.toLowerCase().includes(q) ||
      c.codigoBarras?.toLowerCase().includes(q) ||
      c.paciente?.dni?.includes(q)
    );
  });

  return (
    <div className={s.page}>
      {/* Header */}
      <div className={s.header}>
        <div className={s.headerLeft}>
          <h1 className={s.title}>Cultivos activos</h1>
          <div className={s.searchWrap}>
            <i className="ti ti-search" aria-hidden="true" />
            <input
              className={s.search}
              placeholder="Buscar por nombre, DNI o ID..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
            />
          </div>
        </div>
        <div className={s.headerActions}>
          <button className={s.btnSecondary}>
            <i className="ti ti-calendar" aria-hidden="true" /> Filtrar por fecha
          </button>
          <Link to="/cultivos/nuevo" className={s.btnPrimary}>
            <i className="ti ti-plus" aria-hidden="true" /> Nuevo cultivo
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className={s.stats}>
        <div className={s.stat}>
          <span className={s.statNum}>{abiertos.length}</span>
          <span className={s.statLabel}>Activos</span>
        </div>
        <div className={s.statDivider} />
        <div className={s.stat}>
          <span className={s.statNum}>{cultivos.filter(c => c.estado === 'recepcionado').length}</span>
          <span className={s.statLabel}>Pendientes recepción</span>
        </div>
        <div className={s.statDivider} />
        <div className={s.stat}>
          <span className={s.statNum}>{sinSiembra.length}</span>
          <span className={s.statLabel}>Sin siembra</span>
        </div>
        <div className={s.statDivider} />
        <div className={`${s.stat} ${conAlerta.length > 0 ? s.statAlert : ''}`}>
          <span className={s.statNum}>{conAlerta.length}</span>
          <span className={s.statLabel}>Alerta +72 hs</span>
        </div>
        <div className={s.statDivider} />
        <div className={s.stat}>
          <span className={s.statNum}>{cerradosHoy.length}</span>
          <span className={s.statLabel}>Cerrados hoy</span>
        </div>
      </div>

      {/* Alerta */}
      {conAlerta.length > 0 && (
        <div className={s.alertBanner}>
          <i className="ti ti-alert-triangle" aria-hidden="true" />
          {conAlerta.length} cultivo{conAlerta.length > 1 ? 's' : ''} lleva{conAlerta.length === 1 ? '' : 'n'} más de 72 hs sin registro de cierre.
        </div>
      )}

      {/* Tabla */}
      <div className={s.tableWrap}>
        <table className={s.table}>
          <thead>
            <tr>
              <th className={s.th}>ID</th>
              <th className={s.th}>Paciente</th>
              <th className={s.th}>Tipo de estudio</th>
              <th className={s.th}>Centro derivante</th>
              <th className={s.th}>Estado</th>
              <th className={s.th}>Días</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr><td colSpan={6} className={s.empty}>Cargando...</td></tr>
            )}
            {!isLoading && filtrados.length === 0 && (
              <tr><td colSpan={6} className={s.empty}>No hay cultivos activos.</td></tr>
            )}
            {filtrados.map(c => {
              const dias = diasDesde(c.fechaApertura);
              const alerta = dias >= 3;
              return (
                <tr key={c.id} className={s.tr} onClick={() => navigate(`/cultivos/${c.id}`)}>
                  <td className={s.td}>
                    <span className={s.idPill}>{c.codigoBarras}</span>
                  </td>
                  <td className={s.td}>
                    <div className={s.pacienteNombre}>{c.paciente?.nombre}</div>
                    {c.paciente?.dni && <div className={s.pacienteDni}>DNI {c.paciente.dni}</div>}
                  </td>
                  <td className={s.td}>{c.tipoEstudio.charAt(0).toUpperCase() + c.tipoEstudio.slice(1)}</td>
                  <td className={s.td + ' ' + s.tdMuted}>{c.centroDerivante || '—'}</td>
                  <td className={s.td}>
                    <span className={`${s.estadoBadge} ${s[ESTADO_CLASS[c.estado]]}`}>
                      {ESTADO_LABEL[c.estado]}
                    </span>
                  </td>
                  <td className={s.td}>
                    <span className={alerta ? s.diasAlerta : s.diasOk}>
                      {alerta && <i className="ti ti-clock" aria-hidden="true" />}
                      {dias} día{dias !== 1 ? 's' : ''}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
