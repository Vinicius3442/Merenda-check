// Serviço de Integração do WhatsApp Business API (via Twilio)
// Suporta envio real se configurado ou simulação local de alta fidelidade

export async function enviarAlertaWhatsApp({
  gestorNome,
  gestorTelefone,
  nutricionistaNome,
  nutricionistaTelefone,
  insumoNome,
  loteCodigo,
  validadeRestante,
  escolaNome
}) {
  const accountSid = import.meta.env.VITE_TWILIO_ACCOUNT_SID;
  const authToken = import.meta.env.VITE_TWILIO_AUTH_TOKEN;
  const twilioNumber = import.meta.env.VITE_TWILIO_PHONE_NUMBER || 'whatsapp:+14155238886'; // Número padrão Sandbox

  // Montagem das mensagens
  const msgGestor = `⚠️ *ALERTA MERENDA CHECK - FIFO CRÍTICO* ⚠️\n\nOlá *${gestorNome}* (Gestor de Unidade),\n\nO lote de *${insumoNome}* (Lote: *${loteCodigo}*) na unidade *${escolaNome}* está a apenas *${validadeRestante}* do vencimento!\n\nPelo critério FIFO (Primeiro que Entra, Primeiro que Sai), este lote está correndo risco de vencimento ocioso na despensa.\n\n*Ação Recomendada:* Priorize o consumo no cardápio de amanhã ou solicite o remanejamento imediato no sistema.\n\n_— Sistema Integrado Merenda Check_`;

  const msgNutri = `⚠️ *ALERTA MERENDA CHECK - FIFO CRÍTICO* ⚠️\n\nOlá *${nutricionistaNome}* (Nutricionista Responsável),\n\nFoi identificado risco de validade no lote *${loteCodigo}* (*${insumoNome}*) na unidade *${escolaNome}* (*${validadeRestante}* restando).\n\nO cardápio atual deve ser ajustado para priorizar este insumo ou autorizar a transferência imediata de excedentes.\n\n_— Sistema Integrado Merenda Check_`;

  const logNotification = {
    id: `wa-log-${Date.now()}`,
    data: new Date().toLocaleDateString('pt-BR') + ' - ' + new Date().toLocaleTimeString('pt-BR'),
    insumo: insumoNome,
    lote: loteCodigo,
    escola: escolaNome,
    gestor: { nome: gestorNome, telefone: gestorTelefone, mensagem: msgGestor },
    nutricionista: { nome: nutricionistaNome, telefone: nutricionistaTelefone, mensagem: msgNutri },
    status: 'simulated'
  };

  // Salvar no localStorage para ser consumido pelo mock do celular
  const logsAnteriores = JSON.parse(localStorage.getItem('merenda_whatsapp_alerts') || '[]');
  localStorage.setItem('merenda_whatsapp_alerts', JSON.stringify([logNotification, ...logsAnteriores]));

  // Adicionar também ao histórico geral do auditor para que apareça na trilha de auditoria
  const auditLogs = JSON.parse(localStorage.getItem('merenda_audit_trail') || '[]');
  auditLogs.unshift({
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString(),
    evento: 'Notificação FIFO WhatsApp',
    usuario: 'Algoritmo FIFO Automatizado',
    detalhes: `Alerta disparado para Gestor ${gestorNome} e Nutricionista ${nutricionistaNome} sobre vencimento do lote ${loteCodigo} (${insumoNome}) na unidade ${escolaNome}.`
  });
  localStorage.setItem('merenda_audit_trail', JSON.stringify(auditLogs));

  // Verificar se há credenciais configuradas para envio real
  const isTwilioConfigured = accountSid && authToken && !accountSid.includes('sua_') && !authToken.includes('sua_');

  if (isTwilioConfigured) {
    try {
      console.log('[WhatsApp Service] Tentando enviar alerta real via Twilio REST API...');
      
      // Enviar mensagem para o Gestor
      const resGestor = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa(`${accountSid}:${authToken}`),
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          From: twilioNumber,
          To: `whatsapp:${gestorTelefone.replace(/\D/g, '')}`,
          Body: msgGestor
        })
      });

      // Enviar mensagem para o Nutricionista
      const resNutri = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa(`${accountSid}:${authToken}`),
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          From: twilioNumber,
          To: `whatsapp:${nutricionistaTelefone.replace(/\D/g, '')}`,
          Body: msgNutri
        })
      });

      if (resGestor.ok && resNutri.ok) {
        logNotification.status = 'sent';
        localStorage.setItem('merenda_whatsapp_alerts', JSON.stringify([logNotification, ...logsAnteriores.slice(1)]));
        return { success: true, realSent: true };
      } else {
        const errData = await resGestor.json();
        console.error('[WhatsApp Service] Falha na API do Twilio:', errData);
        return { success: true, realSent: false, error: errData.message };
      }
    } catch (e) {
      console.error('[WhatsApp Service] Erro de rede na requisição do Twilio:', e);
      return { success: true, realSent: false, error: e.message };
    }
  }

  // Retorna com sucesso simulado
  console.info(`[WhatsApp Service - SIMULADO] Alertas registrados com sucesso no localStorage:\n- Para Gestor (${gestorNome}): ${msgGestor}\n- Para Nutri (${nutricionistaNome}): ${msgNutri}`);
  return { success: true, realSent: false };
}
