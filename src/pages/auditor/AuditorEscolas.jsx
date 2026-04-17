import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useMockSubmit } from '../../hooks/useMockSubmit';
import { mockEscolas } from '../../data/mockData';

export default function AuditorEscolas() {
  const { loading, mockSubmit } = useMockSubmit();
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="header-dash animate-fade-in">
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: 12 }}>Lista de Jurisdição</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
            Nível de desperdício em relação às catracas e integridade dos Smart Contracts e estoques locais.
          </p>
        </div>
        <div>
          <button className="btn btn-secondary"><i className="fa-solid fa-file-excel"></i> Exportar Orçamento .CSV</button>
        </div>
      </div>

      <div className="controls-bar animate-slide-up">
        <div className="search-bar">
          <i className="fa-solid fa-search"></i>
          <input type="text" placeholder="Nome da Escola, ID ou Gestor..." />
        </div>
        <select className="form-control" style={{ width: 'auto' }}>
          <option>Ordenar por: Pior Desempenho (Risco)</option>
          <option>Ordenar por: Melhor Desempenho</option>
          <option>Ordem Alfabética</option>
        </select>
      </div>

      <div className="school-grid animate-slide-up delay-100">
        {mockEscolas.map((escola) => (
          <div key={escola.id} className={`glass-panel school-card ${escola.healthClass}`} style={escola.health < 70 ? { borderWidth: 2 } : {}}>
            <div className="school-header">
              <div>
                <div className="school-name">{escola.nome}</div>
                <div className="school-director"><i className="fa-solid fa-id-badge"></i> {escola.diretora}</div>
              </div>
              <span className={`badge ${escola.badgeClass}`}>{escola.badgeText}</span>
            </div>

            <div className="school-status-bar">
              <span style={{ color: 'var(--text-muted)' }}>Integridade da Malha</span>
              <span className="health-text">{escola.health}%</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${escola.health}%` }}></div>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 20, lineHeight: 1.4 }}>
              <i className={`fa-solid ${escola.alertIcon}`} style={{ color: escola.alertColor }}></i> {escola.alerta}
            </p>

            <div className="card-actions">
              {escola.health < 70 ? (
                <>
                  <Link
                    to={`/auditor/investigar?escola=${escola.timelineKey}&nome=${encodeURIComponent(escola.nome)}&tipo=Anomalia+Crítica`}
                    className="btn btn-primary"
                    style={{ flex: 1, padding: 10, fontSize: '0.8rem' }}
                  >
                    Ler Blackbox
                  </Link>
                  <button
                    className="btn btn-secondary"
                    style={{ flex: 1, padding: 10, fontSize: '0.8rem' }}
                    onClick={() => mockSubmit({
                      successTitle: 'Auditoria Expedida',
                      successMsg: `Aviso extrajudicial enviado para a gestão de ${escola.nome} via portaria eletrônica.`,
                    })}
                    disabled={loading}
                  >
                    Notificar Gestor
                  </button>
                </>
              ) : escola.health < 95 ? (
                <button
                  className="btn btn-secondary"
                  style={{ width: '100%', padding: 10, fontSize: '0.8rem' }}
                  onClick={() => mockSubmit({
                    successTitle: 'Remanejamento Sugerido pela IA',
                    successMsg: `Excesso de laticínios da ${escola.nome} redirecionado para ${escola.remanejamentoDest || 'CEI Pequeninos'}.`,
                  })}
                  disabled={loading}
                >
                  <i className="fa-solid fa-truck-arrow-right"></i> Sugerir Remanejamento IA
                </button>
              ) : (
                <button
                  className="btn btn-secondary"
                  style={{ width: '100%', padding: 10, fontSize: '0.8rem' }}
                  onClick={() => navigate(`/auditor/rastrear?escola=${escola.timelineKey}&nome=${encodeURIComponent(escola.nome)}`)}
                  disabled={loading}
                >
                  <i className="fa-regular fa-eye"></i> Visualizar Oráculo (Log Completo)
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
