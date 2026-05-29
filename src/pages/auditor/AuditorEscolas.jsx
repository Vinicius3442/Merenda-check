import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useMockSubmit } from '../../hooks/useMockSubmit';
import { useEscolas } from '../../hooks/useEscolas';

export default function AuditorEscolas() {
  const { loading: loadingSubmit, mockSubmit } = useMockSubmit();
  const { escolas, loading } = useEscolas();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('pior');

  const processedEscolas = escolas
    .filter(e => 
      e.nome.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (e.diretora && e.diretora.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortOrder === 'pior') return a.health - b.health;
      if (sortOrder === 'melhor') return b.health - a.health;
      return a.nome.localeCompare(b.nome);
    });

  return (
    <DashboardLayout>
      <div className="header-dash animate-fade-in">
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: 12 }}>Lista de Jurisdição</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
            Nível de desperdício em relação às catracas e integridade dos Hashes Criptográficos e estoques locais.
          </p>
        </div>
        <div>
          <button className="btn btn-secondary"><i className="fa-solid fa-file-excel"></i> Exportar Orçamento .CSV</button>
        </div>
      </div>

      <div className="controls-bar animate-slide-up">
        <div className="search-bar">
          <i className="fa-solid fa-search"></i>
          <input 
            type="text" 
            placeholder="Nome da Escola ou Gestor..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select className="form-control" style={{ width: 'auto' }} value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
          <option value="pior">Ordenar por: Pior Desempenho (Risco)</option>
          <option value="melhor">Ordenar por: Melhor Desempenho</option>
          <option value="alfa">Ordem Alfabética</option>
        </select>
      </div>

      {loading ? (
        <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)' }}>
          <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: '2rem', marginBottom: 16 }}></i>
          <p>Carregando escolas...</p>
        </div>
      ) : (
        <div className="school-grid animate-slide-up delay-100">
          {processedEscolas.map((escola) => (
            <div key={escola.id} className={`glass-panel school-card ${escola.healthClass}`} style={escola.health < 70 ? { borderWidth: 2 } : {}}>
              <div className="school-header">
                <div>
                  <div className="school-name">{escola.nome}</div>
                  <div className="school-director"><i className="fa-solid fa-id-badge"></i> {escola.diretora}</div>
                </div>
                <span className={`badge ${escola.badgeClass}`}>{escola.badgeText}</span>
              </div>

              <div className="school-status-bar">
                <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  Integridade da Malha
                  <i className="fa-solid fa-circle-info" title="Baseado na divergência entre apontamento de Catracas vs. Estoque físico e validades." style={{ cursor: 'help', fontSize: '0.85rem' }}></i>
                </span>
                <span className="health-text">{escola.health}%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${escola.health}%` }}></div>
              </div>

              {escola.alertas && escola.alertas.length > 0 ? (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 20, lineHeight: 1.4 }}>
                  <i className={`fa-solid ${escola.alertIcon}`} style={{ color: escola.alertColor }}></i>{' '}
                  {escola.alertas[0].descricao}
                </p>
              ) : (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 20, lineHeight: 1.4 }}>
                  <i className={`fa-solid ${escola.alertIcon}`} style={{ color: escola.alertColor }}></i>{' '}
                  {escola.health >= 90 ? 'Operação em conformidade contratual.' : 'Verificar pendências no estoque.'}
                </p>
              )}

              <div className="card-actions">
                {escola.health < 70 ? (
                  <>
                    <button
                      className="btn btn-primary"
                      style={{ flex: 1, padding: 10, fontSize: '0.8rem' }}
                      onClick={() => navigate(`/auditor/investigar?escola=${escola.id}&nome=${encodeURIComponent(escola.nome)}&tipo=Anomalia+Crítica`)}
                    >
                      Dossiê de Integridade
                    </button>
                    <button
                      className="btn btn-secondary"
                      style={{ flex: 1, padding: 10, fontSize: '0.8rem' }}
                      onClick={() => mockSubmit({
                        successTitle: 'Auditoria Expedida',
                        successMsg: `Aviso extrajudicial enviado para a gestão de ${escola.nome} via portaria eletrônica.`,
                      })}
                      disabled={loadingSubmit}
                    >
                      Notificar Gestor
                    </button>
                  </>
                ) : escola.health < 95 ? (
                  <button
                    className="btn btn-secondary"
                    style={{ width: '100%', padding: 10, fontSize: '0.8rem' }}
                    onClick={() => mockSubmit({
                      successTitle: 'Inspeção Agendada',
                      successMsg: `Ordem de serviço gerada para inspeção in loco na unidade ${escola.nome}.`,
                    })}
                    disabled={loadingSubmit}
                  >
                    <i className="fa-solid fa-clipboard-user"></i> Solicitar Auditoria Local
                  </button>
                ) : (
                  <button
                    className="btn btn-secondary"
                    style={{ width: '100%', padding: 10, fontSize: '0.8rem' }}
                    onClick={() => navigate(`/auditor/rastrear?escola=${escola.id}&nome=${encodeURIComponent(escola.nome)}`)}
                    disabled={loadingSubmit}
                  >
                    <i className="fa-regular fa-eye"></i> Fonte de Veracidade (Validação)
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
