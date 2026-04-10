import { useState } from 'react';
import { Link } from 'react-router-dom';
import BgMesh from '../../components/ui/BgMesh';
import Footer from '../../components/ui/Footer';
import { useMockSubmit } from '../../hooks/useMockSubmit';
import { mockEstoque } from '../../data/mockData';

export default function BaixaInsumo() {
  const [selectedId, setSelectedId] = useState(null);
  const { loading, mockSubmit } = useMockSubmit();
  const selected = mockEstoque.find((i) => i.id === selectedId);

  return (
    <>
      <BgMesh />
      <div className="app-container">
        <main className="app-main" style={{ paddingTop: 60 }}>
          <div className="wizard-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
              <Link to="/operador" className="btn btn-secondary"><i className="fa-solid fa-arrow-left"></i> Voltar</Link>
              <img src="/logo.png" alt="Merenda Check" className="logo-img" />
            </div>

            <div className="header-dash animate-fade-in">
              <div>
                <h1>Retirar para Cozinha</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Lista restrita por data de validade (Sistema FIFO ativo).</p>
              </div>
            </div>

            <div className="glass-panel animate-slide-up" style={{ padding: 40 }}>
              <div className="search-mock">
                <i className="fa-solid fa-magnifying-glass"></i>
                <input type="text" className="form-control" placeholder="Procurar Insumo (Ex: Carne, Arroz...)" />
              </div>

              <div className="inventory-list">
                {mockEstoque.filter((i) => i.status !== 'arquivado').map((item) => (
                  <div
                    key={item.id}
                    className={`inv-item ${selectedId === item.id ? 'selected' : ''} ${!item.eligible ? 'locked' : ''}`}
                    onClick={() => item.eligible && setSelectedId(item.id)}
                  >
                    <div>
                      <h4 style={{ fontSize: '1.1rem', marginBottom: 4 }}>{item.nome} - Lote {item.lote}</h4>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        <i className="fa-solid fa-cube" style={{ marginRight: 4 }}></i> Disponível: {item.volume}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className={`badge ${item.status === 'urgente' ? 'badge-warning' : 'badge-neutral'}`} style={{ marginBottom: 4 }}>
                        {item.status === 'urgente' && <i className="fa-solid fa-hourglass-end"></i>}
                        {item.validade}
                      </span>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: item.eligible ? 'var(--primary)' : 'var(--alert-red)' }}>
                        <i className={`fa-solid ${item.eligible ? 'fa-unlock' : 'fa-lock'}`}></i>{' '}
                        {item.eligible ? 'Elegível' : 'Retido pelo FIFO'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {selected && (
                <div className="baixa-area active">
                  <h3 className="brand-font" style={{ marginBottom: 20 }}>
                    <i className="fa-solid fa-fire-burner" style={{ color: 'var(--primary)', marginRight: 10 }}></i> Ordem de Envio
                  </h3>
                  <div className="form-group">
                    <label className="form-label">Insumo Selecionado</label>
                    <input type="text" className="form-control" value={`${selected.nome} (${selected.lote})`} readOnly />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Quantidade para Despacho (kg)</label>
                    <input type="number" className="form-control" placeholder="Inserir valor em kg..." max={selected.maxValue} />
                  </div>
                  <div style={{ marginTop: 30, textAlign: 'right' }}>
                    <button
                      className="btn btn-primary btn-lg"
                      onClick={() => mockSubmit({ successTitle: 'Despacho Validado', successMsg: 'Saída registrada. Estoque atualizado com sucesso.' })}
                      disabled={loading}
                    >
                      {loading ? <><i className="fa-solid fa-circle-notch fa-spin"></i> Processando...</> : <><i className="fa-solid fa-check"></i> Autorizar Remoção</>}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <Footer />
        </main>
      </div>
    </>
  );
}
