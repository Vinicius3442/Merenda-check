import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Detectar valores placeholder que não são credenciais reais
const isPlaceholder = (val) =>
  !val ||
  val.includes('sua_url_aqui') ||
  val.includes('sua_anon_key_aqui') ||
  val === 'undefined' ||
  val.length < 20;

export const isSupabaseConfigured =
  Boolean(supabaseUrl && supabaseAnonKey) &&
  !isPlaceholder(supabaseUrl) &&
  !isPlaceholder(supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.info(
    '[Supabase] Rodando em modo DEMO (mock data). ' +
    'Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no .env para usar o banco real.'
  );
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;
