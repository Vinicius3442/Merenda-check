import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

const USERS = {
  operador: { name: 'Maria Silva', role: 'Nutricionista / Operador', initials: 'MS' },
  gestor: { name: 'Carlos Roberto', role: 'Diretor Escolar', initials: 'CR' },
  auditor: { name: 'Dra. Ana Gomes', role: 'Auditora Chefe', initials: 'AG' },
  nutricao: { name: 'Dra. Fernanda L.', role: 'Nutricionista Chefe PNAE', initials: 'FL' },
  licitacao: { name: 'Roberto Braga', role: 'Setor de Contratos / Compras', initials: 'RB' },
  admin: { name: 'SysAdmin', role: 'Sec. de Educação (TI)', initials: 'TI' },
};

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({ user: null, role: null, isAuthenticated: false });

  const login = useCallback((role) => {
    setAuth({ user: USERS[role], role, isAuthenticated: true });
  }, []);

  const logout = useCallback(() => {
    setAuth({ user: null, role: null, isAuthenticated: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
