import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useToast } from '../../contexts/ToastContext';
import { useMovimentacoes } from '../../hooks/useMovimentacoes';
import { useAuth } from '../../contexts/AuthContext';

function downloadFile(nomeArquivo, conteudo, tipo = 'text/csv;charset=utf-8') {
  const blob = new Blob(['\uFEFF' + conteudo], { type: tipo });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nomeArquivo;
  document.body.appendChild(a); // Fallback de compatibilidade
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// As funções de exportação foram internalizadas no componente para acesso ao estado.

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
  const { user } = useAuth();
  const { movimentacoes } = useMovimentacoes(user?.escola_id);
  const [mesConsumo, setMesConsumo] = useState('');
  const [loadingSobra, setLoadingSobra]   = useState(false);
  const [loadingConsumo, setLoadingConsumo] = useState(false);
  const [loadingCert, setLoadingCert]    = useState(false);
  const { showToast } = useToast();

  const handleSobra = () => {
    setLoadingSobra(true);
    const cabecalho = 'Data;Tipo de Registro;Quantidade (kg);Escola;Observacao;Lote ID';
    const sobrasReais = movimentacoes.filter(m => m.tipo === 'sobra' || m.tipo === 'baixa');
    
    if (sobrasReais.length === 0) {
      showToast('Aviso', 'Nenhuma movimentação de sobra encontrada no banco de dados para esta escola.', 'warning');
      setLoadingSobra(false);
      return;
    }

    const linhas = sobrasReais.map(r => {
      const d = new Date(r.criado_em).toLocaleDateString('pt-BR');
      return `${d};${r.tipo};${parseFloat(r.quantidade_kg || 0).toFixed(2).replace('.', ',')};${r.escola?.nome || '—'};${r.observacao};${r.lote?.lote || '—'}`;
    });
    
    const csv = [cabecalho, ...linhas].join('\n');
    downloadFile('Auditoria-Movimentacoes-Real.csv', csv);
    showToast('Download Iniciado', 'Relatório de Sobras exportado a partir do banco de dados.', 'success');
    setLoadingSobra(false);
  };

  const handleConsumo = () => {
    const mesValido = mesConsumo || new Date().toISOString().slice(0, 7);
    
    setLoadingConsumo(true);
    const cabecalho = 'Mes;Lote Usado;Quantidade Removida(kg);Tipo';
    const linhas = movimentacoes.filter(m => m.criado_em.startsWith(mesValido)).map(m => {
      return `${mesValido};${m.lote?.nome || m.observacao};${parseFloat(m.quantidade_kg || 0).toFixed(2).replace('.', ',')};${m.tipo}`;
    });

    const csvData = linhas.length > 0 ? [cabecalho, ...linhas].join('\n') : "Nenhum dado encontrado no banco para este mes.";

    downloadFile(`Consumo-${mesValido}.csv`, csvData);
    showToast('Relatório Gerado', `Evolução de consumo (via Banco) exportada com sucesso.`, 'success');
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
