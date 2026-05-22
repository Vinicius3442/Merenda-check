import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useUsuarios } from '../../hooks/useUsuarios';
import { useEscolas } from '../../hooks/useEscolas';
import { useToast } from '../../contexts/ToastContext';

export default function GestaoUsuarios() {
  const { usuarios, loading, atualizarStatus, inserirUsuario } = useUsuarios();
  const { escolas } = useEscolas();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('operador');
  const [escolaId, setEscolaId] = useState('');
  const [saving, setSaving] = useState(false);

  const roleLabels = {
    operador: 'Operador',
    gestor: 'Gestor',
    auditor: 'Auditor',
    nutricao: 'Nutrição',
    licitacao: 'Licitação',
    transportadora: 'Logística',
    admin: 'SysAdmin',
  };

  const roleBadgeStyle = {
    admin: { background: 'rgba(244,63,94,0.12)', color: 'var(--alert-red)', border: '1px solid rgba(244,63,94,0.2)' },
    auditor: { background: 'rgba(96,165,250,0.12)', color: 'var(--alert-blue)', border: '1px solid rgba(96,165,250,0.2)' },
    gestor: { background: 'rgba(16,185,129,0.12)', color: 'var(--primary)', border: '1px solid rgba(16,185,129,0.2)' },
    nutricao: { background: 'rgba(251,191,36,0.12)', color: 'var(--alert-yellow)', border: '1px solid rgba(251,191,36,0.2)' },
    operador: { background: 'rgba(255,255,255,0.08)', color: '#cbd5e1', border: '1px solid rgba(255,255,255,0.1)' },
    licitacao: { background: 'rgba(96,165,250,0.1)', color: 'var(--alert-blue)', border: '1px solid rgba(96,165,250,0.15)' },
    transportadora: { background: 'rgba(16,185,129,0.08)', color: 'var(--alert-green)', border: '1px solid rgba(52,211,153,0.2)' },
  };

  const filteredUsuarios = usuarios.filter((u) => {
    const term = searchQuery.toLowerCase();
    return (
      u.nome.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      (u.escola && u.escola.toLowerCase().includes(term))
    );
  });

  const handleOpenModal = () => {
    setNome('');
    setEmail('');
    setRole('operador');
    setEscolaId('');
    setIsModalOpen(true);
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!nome || !email) {
      showToast('Erro de Validação', 'Preencha o nome e o e-mail do servidor.', 'error');
      return;
    }
    setSaving(true);
    const res = await inserirUsuario({ nome, email, role, escola_id: escolaId });
    setSaving(false);
    if (res.ok) {
      showToast('Servidor Cadastrado', 'Novo cadastro efetuado com sucesso no IAM.', 'success');
      setIsModalOpen(false);
    } else {
      showToast('Erro ao Cadastrar', res.error || 'Ocorreu um erro ao cadastrar o servidor.', 'error');
    }
  };

  return (
    <DashboardLayout>
      <div className="header-dash animate-fade-in">
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <i className="fa-solid fa-users-gear" style={{ color: 'var(--primary)' }}></i>
            Gestão de Identidades (IAM)
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: 4 }}>
            Controle de acessos, Roles (RBAC) e revogação de acessos de servidores.
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenModal}>
          <i className="fa-solid fa-user-plus"></i> Novo Servidor
        </button>
      </div>

      <div className="table-card animate-slide-up" style={{ minWidth: 0 }}>
        {/* Card Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)',
          flexWrap: 'wrap', gap: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <i className="fa-solid fa-shield-halved" style={{ color: 'var(--primary)' }}></i>
            <span style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>
              Contas de Acesso
            </span>
            {!loading && (
              <span style={{
                background: 'rgba(16,185,129,0.12)', color: 'var(--primary)',
                border: '1px solid rgba(16,185,129,0.2)', borderRadius: 20,
                padding: '2px 10px', fontSize: '0.75rem', fontWeight: 700
              }}>{filteredUsuarios.length}</span>
            )}
          </div>
          <div style={{ position: 'relative' }}>
            <i className="fa-solid fa-search" style={{
              position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
              color: 'var(--text-muted)', fontSize: '0.8rem'
            }}></i>
            <input
              type="text"
              placeholder="Buscar servidor ou e-mail..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                paddingLeft: 34, paddingRight: 14, paddingTop: 8, paddingBottom: 8,
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8, color: '#f1f5f9', fontSize: '0.85rem', outline: 'none', width: 220,
              }}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)' }}>
            <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: '2rem', marginBottom: 12, color: 'var(--primary)' }}></i>
            <p>Carregando usuários...</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table" style={{ minWidth: 780 }}>
              <thead>
                <tr>
                  <th>Servidor</th>
                  <th>E-mail Corporativo</th>
                  <th>Cargo / Acesso</th>
                  <th>Unidade Escolar</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsuarios.map((u) => (
                  <tr key={u.id} style={{ opacity: u.status === 'inativo' ? 0.5 : 1 }}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 34, height: 34, borderRadius: 10,
                          background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#fff', fontWeight: 800, fontSize: '0.8rem', flexShrink: 0,
                          fontFamily: 'Outfit',
                        }}>
                          {(u.nome || '').split(' ').filter(Boolean).map(n => n[0]).slice(0, 2).join('').toUpperCase() || '??'}
                        </div>
                        <span style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '0.9rem' }}>{u.nome}</span>
                      </div>
                    </td>
                    <td style={{ color: '#94a3b8', fontFamily: 'monospace', fontSize: '0.85rem' }}>{u.email}</td>
                    <td>
                      <span className="badge" style={{ ...(roleBadgeStyle[u.role] || {}), fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        {roleLabels[u.role] || u.role}
                      </span>
                    </td>
                    <td style={{ color: '#94a3b8', fontSize: '0.88rem', fontWeight: 600 }}>
                      <i className="fa-solid fa-school" style={{ marginRight: 6, fontSize: '0.8rem', color: 'var(--primary)' }}></i>
                      {u.escola || 'Todas'}
                    </td>
                    <td>
                      {u.status === 'ativo' ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', color: 'var(--alert-green)', fontWeight: 600 }}>
                          <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--alert-green)', display: 'inline-block' }}></span>
                          Ativo
                        </span>
                      ) : (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', color: 'var(--alert-red)', fontWeight: 600 }}>
                          <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--alert-red)', display: 'inline-block' }}></span>
                          Revogado
                        </span>
                      )}
                    </td>
                    <td className="text-nowrap">
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-secondary" style={{ padding: '5px 10px', fontSize: '0.8rem' }} title="Resetar Senha">
                          <i className="fa-solid fa-key"></i>
                        </button>
                        <button className="btn btn-secondary" style={{ padding: '5px 10px', fontSize: '0.8rem' }} title="Editar Permissões">
                          <i className="fa-solid fa-sliders"></i>
                        </button>
                        {u.status === 'ativo' ? (
                          <button
                            className="btn btn-danger"
                            style={{ padding: '5px 10px', fontSize: '0.8rem' }}
                            title="Revogar Acesso"
                            onClick={() => atualizarStatus(u.id, 'inativo')}
                          >
                            <i className="fa-solid fa-ban"></i>
                          </button>
                        ) : (
                          <button
                            className="btn btn-secondary"
                            style={{ padding: '5px 10px', fontSize: '0.8rem' }}
                            title="Reativar Acesso"
                            onClick={() => atualizarStatus(u.id, 'ativo')}
                          >
                            <i className="fa-solid fa-check"></i>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredUsuarios.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                      Nenhum servidor correspondente encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {!loading && (
          <div style={{
            padding: '11px 24px', borderTop: '1px solid rgba(255,255,255,0.06)',
            fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between'
          }}>
            <span><i className="fa-solid fa-circle-info" style={{ marginRight: 6 }}></i>{usuarios.filter(u => u.status === 'ativo').length} contas ativas de {usuarios.length} registradas</span>
            <span style={{ color: 'var(--primary)' }}><i className="fa-solid fa-lock" style={{ marginRight: 6 }}></i>RBAC Ativo</span>
          </div>
        )}
      </div>

      {/* New Server Dialog Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(12px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999, padding: 20
        }}>
          <div className="glass-panel animate-slide-up" style={{
            maxWidth: 500, width: '100%', padding: 40,
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontFamily: 'Outfit', color: 'var(--text-main)', fontSize: '1.4rem', margin: 0 }}>
                <i className="fa-solid fa-user-plus" style={{ color: 'var(--primary)', marginRight: 10 }}></i>
                Cadastrar Novo Servidor
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.3rem' }}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="form-group">
                <label className="form-label" style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 6 }}>Nome Completo</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Ex: Luiz Felipe" 
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  style={{ width: '100%', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: 12, borderRadius: 8 }}
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 6 }}>E-mail Corporativo</label>
                <input 
                  type="email" 
                  className="form-control" 
                  placeholder="nome@merendacheck.gov.br" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: 12, borderRadius: 8 }}
                  required 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label" style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 6 }}>Perfil de Acesso</label>
                  <select 
                    className="form-control" 
                    value={role} 
                    onChange={(e) => setRole(e.target.value)}
                    style={{ width: '100%', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: 11, borderRadius: 8, outline: 'none' }}
                  >
                    {Object.entries(roleLabels).map(([key, value]) => (
                      <option key={key} value={key} style={{ background: 'var(--bg-surface)' }}>{value}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 6 }}>Unidade Escolar</label>
                  <select 
                    className="form-control" 
                    value={escolaId} 
                    onChange={(e) => setEscolaId(e.target.value)}
                    style={{ width: '100%', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff', padding: 11, borderRadius: 8, outline: 'none' }}
                  >
                    <option value="" style={{ background: 'var(--bg-surface)' }}>Todas (Geral)</option>
                    {escolas.map((e) => (
                      <option key={e.id} value={e.id} style={{ background: 'var(--bg-surface)' }}>{e.nome}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 15 }}>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setIsModalOpen(false)}
                  disabled={saving}
                  style={{ padding: '10px 16px', fontSize: '0.9rem' }}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={saving}
                  style={{ padding: '10px 16px', fontSize: '0.9rem' }}
                >
                  {saving ? <><i className="fa-solid fa-circle-notch fa-spin"></i> Cadastrando...</> : 'Salvar Cadastro'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
