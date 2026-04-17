import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';

// Operador
import OperadorHome from './pages/operador/OperadorHome';
import EntradaInsumo from './pages/operador/EntradaInsumo';
import BaixaInsumo from './pages/operador/BaixaInsumo';
import RegistrarRefeicao from './pages/operador/RegistrarRefeicao';
import SobraLimpa from './pages/operador/SobraLimpa';
import Saida from './pages/operador/Saida';

// Gestor
import GestorHome from './pages/gestor/GestorHome';
import GestorEstoque from './pages/gestor/GestorEstoque';
import Relatorios from './pages/gestor/Relatorios';

// Auditor
import AuditorHome from './pages/auditor/AuditorHome';
import AuditorEscolas from './pages/auditor/AuditorEscolas';
import Rastreabilidade from './pages/auditor/Rastreabilidade';
import InvestigarAlerta from './pages/auditor/InvestigarAlerta';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected */}
        <Route path="/perfil" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

        {/* Operador */}
        <Route path="/operador" element={<ProtectedRoute><OperadorHome /></ProtectedRoute>} />
        <Route path="/operador/entrada" element={<ProtectedRoute><EntradaInsumo /></ProtectedRoute>} />
        <Route path="/operador/baixa" element={<ProtectedRoute><BaixaInsumo /></ProtectedRoute>} />
        <Route path="/operador/refeicao" element={<ProtectedRoute><RegistrarRefeicao /></ProtectedRoute>} />
        <Route path="/operador/sobra" element={<ProtectedRoute><SobraLimpa /></ProtectedRoute>} />
        <Route path="/operador/saida" element={<ProtectedRoute><Saida /></ProtectedRoute>} />

        {/* Gestor */}
        <Route path="/gestor" element={<ProtectedRoute><GestorHome /></ProtectedRoute>} />
        <Route path="/gestor/estoque" element={<ProtectedRoute><GestorEstoque /></ProtectedRoute>} />
        <Route path="/gestor/relatorios" element={<ProtectedRoute><Relatorios /></ProtectedRoute>} />

        {/* Auditor */}
        <Route path="/auditor" element={<ProtectedRoute><AuditorHome /></ProtectedRoute>} />
        <Route path="/auditor/escolas" element={<ProtectedRoute><AuditorEscolas /></ProtectedRoute>} />
        <Route path="/auditor/rastrear" element={<ProtectedRoute><Rastreabilidade /></ProtectedRoute>} />
        <Route path="/auditor/investigar" element={<ProtectedRoute><InvestigarAlerta /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
