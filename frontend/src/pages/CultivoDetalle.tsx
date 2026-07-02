import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCultivo, cerrarCultivo, reabrirCultivo } from '../services/api';
import type { Cultivo } from '../types';
import styles from './CultivoDetalle.module.css';

export default function CultivoDetalle() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: cultivo, isLoading } = useQuery<Cultivo>({
    queryKey: ['cultivo', id],
    queryFn: () => getCultivo(Number(id)),
  });

  const mutCerrar = useMutation({
    mutationFn: () => cerrarCultivo(Number(id)),
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

  if (isLoading) return <div className={styles.page}><p className={styles.muted}>Cargando...</p></div>;
  if (!cultivo) return <div className={styles.page}><p className={styles.muted}>Cultivo no encontrado.</p></div>;

  const abierto = cultivo.estado === 'abierto';

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button onClick={() => navigate(-1)} className={styles.back}>← Volver</button>
        <div className={styles.headerRight}>
          <span className={`${styles.estado} ${abierto ? styles.abierto : styles.cerrado}`}>
            {cultivo.estado}
          </span>
          {abierto ? (
            <button className={styles.btnDanger} onClick={() => mutCerrar.mutate()}
              disabled={mutCerrar.isPending}>
              Cerrar cultivo
            </button>
          ) : (
            <button className={styles.btnSecondary} onClick={() => mutReabrir.mutate()}
              disabled={mutReabrir.isPending}>
              Reabrir cultivo
            </button>
          )}
        </div>
      </header>

      <div className={styles.grid}>
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Paciente</h2>
          <div className={styles.field}><span className={styles.flabel}>Nombre</span><span>{cultivo.paciente?.nombre}</span></div>
          <div className={styles.field}><span className={styles.flabel}>DNI</span><span>{cultivo.paciente?.dni || '—'}</span></div>
        </section>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Cultivo</h2>
          <div className={styles.field}><span className={styles.flabel}>Código</span><code className={styles.code}>{cultivo.codigoBarras}</code></div>
          <div className={styles.field}><span className={styles.flabel}>Tipo</span><span>{cultivo.tipoEstudio}</span></div>
          <div className={styles.field}><span className={styles.flabel}>Apertura</span><span>{new Date(cultivo.fechaApertura).toLocaleDateString('es-AR')}</span></div>
          {cultivo.medicoSolicitante && <div className={styles.field}><span className={styles.flabel}>Médico</span><span>{cultivo.medicoSolicitante}</span></div>}
          {cultivo.servicio && <div className={styles.field}><span className={styles.flabel}>Servicio</span><span>{cultivo.servicio}</span></div>}
        </section>
      </div>

      {(cultivo.mediosSembrados?.length ?? 0) > 0 && (
        <section className={styles.card} style={{ marginTop: 16 }}>
          <h2 className={styles.cardTitle}>Medios sembrados</h2>
          <div className={styles.medios}>
            {cultivo.mediosSembrados!.map((m, i) => (
              <div key={i} className={styles.medioPill}>
                <span className={styles.medioCant}>{m.cantidad}</span>
                <span>{m.medio}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className={styles.card} style={{ marginTop: 16 }}>
        <h2 className={styles.cardTitle}>Aislamientos / seguimiento</h2>
        {(!cultivo.seguimientos || cultivo.seguimientos.length === 0) ? (
          <p className={styles.muted}>Sin aislamientos registrados.</p>
        ) : (
          cultivo.seguimientos.map(s => (
            <div key={s.id} className={styles.aislamiento}>
              <div className={styles.aisNro}>#{s.nroAislamiento}</div>
              <div>
                {s.sospecha && <div><span className={styles.flabel}>Sospecha: </span>{s.sospecha}</div>}
                {s.identificacionDefinitiva && <div><span className={styles.flabel}>ID definitiva: </span><strong>{s.identificacionDefinitiva}</strong></div>}
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
