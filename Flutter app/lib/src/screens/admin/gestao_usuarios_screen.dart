import 'package:flutter/material.dart';
import '../../widgets/base_layout.dart';

class SystemUser {
  final String name;
  final String role;
  final String email;
  final String school;
  final bool isActive;

  SystemUser(this.name, this.role, this.email, this.school, this.isActive);
}

class GestaoUsuariosScreen extends StatefulWidget {
  const GestaoUsuariosScreen({super.key});

  @override
  State<GestaoUsuariosScreen> createState() => _GestaoUsuariosScreenState();
}

class _GestaoUsuariosScreenState extends State<GestaoUsuariosScreen> {
  final List<SystemUser> _users = [
    SystemUser('Ana Paula Silva', 'Gestor', 'gestor@merendacheck.gov.br', 'E. M. Monteiro Lobato', true),
    SystemUser('Carlos Souza', 'Operador', 'operador@merendacheck.gov.br', 'E. M. Monteiro Lobato', true),
    SystemUser('Mariana Santos', 'Nutrição', 'nutricao@merendacheck.gov.br', 'Dep. Alimentação Escolar', true),
    SystemUser('Júlio Fagundes', 'Auditor', 'auditor@merendacheck.gov.br', 'Auditoria Geral Municipal', true),
  ];

  String _searchQuery = '';

  @override
  Widget build(BuildContext context) {
    final filteredUsers = _users.where((u) {
      final nameLower = u.name.toLowerCase();
      final roleLower = u.role.toLowerCase();
      final emailLower = u.email.toLowerCase();
      final schoolLower = u.school.toLowerCase();
      final queryLower = _searchQuery.toLowerCase();
      return nameLower.contains(queryLower) ||
          roleLower.contains(queryLower) ||
          emailLower.contains(queryLower) ||
          schoolLower.contains(queryLower);
    }).toList();

    return BaseLayout(
      title: 'Gestão de Usuários',
      currentRoute: '/admin',
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Contas de Usuários',
              style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold, fontFamily: 'Outfit'),
            ),
            const SizedBox(height: 4),
            Text(
              'Gerenciamento de contas e credenciais de servidores municipais.',
              style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 13),
            ),
            const SizedBox(height: 20),

            // Search Bar
            Container(
              decoration: BoxDecoration(
                color: const Color(0xFF1E293B),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.white.withOpacity(0.08)),
              ),
              child: TextField(
                style: const TextStyle(color: Colors.white),
                decoration: InputDecoration(
                  hintText: 'Pesquisar usuário por nome, e-mail ou cargo...',
                  hintStyle: TextStyle(color: Colors.white.withOpacity(0.3)),
                  prefixIcon: Icon(Icons.search, color: Colors.white.withOpacity(0.5)),
                  border: InputBorder.none,
                  contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                ),
                onChanged: (val) {
                  setState(() {
                    _searchQuery = val;
                  });
                },
              ),
            ),
            const SizedBox(height: 20),

            // Accounts List
            Expanded(
              child: ListView.builder(
                itemCount: filteredUsers.length,
                itemBuilder: (context, index) {
                  final u = filteredUsers[index];
                  final roleColor = u.role == 'Gestor'
                      ? const Color(0xFF3B82F6)
                      : u.role == 'Nutrição'
                          ? const Color(0xFF10B981)
                          : u.role == 'Auditor'
                              ? const Color(0xFFEAB308)
                              : const Color(0xFF8B5CF6);

                  return Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: const Color(0xFF1E293B),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: Colors.white.withOpacity(0.05)),
                    ),
                    child: Row(
                      children: [
                        CircleAvatar(
                          backgroundColor: roleColor.withOpacity(0.1),
                          child: Icon(Icons.person, color: roleColor),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Text(
                                    u.name,
                                    style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14, fontFamily: 'Outfit'),
                                  ),
                                  const SizedBox(width: 8),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                    decoration: BoxDecoration(
                                      color: roleColor.withOpacity(0.15),
                                      borderRadius: BorderRadius.circular(6),
                                    ),
                                    child: Text(
                                      u.role,
                                      style: TextStyle(color: roleColor, fontSize: 9, fontWeight: FontWeight.bold),
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 4),
                              Text(
                                u.email,
                                style: TextStyle(color: Colors.white.withOpacity(0.4), fontSize: 11),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                u.school,
                                style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 12),
                              ),
                            ],
                          ),
                        ),
                        IconButton(
                          onPressed: () {
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(content: Text('Configurar permissões de "${u.name}"...')),
                            );
                          },
                          icon: const Icon(Icons.settings, color: Colors.white38),
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
