import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useEscolas } from '../../hooks/useEscolas';
import { useToast } from '../../contexts/ToastContext';

export default function GestaoEscolas() {
  const { escolas, loading, inserirEscola, atualizarStatus } = useEscolas();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nome, setNome] = useState('');
  const [diretora, setDiretora] = useState('');
  const [endereco, setEndereco] = useState('');
  const [lat, setLat] = useState('-23.5500');
  const [lng, setLng] = useState('-46.6330');
  const [status, setStatus] = useState('normal');
  const [saving, setSaving] = useState(false);

  const filteredEscolas = escolas.filter((e) => {
    const term = searchQuery.toLowerCase();
    return (
      e.nome.toLowerCase().includes(term) ||
      (e.diretora && e.diretora.toLowerCase().includes(term))
    );
  });

  const handleOpenModal = () => {
    setNome('');
    setDiretora('');
    setEndereco('');
    setStatus('normal');
    setLat('-23.5500');
    setLng('-46.6330');
    setIsModalOpen(true);
  };

  const handleCreateSchool = async (e) => {
    e.preventDefault();
    if (!nome || !endereco) {
      showToast('Erro de Validação', 'Preencha o nome e o endereço da escola.', 'error');
      return;
    }
    setSaving(true);
    const res = await inserirEscola({ 
      nome, 
      diretora, 
      endereco, 
      lat: parseFloat(lat), 
      lng: parseFloat(lng),
      status,
      health: 100
    });
    setSaving(false);
    
    if (res.ok) {
      showToast('Escola Cadastrada', 'Nova unidade escolar adicionada com sucesso.', 'success');
      setIsModalOpen(false);
    } else {
      showToast('Erro ao Cadastrar', res.error || 'Ocorreu um erro ao cadastrar a escola.', 'error');
    }
  };

  return (
    <DashboardLayout>
      <div className="header-dash animate-fade-in">
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <i className="fa-solid fa-school-flag" style={{ color: 'var(--primary)' }}></i>
            Gestão de Unidades Escolares
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: 4 }}>
            Cadastre novas escolas na rede, gerencie diretores e acompanhe o status operacional.
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenModal}>
          <i className="fa-solid fa-plus"></i> Nova Unidade
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
            <i className="fa-solid fa-building-columns" style={{ color: 'var(--primary)' }}></i>
            <span style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>
              Rede de Ensino
            </span>
            {!loading && (
              <span style={{
                background: 'rgba(16,185,129,0.12)', color: 'var(--primary)',
                border: '1px solid rgba(16,185,129,0.2)', borderRadius: 20,
                padding: '2px 10px', fontSize: '0.75rem', fontWeight: 700
              }}>{filteredEscolas.length}</span>
            )}
          </div>
          <div style={{ position: 'relative' }}>
            <i className="fa-solid fa-search" style={{
              position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
              color: 'var(--text-muted)', fontSize: '0.8rem'
            }}></i>
            <input
              type="text"
              placeholder="Buscar por nome ou diretora..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                paddingLeft: 34, paddingRight: 14, paddingTop: 8, paddingBottom: 8,
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8, color: '#f1f5f9', fontSize: '0.85rem', outline: 'none', width: 250,
              }}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)' }}>
            <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: '2rem', marginBottom: 12, color: 'var(--primary)' }}></i>
            <p>Carregando escolas...</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table" style={{ minWidth: 780 }}>
              <thead>
                <tr>
                  <th>Escola</th>
                  <th>Diretora/Gestor</th>
                  <th>Endereço</th>
                  <th>Status Operacional</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredEscolas.map((e) => (
                  <tr key={e.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 34, height: 34, borderRadius: 10,
                          background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#fff', fontWeight: 800, fontSize: '1rem', flexShrink: 0,
                        }}>
                          <i className="fa-solid fa-school"></i>
                        </div>
                        <span style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '0.9rem' }}>{e.nome}</span>
                      </div>
                    </td>
                    <td style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{e.diretora || 'Não informado'}</td>
                    <td style={{ color: '#94a3b8', fontSize: '0.85rem', maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      <i className="fa-solid fa-map-pin" style={{ color: 'var(--text-muted)', marginRight: 6 }}></i>
                      {e.endereco}
                    </td>
                    <td>
                      <span className={`badge ${e.status === 'urgente' ? 'badge-danger' : e.status === 'atencao' ? 'badge-warning' : 'badge-success'}`} style={{ fontSize: '0.75rem' }}>
                        {e.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="text-nowrap">
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-secondary" style={{ padding: '5px 10px', fontSize: '0.8rem' }} title="Editar">
                          <i className="fa-solid fa-pen"></i>
                        </button>
                        <button 
                          className="btn btn-secondary" 
                          style={{ padding: '5px 10px', fontSize: '0.8rem' }} 
                          title="Alterar Status"
                          onClick={() => {
                            const current = e.status;
                            const next = current === 'normal' ? 'atencao' : current === 'atencao' ? 'urgente' : 'normal';
                            atualizarStatus(e.id, next);
                          }}
                        >
                          <i className="fa-solid fa-rotate"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredEscolas.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                      Nenhuma escola correspondente encontrada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* New School Modal */}
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
                <i className="fa-solid fa-school-flag" style={{ color: 'var(--primary)', marginRight: 10 }}></i>
                Cadastrar Nova Escola
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.3rem' }}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form onSubmit={handleCreateSchool} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.85rem', marginBottom: 6 }}>Nome da Unidade</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Ex: EMEI Primavera" 
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  style={{ width: '100%', padding: 10, fontSize: '0.9rem' }}
                  required 
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.85rem', marginBottom: 6 }}>Nome do(a) Diretor(a)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Ex: Diretora Ana Beatriz" 
                  value={diretora}
                  onChange={(e) => setDiretora(e.target.value)}
                  style={{ width: '100%', padding: 10, fontSize: '0.9rem' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.85rem', marginBottom: 6 }}>Endereço Completo</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Rua, Número - Bairro" 
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                  style={{ width: '100%', padding: 10, fontSize: '0.9rem' }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.85rem', marginBottom: 6 }}>Latitude</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    style={{ width: '100%', padding: 10, fontSize: '0.9rem' }}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.85rem', marginBottom: 6 }}>Longitude</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                    style={{ width: '100%', padding: 10, fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.85rem', marginBottom: 6 }}>Status Operacional Inicial</label>
                <select 
                  className="form-control" 
                  value={status} 
                  onChange={(e) => setStatus(e.target.value)}
                  style={{ width: '100%', padding: 10, fontSize: '0.9rem' }}
                >
                  <option value="normal" style={{ background: 'var(--bg-surface)' }}>Normal (Operando)</option>
                  <option value="atencao" style={{ background: 'var(--bg-surface)' }}>Atenção</option>
                  <option value="urgente" style={{ background: 'var(--bg-surface)' }}>Urgente (Sem Operação)</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 15 }}>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setIsModalOpen(false)}
                  disabled={saving}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving ? <><i className="fa-solid fa-circle-notch fa-spin"></i> Cadastrando...</> : 'Salvar Escola'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
