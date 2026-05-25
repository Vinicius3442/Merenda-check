import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BgMesh from '../../components/ui/BgMesh';
import PublicFooter from '../../components/ui/PublicFooter';
import { supabase } from '../../lib/supabase';
import '../../styles/landing.css';

export default function Transparencia() {
  const [lotesRecentes, setLotesRecentes] = useState([]);
  const [loading, setLoading] = useState(true);

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
            <div className="card glass-panel" style={{ padding: 24, textAlign: 'center' }}>
              <i className="fa-solid fa-file-contract" style={{ fontSize: '2.5rem', color: 'var(--alert-blue)', marginBottom: 16 }}></i>
              <h3 style={{ marginBottom: 10 }}>Contratos Abertos</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 16 }}>Visualize as atas de registro de preço e contratos com fornecedores do PNAE.</p>
              <button className="btn btn-secondary" style={{ width: '100%' }}>Consultar</button>
            </div>
            <div className="card glass-panel" style={{ padding: 24, textAlign: 'center' }}>
              <i className="fa-solid fa-chart-pie" style={{ fontSize: '2.5rem', color: 'var(--alert-yellow)', marginBottom: 16 }}></i>
              <h3 style={{ marginBottom: 10 }}>Desperdício (Sobras)</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 16 }}>Estatísticas reais de resto-ingesta por unidade escolar em tempo real.</p>
              <button className="btn btn-secondary" style={{ width: '100%' }}>Ver Relatórios</button>
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
      <PublicFooter />
    </>
  );
}
