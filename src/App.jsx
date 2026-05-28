import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import EsqueciSenhaPage from './pages/EsqueciSenhaPage';
import ProfilePage from './pages/ProfilePage';
import Mascot from './components/ui/Mascot';

// Personas
import OperadorHome from './pages/operador/OperadorHome';
import Saida from './pages/operador/Saida';
import EntradaInsumo from './pages/operador/EntradaInsumo';
import BaixaInsumo from './pages/operador/BaixaInsumo';
import RegistrarRefeicao from './pages/operador/RegistrarRefeicao';
import SobraLimpa from './pages/operador/SobraLimpa';

// Páginas Públicas
import SobreNos from './pages/public/SobreNos';
import Transparencia from './pages/public/Transparencia';
import Privacidade from './pages/public/Privacidade';
import Termos from './pages/public/Termos';

// Gestor
import GestorHome from './pages/gestor/GestorHome';
import GestorEstoque from './pages/gestor/GestorEstoque';
import Relatorios from './pages/gestor/Relatorios';

// Auditor
import AuditorHome from './pages/auditor/AuditorHome';
import AuditorEscolas from './pages/auditor/AuditorEscolas';
import Rastreabilidade from './pages/auditor/Rastreabilidade';
import InvestigarAlerta from './pages/auditor/InvestigarAlerta';

// Nutrição
import NutricaoDashboard from './pages/nutricao/NutricaoDashboard';
import GestaoCardapios from './pages/nutricao/GestaoCardapios';
import FichaTecnica from './pages/nutricao/FichaTecnica';

// Licitação
import EmpenhosSaldo from './pages/licitacao/EmpenhosSaldo';
import Fornecedores from './pages/licitacao/Fornecedores';

// Admin
import GestaoUsuarios from './pages/admin/GestaoUsuarios';
import AuditTrailTI from './pages/admin/AuditTrailTI';

// Transportadora
import TransportadoraHome from './pages/transportadora/TransportadoraHome';
import EmitirLote from './pages/transportadora/EmitirLote';

// Ajuda
import AjudaPage from './pages/AjudaPage';

// Public & Kiosk
import Ouvidoria from './pages/public/Ouvidoria';
import KioskRefeitorio from './pages/kiosk/KioskRefeitorio';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        background: 'var(--bg-base)',
        flexDirection: 'column',
        gap: 16,
        color: 'var(--text-muted)'
      }}>
        <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: '2rem', color: 'var(--primary)' }}></i>
        <span style={{ fontFamily: 'Outfit', fontSize: '1rem' }}>Verificando sessão...</span>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/sobre" element={<SobreNos />} />
        <Route path="/transparencia" element={<Transparencia />} />
        <Route path="/privacidade" element={<Privacidade />} />
        <Route path="/termos" element={<Termos />} />
        <Route path="/esqueci-senha" element={<EsqueciSenhaPage />} />

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

        {/* Nutrição */}
        <Route path="/nutricao" element={<ProtectedRoute><NutricaoDashboard /></ProtectedRoute>} />
        <Route path="/nutricao/cardapios" element={<ProtectedRoute><GestaoCardapios /></ProtectedRoute>} />
        <Route path="/nutricao/fichas" element={<ProtectedRoute><FichaTecnica /></ProtectedRoute>} />

        {/* Licitação */}
        <Route path="/licitacao" element={<ProtectedRoute><EmpenhosSaldo /></ProtectedRoute>} />
        <Route path="/licitacao/fornecedores" element={<ProtectedRoute><Fornecedores /></ProtectedRoute>} />

        {/* Admin */}
        <Route path="/admin" element={<ProtectedRoute><GestaoUsuarios /></ProtectedRoute>} />
        <Route path="/admin/audit-ti" element={<ProtectedRoute><AuditTrailTI /></ProtectedRoute>} />

        {/* Transportadora */}
        <Route path="/transportadora" element={<ProtectedRoute><TransportadoraHome /></ProtectedRoute>} />
        <Route path="/transportadora/emitir-lote" element={<ProtectedRoute><EmitirLote /></ProtectedRoute>} />

        {/* Ajuda */}
        <Route path="/ajuda" element={<ProtectedRoute><AjudaPage /></ProtectedRoute>} />

        {/* Telas Públicas (Sem login) */}
        <Route path="/ouvidoria" element={<Ouvidoria />} />
        <Route path="/kiosk" element={<KioskRefeitorio />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Mascot />
    </BrowserRouter>
  );
}
