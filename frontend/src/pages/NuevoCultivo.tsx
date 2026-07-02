import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { buscarPacientes, crearPaciente, crearCultivo, getEsquemas } from '../services/api';
import type { Paciente, EsquemaSiembra } from '../types';
import styles from './NuevoCultivo.module.css';

export default function NuevoCultivo() {
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState('');
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [crearNuevo, setCrearNuevo] = useState(false);
  const [formPaciente, setFormPaciente] = useState({ nombre: '', dni: '', sexo: '', obraSocial: '' });
  const [tipoEstudio, setTipoEstudio] = useState('');
  const [material, setMaterial] = useState('');
  const [medico, setMedico] = useState('');
  const [servicio, setServicio] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);

  const { data: resultados = [] } = useQuery<Paciente[]>({
    queryKey: ['pacientes-buscar', busqueda],
    queryFn: () => buscarPacientes(busqueda),
    enabled: busqueda.length >= 2 && !paciente,
  });

  const { data: esquemas = [] } = useQuery<EsquemaSiembra[]>({
    queryKey: ['esquemas'],
    queryFn: getEsquemas,
  });

  const esquemaSeleccionado = esquemas.find(e => e.tipoEstudio === tipoEstudio);

  const mutPaciente = useMutation({ mutationFn: crearPaciente });
  const mutCultivo = useMutation({
    mutationFn: crearCultivo,
    onSuccess: (c: { id: number }) => navigate(`/cultivos/${c.id}`),
  });

  // Cerrar dropdown al clickear fuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setMostrarResultados(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    let pid = paciente?.id;
    if (!pid && crearNuevo) {
      const p = await mutPaciente.mutateAsync(formPaciente);
      pid = p.id;
    }
    if (!pid) return;
    await mutCultivo.mutateAsync({
      pacienteId: pid, tipoEstudio, material, medicoSolicitante: medico, servicio, observacionesClinicas: observaciones,
    });
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button onClick={() => navigate(-1)} className={styles.back}>← Volver</button>
        <h1 className={styles.title}>Nuevo cultivo</h1>
      </header>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* PACIENTE */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Paciente</h2>

          {paciente ? (
            <div className={styles.pacienteSeleccionado}>
              <div>
                <div className={styles.pacienteNombre}>{paciente.nombre}</div>
                <div className={styles.pacienteSub}>DNI: {paciente.dni || '—'} · {paciente.obraSocial || 'Sin obra social'}</div>
              </div>
              <button type="button" className={styles.btnLink} onClick={() => { setPaciente(null); setBusqueda(''); }}>
                Cambiar
              </button>
            </div>
          ) : (
            <div ref={searchRef} className={styles.searchWrap}>
              <input
                className={styles.input}
                placeholder="Buscar por nombre o DNI..."
                value={busqueda}
                onChange={e => { setBusqueda(e.target.value); setMostrarResultados(true); setCrearNuevo(false); }}
                onFocus={() => setMostrarResultados(true)}
              />
              {mostrarResultados && busqueda.length >= 2 && (
                <div className={styles.dropdown}>
                  {resultados.map(p => (
                    <button key={p.id} type="button" className={styles.dropdownItem}
                      onClick={() => { setPaciente(p); setMostrarResultados(false); setBusqueda(''); }}>
                      <span className={styles.dropNombre}>{p.nombre}</span>
                      <span className={styles.dropSub}>{p.dni ? `DNI ${p.dni}` : 'Sin DNI'}</span>
                    </button>
                  ))}
                  <button type="button" className={styles.dropdownNew}
                    onClick={() => { setCrearNuevo(true); setMostrarResultados(false); }}>
                    + Registrar nuevo paciente
                  </button>
                </div>
              )}
            </div>
          )}

          {crearNuevo && !paciente && (
            <div className={styles.subForm}>
              <div className={styles.row2}>
                <div className={styles.field}>
                  <label className={styles.label}>Apellido y nombre *</label>
                  <input className={styles.input} value={formPaciente.nombre}
                    onChange={e => setFormPaciente(p => ({ ...p, nombre: e.target.value }))} required />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>DNI (opcional)</label>
                  <input className={styles.input} value={formPaciente.dni}
                    onChange={e => setFormPaciente(p => ({ ...p, dni: e.target.value }))} />
                </div>
              </div>
              <div className={styles.row2}>
                <div className={styles.field}>
                  <label className={styles.label}>Sexo</label>
                  <select className={styles.input} value={formPaciente.sexo}
                    onChange={e => setFormPaciente(p => ({ ...p, sexo: e.target.value }))}>
                    <option value="">— seleccionar —</option>
                    <option value="M">Masculino</option>
                    <option value="F">Femenino</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Obra social</label>
                  <input className={styles.input} value={formPaciente.obraSocial}
                    onChange={e => setFormPaciente(p => ({ ...p, obraSocial: e.target.value }))} />
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ESTUDIO */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Tipo de estudio</h2>
          <div className={styles.tiposGrid}>
            {esquemas.map(e => (
              <button key={e.tipoEstudio} type="button"
                className={`${styles.tipoBtn} ${tipoEstudio === e.tipoEstudio ? styles.selected : ''}`}
                onClick={() => setTipoEstudio(e.tipoEstudio)}>
                {e.nombreDisplay}
              </button>
            ))}
          </div>

          {esquemaSeleccionado && (
            <div className={styles.mediosPreview}>
              <span className={styles.mediosLabel}>Medios a sembrar:</span>
              {esquemaSeleccionado.medios.map((m, i) => (
                <span key={i} className={styles.medioPill}>{m.cantidad} {m.medio}</span>
              ))}
            </div>
          )}

          {esquemaSeleccionado?.requiereMaterial && (
            <div className={styles.field} style={{ marginTop: 16 }}>
              <label className={styles.label}>Material / muestra *</label>
              <input className={styles.input} value={material} onChange={e => setMaterial(e.target.value)}
                placeholder="Ej: Orina espontánea, sangre periférica..." required />
            </div>
          )}
        </section>

        {/* DATOS CLÍNICOS */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Datos clínicos (opcional)</h2>
          <div className={styles.row2}>
            <div className={styles.field}>
              <label className={styles.label}>Médico solicitante</label>
              <input className={styles.input} value={medico} onChange={e => setMedico(e.target.value)} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Servicio</label>
              <input className={styles.input} value={servicio} onChange={e => setServicio(e.target.value)} />
            </div>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Observaciones clínicas</label>
            <textarea className={styles.textarea} rows={3} value={observaciones}
              onChange={e => setObservaciones(e.target.value)} />
          </div>
        </section>

        <div className={styles.actions}>
          <button type="button" className={styles.btnSecondary} onClick={() => navigate(-1)}>Cancelar</button>
          <button type="submit" className={styles.btnPrimary}
            disabled={(!paciente && !crearNuevo) || !tipoEstudio || mutCultivo.isPending}>
            {mutCultivo.isPending ? 'Guardando...' : 'Registrar cultivo'}
          </button>
        </div>
      </form>
    </div>
  );
}
