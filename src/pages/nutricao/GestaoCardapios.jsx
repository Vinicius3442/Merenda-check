import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';

export default function GestaoCardapios() {
  const [selectedDay, setSelectedDay] = useState('seg');
  
  const diasSemana = [
    { id: 'seg', label: 'Segunda-feira' },
    { id: 'ter', label: 'Terça-feira' },
    { id: 'qua', label: 'Quarta-feira' },
    { id: 'qui', label: 'Quinta-feira' },
    { id: 'sex', label: 'Sexta-feira' }
  ];

  const refeicoes = [
    { tipo: 'Desjejum', prato: 'Pão com manteiga e Leite com Cacau', calorias: 350 },
    { tipo: 'Almoço', prato: 'Arroz, Feijão, Iscas de Frango e Salada de Repolho', calorias: 680 },
    { tipo: 'Lanche da Tarde', prato: 'Fruta da Estação (Banana)', calorias: 120 }
  ];

  return (
    <DashboardLayout>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <div className="header-dash animate-fade-in">
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <i className="fa-solid fa-calendar-days" style={{ color: 'var(--primary)' }}></i>
            Gestão de Cardápios
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
            Planejamento semanal de refeições por dia letivo. Afeta diretamente as projeções de estoque.
          </p>
        </div>
        <div>
          <button className="btn btn-primary"><i className="fa-solid fa-plus"></i> Novo Cardápio</button>
        </div>
      </div>

      <div className="glass-panel animate-slide-up" style={{ padding: 24, marginBottom: 30 }}>
        <h3 style={{ fontFamily: 'Outfit', marginBottom: 16 }}>Semana Vigente (15 a 19 Abr)</h3>
        
        {/* Day selector tabs */}
        <div style={{ display: 'flex', gap: 10, borderBottom: '1px solid var(--border-subtle)', paddingBottom: 16, marginBottom: 24, overflowX: 'auto' }}>
          {diasSemana.map(dia => (
            <button
              key={dia.id}
              onClick={() => setSelectedDay(dia.id)}
              style={{
                padding: '10px 20px',
                borderRadius: '8px 8px 0 0',
                background: selectedDay === dia.id ? 'var(--primary)' : 'transparent',
                color: selectedDay === dia.id ? '#fff' : 'var(--text-muted)',
                border: 'none',
                borderBottom: selectedDay === dia.id ? '3px solid #064e3b' : '3px solid transparent',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {dia.label}
            </button>
          ))}
        </div>

        <div className="animate-fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h4 style={{ color: 'var(--text-main)' }}>Refeições Planejadas</h4>
            <span className="badge badge-success">Aprovado pelo FNDE</span>
          </div>

          <div style={{ display: 'grid', gap: 16 }}>
            {refeicoes.map((ref, i) => (
              <div key={i} style={{ 
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
                padding: 16, background: 'var(--bg-surface-elevated)', borderRadius: 12, border: '1px solid var(--border-subtle)' 
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(16, 185, 129, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="fa-solid fa-bell-concierge"></i>
                  </div>
                  <div>
                    <h5 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>{ref.tipo}</h5>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: '1.05rem' }}>{ref.prato}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}><i className="fa-solid fa-fire" style={{ color: 'var(--alert-yellow)' }}></i> {ref.calorias} kcal</span>
                  <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}><i className="fa-solid fa-pen"></i></button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 24, textAlign: 'right' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginRight: 16 }}>Total Diário: <strong>1150 kcal</strong> per capita</span>
          </div>
        </div>
      </div>
      </div>
    </DashboardLayout>
  );
}
