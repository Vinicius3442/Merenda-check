import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../../widgets/base_layout.dart';
import '../../widgets/safe_avatar.dart';

class GestaoUsuariosScreen extends StatefulWidget {
  const GestaoUsuariosScreen({super.key});

  @override
  State<GestaoUsuariosScreen> createState() => _GestaoUsuariosScreenState();
}

class _GestaoUsuariosScreenState extends State<GestaoUsuariosScreen> {
  List<dynamic> _users = [];
  List<dynamic> _schools = [];
  bool _isLoading = true;
  String _searchQuery = '';

  final Map<String, String> _roleLabels = {
    'operador': 'Operador',
    'gestor': 'Gestor',
    'auditor': 'Auditor',
    'nutricao': 'Nutrição',
    'licitacao': 'Licitação',
    'transportadora': 'Logística',
    'admin': 'SysAdmin',
  };

  @override
  void initState() {
    super.initState();
    _fetchUsers();
  }

  Future<void> _fetchUsers() async {
    try {
      final response = await Supabase.instance.client
          .from('usuarios')
          .select('id, nome, email, role, status, avatar_url, escola_id, escolas(nome)')
          .order('nome');

      final schoolsResponse = await Supabase.instance.client
          .from('escolas')
          .select('id, nome')
          .order('nome');

      setState(() {
        _users = response as List<dynamic>;
        _schools = schoolsResponse as List<dynamic>;
        _isLoading = false;
      });
    } catch (e) {
      debugPrint('Erro ao carregar dados: $e');
      setState(() {
        _isLoading = false;
      });
    }
  }

  Future<void> _updateUser(String id, String nome, String email, String role, String? escolaId) async {
    try {
      final parts = nome.trim().split(' ').where((p) => p.isNotEmpty).toList();
      String iniciais = 'U';
      if (parts.length >= 2) {
        iniciais = '${parts[0][0]}${parts[parts.length - 1][0]}'.toUpperCase();
      } else if (parts.isNotEmpty) {
        iniciais = parts[0].substring(0, 1).toUpperCase();
      }

      await Supabase.instance.client.from('usuarios').update({
        'nome': nome,
        'email': email,
        'role': role,
        'iniciais': iniciais,
        'escola_id': escolaId,
      }).eq('id', id);

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Servidor atualizado com sucesso!'),
          backgroundColor: Color(0xFF10B981),
        ),
      );

      _fetchUsers();
    } catch (e) {
      debugPrint('Erro ao atualizar usuário: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Erro ao atualizar servidor: $e'),
          backgroundColor: const Color(0xFFEF4444),
        ),
      );
    }
  }

  void _showEditDialog(Map<String, dynamic> u) {
    final TextEditingController nameController = TextEditingController(text: u['nome'] ?? '');
    final TextEditingController emailController = TextEditingController(text: u['email'] ?? '');
    String selectedRole = u['role'] ?? 'operador';
    String? selectedEscolaId = u['escola_id']?.toString();

    // Validar se escola_id existe na lista _schools, se não setar como nulo
    bool isEscolaIdValid = _schools.any((sch) => sch['id'].toString() == selectedEscolaId);
    if (!isEscolaIdValid) {
      selectedEscolaId = null;
    }

    showDialog(
      context: context,
      builder: (BuildContext context) {
        return StatefulBuilder(
          builder: (context, setDialogState) {
            return Dialog(
              backgroundColor: const Color(0xFF1E293B),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.white.withOpacity(0.08)),
              ),
              child: Container(
                constraints: const BoxConstraints(maxWidth: 450),
                padding: const EdgeInsets.all(24.0),
                child: SingleChildScrollView(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Header
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: const [
                              Icon(Icons.settings, color: Color(0xFF10B981), size: 22),
                              SizedBox(width: 8),
                              Text(
                                'Editar Servidor',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 18,
                                  fontFamily: 'Outfit',
                                ),
                              ),
                            ],
                          ),
                          IconButton(
                            icon: const Icon(Icons.close, color: Colors.white54, size: 20),
                            onPressed: () => Navigator.pop(context),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      
                      // Nome Field
                      const Text(
                        'Nome Completo',
                        style: TextStyle(color: Colors.white70, fontSize: 13, fontWeight: FontWeight.w500),
                      ),
                      const SizedBox(height: 6),
                      TextField(
                        controller: nameController,
                        style: const TextStyle(color: Colors.white, fontSize: 14),
                        decoration: InputDecoration(
                          hintText: 'Ex: Luiz Felipe',
                          contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                          filled: true,
                          fillColor: const Color(0xFF0F172A),
                          enabledBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(8),
                            borderSide: BorderSide(color: Colors.white.withOpacity(0.1)),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(8),
                            borderSide: const BorderSide(color: Color(0xFF10B981), width: 1.5),
                          ),
                        ),
                      ),
                      const SizedBox(height: 16),

                      // E-mail Field
                      const Text(
                        'E-mail Corporativo',
                        style: TextStyle(color: Colors.white70, fontSize: 13, fontWeight: FontWeight.w500),
                      ),
                      const SizedBox(height: 6),
                      TextField(
                        controller: emailController,
                        style: const TextStyle(color: Colors.white, fontSize: 14),
                        keyboardType: TextInputType.emailAddress,
                        decoration: InputDecoration(
                          hintText: 'nome@merendacheck.gov.br',
                          contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                          filled: true,
                          fillColor: const Color(0xFF0F172A),
                          enabledBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(8),
                            borderSide: BorderSide(color: Colors.white.withOpacity(0.1)),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(8),
                            borderSide: const BorderSide(color: Color(0xFF10B981), width: 1.5),
                          ),
                        ),
                      ),
                      const SizedBox(height: 16),

                      // Role and School
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Perfil de Acesso',
                            style: TextStyle(color: Colors.white70, fontSize: 13, fontWeight: FontWeight.w500),
                          ),
                          const SizedBox(height: 6),
                          DropdownButtonFormField<String>(
                            value: selectedRole,
                            dropdownColor: const Color(0xFF1E293B),
                            style: const TextStyle(color: Colors.white, fontSize: 14),
                            decoration: InputDecoration(
                              contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                              filled: true,
                              fillColor: const Color(0xFF0F172A),
                              enabledBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(8),
                                borderSide: BorderSide(color: Colors.white.withOpacity(0.1)),
                              ),
                              focusedBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(8),
                                borderSide: const BorderSide(color: Color(0xFF10B981), width: 1.5),
                              ),
                            ),
                            items: _roleLabels.entries.map((entry) {
                              return DropdownMenuItem<String>(
                                value: entry.key,
                                child: Text(entry.value),
                              );
                            }).toList(),
                            onChanged: (val) {
                              if (val != null) {
                                setDialogState(() {
                                  selectedRole = val;
                                });
                              }
                            },
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),

                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Unidade Escolar',
                            style: TextStyle(color: Colors.white70, fontSize: 13, fontWeight: FontWeight.w500),
                          ),
                          const SizedBox(height: 6),
                          DropdownButtonFormField<String?>(
                            value: selectedEscolaId,
                            dropdownColor: const Color(0xFF1E293B),
                            style: const TextStyle(color: Colors.white, fontSize: 14),
                            decoration: InputDecoration(
                              contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                              filled: true,
                              fillColor: const Color(0xFF0F172A),
                              enabledBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(8),
                                borderSide: BorderSide(color: Colors.white.withOpacity(0.1)),
                              ),
                              focusedBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(8),
                                borderSide: const BorderSide(color: Color(0xFF10B981), width: 1.5),
                              ),
                            ),
                            items: [
                              const DropdownMenuItem<String?>(
                                value: null,
                                child: Text('Todas (Geral)'),
                              ),
                              ..._schools.map((sch) {
                                return DropdownMenuItem<String?>(
                                  value: sch['id'].toString(),
                                  child: Text(
                                    sch['nome'] ?? 'Sem Nome',
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                );
                              }).toList(),
                            ],
                            onChanged: (val) {
                              setDialogState(() {
                                selectedEscolaId = val;
                              });
                            },
                          ),
                        ],
                      ),
                      const SizedBox(height: 24),

                      // Footer Buttons
                      Row(
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [
                          TextButton(
                            onPressed: () => Navigator.pop(context),
                            child: const Text('Cancelar', style: TextStyle(color: Colors.white54)),
                          ),
                          const SizedBox(width: 12),
                          ElevatedButton(
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFF10B981),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
                              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                            ),
                            onPressed: () {
                              if (nameController.text.trim().isEmpty || emailController.text.trim().isEmpty) {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(
                                    content: Text('Preencha o nome e o e-mail do servidor.'),
                                    backgroundColor: Color(0xFFEF4444),
                                  ),
                                );
                                return;
                              }
                              Navigator.pop(context);
                              _updateUser(
                                u['id'],
                                nameController.text.trim(),
                                emailController.text.trim(),
                                selectedRole,
                                selectedEscolaId,
                              );
                            },
                            child: const Text(
                              'Salvar Alterações',
                              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            );
          },
        );
      },
    );
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
                        SafeAvatar(
                          imageUrl: u['avatar_url']?.toString() ?? '',
                          initials: () {
                            final parts = (u['nome'] ?? 'U').toString().split(' ').where((p) => p.isNotEmpty).toList();
                            if (parts.length >= 2) {
                              return '${parts[0][0]}${parts[parts.length - 1][0]}'.toUpperCase();
                            }
                            return (u['nome'] ?? 'U').toString().substring(0, 1).toUpperCase();
                          }(),
                          roleColor: roleColor,
                          radius: 18,
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Flexible(
                                    child: Text(
                                      u['nome'] ?? 'Sem Nome',
                                      overflow: TextOverflow.ellipsis,
                                      style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14, fontFamily: 'Outfit'),
                                    ),
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
                          onPressed: () => _showEditDialog(u),
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
