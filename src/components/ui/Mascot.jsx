import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

// ─── Contexto por rota ────────────────────────────────────────────────────────
const ROUTE_CONTEXTS = {
  '/operador': {
    tip: 'Oi! Estou aqui para ajudar com o registro de insumos e refeições. 🍎',
    context: 'O usuário está na área do Operador de Escola, responsável por receber insumos (escanear QR Code), registrar refeições e controlar sobras (Resto-Ingesta).',
  },
  '/operador/entrada': {
    tip: 'Dica: escaneie o QR Code da guia da transportadora para registrar a entrada! 📦',
    context: 'O usuário está na tela de Entrada de Insumo — recebimento de mercadorias via QR Code ou hash manual.',
  },
  '/operador/baixa': {
    tip: 'Aqui você dá baixa no estoque quando os itens são usados. 📋',
    context: 'O usuário está na tela de Baixa de Insumo — registro de consumo de estoque.',
  },
  '/operador/refeicao': {
    tip: 'Registre quantas refeições foram servidas hoje! 🥗',
    context: 'O usuário está na tela de Registro de Refeição.',
  },
  '/operador/sobra': {
    tip: 'O Resto-Ingesta mede as sobras após as refeições — anote o peso em kg! ⚖️',
    context: 'O usuário está na tela de Sobra Limpa (Resto-Ingesta) — controle de desperdício.',
  },
  '/gestor': {
    tip: 'Visão geral do estoque e indicadores da sua escola! 📊',
    context: 'O usuário é Gestor e vê o dashboard geral com KPIs de estoque e conformidade.',
  },
  '/gestor/estoque': {
    tip: 'Monitore os níveis de cada item no estoque aqui. 🗃️',
    context: 'O usuário está na tela de Gestão de Estoque.',
  },
  '/auditor': {
    tip: 'Monitore alertas e a saúde das escolas do município! 🔍',
    context: 'O usuário é Auditor Municipal e tem acesso a alertas de desvio, rastreabilidade e saúde das escolas.',
  },
  '/auditor/rastrear': {
    tip: 'Insira o hash de um lote para ver toda a cadeia de custódia! 🔗',
    context: 'O usuário está na tela de Rastreabilidade de Lotes criptografados.',
  },
  '/transportadora': {
    tip: 'Gerencie entregas e emita lotes assinados por aqui! 🚚',
    context: 'O usuário é da Transportadora e pode emitir lotes com QR Code Criptografado para entrega nas escolas.',
  },
  '/transportadora/emitir-lote': {
    tip: 'Preencha os dados do veículo e do lote para gerar o QR Code! 📄',
    context: 'O usuário está na tela de Emissão de Lote Criptografado.',
  },
  '/nutricao': {
    tip: 'Acompanhe os cardápios e fichas técnicas nutricionais! 🥦',
    context: 'O usuário é Nutricionista e gerencia cardápios e fichas técnicas conforme o PNAE.',
  },
  '/licitacao': {
    tip: 'Controle empenhos e saldo orçamentário aqui! 💰',
    context: 'O usuário está na área de Licitação/Compras Públicas — empenhos e fornecedores.',
  },
  '/admin': {
    tip: 'Gerencie usuários e veja o audit trail do sistema! 🛡️',
    context: 'O usuário é Administrador de TI — gerencia contas e monitora logs do sistema.',
  },
  '/ajuda': {
    tip: 'Precisa de ajuda? Me pergunte qualquer coisa! 😊',
    context: 'O usuário está na Central de Ajuda do Merenda Check.',
  },
  '/': {
    tip: 'Oi! Sou o Checky, mascote do Merenda Check! Como posso ajudar? 🍎',
    context: 'O usuário está na landing page pública do Merenda Check.',
  },
};

const DEFAULT_CONTEXT = {
  tip: 'Oi! Sou o Checky. Clique em mim para conversar! 🍎',
  context: 'O usuário está usando o sistema Merenda Check — plataforma GovTech de rastreabilidade de merenda escolar (PNAE).',
};

const SYSTEM_PROMPT = `Você é o Checky, o assistente virtual simpático e inteligente do sistema Merenda Check — uma plataforma GovTech brasileira para rastreabilidade de insumos da merenda escolar, em conformidade com o PNAE (Programa Nacional de Alimentação Escolar).

Suas responsabilidades:
- Ajudar usuários a entender e usar as funcionalidades do sistema
- Responder dúvidas sobre processos (recebimento de lotes, registro de refeições, emissão criptográfica, etc.)
- Dar dicas contextuais sobre a tela atual do usuário
- Ser amigável, direto e usar emojis com moderação
- Responder SEMPRE em português brasileiro

Contexto atual do usuário: {CONTEXT}

Regras:
- Respostas curtas e objetivas (máximo 3 parágrafos)
- Não invente funcionalidades que não existam no sistema
- Se não souber algo específico, oriente o usuário a contatar o suporte
- Use o tom de um assistente governamental amigável`;


// ─── Chama API REST do Google Gemini diretamente ────────────────────────────────
async function callGemini(apiKey, systemPrompt, history, userMessage) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const contents = [
    ...history.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    })),
    {
      role: 'user',
      parts: [{ text: userMessage }]
    }
  ];

  const res = await fetch(url, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: contents,
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 512,
      },
    }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    console.warn(`[Checky] Gemini error ${res.status}:`, errData?.error?.message);
    const err = new Error(errData?.error?.message || `HTTP ${res.status}`);
    err.status = res.status;
    throw err;
  }

  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

// ─── Componente ───────────────────────────────────────────────────────────────
export default function Mascot() {
  const [isVisible, setIsVisible] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasApiKey] = useState(
    !!(import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_OPENAI_API_KEY)
  );

  const historyRef = useRef([]);     // histórico REST: [{role, parts:[{text}]}]
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const location = useLocation();

  // Esconder no Kiosk
  const hideMascot = location.pathname.includes('/kiosk');

  // Resolver contexto da rota
  const getRouteContext = () => {
    const path = location.pathname;
    if (ROUTE_CONTEXTS[path]) return ROUTE_CONTEXTS[path];
    const partial = Object.keys(ROUTE_CONTEXTS).find(k => k !== '/' && path.startsWith(k));
    return partial ? ROUTE_CONTEXTS[partial] : DEFAULT_CONTEXT;
  };

  // Reset chat ao mudar de rota
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1000);
    const ctx = getRouteContext();

    // Saudação inicial da nova página
    setMessages([{
      role: 'assistant',
      text: ctx.tip,
      id: Date.now(),
    }]);

    // Resetar histórico ao mudar de rota
    historyRef.current = [];

    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Piscar olhos
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.5) {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 200);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Scroll automático
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Foco no input ao abrir
  useEffect(() => {
    if (chatOpen) setTimeout(() => inputRef.current?.focus(), 100);
  }, [chatOpen]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isTyping) return;

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_OPENAI_API_KEY;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', text, id: Date.now() }]);
    setIsTyping(true);

    if (!hasApiKey) {
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, {
          role: 'assistant',
          text: '⚠️ Chave de API não configurada. Adicione `VITE_GEMINI_API_KEY` ou `VITE_OPENAI_API_KEY` no arquivo `.env` da raiz do projeto para ativar o assistente!',
          id: Date.now(),
        }]);
      }, 800);
      return;
    }

    const ctx = getRouteContext();
    const systemPrompt = SYSTEM_PROMPT.replace('{CONTEXT}', ctx.context);

    try {
      const reply = await callGemini(apiKey, systemPrompt, historyRef.current, text);

      // Atualiza histórico para manter contexto da conversa
      historyRef.current = [
        ...historyRef.current,
        { role: 'user', content: text },
        { role: 'assistant', content: reply },
      ];

      setMessages(prev => [...prev, { role: 'assistant', text: reply, id: Date.now() }]);
    } catch (err) {
      console.error('[Checky] Gemini error:', err);
      const is429 = err?.status === 429 || err?.message?.includes('429');
      const is400 = err?.status === 400 || err?.message?.includes('400');
      const errMsg = is429
        ? '⏳ Muitas requisições da API Gemini. Aguarde alguns segundos e tente de novo!'
        : is400
        ? '⚠️ Chave de API do Gemini inválida ou sem permissão. Verifique o arquivo `.env` e reinicie o servidor.'
        : '😔 Não consegui responder agora. Tente novamente em instantes.';
      setMessages(prev => [...prev, { role: 'assistant', text: errMsg, id: Date.now() }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (hideMascot) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '12px',
      }}
    >
      {/* ── Painel de Chat ── */}
      {chatOpen && (
        <div className="mascot-chat-panel">
          {/* Header */}
          <div className="mascot-chat-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="mascot-chat-avatar">🍎</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Checky</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--alert-green)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--alert-green)', display: 'inline-block' }} />
                  {hasApiKey ? 'Online' : 'Sem API key'}
                </div>
              </div>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              className="mascot-close-btn"
              aria-label="Fechar chat"
            >
              <i className="fa-solid fa-xmark" />
            </button>
          </div>

          {/* Mensagens */}
          <div className="mascot-messages">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`mascot-msg ${msg.role === 'user' ? 'mascot-msg-user' : 'mascot-msg-bot'}`}
              >
                {msg.text}
              </div>
            ))}

            {isTyping && (
              <div className="mascot-msg mascot-msg-bot mascot-typing">
                <span /><span /><span />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="mascot-input-area">
            <input
              ref={inputRef}
              type="text"
              className="mascot-input"
              placeholder="Pergunte algo ao Checky..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isTyping}
            />
            <button
              className="mascot-send-btn"
              onClick={sendMessage}
              disabled={isTyping || !input.trim()}
              aria-label="Enviar"
            >
              <i className="fa-solid fa-paper-plane" />
            </button>
          </div>
        </div>
      )}

      {/* ── Mascote (botão de toggle) ── */}
      <div
        className={`mascot-container ${isVisible ? 'mascot-visible' : ''}`}
        onClick={() => setChatOpen(o => !o)}
        title="Conversar com o Checky"
        style={{ cursor: 'pointer' }}
      >
        {/* Ping de notificação quando fechado */}
        {!chatOpen && (
          <div className="mascot-ping" />
        )}

        <div className={`mascot-svg-wrapper animate-float ${chatOpen ? 'mascot-active' : ''}`}>
          <svg width="72" height="72" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="50" cy="90" rx="30" ry="5" fill="rgba(0,0,0,0.2)" className="mascot-shadow" />
            <path d="M50 85 C10 85, 10 30, 50 30 C90 30, 90 85, 50 85 Z" fill="url(#appleGrad)" />
            <path d="M50 30 C50 20, 55 15, 60 10" stroke="#8B5A2B" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M50 30 C40 20, 30 25, 30 35 C40 35, 50 30, 50 30 Z" fill="#34D399" />

            {isBlinking ? (
              <g>
                <line x1="35" y1="50" x2="45" y2="50" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
                <line x1="55" y1="50" x2="65" y2="50" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
              </g>
            ) : (
              <g>
                <circle cx="40" cy="50" r="5" fill="#0F172A" />
                <circle cx="42" cy="48" r="1.5" fill="#FFF" />
                <circle cx="60" cy="50" r="5" fill="#0F172A" />
                <circle cx="62" cy="48" r="1.5" fill="#FFF" />
              </g>
            )}

            <ellipse cx="32" cy="56" rx="4" ry="2" fill="#FF8A8A" opacity="0.6" />
            <ellipse cx="68" cy="56" rx="4" ry="2" fill="#FF8A8A" opacity="0.6" />
            <path d="M45 58 Q50 65 55 58" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M25 45 C20 55, 25 70, 40 80" stroke="#FFF" strokeWidth="3" strokeLinecap="round" opacity="0.3" fill="none" />

            <defs>
              <radialGradient id="appleGrad" cx="30" cy="40" r="60" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#34D399" />
                <stop offset="50%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#059669" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}
