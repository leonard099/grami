import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CultivosList from './pages/CultivosList';
import CultivoDetalle from './pages/CultivoDetalle';
import NuevoCultivo from './pages/NuevoCultivo';
import styles from './App.module.css';

export default function App() {
  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>🧫</span>
          <span className={styles.logoText}>Grami</span>
        </div>
        <nav className={styles.nav}>
          <NavLink to="/dashboard" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
            Dashboard
          </NavLink>
          <NavLink to="/cultivos" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
            Cultivos
          </NavLink>
        </nav>
        <div className={styles.sidebarFooter}>
          <span className={styles.version}>v0.1.0</span>
        </div>
      </aside>
      <main className={styles.main}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/cultivos" element={<CultivosList />} />
          <Route path="/cultivos/nuevo" element={<NuevoCultivo />} />
          <Route path="/cultivos/:id" element={<CultivoDetalle />} />
        </Routes>
      </main>
    </div>
  );
}
