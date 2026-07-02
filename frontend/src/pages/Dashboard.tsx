import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getCultivos } from '../services/api';
import type { Cultivo } from '../types';
import styles from './Dashboard.module.css';

function diasDesde(fecha: string) {
  return Math.floor((Date.now() - new Date(fecha).getTime()) / 86_400_000);
}

export default function Dashboard() {
  const { data: cultivos = [], isLoading } = useQuery<Cultivo[]>({
    queryKey: ['cultivos'],
    queryFn: () => getCultivos(),
  });

  const abiertos = cultivos.filter(c => c.estado === 'abierto');
  const cerrados = cultivos.filter(c => c.estado === 'cerrado');

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <Link to="/cultivos/nuevo" className={styles.btnPrimary}>+ Nuevo cultivo</Link>
      </header>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statNum}>{abiertos.length}</span>
          <span className={styles.statLabel}>Cultivos abiertos</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statNum}>{cerrados.length}</span>
          <span className={styles.statLabel}>Cerrados hoy</span>
        </div>
        <div className={styles.stat}>
          <span className={`${styles.statNum} ${styles.danger}`}>
            {abiertos.filter(c => diasDesde(c.fechaApertura) >= 3).length}
          </span>
          <span className={styles.statLabel}>Con alerta de tiempo</span>
        </div>
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Cultivos abiertos</h2>
        {isLoading && <p className={styles.muted}>Cargando...</p>}
        {!isLoading && abiertos.length === 0 && (
          <p className={styles.muted}>No hay cultivos abiertos.</p>
        )}
        <div className={styles.list}>
          {abiertos.map(c => {
            const dias = diasDesde(c.fechaApertura);
            const alerta = dias >= 3;
            return (
              <Link key={c.id} to={`/cultivos/${c.id}`} className={styles.card}>
                <div className={styles.cardLeft}>
                  <span className={`${styles.badge} ${alerta ? styles.badgeDanger : styles.badgeOk}`}>
                    {dias}d
                  </span>
                  <div>
                    <div className={styles.cardTitle}>{c.paciente?.nombre}</div>
                    <div className={styles.cardSub}>{c.tipoEstudio} · #{c.codigoBarras}</div>
                  </div>
                </div>
                <span className={styles.arrow}>›</span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
