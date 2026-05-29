import { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export default function ProfilePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [nome, setNome] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    if (user) {
      setNome(user.name || '');
      setAvatarUrl(user.avatar_url || '');
    }
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    try {
      if (!user?.id) throw new Error('Usuário não autenticado no Supabase');
      
      const { error } = await supabase
        .from('usuarios')
        .update({ nome: nome, avatar_url: avatarUrl })
        .eq('id', user.id);
        
      if (error) throw error;
      
      alert('Perfil atualizado com sucesso! Recarregue a página para ver as alterações aplicadas globalmente.');
    } catch (e) {
      console.error(e);
      alert(`Erro ao atualizar perfil: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="header-dash animate-fade-in">
        <div>
          <h1>Configurações do Perfil</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Gerencie sua conta e foto de perfil.</p>
        </div>
      </div>

      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <div className="glass-panel animate-slide-up" style={{ padding: 40, marginBottom: 30 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 30 }}>
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" style={{ width: 70, height: 70, borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              <div className="avatar" style={{ width: 70, height: 70, fontSize: '1.6rem' }}>{user?.initials || '??'}</div>
            )}
            <div>
              <h2 style={{ fontSize: '1.5rem', fontFamily: 'Outfit' }}>{user?.name || 'Usuário'}</h2>
              <span style={{ color: 'var(--text-muted)' }}>{user?.role || 'Sem cargo'}</span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Nome Completo</label>
            <input 
              type="text" 
              className="form-control" 
              value={nome} 
              onChange={(e) => setNome(e.target.value)} 
            />
          </div>
          <div className="form-group">
            <label className="form-label">URL da Foto de Perfil (Opcional)</label>
            <input 
              type="url" 
              className="form-control" 
              placeholder="https://exemplo.com/foto.jpg"
              value={avatarUrl} 
              onChange={(e) => setAvatarUrl(e.target.value)} 
            />
          </div>
          <div className="form-group">
            <label className="form-label">E-mail Institucional</label>
            <input type="email" className="form-control" value={user?.email || ''} disabled style={{ opacity: 0.6 }} />
          </div>

          <div style={{ textAlign: 'right', marginTop: 20 }}>
            <button
              className="btn btn-primary"
              onClick={handleSave}
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
        </div>
      </div>
    </DashboardLayout>
  );
}
