import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const AuthContext = createContext(null);

// Usuários mock para quando Supabase não está configurado
const MOCK_USERS = {
  operador:       { name: 'Maria Silva',     role: 'Nutricionista / Operador',         initials: 'MS', email: 'operador@merendacheck.gov.br' },
  gestor:         { name: 'Carlos Roberto',  role: 'Diretor Escolar',                  initials: 'CR', email: 'gestor@merendacheck.gov.br' },
  auditor:        { name: 'Dra. Ana Gomes',  role: 'Auditora Chefe',                   initials: 'AG', email: 'auditor@merendacheck.gov.br' },
  nutricao:       { name: 'Dra. Fernanda L.',role: 'Nutricionista Chefe PNAE',         initials: 'FL', email: 'nutricao@merendacheck.gov.br' },
  licitacao:      { name: 'Roberto Braga',   role: 'Setor de Contratos / Compras',     initials: 'RB', email: 'licitacao@merendacheck.gov.br' },
  transportadora: { name: 'João Logística',  role: 'Motorista / Transportadora',       initials: 'JL', email: 'transportadora@merendacheck.gov.br' },
  admin:          { name: 'SysAdmin',        role: 'Sec. de Educação (TI)',            initials: 'TI', email: 'admin@merendacheck.gov.br' },
};

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({ user: null, role: null, isAuthenticated: false });
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Ao iniciar, verificar sessão existente no Supabase
  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    // Buscar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Ouvir mudanças de autenticação (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setAuth({ user: null, role: null, isAuthenticated: false });
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchUserProfile(authId) {
    try {
      // 1. Tentar buscar por auth_id
      let { data, error } = await supabase
        .from('usuarios')
        .select('id, nome, role, iniciais, email, escola_id, avatar_url')
        .eq('auth_id', authId)
        .maybeSingle();

      // 2. Se não encontrou por auth_id, tentar resolver por e-mail ou criar perfil
      if (error || !data) {
        console.log('[Auth] Perfil não encontrado por auth_id, tentando por e-mail...');
        
        // Obter os dados da conta Auth atual
        const { data: { user: authUser } } = await supabase.auth.getUser();
        
        if (authUser && authUser.email) {
          // Buscar perfil pelo email
          const { data: emailData, error: emailErr } = await supabase
            .from('usuarios')
            .select('id, nome, role, iniciais, email, escola_id, avatar_url')
            .eq('email', authUser.email)
            .maybeSingle();

          if (emailData) {
            console.log('[Auth] Perfil encontrado por e-mail, vinculando auth_id:', authUser.email);
            // Associar o auth_id a este usuário
            const { data: updatedData, error: updateError } = await supabase
              .from('usuarios')
              .update({ auth_id: authId })
              .eq('id', emailData.id)
              .select()
              .maybeSingle();

            if (!updateError && updatedData) {
              data = updatedData;
            } else {
              console.warn('[Auth] Falha ao atualizar auth_id no banco (provável RLS), usando fallback local:', updateError);
              // Usar dados existentes com o authId mapeado localmente em memória
              data = { ...emailData, auth_id: authId };
            }
          } else {
            // Se absolutamente nenhum perfil existir com este e-mail, criar um perfil dinâmico!
            console.log('[Auth] Perfil inexistente no banco. Criando perfil padrão para:', authUser.email);
            const prefix = authUser.email.split('@')[0];
            const role = prefix === 'admin' ? 'admin' : (prefix === 'nutricao' ? 'nutricao' : (prefix === 'gestor' ? 'gestor' : (prefix === 'auditor' ? 'auditor' : (prefix === 'transportadora' ? 'transportadora' : (prefix === 'licitacao' ? 'licitacao' : 'operador')))));
            const nome = prefix.charAt(0).toUpperCase() + prefix.slice(1);
            const iniciais = nome.substring(0, 2).toUpperCase();

            const { data: insertedData, error: insertError } = await supabase
              .from('usuarios')
              .insert({
                auth_id: authId,
                email: authUser.email,
                nome: nome,
                role: role,
                iniciais: iniciais,
                status: 'ativo'
              })
              .select()
              .maybeSingle();

            if (!insertError && insertedData) {
              data = insertedData;
            } else {
              console.warn('[Auth] Erro ao criar perfil no banco (provável RLS), ativando fallback em memória:', insertError);
              data = {
                id: authId,
                nome: nome,
                role: role,
                iniciais: iniciais,
                email: authUser.email,
                escola_id: null
              };
            }
          }
        }
      }

      if (!data) {
        console.error('[Auth] Impossível obter ou criar perfil para authId:', authId);
        setLoading(false);
        return;
      }

      setAuth({
        user: { id: data.id, name: data.nome, role: data.role, initials: data.iniciais, email: data.email, escola_id: data.escola_id, avatar_url: data.avatar_url },
        role: data.role,
        isAuthenticated: true,
      });
    } catch (err) {
      console.error('[Auth] Exceção crítica na resolução do perfil:', err);
    } finally {
      setLoading(false);
    }
  }

  // Login com Supabase ou fallback mock
  const login = useCallback(async (roleOrEmail, senha) => {
    setAuthError(null);

    // Se Supabase não está configurado, usar modo mock
    if (!isSupabaseConfigured) {
      const roleKey = roleOrEmail.split('@')[0].split('.')[0]; // extrai role do email
      const matchedRole = Object.keys(MOCK_USERS).find(
        (k) => roleOrEmail === k || MOCK_USERS[k].email === roleOrEmail
      ) || roleKey;

      const mockUser = MOCK_USERS[matchedRole] || MOCK_USERS.operador;
      setAuth({ user: mockUser, role: matchedRole, isAuthenticated: true });
      return { ok: true, role: matchedRole };
    }

    // Login real com Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: roleOrEmail,
      password: senha,
    });

    if (error) {
      setAuthError(error.message);
      return { ok: false, error: error.message };
    }

    // Buscar a role para redirecionar de forma ultra resiliente
    let userRole = 'operador';
    try {
      const { data: profile } = await supabase
        .from('usuarios')
        .select('role')
        .eq('auth_id', data.user.id)
        .maybeSingle();

      if (profile?.role) {
        userRole = profile.role;
      } else if (data.user.email) {
        const { data: emailProfile } = await supabase
          .from('usuarios')
          .select('role')
          .eq('email', data.user.email)
          .maybeSingle();

        if (emailProfile?.role) {
          userRole = emailProfile.role;
        } else {
          const prefix = data.user.email.split('@')[0];
          userRole = prefix === 'admin' ? 'admin' : (prefix === 'nutricao' ? 'nutricao' : (prefix === 'gestor' ? 'gestor' : (prefix === 'auditor' ? 'auditor' : 'operador')));
        }
      }
    } catch (err) {
      console.error('[Auth] Erro ao obter role para redirecionamento:', err);
    }

    return { ok: true, role: userRole };
  }, []);

  const logout = useCallback(async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setAuth({ user: null, role: null, isAuthenticated: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...auth, login, logout, loading, authError, isSupabaseConfigured }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
