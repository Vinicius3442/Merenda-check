import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function PredictiveChart({ labels, real, predito }) {
  const data = {
    labels,
    datasets: [
      {
        label: 'Refeições Reais',
        data: real,
        borderColor: '#25d371',
        backgroundColor: 'rgba(37, 211, 113, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointBackgroundColor: '#25d371',
      },
      {
        label: 'Predição IA',
        data: predito,
        borderColor: '#60a5fa',
        backgroundColor: 'rgba(96, 165, 250, 0.05)',
        fill: true,
        tension: 0.4,
        borderDash: [8, 4],
        pointRadius: 4,
        pointBackgroundColor: '#60a5fa',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#94a3b8', font: { family: 'Poppins' } } },
      tooltip: {
        backgroundColor: '#1e293b', titleColor: '#f8fafc', bodyColor: '#94a3b8',
        borderColor: '#475569', borderWidth: 1, cornerRadius: 12, padding: 14,
      },
    },
    scales: {
      x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(71,85,105,0.3)' } },
      y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(71,85,105,0.3)' } },
    },
  };

  return (
    <div style={{ height: 350, padding: 20 }}>
      <Line data={data} options={options} />
    </div>
  );
}
