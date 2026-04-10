import DashboardLayout from '../components/layout/DashboardLayout';
import { useAuth } from '../contexts/AuthContext';
import { useMockSubmit } from '../hooks/useMockSubmit';

export default function ProfilePage() {
  const { user } = useAuth();
  const { loading, mockSubmit } = useMockSubmit();

  return (
    <DashboardLayout>
      <div className="header-dash animate-fade-in">
        <div>
          <h1>Configurações do Perfil</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Gerencie sua conta e preferências de sistema.</p>
        </div>
      </div>

      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <div className="glass-panel animate-slide-up" style={{ padding: 40, marginBottom: 30 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 30 }}>
            <div className="avatar" style={{ width: 70, height: 70, fontSize: '1.6rem' }}>{user?.initials || '??'}</div>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontFamily: 'Outfit' }}>{user?.name || 'Usuário'}</h2>
              <span style={{ color: 'var(--text-muted)' }}>{user?.role || 'Sem cargo'}</span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Nome Completo</label>
            <input type="text" className="form-control" defaultValue={user?.name || ''} />
          </div>
          <div className="form-group">
            <label className="form-label">E-mail Institucional</label>
            <input type="email" className="form-control" defaultValue="usuario@merendacheck.gov.br" />
          </div>
          <div className="form-group">
            <label className="form-label">Telefone</label>
            <input type="tel" className="form-control" defaultValue="(11) 98765-4321" />
          </div>

          <div style={{ textAlign: 'right', marginTop: 20 }}>
            <button
              className="btn btn-primary"
              onClick={() => mockSubmit({ successTitle: 'Perfil Atualizado', successMsg: 'Suas configurações foram salvas com sucesso.' })}
              disabled={loading}
            >
              {loading ? <><i className="fa-solid fa-circle-notch fa-spin"></i> Salvando...</> : <><i className="fa-solid fa-check"></i> Salvar Alterações</>}
            </button>
          </div>
        </div>

        <div className="glass-panel animate-slide-up delay-100" style={{ padding: 40 }}>
          <h3 style={{ marginBottom: 20, fontFamily: 'Outfit' }}><i className="fa-solid fa-palette" style={{ color: 'var(--primary)', marginRight: 10 }}></i> Aparência</h3>
          <div className="form-group">
            <label className="form-label">Tema da Interface</label>
            <select className="form-control" defaultValue="dark">
              <option value="dark">Escuro (Padrão)</option>
              <option value="light">Claro</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Idioma</label>
            <select className="form-control" defaultValue="pt-BR">
              <option value="pt-BR">Português (Brasil)</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
