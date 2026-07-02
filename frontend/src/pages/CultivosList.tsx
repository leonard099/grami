import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getCultivos } from '../services/api';
import type { Cultivo } from '../types';
import styles from './CultivosList.module.css';

export default function CultivosList() {
  const [filtro, setFiltro] = useState<'todos' | 'abierto' | 'cerrado'>('todos');

  const { data: cultivos = [], isLoading } = useQuery<Cultivo[]>({
    queryKey: ['cultivos'],
    queryFn: () => getCultivos(),
  });

  const filtrados = filtro === 'todos' ? cultivos : cultivos.filter(c => c.estado === filtro);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Cultivos</h1>
        <Link to="/cultivos/nuevo" className={styles.btnPrimary}>+ Nuevo cultivo</Link>
      </header>

      <div className={styles.filtros}>
        {(['todos', 'abierto', 'cerrado'] as const).map(f => (
          <button
            key={f}
            className={`${styles.filtroBtn} ${filtro === f ? styles.active : ''}`}
            onClick={() => setFiltro(f)}
          >
            {f === 'todos' ? 'Todos' : f === 'abierto' ? 'Abiertos' : 'Cerrados'}
            <span className={styles.count}>
              {f === 'todos' ? cultivos.length : cultivos.filter(c => c.estado === f).length}
            </span>
          </button>
        ))}
      </div>

      {isLoading && <p className={styles.muted}>Cargando cultivos...</p>}

      <div className={styles.table}>
        {filtrados.map(c => (
          <Link key={c.id} to={`/cultivos/${c.id}`} className={styles.row}>
            <div className={styles.col} style={{ width: 120 }}>
              <code className={styles.codigo}>{c.codigoBarras}</code>
            </div>
            <div className={styles.col} style={{ flex: 1 }}>
              <div className={styles.paciente}>{c.paciente?.nombre}</div>
              <div className={styles.tipo}>{c.tipoEstudio}</div>
            </div>
            <div className={styles.col} style={{ width: 80 }}>
              <span className={`${styles.estado} ${c.estado === 'abierto' ? styles.abierto : styles.cerrado}`}>
                {c.estado}
              </span>
            </div>
            <div className={styles.col} style={{ width: 100, color: 'var(--text-muted)', fontSize: 12 }}>
              {new Date(c.fechaApertura).toLocaleDateString('es-AR')}
            </div>
            <span className={styles.arrow}>›</span>
          </Link>
        ))}
        {!isLoading && filtrados.length === 0 && (
          <p className={styles.muted}>No hay cultivos para mostrar.</p>
        )}
      </div>
    </div>
  );
}
