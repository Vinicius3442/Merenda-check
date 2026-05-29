import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const mockUsuarios = [
  { id: '1', nome: 'Maria Silva',     email: 'maria@merendacheck.gov.br',         role: 'operador',  escola: 'CEI Pequeninos',   status: 'ativo' },
  { id: '2', nome: 'Carlos Roberto',  email: 'carlos@merendacheck.gov.br',        role: 'gestor',    escola: 'EMEF João Silva',  status: 'ativo' },
  { id: '3', nome: 'Dra. Ana Gomes',  email: 'ana.gomes@merendacheck.gov.br',     role: 'auditor',   escola: 'Todas',            status: 'ativo' },
  { id: '4', nome: 'Paulo Exonerado', email: 'paulo@merendacheck.gov.br',         role: 'operador',  escola: 'EMEI Margarida',   status: 'inativo' },
];

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchUsuarios() {
    setLoading(true);
    if (!isSupabaseConfigured) {
      setUsuarios(mockUsuarios);
      setLoading(false);
      return;
    }

    const { data, error: err } = await supabase
      .from('usuarios')
      .select('id, nome, email, role, status, avatar_url, escolas(nome)')
      .order('nome');

    if (err) {
      setError(err.message);
      setUsuarios(mockUsuarios);
    } else {
      const mapped = (data || []).map((u) => ({
        id: u.id,
        nome: u.nome,
        email: u.email,
        role: u.role,
        escola: u.escolas?.nome || 'Todas',
        status: u.status,
        avatar_url: u.avatar_url,
      }));
      setUsuarios(mapped);
    }
    setLoading(false);
  }

  async function atualizarStatus(id, status) {
    if (!isSupabaseConfigured) {
      setUsuarios((prev) => prev.map((u) => (u.id === id ? { ...u, status } : u)));
      return { ok: true };
    }
    const { error: err } = await supabase.from('usuarios').update({ status }).eq('id', id);
    if (err) return { ok: false, error: err.message };
    await fetchUsuarios();
    return { ok: true };
  }

  async function inserirUsuario({ nome, email, role, escola_id }) {
    const iniciais = nome.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
    if (!isSupabaseConfigured) {
      const novo = {
        id: String(Date.now()),
        nome,
        email,
        role,
        escola: 'Todas',
        status: 'ativo',
      };
      setUsuarios((prev) => [novo, ...prev]);
      return { ok: true };
    }

    const { error: err } = await supabase.from('usuarios').insert([
      { nome, email, role, iniciais, escola_id: escola_id || null, status: 'ativo' },
    ]);
    if (err) return { ok: false, error: err.message };
    await fetchUsuarios();
    return { ok: true };
  }

  useEffect(() => {
    fetchUsuarios();
  }, []);

  return { usuarios, loading, error, atualizarStatus, inserirUsuario, refetch: fetchUsuarios };
}
