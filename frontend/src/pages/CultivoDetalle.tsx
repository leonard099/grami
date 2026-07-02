import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCultivo, avanzarEstado, reabrirCultivo } from '../services/api';
import type { Cultivo, EstadoCultivo } from '../types';
import s from './CultivoDetalle.module.css';

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

export default function CultivoDetalle() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: cultivo, isLoading } = useQuery<Cultivo>({
    queryKey: ['cultivo', id],
    queryFn: () => getCultivo(Number(id)),
  });

  const mutAvanzar = useMutation({
    mutationFn: () => avanzarEstado(Number(id)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cultivo', id] }),
  });

  const mutReabrir = useMutation({
    mutationFn: () => {
      const motivo = prompt('Motivo de reapertura:');
      if (!motivo) return Promise.reject();
      return reabrirCultivo(Number(id), motivo);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cultivo', id] }),
  });

  if (isLoading) return <div className={s.page}><p className={s.muted}>Cargando...</p></div>;
  if (!cultivo) return <div className={s.page}><p className={s.muted}>Cultivo no encontrado.</p></div>;

  const cerrado = cultivo.estado === 'cerrado';
  const dias = diasDesde(cultivo.fechaApertura);

  const SIGUIENTE_ACCION: Record<EstadoCultivo, string> = {
    pendiente: 'Marcar recepcionado',
    recepcionado: 'Marcar sembrado',
    sembrado: 'Pasar a lectura',
    en_lectura: 'Cerrar cultivo',
    cerrado: '',
  };

  return (
    <div className={s.page}>
      <div className={s.header}>
        <div className={s.headerLeft}>
          <button onClick={() => navigate(-1)} className={s.back}>
            <i className="ti ti-arrow-left" aria-hidden="true" /> Volver
          </button>
          <span className={s.idPill}>{cultivo.codigoBarras}</span>
          <span className={`${s.estadoBadge} ${s[ESTADO_CLASS[cultivo.estado]]}`}>
            {ESTADO_LABEL[cultivo.estado]}
          </span>
        </div>
        <div className={s.headerActions}>
          {!cerrado && (
            <button className={s.btnPrimary} onClick={() => mutAvanzar.mutate()} disabled={mutAvanzar.isPending}>
              {SIGUIENTE_ACCION[cultivo.estado]}
            </button>
          )}
          {cerrado && (
            <button className={s.btnSecondary} onClick={() => mutReabrir.mutate()} disabled={mutReabrir.isPending}>
              Reabrir cultivo
            </button>
          )}
        </div>
      </div>

      <div className={s.body}>
        <div className={s.grid2}>
          <section className={s.card}>
            <h2 className={s.cardTitle}>Paciente</h2>
            <div className={s.fieldRow}><span className={s.flabel}>Nombre</span><span>{cultivo.paciente?.nombre}</span></div>
            <div className={s.fieldRow}><span className={s.flabel}>DNI</span><span>{cultivo.paciente?.dni || '—'}</span></div>
            <div className={s.fieldRow}><span className={s.flabel}>Obra social</span><span>{cultivo.paciente?.obraSocial || '—'}</span></div>
          </section>

          <section className={s.card}>
            <h2 className={s.cardTitle}>Cultivo</h2>
            <div className={s.fieldRow}><span className={s.flabel}>Tipo</span><span>{cultivo.tipoEstudio}</span></div>
            <div className={s.fieldRow}><span className={s.flabel}>Apertura</span><span>{new Date(cultivo.fechaApertura).toLocaleDateString('es-AR')}</span></div>
            <div className={s.fieldRow}><span className={s.flabel}>Días</span>
              <span className={dias >= 3 ? s.diasAlerta : ''}>{dias} día{dias !== 1 ? 's' : ''}</span>
            </div>
            {cultivo.medicoSolicitante && <div className={s.fieldRow}><span className={s.flabel}>Médico</span><span>{cultivo.medicoSolicitante}</span></div>}
            {cultivo.centroDerivante && <div className={s.fieldRow}><span className={s.flabel}>Centro</span><span>{cultivo.centroDerivante}</span></div>}
          </section>
        </div>

        {(cultivo.mediosSembrados?.length ?? 0) > 0 && (
          <section className={s.card}>
            <h2 className={s.cardTitle}>Medios sembrados</h2>
            <div className={s.medios}>
              {cultivo.mediosSembrados!.map((m, i) => (
                <div key={i} className={s.medioPill}>
                  <span className={s.medioCant}>{m.cantidad}</span>
                  <span>{m.medio}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className={s.card}>
          <div className={s.cardTitleRow}>
            <h2 className={s.cardTitle}>Aislamientos</h2>
            <button className={s.btnAdd}><i className="ti ti-plus" aria-hidden="true" /> Agregar aislamiento</button>
          </div>
          {(!cultivo.seguimientos || cultivo.seguimientos.length === 0) ? (
            <p className={s.muted}>Sin aislamientos registrados.</p>
          ) : (
            cultivo.seguimientos.map(seg => (
              <div key={seg.id} className={s.aislamiento}>
                <div className={s.aisNro}>#{seg.nroAislamiento}</div>
                <div className={s.aisBody}>
                  {seg.sospecha && <div><span className={s.flabel}>Sospecha:</span> {seg.sospecha}</div>}
                  {seg.identificacionDefinitiva && <div><span className={s.flabel}>ID definitiva:</span> <strong>{seg.identificacionDefinitiva}</strong></div>}
                </div>
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  );
}
