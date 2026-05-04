import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';

export default function EmitirLote() {
  const [etapa, setEtapa] = useState(1);
  const [fornecedor, setFornecedor] = useState('');
  const [notaFiscal, setNotaFiscal] = useState('');
  const [placa, setPlaca] = useState('');
  const [motorista, setMotorista] = useState('');
  
  const [items, setItems] = useState([
    { id: 1, descricao: 'Arroz Agulhinha Tipo 1', qtd: 50, unidade: 'kg', validade: '2026-12-01' },
    { id: 2, descricao: 'Feijão Carioca', qtd: 30, unidade: 'kg', validade: '2026-10-15' },
  ]);

  const [gerando, setGerando] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setGerando(true);
    setTimeout(() => {
      setGerando(false);
      setEtapa(2);
    }, 2000); // Simulando tempo de assinatura do contrato no blockchain
  };

  return (
    <DashboardLayout>
      <header className="page-header">
        <div>
          <h1 className="page-title">Emitir Lote de Transporte</h1>
          <p className="page-subtitle">Gere o QR Code Blockchain para rastreabilidade de entrega</p>
        </div>
      </header>

      {etapa === 1 && (
        <div className="card glass-panel" style={{ padding: 30, maxWidth: 800, margin: '0 auto' }}>
          <form onSubmit={handleSubmit}>
            <h3 style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: 10, marginBottom: 20 }}>
              Dados do Veículo e Origem
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
              <div className="form-group">
                <label className="form-label">Fornecedor / Armazém Origem</label>
                <select className="form-control" value={fornecedor} onChange={e => setFornecedor(e.target.value)} required>
                  <option value="">Selecione...</option>
                  <option value="CD Central">Centro de Distribuição Central</option>
                  <option value="Frigorífico Bom Corte">Frigorífico Bom Corte LTDA</option>
                  <option value="Hortifruti Vale">Hortifruti Verde Vale</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Nota Fiscal (Opcional)</label>
                <input type="text" className="form-control" placeholder="000.123.456" value={notaFiscal} onChange={e => setNotaFiscal(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Placa do Veículo</label>
                <input type="text" className="form-control" placeholder="ABC-1234" value={placa} onChange={e => setPlaca(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Nome do Motorista</label>
                <input type="text" className="form-control" placeholder="João da Silva" value={motorista} onChange={e => setMotorista(e.target.value)} required />
              </div>
            </div>

            <h3 style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: 10, marginBottom: 20, display: 'flex', justifyContent: 'space-between' }}>
              Itens do Lote
              <button type="button" style={{ fontSize: '0.8rem', background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)', padding: '4px 10px', borderRadius: 4, cursor: 'pointer' }}>
                <i className="fa-solid fa-plus"></i> Adicionar Item
              </button>
            </h3>

            <div style={{ background: 'var(--bg-surface-elevated)', borderRadius: 8, padding: 10, marginBottom: 30 }}>
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ color: 'var(--text-muted)' }}>
                    <th style={{ padding: 10 }}>Descrição</th>
                    <th style={{ padding: 10 }}>Qtd</th>
                    <th style={{ padding: 10 }}>Unid.</th>
                    <th style={{ padding: 10 }}>Validade</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(item => (
                    <tr key={item.id} style={{ borderTop: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: 10 }}>{item.descricao}</td>
                      <td style={{ padding: 10, fontWeight: 700 }}>{item.qtd}</td>
                      <td style={{ padding: 10 }}>{item.unidade}</td>
                      <td style={{ padding: 10, color: 'var(--alert-yellow)' }}>{item.validade}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '16px', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', gap: 10 }}
              disabled={gerando}
            >
              {gerando ? (
                <>
                  <i className="fa-solid fa-circle-notch fa-spin"></i> Emitindo Smart Contract...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-link"></i> Emitir Lote no Blockchain
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {etapa === 2 && (
        <div className="card glass-panel animate-slide-up" style={{ padding: 40, maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', margin: '0 auto 20px' }}>
            <i className="fa-solid fa-check-double"></i>
          </div>
          
          <h2 style={{ marginBottom: 10 }}>Lote Emitido com Sucesso</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 30 }}>
            Smart Contract registrado. O QR Code abaixo acompanha a carga. A merendeira deverá escaneá-lo no ato do recebimento.
          </p>

          <div style={{ background: '#fff', padding: 20, display: 'inline-block', borderRadius: 16, marginBottom: 20 }}>
            {/* Um placeholder visual para o QR Code */}
            <div style={{ width: 240, height: 240, background: `url('https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=merendacheck://lote/0x${Math.random().toString(16).slice(2)}&color=0f172a&bgcolor=ffffff')`, backgroundSize: 'cover', borderRadius: 8 }}></div>
          </div>

          <div style={{ background: 'var(--bg-surface-elevated)', padding: '12px 16px', borderRadius: 8, fontSize: '0.85rem', fontFamily: 'monospace', color: 'var(--text-main)', marginBottom: 30, wordBreak: 'break-all' }}>
            <strong style={{ color: 'var(--primary)' }}>Tx Hash:</strong> 0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b
          </div>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={() => window.print()}>
              <i className="fa-solid fa-print"></i> Imprimir Guia
            </button>
            <button className="btn" onClick={() => { setEtapa(1); setPlaca(''); setMotorista(''); }} style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)' }}>
              Emitir Novo Lote
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
