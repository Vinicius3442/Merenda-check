import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useToast } from '../../contexts/ToastContext';

// ── Utilitário: dispara download de um arquivo ────────────────────────────────
function downloadFile(nomeArquivo, conteudo, tipo = 'text/csv;charset=utf-8') {
  const blob = new Blob(['\uFEFF' + conteudo], { type: tipo });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nomeArquivo;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Dados mock para os relatórios ────────────────────────────────────────────
const dadosSobra = [
  { data: '15/05/2026', insumo: 'Carne Moída Bovina', baixa_kg: 45.0, sobra_kg: 3.2, perda_pct: '7,1%' },
  { data: '15/05/2026', insumo: 'Arroz Agulhinha',    baixa_kg: 80.0, sobra_kg: 2.5, perda_pct: '3,1%' },
  { data: '15/05/2026', insumo: 'Feijão Carioca',     baixa_kg: 30.0, sobra_kg: 0.8, perda_pct: '2,7%' },
  { data: '14/05/2026', insumo: 'Carne Moída Bovina', baixa_kg: 42.0, sobra_kg: 4.1, perda_pct: '9,8%' },
  { data: '14/05/2026', insumo: 'Macarrão Espaguete', baixa_kg: 25.0, sobra_kg: 1.2, perda_pct: '4,8%' },
  { data: '13/05/2026', insumo: 'Arroz Agulhinha',    baixa_kg: 75.0, sobra_kg: 3.0, perda_pct: '4,0%' },
];

function gerarRelatorioSobra() {
  const cabecalho = 'Data;Insumo;Baixa (kg);Sobra (kg);Perda (%)';
  const linhas = dadosSobra.map(r =>
    `${r.data};${r.insumo};${r.baixa_kg.toFixed(2).replace('.', ',')};${r.sobra_kg.toFixed(2).replace('.', ',')};${r.perda_pct}`
  );
  return [cabecalho, ...linhas].join('\n');
}

function gerarRelatorioConsumo(mes) {
  const [ano, m] = mes.split('-');
  const meses = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  const nomeMes = meses[parseInt(m) - 1] || m;

  const cabecalho = 'Semana;Refeições Servidas;Custo Total (R$);Custo per Capita (R$);Índice de Adesão (%)';
  const semanas = [
    `Sem 1 ${nomeMes}/${ano};1.240;R$ 6.820,00;R$ 5,50;91%`,
    `Sem 2 ${nomeMes}/${ano};1.310;R$ 7.205,00;R$ 5,50;94%`,
    `Sem 3 ${nomeMes}/${ano};1.280;R$ 7.040,00;R$ 5,50;92%`,
    `Sem 4 ${nomeMes}/${ano};1.195;R$ 6.572,50;R$ 5,50;89%`,
  ];
  const totais = `TOTAL;5.025;R$ 27.637,50;R$ 5,50;91,5%`;
  return [cabecalho, ...semanas, totais].join('\n');
}

function gerarCertificadoHTML() {
  const hoje = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Certificado de Conformidade — Merenda Check</title>
  <style>
    body { font-family: 'Georgia', serif; max-width: 800px; margin: 40px auto; padding: 40px;
           border: 4px double #1a7a4a; color: #111; }
    h1 { text-align: center; color: #1a7a4a; font-size: 2rem; margin-bottom: 4px; }
    .subtitle { text-align: center; color: #555; font-size: 0.95rem; margin-bottom: 32px; }
    .seal { text-align: center; font-size: 4rem; margin: 24px 0; }
    .body-text { line-height: 1.9; font-size: 1.05rem; margin: 20px 0; }
    .assinatura { margin-top: 60px; display: flex; justify-content: space-around; }
    .assinatura div { text-align: center; }
    .linha { border-top: 1px solid #333; padding-top: 8px; font-size: 0.85rem; }
    .rodape { text-align: center; margin-top: 40px; font-size: 0.75rem; color: #999; }
    @media print { body { margin: 0; } }
  </style>
</head>
<body>
  <h1>🏛 Merenda Check</h1>
  <div class="subtitle">Sistema de Rastreabilidade Alimentar Escolar — PNAE</div>
  <div class="seal">🏅</div>
  <h2 style="text-align:center; color:#1a7a4a;">Certificado de Conformidade Operacional</h2>
  <div class="body-text">
    <p>Certificamos que a Unidade Escolar atendeu integralmente aos protocolos do
    <strong>Programa Nacional de Alimentação Escolar (PNAE)</strong> durante o período
    de referência, não apresentando violações dos critérios FIFO de estoque, recusas
    de inspeção óptica ou irregularidades nos registros de recebimento de insumos.</p>
    <p>Todos os lotes recebidos foram rastreados via QR Code e registrados na
    plataforma Merenda Check. O índice de conformidade alcançado foi de
    <strong>98,7%</strong>, acima do mínimo exigido de 90%.</p>
    <p>Documento emitido eletronicamente em: <strong>${hoje}</strong></p>
  </div>
  <div class="assinatura">
    <div>
      <div class="linha">Nutricionista Responsável</div>
      <div>Dra. Fernanda L. — CRN 12345</div>
    </div>
    <div>
      <div class="linha">Gestor Escolar</div>
      <div>Carlos Roberto — Mat. 54321</div>
    </div>
  </div>
  <div class="rodape">
    Código de Verificação: MC-2026-${Math.random().toString(36).substr(2, 9).toUpperCase()} | merendacheck.gov.br
  </div>
  <script>window.onload = () => window.print();</script>
</body>
</html>`;
}

// ─────────────────────────────────────────────────────────────────────────────
export default function Relatorios() {
  const [mesConsumo, setMesConsumo] = useState('');
  const [loadingSobra, setLoadingSobra]   = useState(false);
  const [loadingConsumo, setLoadingConsumo] = useState(false);
  const [loadingCert, setLoadingCert]    = useState(false);
  const { showToast } = useToast();

  const handleSobra = () => {
    setLoadingSobra(true);
    const csv = gerarRelatorioSobra();
    downloadFile('Auditoria-SobraLimpa-D0.csv', csv);
    showToast('Download Iniciado', 'Relatório de Sobra Limpa exportado com sucesso (CSV).', 'success');
    setLoadingSobra(false);
  };

  const handleConsumo = () => {
    if (!mesConsumo) {
      showToast('Selecione o Mês', 'Escolha o mês de referência antes de consultar.', 'error');
      return;
    }
    setLoadingConsumo(true);
    const csv = gerarRelatorioConsumo(mesConsumo);
    downloadFile(`Consumo-${mesConsumo}.csv`, csv);
    showToast('Relatório Gerado', `Evolução de consumo de ${mesConsumo} exportada (CSV).`, 'success');
    setLoadingConsumo(false);
  };

  const handleCertificado = () => {
    setLoadingCert(true);
    const html = gerarCertificadoHTML();
    const janela = window.open('', '_blank');
    if (janela) {
      janela.document.write(html);
      janela.document.close();
      showToast('Certificado Emitido', 'Janela de impressão aberta. Use Ctrl+P para salvar como PDF.', 'success');
    } else {
      showToast('Bloqueado', 'Permita popups neste site para abrir o certificado.', 'error');
    }
    setLoadingCert(false);
  };

  return (
    <DashboardLayout>
      <div className="header-dash animate-fade-in">
        <div>
          <h1>Repositório Documental</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
            Emissão de relatórios e documentos oficiais para prestação de contas.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 8,
          background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', fontSize: '0.8rem', color: 'var(--primary)' }}>
          <i className="fa-solid fa-circle-check"></i> Downloads reais disponíveis
        </div>
      </div>

      <div className="report-grid animate-slide-up delay-100">
        {/* Card 1 — Sobra Limpa */}
        <div className="report-card glass-panel">
          <div className="report-icon"><i className="fa-solid fa-clipboard-check"></i></div>
          <h3 className="brand-font" style={{ fontSize: '1.4rem', marginBottom: 10 }}>Auditoria de Sobra Limpa</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: 'auto', flex: 1, fontSize: '0.9rem', lineHeight: 1.6 }}>
            Exporta um CSV detalhando grama a grama a diferença entre baixas de estoque e
            a sobra das panelas — dos últimos 3 dias de operação.
          </p>
          <div style={{ marginTop: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <i className="fa-solid fa-file-csv" style={{ color: 'var(--primary)' }}></i>
              Formato: CSV · 3 dias · Compatível com Excel
            </div>
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}
              onClick={handleSobra} disabled={loadingSobra}>
              {loadingSobra
                ? <><i className="fa-solid fa-circle-notch fa-spin"></i> Gerando...</>
                : <><i className="fa-solid fa-download"></i> Baixar Extrato (D-0)</>}
            </button>
          </div>
        </div>

        {/* Card 2 — Evolução de Consumo */}
        <div className="report-card glass-panel">
          <div className="report-icon" style={{ background: 'rgba(59,130,246,0.1)', color: 'var(--alert-blue)' }}>
            <i className="fa-solid fa-chart-line"></i>
          </div>
          <h3 className="brand-font" style={{ fontSize: '1.4rem', marginBottom: 10 }}>Evolução de Consumo</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: 'auto', flex: 1, fontSize: '0.9rem', lineHeight: 1.6 }}>
            Comparativo mensal de refeições servidas, custo per capita e índice de
            adesão. Selecione o mês de referência abaixo.
          </p>
          <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <i className="fa-solid fa-file-csv" style={{ color: 'var(--alert-blue)' }}></i>
              Formato: CSV · Por semana · Custo e adesão
            </div>
            <input type="month" className="form-control" style={{ width: '100%' }}
              value={mesConsumo} onChange={e => setMesConsumo(e.target.value)} />
            <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', color: 'var(--alert-blue)', borderColor: 'var(--alert-blue)' }}
              onClick={handleConsumo} disabled={loadingConsumo}>
              {loadingConsumo
                ? <><i className="fa-solid fa-circle-notch fa-spin"></i> Gerando...</>
                : <><i className="fa-solid fa-download"></i> Baixar Relatório</>}
            </button>
          </div>
        </div>

        {/* Card 3 — Certificado */}
        <div className="report-card glass-panel">
          <div className="report-icon" style={{ background: 'rgba(245,158,11,0.1)', color: 'var(--alert-yellow)' }}>
            <i className="fa-solid fa-file-shield"></i>
          </div>
          <h3 className="brand-font" style={{ fontSize: '1.4rem', marginBottom: 10 }}>Certificado de Conformidade</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: 'auto', flex: 1, fontSize: '0.9rem', lineHeight: 1.6 }}>
            Atestado de que a escola não violou nenhum protocolo FIFO. Abre uma janela
            formatada — use <strong>Ctrl+P → Salvar como PDF</strong> para arquivar.
          </p>
          <div style={{ marginTop: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <i className="fa-solid fa-print" style={{ color: 'var(--alert-yellow)' }}></i>
              Formato: Impressão / PDF · Código de verificação único
            </div>
            <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', color: 'var(--alert-yellow)', borderColor: 'var(--alert-yellow)' }}
              onClick={handleCertificado} disabled={loadingCert}>
              {loadingCert
                ? <><i className="fa-solid fa-circle-notch fa-spin"></i> Preparando...</>
                : <><i className="fa-solid fa-certificate"></i> Emitir Certificado (PDF)</>}
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
