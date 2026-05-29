import { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useLotesTransporte } from '../../hooks/useLotesTransporte';
import { useFornecedores } from '../../hooks/useFornecedores';
import { useEscolas } from '../../hooks/useEscolas';
import { useToast } from '../../contexts/ToastContext';

export default function EmitirLote() {
  const { emitirLote } = useLotesTransporte();
  const { fornecedores } = useFornecedores();
  const { escolas } = useEscolas();
  const { showToast } = useToast();

  const [etapa, setEtapa] = useState(1);
  const [fornecedorId, setFornecedorId] = useState('');
  const [notaFiscal, setNotaFiscal] = useState('');
  const [placa, setPlaca] = useState('');
  const [motorista, setMotorista] = useState('');
  const [destinoEscola, setDestinoEscola] = useState('');
  const [gerando, setGerando] = useState(false);
  const [loteEmitido, setLoteEmitido] = useState(null);

  const [items, setItems] = useState([
    { id: 1, descricao: 'Arroz Agulhinha Tipo 1', qtd: 50, unidade: 'kg', validade: '2026-12-01' },
    { id: 2, descricao: 'Feijão Carioca',          qtd: 30, unidade: 'kg', validade: '2026-10-15' },
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!placa || !motorista) {
      showToast('Campos Obrigatórios', 'Preencha a placa e o nome do motorista.', 'error');
      return;
    }

    setGerando(true);
    const res = await emitirLote({
      fornecedor_id: fornecedorId || null,
      nota_fiscal: notaFiscal || null,
      placa,
      motorista,
      origem: 'Centro de Distribuição Central',
      destino_escola: destinoEscola || null,
      itens: items,
    });
    setGerando(false);

    if (res.ok) {
      setLoteEmitido(res);
      setEtapa(2);
    } else {
      showToast('Erro ao Emitir Lote', res.error || 'Não foi possível registrar o lote.', 'error');
    }
  };

  const handleDownloadQR = async () => {
    try {
      showToast('Gerando Imagem', 'Preparando o QR Code do romaneio para download...', 'success');
      const url = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(loteEmitido.qrData || loteEmitido.txHash)}&color=0f172a&bgcolor=ffffff`;
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `romaneio-${loteEmitido.txHash.substring(0, 8)}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (e) {
      showToast('Erro no Download', 'Não foi possível baixar o QR Code.', 'error');
    }
  };

  return (
    <DashboardLayout>
      <header className="page-header">
        <div>
          <h1 className="page-title">Emitir Lote de Transporte</h1>
          <p className="page-subtitle">Gere o QR Code com Assinatura Criptográfica para rastreabilidade</p>
        </div>
      </header>

      {etapa === 1 && (
        <div className="card glass-panel" style={{ padding: 30, maxWidth: 800, margin: '0 auto' }}>
          <form onSubmit={handleSubmit}>
            <h3 style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: 10, marginBottom: 20 }}>
              Dados do Veículo e Origem
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 20 }}>
              <div className="form-group">
                <label className="form-label">Fornecedor / Armazém Origem</label>
                <select className="form-control" value={fornecedorId} onChange={e => setFornecedorId(e.target.value)}>
                  <option value="">Selecione...</option>
                  {fornecedores.map((f) => (
                    <option key={f.id} value={f.id}>{f.nome}</option>
                  ))}
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
              <div className="form-group">
                <label className="form-label">Escola Destinatária</label>
                <select className="form-control" value={destinoEscola} onChange={e => setDestinoEscola(e.target.value)}>
                  <option value="">Selecione a escola...</option>
                  {escolas.map((e) => (
                    <option key={e.id} value={e.id}>{e.nome}</option>
                  ))}
                </select>
              </div>
            </div>

            <h3 style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: 10, marginBottom: 20, display: 'flex', justifyContent: 'space-between' }}>
              Itens do Lote
              <button
                type="button"
                style={{ fontSize: '0.8rem', background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)', padding: '4px 10px', borderRadius: 4, cursor: 'pointer' }}
                onClick={() => setItems(prev => [...prev, { id: Date.now(), descricao: '', qtd: 0, unidade: 'kg', validade: '' }])}
              >
                <i className="fa-solid fa-plus"></i> Adicionar Item
              </button>
            </h3>

            <div style={{ background: 'var(--bg-surface-elevated)', borderRadius: 8, padding: 10, marginBottom: 30 }}>
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ color: 'var(--text-muted)' }}>
                    <th style={{ padding: 10, width: '40%' }}>Descrição</th>
                    <th style={{ padding: 10, width: '15%' }}>Qtd</th>
                    <th style={{ padding: 10, width: '15%' }}>Unid.</th>
                    <th style={{ padding: 10, width: '25%' }}>Validade</th>
                    <th style={{ padding: 10, width: '5%' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(item => (
                    <tr key={item.id} style={{ borderTop: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: 10 }}>
                        <input type="text" className="form-control" value={item.descricao} onChange={e => setItems(prev => prev.map(i => i.id === item.id ? { ...i, descricao: e.target.value } : i))} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', width: '100%', minWidth: '150px' }} placeholder="Ex: Arroz Agulhinha" />
                      </td>
                      <td style={{ padding: 10 }}>
                        <input type="number" className="form-control" value={item.qtd} onChange={e => setItems(prev => prev.map(i => i.id === item.id ? { ...i, qtd: e.target.value } : i))} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', width: '100%', minWidth: '80px', textAlign: 'center' }} />
                      </td>
                      <td style={{ padding: 10 }}>
                        <select className="form-control" value={item.unidade} onChange={e => setItems(prev => prev.map(i => i.id === item.id ? { ...i, unidade: e.target.value } : i))} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', width: '100%', minWidth: '90px' }}>
                          <option value="kg" style={{ color: '#000' }}>kg</option>
                          <option value="unidade" style={{ color: '#000' }}>unid</option>
                        </select>
                      </td>
                      <td style={{ padding: 10 }}>
                        <input type="date" className="form-control" value={item.validade} onChange={e => setItems(prev => prev.map(i => i.id === item.id ? { ...i, validade: e.target.value } : i))} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'var(--alert-yellow)', width: '100%', minWidth: '140px' }} />
                      </td>
                      <td style={{ padding: 10, textAlign: 'center' }}>
                         <button type="button" onClick={() => setItems(prev => prev.filter(i => i.id !== item.id))} style={{ background: 'transparent', border: 'none', color: 'var(--alert-red)', cursor: 'pointer', fontSize: '1.2rem' }}>
                           <i className="fa-solid fa-trash"></i>
                         </button>
                      </td>
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
                <><i className="fa-solid fa-circle-notch fa-spin"></i> Gerando Hash SHA-256...</>
              ) : (
                <><i className="fa-solid fa-link"></i> Assinar Lote Criptograficamente</>
              )}
            </button>
          </form>
        </div>
      )}

      {etapa === 2 && loteEmitido && (
        <div className="card glass-panel animate-slide-up" style={{ padding: 40, maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', margin: '0 auto 20px' }}>
            <i className="fa-solid fa-check-double"></i>
          </div>

          <h2 style={{ marginBottom: 10 }}>Lote Emitido com Sucesso</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 30 }}>
            Hash Criptográfico registrado. O QR Code abaixo acompanha a carga. A merendeira deverá escaneá-lo no ato do recebimento.
          </p>

          <div style={{ background: '#fff', padding: 20, display: 'inline-block', borderRadius: 16, marginBottom: 20 }}>
            <div style={{
              width: 240, height: 240,
              background: `url('https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(loteEmitido.qrData || loteEmitido.txHash)}&color=0f172a&bgcolor=ffffff')`,
              backgroundSize: 'cover', borderRadius: 8
            }}></div>
          </div>

          <div style={{ background: 'var(--bg-surface-elevated)', padding: '12px 16px', borderRadius: 8, fontSize: '0.82rem', fontFamily: 'monospace', color: 'var(--text-main)', marginBottom: 30, wordBreak: 'break-all' }}>
            <strong style={{ color: 'var(--primary)' }}>Tx Hash:</strong> {loteEmitido.txHash}
          </div>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={handleDownloadQR}>
              <i className="fa-solid fa-download"></i> Baixar Romaneio (QR Code)
            </button>
            <button className="btn" onClick={() => { setEtapa(1); setPlaca(''); setMotorista(''); setLoteEmitido(null); }} style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)' }}>
              Emitir Novo Lote
            </button>
            <Link to="/transportadora" className="btn btn-secondary" style={{ background: 'transparent', border: '1px solid var(--text-muted)' }}>
              <i className="fa-solid fa-clock-rotate-left"></i> Histórico de Lotes
            </Link>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
