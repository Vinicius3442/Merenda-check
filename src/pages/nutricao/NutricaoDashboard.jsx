import { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useMockSubmit } from '../../hooks/useMockSubmit';
import { useToast } from '../../contexts/ToastContext';
import { useEstoque } from '../../hooks/useEstoque';
import { useRefeicoes } from '../../hooks/useRefeicoes';

// ── Download de relatório FNDE ────────────────────────────────────────────────
function gerarRelatorioFNDE() {
  const hoje = new Date().toLocaleDateString('pt-BR');
  const conteudo = `RELATÓRIO FNDE — Programa Nacional de Alimentação Escolar
Data de Emissão: ${hoje}
===========================================================

1. INDICADORES GERAIS
   Cardápios Planejados:      12 / 12  (100%)
   Custo FNDE Mensal:         R$ 1.200.000,00
   Fichas Técnicas Ativas:    45
   Conformidade Nutricional:  98%

2. DISTRIBUIÇÃO POR FAIXA ETÁRIA (PNAE Art. 17)
   Creche (0-3 anos):         R$ 1,07/dia por aluno
   Pré-Escola (4-5 anos):     R$ 1,07/dia por aluno
   Ensino Fund. (6-10 anos):  R$ 0,36/dia por aluno
   Ensino Fund. (11+ anos):   R$ 0,36/dia por aluno

3. CONFORMIDADE NUTRICIONAL (IN 01/2013)
   Energia:        100% dos dias dentro da meta
   Proteínas:       98% dos dias dentro da meta
   Fibras:          95% dos dias dentro da meta
   Sódio:          100% dos dias dentro da meta

4. ALIMENTOS DA AGRICULTURA FAMILIAR
   Percentual adquirido:  38,5% (mínimo exigido: 30%)
   Valor investido:       R$ 462.000,00

5. OBSERVAÇÕES
   Nenhuma não-conformidade crítica identificada no período.
   Déficit projetado de 120kg de Carne Bovina para 22/04 — em tratativa com Licitação.

===========================================================
Documento gerado automaticamente pelo sistema Merenda Check.
Para fins de prestação de contas ao FNDE — Art. 27 da Lei 11.947/2009.
`;
  const blob = new Blob(['\uFEFF' + conteudo], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `FNDE-Relatorio-${hoje.replace(/\//g, '-')}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

const ACOES_NUTRICAO = [
  {
    to: '/nutricao/fichas',
    icon: 'fa-clipboard-list',
    title: 'Validar Ficha Técnica',
    desc: 'Revise e aprove as fichas técnicas de cada prato do cardápio.',
    color: 'var(--primary)',
  },
  {
    to: '/nutricao/cardapios',
    icon: 'fa-calendar-days',
    title: 'Planejar Cardápio',
    desc: 'Monte o cardápio semanal dentro das diretrizes PNAE.',
    color: 'var(--alert-blue)',
  },
];

export default function NutricaoDashboard() {
  const { loading, mockSubmit } = useMockSubmit();
  const { showToast } = useToast();
  const { estoque } = useEstoque();
  const { refeicoes } = useRefeicoes();
  const [downloadingFnde, setDownloadingFnde] = useState(false);

  const totalEstoqueKg = estoque.reduce((acc, item) => acc + (parseFloat(item.volume_kg) || 0), 0).toFixed(1);
  const totalRefeicoes = refeicoes.reduce((acc, r) => acc + (parseInt(r.total_servidos) || 0), 0);
  const mediaSobras = refeicoes.length > 0 ? (refeicoes.reduce((acc, r) => acc + (parseFloat(r.resto_kg) || 0), 0) / refeicoes.length).toFixed(1) : 0;

  const metaKpis = [
    { label: 'Cardápios Planejados', value: '12 / 12', icon: 'fa-calendar-check', color: 'var(--alert-green)' },
    { label: 'Estoque Total',        value: `${totalEstoqueKg} kg`,  icon: 'fa-box-open',   color: 'var(--alert-yellow)' },
    { label: 'Refeições Servidas',   value: `${totalRefeicoes}`,        icon: 'fa-utensils', color: 'var(--alert-blue)' },
    { label: 'Média de Sobras',      value: `${mediaSobras} kg`,       icon: 'fa-scale-unbalanced',   color: 'var(--primary)' },
  ];

  const handleFndeDownload = () => {
    setDownloadingFnde(true);
    setTimeout(() => {
      gerarRelatorioFNDE();
      showToast('Relatório Exportado', 'Relatório FNDE gerado e salvo com sucesso.', 'success');
      setDownloadingFnde(false);
    }, 1200);
  };

  return (
    <DashboardLayout>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div className="header-dash animate-fade-in">
          <div>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <i className="fa-solid fa-chart-pie" style={{ color: 'var(--primary)' }}></i>
              Metas PNAE
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
              Acompanhe o cumprimento das diretrizes nutricionais, custo per capita e adequação do cardápio letivo.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              className="btn btn-secondary"
              onClick={handleFndeDownload}
              disabled={downloadingFnde}
            >
              {downloadingFnde
                ? <><i className="fa-solid fa-circle-notch fa-spin"></i> Gerando...</>
                : <><i className="fa-solid fa-file-arrow-down"></i> Exportar Relatório FNDE</>}
            </button>
            <button
              className="btn btn-primary"
              onClick={() => mockSubmit({ successTitle: 'Solicitação Enviada', successMsg: 'Pedido de compra emergencial enviado ao setor de licitação.' })}
              disabled={loading}
            >
              {loading
                ? <><i className="fa-solid fa-circle-notch fa-spin"></i> Enviando...</>
                : <><i className="fa-solid fa-paper-plane"></i> Solicitar Compra</>}
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="kpi-grid animate-slide-up">
          {metaKpis.map((kpi, i) => (
            <div key={i} className="kpi-card">
              <div className="kpi-icon"><i className={`fa-solid ${kpi.icon}`}></i></div>
              <div className="kpi-value" style={{ color: kpi.color }}>{kpi.value}</div>
              <div className="kpi-label">{kpi.label}</div>
            </div>
          ))}
        </div>

        {/* Ações Rápidas */}
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontFamily: 'Outfit', fontSize: '1.1rem', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
            <i className="fa-solid fa-bolt" style={{ color: 'var(--primary)' }}></i>
            Ações da Nutricionista
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}
            className="animate-slide-up delay-100">
            {ACOES_NUTRICAO.map((a) => (
              <Link
                key={a.to}
                to={a.to}
                className="glass-panel"
                style={{
                  padding: '18px 22px', textDecoration: 'none',
                  display: 'flex', alignItems: 'center', gap: 14,
                  borderLeft: `3px solid ${a.color}`,
                  transition: 'all 0.25s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 10px 20px ${a.color}20`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = ''; }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  background: `${a.color}18`, color: a.color, border: `1px solid ${a.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.15rem',
                }}>
                  <i className={`fa-solid ${a.icon}`}></i>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', fontFamily: 'Outfit', marginBottom: 2 }}>{a.title}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', lineHeight: 1.4 }}>{a.desc}</div>
                </div>
                <i className="fa-solid fa-chevron-right" style={{ color: 'var(--text-muted)', fontSize: '0.7rem', flexShrink: 0 }}></i>
              </Link>
            ))}
          </div>
        </div>

        {/* Alerta IA */}
        <div className="glass-panel animate-slide-up delay-100" style={{ padding: 24, marginTop: 8 }}>
          <h3 style={{ fontFamily: 'Outfit', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <i className="fa-solid fa-triangle-exclamation" style={{ color: 'var(--alert-red)' }}></i>
            Avisos do Sistema de IA
          </h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>
            O cruzamento preditivo encontrou uma inconsistência entre o Estoque Geral e o Cardápio Planejado:
          </p>
          <div style={{ padding: 16, background: 'rgba(245,158,11,0.1)', borderLeft: '4px solid var(--alert-yellow)', borderRadius: '0 8px 8px 0', marginBottom: 20 }}>
            <strong>Atenção:</strong> Há déficit projetado de <strong>120kg de Carne Bovina</strong> para o dia 22/04 (Cardápio: Estrogonofe).
            Recomenda-se acionar Licitação ou alterar o cardápio.
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link to="/nutricao/cardapios" className="btn btn-primary">
              <i className="fa-solid fa-pen-to-square"></i> Editar Cardápio
            </Link>
            <button
              className="btn btn-secondary"
              onClick={() => mockSubmit({ successTitle: 'Solicitação Enviada', successMsg: 'Pedido encaminhado ao setor de Licitação com prioridade máxima.' })}
              disabled={loading}
            >
              <i className="fa-solid fa-paper-plane"></i> Solicitar Compra
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
