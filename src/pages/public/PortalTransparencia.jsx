import { Link } from 'react-router-dom';

export default function PortalTransparencia() {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a', fontFamily: 'Inter, sans-serif' }}>
      {/* Cabeçalho Público - Light Mode Clássico */}
      <header style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ background: '#0f172a', color: '#fff', width: 40, height: 40, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.2rem' }}>
            M
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>Portal da Transparência</h1>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Merenda Escolar Municipal</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/ouvidoria" style={{ padding: '8px 16px', background: '#f1f5f9', color: '#334155', textDecoration: 'none', borderRadius: 6, fontSize: '0.9rem', fontWeight: 600 }}>
            Fazer Ouvidoria
          </Link>
          <Link to="/login" style={{ padding: '8px 16px', background: '#059669', color: '#fff', textDecoration: 'none', borderRadius: 6, fontSize: '0.9rem', fontWeight: 600 }}>
            Acesso Restrito
          </Link>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main style={{ maxWidth: 1000, margin: '40px auto', padding: '0 24px' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: 8 }}>Cardápio do Dia</h2>
        <p style={{ color: '#64748b', fontSize: '1.1rem', marginBottom: 30 }}>Consulte o que está sendo servido nas escolas hoje.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          {/* Cardápio Creche */}
          <div style={{ background: '#fff', padding: 24, borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ background: '#fef3c7', color: '#d97706', width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                <i className="fa-solid fa-baby"></i>
              </div>
              <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Educação Infantil (Creches)</h3>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                <strong style={{ display: 'block', fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase' }}>Desjejum (08:00)</strong>
                Mingau de Aveia com Maçã picada
              </li>
              <li style={{ padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                <strong style={{ display: 'block', fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase' }}>Almoço (11:30)</strong>
                Arroz, Feijão, Frango Desfiado e Cenoura
              </li>
            </ul>
          </div>

          {/* Cardápio Fundamental */}
          <div style={{ background: '#fff', padding: 24, borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ background: '#e0e7ff', color: '#4f46e5', width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                <i className="fa-solid fa-child-reaching"></i>
              </div>
              <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Ensino Fundamental</h3>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                <strong style={{ display: 'block', fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase' }}>Almoço (12:00)</strong>
                Macarronada com Carne Moída (Bolonhesa) e Salada de Alface
              </li>
              <li style={{ padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                <strong style={{ display: 'block', fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase' }}>Lanche da Tarde (15:00)</strong>
                Banana e Suco de Caju
              </li>
            </ul>
          </div>
        </div>

        {/* Totais do Município */}
        <div style={{ marginTop: 40, background: '#1e293b', color: '#fff', padding: 30, borderRadius: 16, display: 'flex', flexWrap: 'wrap', gap: 40, alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: 250 }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.4rem' }}>Transparência em Tempos Reais</h3>
            <p style={{ margin: 0, color: '#94a3b8', lineHeight: 1.6 }}>Nossa merenda é rastreável. Acompanhe os investimentos feitos pelas esferas Municipais e FNDE na alimentação escolar hoje.</p>
          </div>
          <div style={{ display: 'flex', gap: 30 }}>
            <div>
              <div style={{ fontSize: '0.9rem', color: '#94a3b8', textTransform: 'uppercase' }}>Refeições Hoje</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981' }}>12.450</div>
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', color: '#94a3b8', textTransform: 'uppercase' }}>Investimento Mês</div>
              <div style={{ fontSize: '2rem', fontWeight: 800 }}>R$ 1.8 Mi</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
