import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';

class RoleItem {
  final String key;
  final IconData icon;
  final String title;
  final Color color;

  RoleItem(this.key, this.icon, this.title, this.color);
}

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailController = TextEditingController();
  final _senhaController = TextEditingController();
  bool _isLoading = false;
  String? _selectedRole;
  bool _keepConnected = false;

  final List<RoleItem> roles = [
    RoleItem('operador', Icons.restaurant, 'Operador', const Color(0xFF10b981)),
    RoleItem('gestor', Icons.bar_chart, 'Gestor', const Color(0xFF3b82f6)),
    RoleItem('nutricao', Icons.apple, 'Nutrição', const Color(0xFF10b981)),
    RoleItem('licitacao', Icons.edit_document, 'Licitação', const Color(0xFFf59e0b)),
    RoleItem('auditor', Icons.account_balance, 'Auditor', const Color(0xFFeab308)),
    RoleItem('transportadora', Icons.local_shipping, 'Logística', const Color(0xFF8b5cf6)),
    RoleItem('admin', Icons.dns, 'SysAdmin', const Color(0xFFef4444)),
  ];

  void _handleRoleSelect(String key) {
    setState(() {
      _selectedRole = key;
      _emailController.text = '$key@merendacheck.gov.br';
      _senhaController.text = 'Merenda@2026';
    });
  }

  void _login() async {
    if (_selectedRole == null || _emailController.text.isEmpty || _senhaController.text.isEmpty) return;

    setState(() {
      _isLoading = true;
    });

    final auth = context.read<AuthProvider>();
    final success = await auth.login(_emailController.text.trim(), _senhaController.text);

    if (mounted) {
      setState(() {
        _isLoading = false;
      });
      if (success) {
        context.go('/operador');
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Credenciais inválidas ou mock não implementado para este perfil.'),
            backgroundColor: Colors.redAccent,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final selectedRoleItem = roles.where((r) => r.key == _selectedRole).firstOrNull;
    final isFormValid = _selectedRole != null && _emailController.text.isNotEmpty && _senhaController.text.isNotEmpty;

    return Scaffold(
      backgroundColor: const Color(0xFF0F172A), // Dark Slate
      body: SafeArea(
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 40.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Header
                const Text(
                  'Acesso ao Sistema',
                  style: TextStyle(
                    fontSize: 32,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                    letterSpacing: -0.5,
                  ),
                ),
                const SizedBox(height: 12),
                Text(
                  'Selecione seu perfil institucional para acessar seu painel de controle personalizado.',
                  style: TextStyle(
                    fontSize: 16,
                    color: Colors.white.withOpacity(0.6),
                    height: 1.5,
                  ),
                ),
                const SizedBox(height: 40),

                // Perfil Selection
                GridView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    childAspectRatio: 2.5,
                    crossAxisSpacing: 12,
                    mainAxisSpacing: 12,
                  ),
                  itemCount: roles.length,
                  itemBuilder: (context, index) {
                    final role = roles[index];
                    final isSelected = _selectedRole == role.key;
                    
                    return GestureDetector(
                      onTap: () => _handleRoleSelect(role.key),
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 200),
                        decoration: BoxDecoration(
                          color: isSelected ? role.color.withOpacity(0.1) : Colors.white.withOpacity(0.02),
                          border: Border.all(
                            color: isSelected ? role.color : Colors.white.withOpacity(0.05),
                            width: 1,
                          ),
                          borderRadius: BorderRadius.circular(12),
                          boxShadow: isSelected ? [
                            BoxShadow(color: role.color.withOpacity(0.15), blurRadius: 12, offset: const Offset(0, 4))
                          ] : [],
                        ),
                        padding: const EdgeInsets.symmetric(horizontal: 12),
                        child: Row(
                          children: [
                            Icon(role.icon, color: isSelected ? role.color : Colors.white.withOpacity(0.5), size: 20),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                role.title,
                                style: TextStyle(
                                  color: isSelected ? role.color : Colors.white.withOpacity(0.6),
                                  fontWeight: FontWeight.w600,
                                  fontSize: 14,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
                const SizedBox(height: 40),

                // Inputs
                Text(
                  'E-mail Institucional',
                  style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: Colors.white.withOpacity(0.6)),
                ),
                const SizedBox(height: 8),
                _buildInput(
                  controller: _emailController,
                  icon: Icons.email_outlined,
                  hintText: 'nome@merendacheck.gov.br',
                ),
                const SizedBox(height: 20),
                Text(
                  'Senha de Acesso',
                  style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: Colors.white.withOpacity(0.6)),
                ),
                const SizedBox(height: 8),
                _buildInput(
                  controller: _senhaController,
                  icon: Icons.lock_outline,
                  hintText: '••••••••',
                  obscureText: true,
                ),
                const SizedBox(height: 24),

                // Options
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        SizedBox(
                          height: 24,
                          width: 24,
                          child: Checkbox(
                            value: _keepConnected,
                            onChanged: (val) => setState(() => _keepConnected = val ?? false),
                            activeColor: const Color(0xFF10b981),
                            side: BorderSide(color: Colors.white.withOpacity(0.3)),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(4)),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Text('Manter conectado', style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 14)),
                      ],
                    ),
                    Text('Esqueceu a senha?', style: TextStyle(color: const Color(0xFF10b981), fontSize: 14, fontWeight: FontWeight.w600)),
                  ],
                ),
                const SizedBox(height: 40),

                // Submit Button
                SizedBox(
                  width: double.infinity,
                  height: 56,
                  child: ElevatedButton(
                    onPressed: isFormValid && !_isLoading ? _login : null,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF10b981),
                      disabledBackgroundColor: const Color(0xFF10b981).withOpacity(0.5),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      elevation: isFormValid ? 8 : 0,
                      shadowColor: const Color(0xFF10b981).withOpacity(0.5),
                    ),
                    child: _isLoading
                        ? const SizedBox(
                            width: 24, height: 24,
                            child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                          )
                        : Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const Icon(Icons.login, color: Colors.white, size: 20),
                              const SizedBox(width: 12),
                              Text(
                                selectedRoleItem != null ? 'Acessar como ${selectedRoleItem.title}' : 'Selecione seu Perfil',
                                style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white),
                              ),
                            ],
                          ),
                  ),
                ),
                const SizedBox(height: 40),
                
                // Footer
                Center(
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.shield, color: const Color(0xFF10b981).withOpacity(0.8), size: 16),
                      const SizedBox(width: 8),
                      Text(
                        'Acesso restrito. Ambiente seguro.',
                        style: TextStyle(color: Colors.white.withOpacity(0.5), fontSize: 12),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildInput({required TextEditingController controller, required IconData icon, required String hintText, bool obscureText = false}) {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B).withOpacity(0.5),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.white.withOpacity(0.1)),
      ),
      child: TextField(
        controller: controller,
        obscureText: obscureText,
        style: const TextStyle(color: Colors.white),
        decoration: InputDecoration(
          hintText: hintText,
          hintStyle: TextStyle(color: Colors.white.withOpacity(0.3)),
          prefixIcon: Icon(icon, color: Colors.white.withOpacity(0.5)),
          border: InputBorder.none,
          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
        ),
      ),
    );
  }
}
