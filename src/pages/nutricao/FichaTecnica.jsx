import DashboardLayout from '../../components/layout/DashboardLayout';

export default function FichaTecnica() {
  const ingredientes = [
    { nome: 'Arroz Agulhinha', qtde: '40g', custo: 'R$ 0,22' },
    { nome: 'Feijão Carioca', qtde: '20g', custo: 'R$ 0,18' },
    { nome: 'Carne Bovina (Patinho)', qtde: '50g', custo: 'R$ 1,45' },
    { nome: 'Polpa de Tomate', qtde: '10g', custo: 'R$ 0,08' },
    { nome: 'Cebola Branca', qtde: '5g', custo: 'R$ 0,02' }
  ];

  return (
    <DashboardLayout>
      <div className="header-dash animate-fade-in">
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <i className="fa-solid fa-clipboard-list" style={{ color: 'var(--primary)' }}></i>
            Fichas Técnicas de Preparo
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
            A base da rastreabilidade. Defina a capitação exata (gramatura por aluno) de cada receita.
          </p>
        </div>
        <div>
          <button className="btn btn-primary"><i className="fa-solid fa-plus"></i> Nova Receita</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: 24 }}>
        {/* Lista de Receitas */}
        <div className="glass-panel animate-slide-up" style={{ padding: 20 }}>
          <div className="search-bar" style={{ marginBottom: 16 }}>
            <i className="fa-solid fa-search"></i>
            <input type="text" placeholder="Buscar receita..." />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ padding: 16, background: 'var(--primary)', color: '#fff', borderRadius: 8, cursor: 'pointer' }}>
              <strong>Picadinho de Carne</strong>
              <div style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: 4 }}>Almoço Escolar · 125g/porção</div>
            </div>
            <div style={{ padding: 16, background: 'var(--bg-surface-elevated)', borderRadius: 8, cursor: 'pointer', border: '1px solid var(--border-subtle)' }}>
              <strong style={{ color: 'var(--text-main)' }}>Frango com Legumes</strong>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>Almoço Escolar · 140g/porção</div>
            </div>
            <div style={{ padding: 16, background: 'var(--bg-surface-elevated)', borderRadius: 8, cursor: 'pointer', border: '1px solid var(--border-subtle)' }}>
              <strong style={{ color: 'var(--text-main)' }}>Sopa de Macarrão</strong>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>Creches · 200ml/porção</div>
            </div>
          </div>
        </div>

        {/* Detalhes da Ficha */}
        <div className="glass-panel animate-slide-up delay-100" style={{ padding: 30 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid var(--border-subtle)' }}>
            <div>
              <h2 style={{ fontFamily: 'Outfit', margin: 0, color: 'var(--text-main)' }}>Picadinho de Carne</h2>
              <div style={{ display: 'flex', gap: 16, marginTop: 8, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <span><i className="fa-solid fa-scale-balanced" style={{ marginRight: 6 }}></i> Rende 1 Porção (125g)</span>
                <span><i className="fa-solid fa-sack-dollar" style={{ marginRight: 6 }}></i> R$ 1,95 / Prato</span>
              </div>
            </div>
            <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}><i className="fa-solid fa-pen"></i> Editar Ficha</button>
          </div>

          <h4 style={{ marginBottom: 16, color: 'var(--text-main)' }}>Ingredientes da Capitação per Capita</h4>
          <table className="data-table" style={{ width: '100%', marginBottom: 30 }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--border-subtle)' }}>
                <th style={{ padding: '12px 8px' }}>Insumo Base</th>
                <th style={{ padding: '12px 8px' }}>Qtde Bruta (g)</th>
                <th style={{ padding: '12px 8px' }}>Custo Estimado</th>
              </tr>
            </thead>
            <tbody>
              {ingredientes.map((ing, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '12px 8px', color: 'var(--text-main)' }}>{ing.nome}</td>
                  <td style={{ padding: '12px 8px', color: 'var(--primary)', fontWeight: 700 }}>{ing.qtde}</td>
                  <td style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>{ing.custo}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ padding: 16, background: 'rgba(16, 185, 129, 0.05)', borderRadius: 12, border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <h4 style={{ margin: '0 0 8px 0', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <i className="fa-solid fa-microchip"></i> IA de Preditividade Ativada
            </h4>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Esta ficha está acoplada ao sistema base do Município. Se a catraca da 'CEI Pequeninos' ler 100 acessos, o sistema exigirá a baixa exata de <strong>5kg de Carne Bovina</strong> do estoque. Qualquer divergência alertará o Auditor Municipal.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
