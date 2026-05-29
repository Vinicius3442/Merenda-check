import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PredictiveChart from '../../components/charts/PredictiveChart';
import LogisticsMap from '../../components/ui/LogisticsMap';
import { useDashboardStats } from '../../hooks/useDashboardStats';
import { useAuth } from '../../contexts/AuthContext';
import { useMockSubmit } from '../../hooks/useMockSubmit';
import { useEstoque } from '../../hooks/useEstoque';

const ACOES_GESTOR = [
  {
    to: '/gestor/relatorios',
    icon: 'fa-file-invoice',
    title: 'Gerar Relatório',
    desc: 'Emita extratos, relatórios de consumo e certificados de conformidade.',
    color: 'var(--primary)',
  },
  {
    to: '/nutricao/cardapios',
    icon: 'fa-calendar-check',
    title: 'Aprovar Cardápio',
    desc: 'Revise e valide o cardápio semanal enviado pela nutricionista.',
    color: 'var(--alert-blue)',
  },
  {
    to: '/auditor/escolas',
    icon: 'fa-triangle-exclamation',
    title: 'Ver Alertas Críticos',
    desc: 'Consulte desvios de estoque e inconsistências apontadas pelo sistema.',
    color: 'var(--alert-yellow)',
  },
  {
    to: '/gestor/estoque',
    icon: 'fa-boxes-stacked',
    title: 'Gestão de Estoque',
    desc: 'Visualize e ajuste os níveis de insumos da unidade escolar.',
    color: 'var(--alert-red)',
  },
  {
    to: '#',
    icon: 'fa-file-signature',
    title: 'Assinar Prestação FNDE',
    desc: 'Assina digitalmente os relatórios de consumo do mês atual.',
    color: 'var(--alert-green)',
    isAction: true,
    successTitle: 'Prestação Assinada',
    successMsg: 'Os documentos foram assinados digitalmente e enviados à Auditoria.',
  },
  {
    to: '/licitacao/fornecedores',
    icon: 'fa-handshake',
    title: 'Avaliar Fornecedores',
    desc: 'Avalie a qualidade das entregas e pontue as empresas.',
    color: 'var(--primary-dark)',
  },
];

export default function GestorHome() {
  const { user } = useAuth();
  const { loading: submitting, mockSubmit } = useMockSubmit();
  const { kpis, chartData, loading } = useDashboardStats('gestor', user?.escola_id);
  const { estoque } = useEstoque(user?.escola_id);
  const [toastMsg, setToastMsg] = useState('');
  const [loteResolvido, setLoteResolvido] = useState(false);
  const [assinouPrestacao, setAssinouPrestacao] = useState(false);

  // Acha o primeiro lote urgente (crítico) no banco
  const loteCritico = estoque?.find(item => item.status === 'urgente' && item.volume_kg > 0);

  useEffect(() => {
    if (loteCritico && !loteResolvido) {
      const timer = setTimeout(() => {
        setToastMsg(`⚠️ ALERTA FIFO: Lote crítico ${loteCritico.lote} de ${loteCritico.nome} vence logo! Priorize o consumo.`);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [loteCritico, loteResolvido]);


  return (
    <DashboardLayout>
      {/* Toast Notificação */}
      {toastMsg && (
        <div style={{
          position: 'fixed', top: 24, right: 24, zIndex: 1000,
          background: toastMsg.includes('FIFO') ? 'var(--alert-red)' : 'var(--primary)', 
          color: '#fff', padding: '16px 24px',
          borderRadius: 12, boxShadow: '0 8px 30px rgba(239,68,68,0.3)',
          display: 'flex', alignItems: 'center', gap: 12,
          fontFamily: 'Outfit', fontWeight: 600, border: '1px solid rgba(255,255,255,0.1)',
          animation: 'slideInRight 0.3s forwards',
          maxWidth: 450
        }}>
          <i className="fa-solid fa-bell" style={{ fontSize: '1.2rem', animation: 'ring 1.5s ease infinite' }}></i>
          <div>{toastMsg}</div>
          <button 
            onClick={() => setToastMsg('')} 
            style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', marginLeft: 'auto', fontSize: '1.1rem' }}
          >
            &times;
          </button>
        </div>
      )}

      {/* Orbs decorativos — contidos para não causar overflow */}
      <div style={{ position: 'fixed', top: '10%', right: '5%', width: 300, height: 300, background: 'var(--primary)', filter: 'blur(100px)', opacity: 0.07, zIndex: 0, pointerEvents: 'none' }}></div>
      <div style={{ position: 'fixed', top: '40%', left: '5%', width: 400, height: 400, background: 'var(--alert-blue)', filter: 'blur(120px)', opacity: 0.07, zIndex: 0, pointerEvents: 'none', animation: 'float 10s ease-in-out infinite' }}></div>

      <div className="header-dash animate-fade-in" style={{ position: 'relative', zIndex: 1 }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <i className="fa-solid fa-chart-line" style={{ color: 'var(--primary)', fontSize: '1.6rem' }}></i>
            Painel Preditivo
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
            Visão em tempo real da rede com projeções de curtíssimo prazo (IA).
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => mockSubmit({ successTitle: 'Sincronizado', successMsg: 'Dados atualizados com sucesso.' })}
          disabled={submitting || loading}
        >
          {submitting || loading
            ? <><i className="fa-solid fa-circle-notch fa-spin"></i> Sincronizando...</>
            : <><i className="fa-solid fa-arrows-rotate"></i> Atualizar Dados</>}
        </button>
      </div>

      <div className="kpi-grid animate-slide-up">
        {kpis.map((kpi, i) => (
          <div key={i} className="kpi-card">
            <div className="kpi-icon"><i className={`fa-solid ${kpi.icon}`}></i></div>
            <div className="kpi-value" style={{ color: kpi.color }}>{kpi.value}</div>
            <div className="kpi-label">{kpi.label}</div>
            {kpi.trend && (
              <div style={{ marginTop: 6, fontSize: '0.75rem', fontWeight: 700, color: kpi.trendColor || kpi.color, display: 'flex', alignItems: 'center', gap: 4 }}>
                <i className="fa-solid fa-arrow-trend-up" style={{ fontSize: '0.7rem' }}></i>
                {kpi.trend}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Ações Rápidas */}
      <div style={{ marginBottom: 32, position: 'relative', zIndex: 1 }}>
        <h2 style={{ fontFamily: 'Outfit', fontSize: '1.2rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
          <i className="fa-solid fa-bolt" style={{ color: 'var(--primary)' }}></i>
          Ações Rápidas
        </h2>
        <div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}
          className="animate-slide-up delay-100"
        >
          {ACOES_GESTOR.filter(a => !(a.title === 'Assinar Prestação FNDE' && assinouPrestacao)).map((a) => {
            const content = (
              <>
                <div style={{
                  width: 46, height: 46, borderRadius: 12, flexShrink: 0,
                  background: `${a.color}18`, color: a.color, border: `1px solid ${a.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem',
                }}>
                  <i className={`fa-solid ${a.icon}`}></i>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', fontFamily: 'Outfit', marginBottom: 3 }}>{a.title}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: 1.4 }}>{a.desc}</div>
                </div>
                {a.isAction 
                  ? <i className="fa-solid fa-check" style={{ color: a.color, fontSize: '0.85rem', flexShrink: 0 }}></i>
                  : <i className="fa-solid fa-chevron-right" style={{ color: 'var(--text-muted)', fontSize: '0.75rem', flexShrink: 0 }}></i>
                }
              </>
            );

            const commonStyle = {
              padding: '20px 24px', textDecoration: 'none',
              display: 'flex', alignItems: 'center', gap: 16,
              borderLeft: `3px solid ${a.color}`,
              transition: 'all 0.25s',
              cursor: 'pointer'
            };

            if (a.isAction) {
              return (
                <div
                  key={a.title}
                  className="glass-panel"
                  style={commonStyle}
                  onClick={() => {
                    if (a.title === 'Assinar Prestação FNDE') setAssinouPrestacao(true);
                    mockSubmit({ successTitle: a.successTitle, successMsg: a.successMsg });
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 12px 24px ${a.color}20`; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = ''; }}
                >
                  {content}
                </div>
              );
            }

            return (
              <Link
                key={a.to}
                to={a.to}
                className="glass-panel"
                style={commonStyle}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 12px 24px ${a.color}20`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = ''; }}
              >
                {content}
              </Link>
            );
          })}
        </div>
      </div>

      {/* NOVO: Painel de Alertas FIFO */}
      <div style={{ marginBottom: 32, position: 'relative', zIndex: 1 }} className="animate-slide-up delay-150">
        <h2 style={{ fontFamily: 'Outfit', fontSize: '1.2rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
          <i className="fa-solid fa-hourglass-half" style={{ color: 'var(--alert-red)' }}></i>
          Controle de Validade FIFO & Otimização
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
          
          {loteCritico ? (
          <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: loteResolvido ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid rgba(239, 68, 68, 0.25)' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                {loteResolvido ? (
                  <span className="badge" style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--alert-green)', border: '1px solid rgba(16,185,129,0.2)' }}>
                    ✅ Risco FIFO Resolvido
                  </span>
                ) : (
                  <span className="badge" style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--alert-red)', border: '1px solid rgba(239,68,68,0.2)' }}>
                    ⚠️ Risco de Perda FIFO Crítico
                  </span>
                )}
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Lote {loteCritico.lote}</span>
              </div>
              
              <h3 style={{ fontFamily: 'Outfit', fontSize: '1.2rem', margin: '0 0 8px 0', color: 'var(--text-main)' }}>
                {loteCritico.nome}
              </h3>
              
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.5', margin: '0 0 16px 0' }}>
                {loteResolvido ? (
                  <>Este lote foi <strong style={{ color: 'var(--alert-green)' }}>realocado com sucesso</strong> no cardápio de Segunda-feira. Zero desperdício garantido.</>
                ) : (
                  <>O algoritmo FIFO detectou que <strong>{parseFloat(loteCritico.volume_kg).toFixed(1)}kg</strong> deste insumo estão prestes a vencer <strong style={{ color: 'var(--alert-red)' }}>({loteCritico.validade ? new Date(loteCritico.validade).toLocaleDateString('pt-BR') : 'Data Indefinida'})</strong>.</>
                )}
              </p>

              {!loteResolvido && (
                <div style={{
                  background: 'rgba(255,255,255,0.02)', borderRadius: 8, padding: 12,
                  border: '1px solid var(--border-subtle)', marginBottom: 20, fontSize: '0.82rem'
                }}>
                  <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: 4 }}>Ação FIFO Automatizada Recomendada:</strong>
                  Priorizar uso imediato em substituição a lotes mais novos.
                </div>
              )}
            </div>
          </div>
          ) : (
          <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', border: '1px solid rgba(16, 185, 129, 0.25)', textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: 'var(--alert-green)', marginBottom: 16 }}>
              <i className="fa-solid fa-shield-check"></i>
            </div>
            <h3 style={{ fontFamily: 'Outfit', fontSize: '1.3rem', color: 'var(--text-main)', marginBottom: 8 }}>Estoque Saudável</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>O algoritmo não identificou lotes com risco iminente de vencimento na sua unidade.</p>
          </div>
          )}

          {/* Métricas de Otimização FIFO Card */}
          <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <h3 style={{ fontFamily: 'Outfit', fontSize: '1.1rem', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-main)' }}>
              <i className="fa-solid fa-gauge-high" style={{ color: 'var(--primary)', fontSize: '1.2rem' }}></i>
              Indicadores de Aproveitamento FIFO
            </h3>
            
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.4, marginBottom: 16 }}>
              A priorização correta deste lote de acordo com as regras FIFO evita desperdícios e garante a segurança alimentar na rede municipal.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                  <span>Aproveitamento Estimado</span>
                  <span style={{ color: 'var(--alert-green)', fontWeight: 'bold' }}>100%</span>
                </div>
                <div style={{ width: '100%', height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: '100%', height: '100%', background: 'var(--alert-green)' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                  <span>Refeições Atendidas (Estimado)</span>
                  <span style={{ color: 'var(--alert-blue)', fontWeight: 'bold' }}>250 refeições</span>
                </div>
                <div style={{ width: '100%', height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: '85%', height: '100%', background: 'var(--alert-blue)' }} />
                </div>
              </div>

              <div style={{
                background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.15)',
                borderRadius: 8, padding: 12, fontSize: '0.8rem', color: 'var(--text-muted)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--primary)', fontWeight: 'bold', marginBottom: 4 }}>
                  <i className="fa-solid fa-shield-halved"></i>
                  <span>Qualidade Certificada</span>
                </div>
                Lote inspecionado e liberado para consumo sob protocolo FIFO-A1.
              </div>
            </div>

            {(!loteResolvido && loteCritico) && (
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setLoteResolvido(true);
                  mockSubmit({ successTitle: 'Cardápio Atualizado', successMsg: `Lote crítico ${loteCritico.lote} foi priorizado no sistema.` });
                }}
                style={{
                  width: '100%',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '12px',
                  marginTop: 16
                }}
              >
                <i className="fa-solid fa-calendar-plus"></i> Aplicar Priorização no Cardápio
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Gráficos e Mapa */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, position: 'relative', zIndex: 1 }}>
        <div className="glass-panel animate-slide-up delay-200" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '24px 24px 0' }}>
            <h3 style={{ fontFamily: 'Outfit', marginBottom: 4 }}>
              <i className="fa-solid fa-brain" style={{ color: 'var(--alert-blue)', marginRight: 10 }}></i>
              Predição de Consumo Semanal
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Modelo calibrado com catracas faciais e cardápio planejado.</p>
          </div>
          <PredictiveChart labels={chartData.labels} real={chartData.real} predito={chartData.predito} />
        </div>

        <div className="animate-slide-up delay-300">
          <LogisticsMap />
        </div>
      </div>
    </DashboardLayout>
  );
}
