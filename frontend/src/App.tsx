import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import CultivosActivos from './pages/CultivosActivos';
import CultivoDetalle from './pages/CultivoDetalle';
import NuevoCultivo from './pages/NuevoCultivo';
import s from './App.module.css';

export default function App() {
  return (
    <div className={s.layout}>
      <aside className={s.sidebar}>
        <div className={s.logo}>
          <span className={s.logoMark}>G</span>
          <span className={s.logoText}>Grami</span>
        </div>

        <div className={s.navGroup}>
          <span className={s.navLabel}>Principal</span>
          <NavLink to="/cultivos" className={({ isActive }) => `${s.navLink} ${isActive ? s.active : ''}`}>
            <i className="ti ti-flask" aria-hidden="true" /> Cultivos
          </NavLink>
          <NavLink to="/pacientes" className={({ isActive }) => `${s.navLink} ${isActive ? s.active : ''}`}>
            <i className="ti ti-users" aria-hidden="true" /> Pacientes
          </NavLink>
        </div>

        <div className={s.navGroup}>
          <span className={s.navLabel}>Configuración</span>
          <NavLink to="/tipos-estudio" className={({ isActive }) => `${s.navLink} ${isActive ? s.active : ''}`}>
            <i className="ti ti-layout-list" aria-hidden="true" /> Tipos de estudio
          </NavLink>
          <NavLink to="/protocolos-atb" className={({ isActive }) => `${s.navLink} ${isActive ? s.active : ''}`}>
            <i className="ti ti-pill" aria-hidden="true" /> Protocolos ATB
          </NavLink>
          <NavLink to="/centros" className={({ isActive }) => `${s.navLink} ${isActive ? s.active : ''}`}>
            <i className="ti ti-building-hospital" aria-hidden="true" /> Centros derivantes
          </NavLink>
          <NavLink to="/usuarios" className={({ isActive }) => `${s.navLink} ${isActive ? s.active : ''}`}>
            <i className="ti ti-user-circle" aria-hidden="true" /> Usuarios
          </NavLink>
        </div>

        <div className={s.sidebarFooter}>
          <div className={s.userAvatar}>MB</div>
          <div>
            <div className={s.userName}>M. Berardi</div>
            <div className={s.userRole}>Bioquímico</div>
          </div>
        </div>
      </aside>

      <main className={s.main}>
        <Routes>
          <Route path="/" element={<Navigate to="/cultivos" replace />} />
          <Route path="/cultivos" element={<CultivosActivos />} />
          <Route path="/cultivos/nuevo" element={<NuevoCultivo />} />
          <Route path="/cultivos/:id" element={<CultivoDetalle />} />
          <Route path="*" element={<Navigate to="/cultivos" replace />} />
        </Routes>
      </main>
    </div>
  );
}
