import DashboardLayout from '../../components/layout/DashboardLayout';

export default function GestaoUsuarios() {
  const usuarios = [
    { nome: 'Maria Silva', email: 'maria@merendacheck.gov.br', role: 'Operador', escola: 'CEI Pequeninos', status: 'Ativo' },
    { nome: 'Carlos Roberto', email: 'carlos@merendacheck.gov.br', role: 'Gestor', escola: 'EMEF João Silva', status: 'Ativo' },
    { nome: 'Dra. Ana Gomes', email: 'ana.gomes@merendacheck.gov.br', role: 'Auditor', escola: 'Todas', status: 'Ativo' },
    { nome: 'Paulo Exonerado', email: 'paulo@merendacheck.gov.br', role: 'Operador', escola: 'EMEI Margarida', status: 'Inativo' },
  ];

  return (
    <DashboardLayout>
      <div className="wizard-container">
        <div className="header-dash animate-fade-in">
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <i className="fa-solid fa-users-gear" style={{ color: 'var(--primary)' }}></i>
            Gestão de Identidades (IAM)
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
            Controle de acessos, Roles (RBAC) e revogação de acessos de servidores demitidos.
          </p>
        </div>
        <div>
          <button className="btn btn-primary"><i className="fa-solid fa-user-plus"></i> Novo Servidor</button>
        </div>
      </div>

      <div className="table-wrapper animate-slide-up">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nome Completo</th>
                <th>E-mail Corporativo</th>
                <th>Cargo / Acesso</th>
                <th>Unidade Escolar</th>
                <th>Status da Conta</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u, i) => (
                <tr key={i} style={{ opacity: u.status === 'Inativo' ? 0.5 : 1 }}>
                  <td style={{ fontWeight: 700 }}>{u.nome}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{u.email}</td>
                  <td><span className="badge">{u.role}</span></td>
                  <td>{u.escola}</td>
                  <td>
                    {u.status === 'Ativo' ? (
                      <span className="badge badge-success">Ativo</span>
                    ) : (
                      <span className="badge badge-error">Revogado</span>
                    )}
                  </td>
                  <td>
                    <button className="btn btn-secondary" style={{ padding: '4px 8px' }} title="Resetar Senha"><i className="fa-solid fa-key"></i></button>
                    <button className="btn btn-secondary" style={{ padding: '4px 8px', marginLeft: 8 }} title="Editar Permissões"><i className="fa-solid fa-sliders"></i></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
