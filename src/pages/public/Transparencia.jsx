import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BgMesh from '../../components/ui/BgMesh';
import PublicFooter from '../../components/ui/PublicFooter';
import { supabase } from '../../lib/supabase';
import '../../styles/landing.css';

export default function Transparencia() {
  const [lotesRecentes, setLotesRecentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(null);
  const [contratosDb, setContratosDb] = useState([]);
  const [refeicoesDb, setRefeicoesDb] = useState([]);
  const [loadingModal, setLoadingModal] = useState(false);

  const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

  const handleOpenContratos = async () => {
    setShowModal('contratos');
    setLoadingModal(true);
    const { data } = await supabase
      .from('contratos')
      .select('*, fornecedores(nome, cnpj)')
      .eq('status', 'vigente');
    if (data) setContratosDb(data);
    setLoadingModal(false);
  };

  const handleOpenDesperdicio = async () => {
    setShowModal('desperdicio');
    setLoadingModal(true);
    // Buscar as refeições mais recentes para ter dados
    const { data } = await supabase
      .from('refeicoes')
      .select('*, escolas(nome)')
      .order('data_ref', { ascending: false })
      .limit(10);
    if (data) {
      // Agrupar por escola para calcular taxa
      const grouped = data.reduce((acc, curr) => {
        const escolaName = curr.escolas?.nome || 'Escola Desconhecida';
        if (!acc[escolaName]) acc[escolaName] = { refeicoes: 0, sobras: 0 };
        acc[escolaName].refeicoes += parseInt(curr.total_servidos || 0);
        acc[escolaName].sobras += parseFloat(curr.resto_kg || 0);
        return acc;
      }, {});

      const processed = Object.entries(grouped).map(([escola, val]) => {
        const pesoPorRefeicao = 0.4; // Ex: 400g por refeição
        const comidaServidaKg = val.refeicoes * pesoPorRefeicao;
        let taxaNum = 0;
        if (comidaServidaKg > 0) taxaNum = (val.sobras / comidaServidaKg) * 100;
        
        return {
          escola,
          refeicoes: val.refeicoes,
          sobras: val.sobras.toFixed(1) + ' kg',
          taxa: taxaNum.toFixed(1) + '%',
          status: taxaNum < 5 ? 'excelente' : taxaNum < 10 ? 'bom' : 'alerta'
        };
      });
      setRefeicoesDb(processed);
    }
    setLoadingModal(false);
  };

  useEffect(() => {
    async function fetchPublicData() {
      // Buscar últimos 5 lotes entregues para mostrar o hash criptográfico publicamente
      const { data, error } = await supabase
        .from('lotes_transporte')
        .select('id, tx_hash, criado_em, status, origem')
        .order('criado_em', { ascending: false })
        .limit(5);
        
      if (!error && data) {
        setLotesRecentes(data);
      }
      setLoading(false);
    }
    fetchPublicData();
  }, []);

  return (
    <>
      <BgMesh />
      <header className="landing-header animate-fade-in" style={{ borderBottom: '1px solid var(--border-subtle)', background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(12px)' }}>
        <Link to="/" className="landing-logo">
          <img src="/logo.png" alt="Merenda Check" className="logo-img" />
        </Link>
        <nav className="landing-nav">
          <Link to="/">Voltar para Home</Link>
        </nav>
        <Link to="/login" className="btn btn-primary" style={{ borderRadius: 50, padding: '10px 24px' }}>
          Acessar
        </Link>
      </header>
      
      <main style={{ paddingTop: 120, paddingBottom: 60, maxWidth: 1000, margin: '0 auto', minHeight: '80vh', paddingLeft: 20, paddingRight: 20 }}>
        <div className="glass-panel animate-slide-up" style={{ padding: '40px 30px' }}>
          <h1 style={{ fontSize: '2.2rem', marginBottom: 10, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <i className="fa-solid fa-magnifying-glass-chart" style={{ color: 'var(--primary)' }}></i>
            Portal de <span className="text-gradient">Transparência</span>
          </h1>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: 40, fontSize: '1.1rem' }}>
            Dados abertos da alimentação escolar municipal para controle social.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20, marginBottom: 40 }}>
            {/* Cardápio do Dia */}
            <div className="card glass-panel" style={{ padding: 24, gridColumn: '1 / -1', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--alert-green)', width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                  <i className="fa-solid fa-utensils"></i>
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.4rem' }}>Cardápio de Hoje</h3>
                  <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Refeições servidas na rede municipal</p>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
                <div style={{ background: 'var(--bg-surface)', padding: 16, borderRadius: 12, border: '1px solid var(--border-subtle)' }}>
                  <h4 style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--alert-yellow)' }}>
                    <i className="fa-solid fa-baby"></i> Educação Infantil (Creches)
                  </h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: '12px 0 0 0' }}>
                    <li style={{ padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)' }}>DESJEJUM (08:00)</span>
                      Mingau de Aveia com Maçã picada
                    </li>
                    <li style={{ padding: '8px 0' }}>
                      <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)' }}>ALMOÇO (11:30)</span>
                      Arroz, Feijão, Frango Desfiado e Cenoura
                    </li>
                  </ul>
                </div>
                <div style={{ background: 'var(--bg-surface)', padding: 16, borderRadius: 12, border: '1px solid var(--border-subtle)' }}>
                  <h4 style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--primary)' }}>
                    <i className="fa-solid fa-child-reaching"></i> Ensino Fundamental
                  </h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: '12px 0 0 0' }}>
                    <li style={{ padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)' }}>ALMOÇO (12:00)</span>
                      Macarronada com Carne Moída e Salada
                    </li>
                    <li style={{ padding: '8px 0' }}>
                      <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)' }}>LANCHE DA TARDE (15:00)</span>
                      Banana e Suco de Caju
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Totais */}
            <div className="card glass-panel" style={{ padding: 24, gridColumn: '1 / -1', display: 'flex', flexWrap: 'wrap', gap: 30, alignItems: 'center', background: 'rgba(15, 23, 42, 0.6)' }}>
              <div style={{ flex: 1, minWidth: 250 }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '1.4rem' }}>Resumo em Tempo Real</h3>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Acompanhe os números da alimentação escolar no município hoje.</p>
              </div>
              <div style={{ display: 'flex', gap: 40 }}>
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Refeições Hoje</div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--alert-green)' }}>12.450</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Investimento Mês</div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>R$ 1.8 Mi</div>
                </div>
              </div>
            </div>

            <div className="card glass-panel" style={{ padding: 24, textAlign: 'center' }}>
              <i className="fa-solid fa-file-contract" style={{ fontSize: '2.5rem', color: 'var(--alert-blue)', marginBottom: 16 }}></i>
              <h3 style={{ marginBottom: 10 }}>Contratos Abertos</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 16 }}>Visualize as atas de registro de preço e contratos com fornecedores do PNAE.</p>
              <button className="btn btn-secondary" style={{ width: '100%' }} onClick={handleOpenContratos}>Consultar</button>
            </div>
            <div className="card glass-panel" style={{ padding: 24, textAlign: 'center' }}>
              <i className="fa-solid fa-chart-pie" style={{ fontSize: '2.5rem', color: 'var(--alert-yellow)', marginBottom: 16 }}></i>
              <h3 style={{ marginBottom: 10 }}>Desperdício (Sobras)</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 16 }}>Estatísticas reais de resto-ingesta por unidade escolar em tempo real.</p>
              <button className="btn btn-secondary" style={{ width: '100%' }} onClick={handleOpenDesperdicio}>Ver Relatórios</button>
            </div>
            <div className="card glass-panel" style={{ padding: 24, textAlign: 'center', border: '1px solid var(--alert-green)' }}>
              <i className="fa-solid fa-shield-halved" style={{ fontSize: '2.5rem', color: 'var(--alert-green)', marginBottom: 16 }}></i>
              <h3 style={{ marginBottom: 10 }}>Rastreabilidade Real</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 16 }}>Lotes de alimentos entregues são rastreados com Hashes SHA-256 públicos.</p>
              <a href="#lotes-recentes" className="btn btn-primary" style={{ width: '100%', display: 'inline-block' }}>Ver Cadeia</a>
            </div>
          </div>
          
          <div id="lotes-recentes" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: 24 }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <i className="fa-solid fa-truck-fast" style={{ color: 'var(--primary)' }}></i>
              Últimas Entregas (Ledger Criptográfico)
            </h3>
            
            {loading ? (
              <div style={{ textAlign: 'center', padding: 20 }}><i className="fa-solid fa-circle-notch fa-spin"></i> Carregando ledgers públicos...</div>
            ) : lotesRecentes.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 20, color: 'var(--text-muted)' }}>Nenhum lote registrado recentemente.</div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="data-table" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <th style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>Data/Hora</th>
                      <th style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>Origem</th>
                      <th style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>Status</th>
                      <th style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>Assinatura SHA-256 (Hash Único)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lotesRecentes.map((lote) => (
                      <tr key={lote.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '12px 8px' }}>{new Date(lote.criado_em).toLocaleString('pt-BR')}</td>
                        <td style={{ padding: '12px 8px' }}>{lote.origem}</td>
                        <td style={{ padding: '12px 8px' }}>
                          <span className={`status-badge ${lote.status}`}>
                            {lote.status === 'entregue' ? 'Entregue' : 'Em Trânsito'}
                          </span>
                        </td>
                        <td style={{ padding: '12px 8px', fontFamily: 'monospace', color: 'var(--primary)' }}>
                          {lote.tx_hash ? lote.tx_hash.substring(0, 24) + '...' : 'Pendente'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 16, textAlign: 'center' }}>
              <i className="fa-solid fa-lock" style={{ marginRight: 6 }}></i>
              Os hashes acima garantem a imutabilidade dos dados nutricionais e financeiros referentes a cada entrega.
            </p>
          </div>
        </div>
      </main>

      {/* Modais */}
      {showModal === 'contratos' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="glass-panel animate-slide-up" style={{ background: 'var(--bg-surface)', width: '100%', maxWidth: 800, padding: 30, borderRadius: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 10, fontSize: '1.5rem' }}>
                <i className="fa-solid fa-file-contract" style={{ color: 'var(--alert-blue)' }}></i> Contratos PNAE Ativos
              </h2>
              <button onClick={() => setShowModal(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '2rem', cursor: 'pointer' }}>&times;</button>
            </div>
            <div style={{ overflowX: 'auto' }}>
              {loadingModal ? (
                <div style={{ textAlign: 'center', padding: 40 }}><i className="fa-solid fa-circle-notch fa-spin"></i> Consultando base de dados pública...</div>
              ) : contratosDb.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>Nenhum contrato ativo no momento.</div>
              ) : (
                <table className="data-table" style={{ width: '100%', textAlign: 'left', fontSize: '0.9rem', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <th style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>Empresa/Fornecedor</th>
                      <th style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>CNPJ</th>
                      <th style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>Objeto</th>
                      <th style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>Valor Contratado</th>
                      <th style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>Vigência</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contratosDb.map((c) => (
                      <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '12px 8px' }}>{c.fornecedores?.nome || 'Fornecedor Desconhecido'}</td>
                        <td style={{ padding: '12px 8px' }}>{c.fornecedores?.cnpj || 'N/A'}</td>
                        <td style={{ padding: '12px 8px' }}>{c.objeto}</td>
                        <td style={{ padding: '12px 8px', fontWeight: 'bold' }}>{formatCurrency(c.valor_total)}</td>
                        <td style={{ padding: '12px 8px' }}>Até {new Date(c.data_fim).toLocaleDateString('pt-BR')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {showModal === 'desperdicio' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="glass-panel animate-slide-up" style={{ background: 'var(--bg-surface)', width: '100%', maxWidth: 700, padding: 30, borderRadius: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 10, fontSize: '1.5rem' }}>
                <i className="fa-solid fa-chart-pie" style={{ color: 'var(--alert-yellow)' }}></i> Relatório de Desperdício Recente
              </h2>
              <button onClick={() => setShowModal(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '2rem', cursor: 'pointer' }}>&times;</button>
            </div>
            
            {loadingModal ? (
              <div style={{ textAlign: 'center', padding: 40 }}><i className="fa-solid fa-circle-notch fa-spin"></i> Consolidando dados de resto-ingesta...</div>
            ) : refeicoesDb.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>Nenhum dado de refeição consolidado recentemente.</div>
            ) : (
              <>
                <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>O cálculo de Resto-Ingesta é baseado nos apontamentos reais de consumo das escolas. (Meta PNAE: &lt; 10%)</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxHeight: '60vh', overflowY: 'auto', paddingRight: 8 }}>
                  {refeicoesDb.map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: 12, border: '1px solid var(--border-subtle)' }}>
                      <div>
                        <h4 style={{ margin: '0 0 4px 0', fontSize: '1.1rem' }}>{item.escola}</h4>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{item.refeicoes} refeições servidas</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: item.status === 'excelente' ? 'var(--alert-green)' : item.status === 'alerta' ? 'var(--alert-red)' : 'var(--alert-yellow)' }}>
                          {item.taxa}
                        </div>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{item.sobras} sobras limpas</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <PublicFooter />
    </>
  );
}
