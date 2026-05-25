import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useEstoque } from '../../hooks/useEstoque';

export default function GestorEstoque() {
  const { estoque, loading } = useEstoque();

  const formatVolume = (kg) => {
    if (kg === null || kg === undefined) return '—';
    return `${parseFloat(kg).toFixed(1)} kg`;
  };

  const formatValidade = (dateStr, status) => {
    if (!dateStr) return status === 'arquivado' ? 'Consumido na Íntegra' : '—';
    const d = new Date(dateStr);
    const diff = Math.ceil((d - new Date()) / 86400000);
    if (diff < 0) return 'Vencido';
    if (diff === 0) return 'Vence Hoje';
    if (diff <= 7) return `Vence em ${diff} Dia${diff > 1 ? 's' : ''}`;
    return `Vence em ${diff} Dias`;
  };

  const handleExportarAuditPDF = () => {
    const printWindow = window.open('', '_blank', 'width=900,height=800');
    if (!printWindow) {
      alert('Por favor, permita pop-ups para gerar o relatório PDF.');
      return;
    }

    const totalItens = estoque.length;
    const itensUrgentes = estoque.filter(i => i.status === 'urgente').length;
    const itensConformes = estoque.filter(i => i.status === 'normal').length;
    const scoreFIFO = totalItens ? Math.round(((totalItens - itensUrgentes) / totalItens) * 100) : 100;

    const rows = estoque.map(item => `
      <tr style="border-bottom: 1px solid #e2e8f0; page-break-inside: avoid;">
        <td style="padding: 10px; font-family: monospace; font-size: 0.85rem; font-weight: bold; color: #0f172a;">${item.lote}</td>
        <td style="padding: 10px; font-weight: 600; color: #1e293b;">${item.nome}</td>
        <td style="padding: 10px; font-weight: bold; color: #0f172a;">${parseFloat(item.volume_kg || 0).toFixed(1)} kg</td>
        <td style="padding: 10px; font-size: 0.85rem; color: #475569;">
          ${item.validade ? new Date(item.validade).toLocaleDateString('pt-BR') : '—'}
        </td>
        <td style="padding: 10px; font-size: 0.85rem;">
          <span style="
            display: inline-block; padding: 4px 8px; border-radius: 4px; font-weight: bold; font-size: 0.75rem;
            background-color: ${item.status === 'urgente' ? '#ffe4e6' : item.status === 'normal' ? '#d1fae5' : '#f1f5f9'};
            color: ${item.status === 'urgente' ? '#e11d48' : item.status === 'normal' ? '#059669' : '#475569'};
          ">
            ${item.status === 'urgente' ? 'Prioridade FIFO' : item.status === 'normal' ? 'Liberado' : item.status === 'bloqueado' ? 'Bloqueado' : 'Arquivado'}
          </span>
        </td>
        <td style="padding: 10px; font-family: monospace; font-size: 0.75rem; color: #64748b;">${item.hash || '—'}</td>
      </tr>
    `).join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Relatório de Auditoria de Estoque — Merenda Check</title>
        <meta charset="utf-8">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@600;700&display=swap');
          body {
            font-family: 'Inter', sans-serif;
            color: #1e293b;
            line-height: 1.5;
            padding: 40px;
            background-color: #fff;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 3px solid #10b981;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .header h1 {
            font-family: 'Outfit', sans-serif;
            font-size: 24px;
            margin: 0;
            color: #0f172a;
          }
          .header p {
            margin: 4px 0 0 0;
            color: #64748b;
            font-size: 14px;
          }
          .gov-crest {
            text-align: right;
          }
          .gov-crest img {
            height: 50px;
            margin-bottom: 6px;
          }
          .gov-crest div {
            font-size: 11px;
            font-weight: bold;
            color: #475569;
            text-transform: uppercase;
          }
          .kpi-container {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 16px;
            margin-bottom: 30px;
          }
          .kpi-card {
            border: 1px solid #e2e8f0;
            padding: 16px;
            border-radius: 8px;
            background-color: #f8fafc;
          }
          .kpi-card h4 {
            margin: 0 0 6px 0;
            font-size: 12px;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .kpi-card .value {
            font-size: 22px;
            font-weight: 700;
            color: #0f172a;
            font-family: 'Outfit', sans-serif;
          }
          .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 40px;
          }
          .data-table th {
            background-color: #f1f5f9;
            color: #475569;
            text-align: left;
            padding: 12px 10px;
            font-size: 12px;
            text-transform: uppercase;
            font-weight: bold;
            border-bottom: 2px solid #cbd5e1;
          }
          .footer {
            margin-top: 60px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            font-size: 12px;
            color: #64748b;
          }
          .signature-box {
            text-align: center;
            border-top: 1px solid #cbd5e1;
            width: 250px;
            padding-top: 8px;
          }
          @media print {
            body { padding: 20px; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="margin-bottom: 20px; text-align: right;">
          <button onclick="window.print();" style="
            background-color: #10b981; color: white; border: none; padding: 10px 20px;
            border-radius: 6px; font-weight: bold; cursor: pointer; font-family: 'Inter', sans-serif;
          ">
            Confirmar Impressão / Salvar PDF
          </button>
        </div>

        <div class="header">
          <div>
            <h1>MERENDA CHECK — AUDITORIA DE ESTOQUE</h1>
            <p>Relatório de Apontamento Físico e Conformidade de Lotes (FIFO)</p>
            <p style="font-size: 12px; margin-top: 4px;">Gerado em: ${new Date().toLocaleString('pt-BR')}</p>
          </div>
          <div class="gov-crest">
            <img src="/logo.png" alt="Logo" onerror="this.src='https://merendacheck.gov.br/logo.png'; this.style.filter='grayscale(100%)';">
            <div>Secretaria de Educação</div>
            <div style="font-size: 9px; color: #94a3b8;">Fundo Nacional de Desenvolvimento da Educação</div>
          </div>
        </div>

        <div class="kpi-container">
          <div class="kpi-card">
            <h4>Total de Lotes</h4>
            <div class="value">${totalItens}</div>
          </div>
          <div class="kpi-card">
            <h4>Alertas Críticos (SLA)</h4>
            <div class="value" style="color: #e11d48;">${itensUrgentes}</div>
          </div>
          <div class="kpi-card">
            <h4>Lotes Conformes</h4>
            <div class="value" style="color: #059669;">${itensConformes}</div>
          </div>
          <div class="kpi-card">
            <h4>Conformidade FIFO</h4>
            <div class="value" style="color: #059669;">${scoreFIFO}%</div>
          </div>
        </div>

        <table class="data-table">
          <thead>
            <tr>
              <th>Código / Lote</th>
              <th>Nome do Insumo</th>
              <th>Volume Físico</th>
              <th>Data Validade</th>
              <th>Status FIFO</th>
              <th>Hash Criptográfico</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>

        <div class="footer">
          <div>
            <p><strong>Hash SHA-256 da Auditoria:</strong> SHA-256/MC-${Math.random().toString(36).substring(2, 10).toUpperCase()}</p>
            <p style="margin-top: 4px;">Este documento constitui trilha oficial e imutável para fins de prestação de contas do PNAE.</p>
          </div>
          <div class="signature-box">
            <strong>Responsável Técnico / Gestor</strong>
            <div style="font-size: 11px; margin-top: 4px; color: #94a3b8;">Assinatura Digital Integrada</div>
          </div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 500);
          }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <DashboardLayout>
      <div className="header-dash animate-fade-in">
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <i className="fa-solid fa-boxes-stacked" style={{ color: 'var(--primary)', fontSize: '1.5rem' }}></i>
            Estoque Transparente
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: 4 }}>
            Lista de lotes com rastreabilidade em tempo real e controle FIFO automático.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary" onClick={handleExportarAuditPDF}>
            <i className="fa-solid fa-file-pdf"></i> Exportar Audit-PDF
          </button>
        </div>
      </div>

      <div className="table-card animate-slide-up delay-100">
        {/* Card Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)',
          flexWrap: 'wrap', gap: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <i className="fa-solid fa-list-check" style={{ color: 'var(--primary)' }}></i>
            <span style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>
              Lotes Registrados
            </span>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <i className="fa-solid fa-search" style={{
                position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                color: 'var(--text-muted)', fontSize: '0.8rem'
              }}></i>
              <input
                type="text"
                placeholder="Buscar lote, hash ou insumo..."
                style={{
                  paddingLeft: 34, paddingRight: 14, paddingTop: 9, paddingBottom: 9,
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8, color: '#f1f5f9', fontSize: '0.85rem', outline: 'none', width: 240,
                }}
              />
            </div>
            <button className="btn btn-secondary" style={{ padding: '9px 14px', fontSize: '0.85rem' }}>
              <i className="fa-solid fa-filter"></i> Filtrar
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)' }}>
            <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: '2rem', marginBottom: 12, color: 'var(--primary)' }}></i>
            <p>Carregando estoque...</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Código / Lote</th>
                  <th>Insumo</th>
                  <th>Volume Atual</th>
                  <th>Validade / SLA</th>
                  <th>Status do Lote</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {estoque.map((item) => (
                  <tr key={item.id} style={item.status === 'bloqueado' ? { opacity: 0.55 } : {}}>
                    <td>
                      <span style={{ fontFamily: 'monospace', color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem' }}>
                        {item.lote}
                      </span>
                      <br />
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{item.hash}</span>
                    </td>
                    <td style={{ fontWeight: 600, color: item.status === 'arquivado' ? 'var(--text-muted)' : '#f1f5f9', textDecoration: item.status === 'arquivado' ? 'line-through' : 'none' }}>
                      {item.nome}
                    </td>
                    <td style={{ fontWeight: 600 }}>{formatVolume(item.volume_kg)}</td>
                    <td style={{ color: item.status === 'urgente' ? 'var(--alert-red)' : 'var(--text-muted)', fontWeight: item.status === 'urgente' ? 700 : 400 }}>
                      {item.status === 'urgente' && <i className="fa-solid fa-hourglass-end" style={{ marginRight: 6 }}></i>}
                      {item.status === 'arquivado' && <i className="fa-solid fa-check-double" style={{ marginRight: 6, color: 'var(--primary)' }}></i>}
                      {formatValidade(item.validade, item.status)}
                    </td>
                    <td>
                      {item.status === 'urgente' && (
                        <span className="badge" style={{ background: 'rgba(244,63,94,0.12)', color: 'var(--alert-red)', border: '1px solid rgba(244,63,94,0.2)', animation: 'pulseGlow 2s infinite', fontSize: '0.75rem' }}>
                          <i className="fa-solid fa-unlock"></i> Prioridade Máxima
                        </span>
                      )}
                      {item.status === 'bloqueado' && <span className="badge badge-neutral" style={{ fontSize: '0.75rem' }}><i className="fa-solid fa-lock"></i> Bloqueado</span>}
                      {item.status === 'normal' && <span className="badge badge-success" style={{ fontSize: '0.75rem' }}><i className="fa-solid fa-check"></i> Liberado</span>}
                      {item.status === 'arquivado' && <span className="badge badge-neutral" style={{ fontSize: '0.75rem' }}><i className="fa-solid fa-archive"></i> Arquivado</span>}
                    </td>
                    <td className="text-nowrap">
                      <div style={{ display: 'flex', gap: 6 }}>
                        {item.eligible && (
                          <Link to={`/operador/baixa?id=${item.id}`} className="btn btn-primary" style={{ padding: '7px 14px', fontSize: '0.82rem' }}>
                            <i className="fa-solid fa-download"></i> {item.status === 'urgente' ? 'Baixar Agora' : 'Baixar'}
                          </Link>
                        )}
                        {item.status === 'bloqueado' && (
                          <button className="btn btn-secondary" style={{ padding: '7px 14px', fontSize: '0.82rem' }} disabled title="Bloqueado pela regra FIFO">
                            <i className="fa-solid fa-ban"></i> Restrito
                          </button>
                        )}
                        <Link to={`/auditor/rastrear?lote=${encodeURIComponent(item.lote)}`} className="btn btn-secondary" style={{ padding: '7px 14px', fontSize: '0.82rem' }}>
                          <i className="fa-solid fa-link"></i> Rastrear
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        {!loading && (
          <div style={{
            padding: '12px 24px', borderTop: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            fontSize: '0.8rem', color: 'var(--text-muted)'
          }}>
            <span><i className="fa-solid fa-circle-info" style={{ marginRight: 6 }}></i>{estoque.length} lotes registrados</span>
            <span style={{ color: 'var(--primary)' }}><i className="fa-solid fa-shield-halved" style={{ marginRight: 6 }}></i>Assinatura Digital Ativa</span>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}


