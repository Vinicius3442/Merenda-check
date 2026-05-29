import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../../widgets/base_layout.dart';

class GestaoUsuariosScreen extends StatefulWidget {
  const GestaoUsuariosScreen({super.key});

  @override
  State<GestaoUsuariosScreen> createState() => _GestaoUsuariosScreenState();
}

class _GestaoUsuariosScreenState extends State<GestaoUsuariosScreen> {
  List<dynamic> _users = [];
  bool _isLoading = true;
  String _searchQuery = '';

  @override
  void initState() {
    super.initState();
    _fetchUsers();
  }

  Future<void> _fetchUsers() async {
    try {
      final response = await Supabase.instance.client
          .from('usuarios')
          .select('id, nome, email, role, status, avatar_url, escolas(nome)')
          .order('nome');

      setState(() {
        _users = response as List<dynamic>;
        _isLoading = false;
      });
    } catch (e) {
      debugPrint('Erro ao carregar usuários: $e');
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final filteredUsers = _users.where((u) {
      final nameLower = (u['nome'] ?? '').toLowerCase();
      final roleLower = (u['role'] ?? '').toLowerCase();
      final emailLower = (u['email'] ?? '').toLowerCase();
      final schoolLower = (u['escolas'] != null ? u['escolas']['nome'] : 'Sem Vínculo').toLowerCase();
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
              child: _isLoading 
                ? const Center(child: CircularProgressIndicator(color: Color(0xFF10B981)))
                : ListView.builder(
                itemCount: filteredUsers.length,
                itemBuilder: (context, index) {
                  final u = filteredUsers[index];
                  final String roleName = u['role'].toString().toUpperCase();
                  final roleColor = roleName == 'GESTOR'
                      ? const Color(0xFF3B82F6)
                      : roleName == 'NUTRICAO'
                          ? const Color(0xFF10B981)
                          : roleName == 'AUDITOR'
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
                        Builder(builder: (context) {
                          final avatar = u['avatar_url']?.toString() ?? '';
                          final isCorsBlocked = avatar.contains('randomuser.me');
                          
                          if (avatar.isNotEmpty && !isCorsBlocked) {
                            return CircleAvatar(
                              backgroundImage: NetworkImage(avatar),
                              backgroundColor: const Color(0xFF1E293B),
                              onBackgroundImageError: (_, __) {},
                            );
                          }
                          
                          return CircleAvatar(
                            backgroundColor: roleColor.withOpacity(0.1),
                            child: Text(
                              (u['nome'] ?? 'U').toString().substring(0, 1).toUpperCase(),
                              style: TextStyle(color: roleColor, fontWeight: FontWeight.bold),
                            ),
                          );
                        }),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Text(
                                    u['nome'] ?? 'Sem Nome',
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
                                      roleName,
                                      style: TextStyle(color: roleColor, fontSize: 9, fontWeight: FontWeight.bold),
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 4),
                              Text(
                                u['email'] ?? 'Sem E-mail',
                                style: TextStyle(color: Colors.white.withOpacity(0.4), fontSize: 11),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                u['escolas'] != null ? u['escolas']['nome'] : 'Sem Vínculo Escolar',
                                style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 12),
                              ),
                            ],
                          ),
                        ),
                        IconButton(
                          onPressed: () {
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(content: Text('Configurar permissões de "${u['nome']}"...')),
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
