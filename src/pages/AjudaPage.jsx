import { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';

const FAQ = [
  {
    categoria: 'Geral',
    icon: 'fa-circle-info',
    cor: 'var(--alert-blue)',
    perguntas: [
      {
        q: 'O que é o Merenda Check?',
        a: 'O Merenda Check é uma plataforma GovTech para rastreabilidade de insumos da merenda escolar, garantindo transparência, segurança alimentar e conformidade com o PNAE (Programa Nacional de Alimentação Escolar).',
      },
      {
        q: 'Quem pode acessar o sistema?',
        a: 'O acesso é restrito a usuários credenciados: Operadores de escola, Gestores, Auditores Municipais, Nutricionistas, Compradores Públicos, Transportadoras e Administradores de TI.',
      },
      {
        q: 'O sistema funciona offline?',
        a: 'Algumas funcionalidades de leitura funcionam offline temporariamente. O registro de lotes e assinatura SHA-256 requerem conexão com a internet.',
      },
    ],
  },
  {
    categoria: 'Transportadora',
    icon: 'fa-truck-fast',
    cor: 'var(--primary)',
    perguntas: [
      {
        q: 'Como emito um lote com rastreabilidade?',
        a: 'Acesse "Emitir Lote Criptografado" no menu lateral. Preencha os dados do veículo, motorista, fornecedor e itens do lote. O sistema gera automaticamente um QR Code e assina a transação com hash SHA-256.',
      },
      {
        q: 'O que fazer se o QR Code não for lido na escola?',
        a: 'Verifique se o PDF foi impresso com qualidade suficiente. Em caso de falha na leitura, o operador da escola pode inserir o número de hash do lote manualmente na tela de Recebimento.',
      },
      {
        q: 'Posso cancelar um lote emitido?',
        a: 'Lotes assinados são imutáveis por segurança criptográfica. Em caso de erro, abra um chamado pelo Ouvidoria ou contate o Administrador para registrar uma nota de correção.',
      },
    ],
  },
  {
    categoria: 'Operador de Escola',
    icon: 'fa-school',
    cor: 'var(--alert-yellow)',
    perguntas: [
      {
        q: 'Como registro o recebimento de insumos?',
        a: 'Acesse "Receber Insumo", escaneie o QR Code da guia da transportadora ou insira o hash manualmente. Confira os itens e confirme o recebimento. O registro é assinado digitalmente.',
      },
      {
        q: 'O que é Resto-Ingesta?',
        a: 'Resto-Ingesta é o controle de sobras limpas após a refeição. Registre o peso em kg das sobras logo após o término da refeição para garantir conformidade com as metas do PNAE.',
      },
    ],
  },
  {
    categoria: 'Auditor',
    icon: 'fa-satellite-dish',
    cor: 'var(--alert-red)',
    perguntas: [
      {
        q: 'Como investigo um alerta de desvio?',
        a: 'Na seção "Investigação de Lote", insira o hash ou número do lote suspeito. O sistema mostrará toda a cadeia de custódia — da emissão até a entrega — com timestamps e assinaturas digitais.',
      },
      {
        q: 'O que significa o indicador de saúde da escola?',
        a: 'Verde (≥90%): conformidade plena. Amarelo (70–89%): atenção, algum registro pendente. Vermelho (<70%): inconformidade detectada que requer investigação imediata.',
      },
    ],
  },
];

const CONTATOS = [
  { icon: 'fa-headset',     label: 'Suporte Técnico',      valor: '0800 123 4567',            sub: 'Seg a Sex, 08h–18h' },
  { icon: 'fa-envelope',    label: 'E-mail',                valor: 'suporte@merendacheck.gov', sub: 'Resposta em até 24h' },
  { icon: 'fa-bullhorn',    label: 'Ouvidoria',             valor: '/ouvidoria',               sub: 'Denúncias e sugestões', link: '/ouvidoria' },
  { icon: 'fa-file-circle-question', label: 'Manual do Usuário', valor: 'manual-merenda.pdf', sub: 'Versão 3.2 — Mai/2026' },
];

export default function AjudaPage() {
  const [aberto, setAberto] = useState(null);
  const [busca, setBusca] = useState('');

  const toggle = (key) => setAberto(aberto === key ? null : key);

  const faqFiltrado = FAQ.map((cat) => ({
    ...cat,
    perguntas: cat.perguntas.filter(
      (p) =>
        busca === '' ||
        p.q.toLowerCase().includes(busca.toLowerCase()) ||
        p.a.toLowerCase().includes(busca.toLowerCase())
    ),
  })).filter((cat) => cat.perguntas.length > 0);

  return (
    <DashboardLayout>
      {/* Header */}
      <header className="page-header" style={{ marginBottom: 40 }}>
        <div>
          <h1 className="page-title">
            <i className="fa-solid fa-circle-question" style={{ color: 'var(--primary)', marginRight: 12 }}></i>
            Central de Ajuda
          </h1>
          <p className="page-subtitle">
            Encontre respostas, tutoriais e canais de suporte do Merenda Check.
          </p>
        </div>
      </header>

      {/* Busca */}
      <div style={{ position: 'relative', marginBottom: 48, maxWidth: 600 }}>
        <i className="fa-solid fa-magnifying-glass" style={{
          position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)',
          color: 'var(--text-muted)', fontSize: '1.1rem',
        }}></i>
        <input
          type="text"
          className="form-control"
          placeholder="Buscar perguntas frequentes..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          style={{ paddingLeft: 50, borderRadius: 14 }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 32, alignItems: 'start' }}>
        {/* FAQ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          {faqFiltrado.length === 0 && (
            <div className="glass-panel" style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
              <i className="fa-solid fa-face-meh" style={{ fontSize: '2rem', marginBottom: 12, display: 'block' }}></i>
              Nenhuma pergunta encontrada para "<strong>{busca}</strong>"
            </div>
          )}
          {faqFiltrado.map((cat) => (
            <div key={cat.categoria}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 10,
                  background: `${cat.cor}22`,
                  color: cat.cor,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1rem',
                }}>
                  <i className={`fa-solid ${cat.icon}`}></i>
                </div>
                <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {cat.categoria}
                </h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {cat.perguntas.map((p, i) => {
                  const key = `${cat.categoria}-${i}`;
                  const estaAberto = aberto === key;
                  return (
                    <div
                      key={key}
                      className="glass-panel"
                      style={{
                        padding: 0, overflow: 'hidden',
                        border: estaAberto ? `1px solid ${cat.cor}55` : '1px solid rgba(255,255,255,0.06)',
                        transform: 'none',
                        transition: 'border-color 0.3s, box-shadow 0.3s',
                        boxShadow: estaAberto ? `0 0 20px ${cat.cor}18` : undefined,
                      }}
                    >
                      <button
                        onClick={() => toggle(key)}
                        style={{
                          width: '100%', textAlign: 'left', background: 'transparent',
                          border: 'none', cursor: 'pointer',
                          padding: '18px 22px',
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          color: 'var(--text-main)', fontFamily: 'inherit', fontSize: '0.97rem', fontWeight: 600,
                        }}
                      >
                        <span>{p.q}</span>
                        <i
                          className={`fa-solid fa-chevron-down`}
                          style={{
                            color: cat.cor, flexShrink: 0, marginLeft: 16,
                            transition: 'transform 0.3s',
                            transform: estaAberto ? 'rotate(180deg)' : 'rotate(0deg)',
                          }}
                        ></i>
                      </button>
                      {estaAberto && (
                        <div style={{
                          padding: '0 22px 20px',
                          color: 'var(--text-muted)',
                          fontSize: '0.93rem',
                          lineHeight: 1.7,
                          borderTop: '1px solid rgba(255,255,255,0.05)',
                          paddingTop: 16,
                          animation: 'slideUp 0.3s ease forwards',
                        }}>
                          {p.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Painel de contato */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
            Canais de Suporte
          </h2>

          {CONTATOS.map((c) => (
            <div
              key={c.label}
              className="glass-panel"
              style={{ padding: '18px 20px', display: 'flex', alignItems: 'flex-start', gap: 14 }}
            >
              <div style={{
                width: 40, height: 40, borderRadius: 12, background: 'rgba(16,185,129,0.1)',
                color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, fontSize: '1.1rem',
              }}>
                <i className={`fa-solid ${c.icon}`}></i>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 2 }}>{c.label}</div>
                {c.link ? (
                  <a href={c.link} style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.95rem' }}>{c.valor}</a>
                ) : (
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>{c.valor}</div>
                )}
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>{c.sub}</div>
              </div>
            </div>
          ))}

          {/* Card dica rápida */}
          <div className="glass-panel" style={{
            padding: '20px 22px', marginTop: 8,
            background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(16,185,129,0.03))',
            border: '1px solid rgba(16,185,129,0.2)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <i className="fa-solid fa-lightbulb" style={{ color: 'var(--alert-yellow)' }}></i>
              <strong style={{ fontSize: '0.9rem' }}>Dica rápida</strong>
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              O mascote no canto inferior da tela oferece dicas contextuais sobre a página atual. Passe o mouse sobre ele!
            </p>
          </div>

          {/* Versão do sistema */}
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.78rem', paddingTop: 8 }}>
            <i className="fa-solid fa-code-branch" style={{ marginRight: 6 }}></i>
            Merenda Check v3.2.0 — build 2026.05
          </div>
        </aside>
      </div>
    </DashboardLayout>
  );
}
