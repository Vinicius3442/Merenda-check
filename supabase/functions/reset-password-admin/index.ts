import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Criar cliente admin com service_role (variáveis injetadas automaticamente pelo Supabase)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    // 2. Verificar se quem está chamando tem sessão válida
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Não autorizado: sem token de sessão.' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Criar cliente com o JWT do chamador para verificar quem é
    const supabaseUser = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: { user: callerUser } } = await supabaseUser.auth.getUser()
    if (!callerUser) {
      return new Response(JSON.stringify({ error: 'Sessão inválida ou expirada.' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Verificar se o chamador é admin no banco
    const { data: callerProfile } = await supabaseAdmin
      .from('usuarios')
      .select('role')
      .eq('auth_id', callerUser.id)
      .maybeSingle()

    if (callerProfile?.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Apenas SysAdmin pode resetar senhas de outros usuários.' }), {
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // 3. Pegar os dados do request
    const { user_id, new_password } = await req.json()

    if (!user_id || !new_password || new_password.length < 6) {
      return new Response(JSON.stringify({ error: 'user_id e senha (mínimo 6 caracteres) são obrigatórios.' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // 4. Buscar o auth_id do usuário pelo id interno da tabela usuarios
    const { data: targetUser } = await supabaseAdmin
      .from('usuarios')
      .select('auth_id, nome')
      .eq('id', user_id)
      .maybeSingle()

    if (!targetUser?.auth_id) {
      return new Response(JSON.stringify({ error: 'Usuário não encontrado ou sem conta de autenticação vinculada.' }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // 5. Atualizar a senha no Supabase Auth (requer service_role)
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      targetUser.auth_id,
      { password: new_password }
    )

    if (updateError) {
      return new Response(JSON.stringify({ error: updateError.message }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    return new Response(
      JSON.stringify({ success: true, message: `Senha de "${targetUser.nome}" redefinida com sucesso.` }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (err) {
    return new Response(JSON.stringify({ error: `Erro interno: ${err.message}` }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
