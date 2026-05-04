import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function PredictiveChart({ labels, real, predito }) {
  // Calcula desvio para alertas contextuais
  const media = real.reduce((a, b) => a + b, 0) / real.length;
  const ultimo = real[real.length - 1];
  const desvio = (((ultimo - media) / media) * 100).toFixed(1);
  const acima = parseFloat(desvio) > 5;
  const abaixo = parseFloat(desvio) < -5;

  const data = {
    labels,
    datasets: [
      {
        label: 'Refeições Reais',
        data: real,
        backgroundColor: 'rgba(16, 185, 129, 0.75)',
        borderColor: '#10B981',
        borderWidth: 1.5,
        borderRadius: 4,
        borderSkipped: false,
      },
      {
        label: 'Predição IA',
        data: predito,
        backgroundColor: 'rgba(96, 165, 250, 0.45)',
        borderColor: '#60a5fa',
        borderWidth: 1.5,
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#CBD5E1',
          font: { family: 'Inter', size: 13, weight: '600' },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'rectRounded',
        },
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#F1F5F9',
        bodyColor: '#CBD5E1',
        borderColor: '#334155',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 14,
        callbacks: {
          label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y} refeições`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: '#CBD5E1', font: { size: 12, weight: '600' } },
        grid: { color: 'rgba(71,85,105,0.2)' },
      },
      y: {
        ticks: { color: '#CBD5E1', font: { size: 12 } },
        grid: { color: 'rgba(71,85,105,0.2)' },
        // Eixo começa perto dos dados, não em zero, para visualizar variação
        suggestedMin: Math.min(...real, ...predito) - 30,
        suggestedMax: Math.max(...real, ...predito) + 30,
      },
    },
  };

  return (
    <div>
      {/* Alerta contextual — dados com contexto */}
      {(acima || abaixo) && (
        <div style={{
          margin: '0 24px 4px',
          padding: '10px 16px',
          borderRadius: 6,
          background: acima ? 'rgba(244,63,94,0.08)' : 'rgba(251,191,36,0.08)',
          border: `1px solid ${acima ? 'rgba(244,63,94,0.3)' : 'rgba(251,191,36,0.3)'}`,
          color: acima ? 'var(--alert-red)' : 'var(--alert-yellow)',
          fontSize: '0.85rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <i className={`fa-solid ${acima ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down'}`}></i>
          Sexta-feira: {Math.abs(parseFloat(desvio))}% {acima ? 'acima' : 'abaixo'} da média semanal —&nbsp;
          {acima
            ? 'Verifique possível subdeclaração de sobra.'
            : 'Possível queda de frequência. Confira presença.'}
        </div>
      )}

      {/* Gráfico de barras */}
      <div style={{ height: 320, padding: '16px 20px 20px' }}>
        <Bar data={data} options={options} />
      </div>

      {/* Linha de contexto abaixo do gráfico */}
      <div style={{
        display: 'flex', gap: 24, padding: '14px 24px',
        borderTop: '1px solid var(--border-subtle)',
        fontSize: '0.82rem', color: 'var(--text-muted)', flexWrap: 'wrap',
      }}>
        <span>
          <i className="fa-solid fa-chart-bar" style={{ marginRight: 5, color: 'var(--primary)' }}></i>
          Média semanal: <strong style={{ color: 'var(--text-main)' }}>{Math.round(media)} ref.</strong>
        </span>
        <span>
          <i className="fa-solid fa-brain" style={{ marginRight: 5, color: 'var(--alert-blue)' }}></i>
          Modelo calibrado por frequência (catraca) e cardápio.
        </span>
        <span style={{ marginLeft: 'auto' }}>
          Dados discretos por dia · Sem interpolação
        </span>
      </div>
    </div>
  );
}
