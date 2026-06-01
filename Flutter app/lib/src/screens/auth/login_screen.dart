import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../../providers/auth_provider.dart';

class _LoginScreenState extends State<LoginScreen> {
  final _emailController = TextEditingController();
  final _senhaController = TextEditingController();
  bool _isLoading = false;
  bool _keepConnected = false;

  Future<void> _resetPassword() async {
    final String email = _emailController.text.trim();
    if (email.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Por favor, informe seu e-mail institucional.'), backgroundColor: Colors.red),
      );
      return;
    }

    try {
      await Supabase.instance.client.auth.resetPasswordForEmail(email);
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Link de recuperação enviado para o seu e-mail!'), backgroundColor: Color(0xFF10B981)),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Erro ao enviar link: $e'), backgroundColor: Colors.red),
      );
    }
  }

  void _login() async {
    if (_emailController.text.isEmpty || _senhaController.text.isEmpty) return;

    setState(() => _isLoading = true);

    final auth = context.read<AuthProvider>();
    final errorMsg = await auth.login(_emailController.text.trim(), _senhaController.text);

    if (!mounted) return;
    setState(() => _isLoading = false);

    if (errorMsg == null) {
      final userRole = auth.user?.role.toLowerCase() ?? '';
      if (userRole.contains('operador')) {
        context.go('/operador');
      } else if (userRole.contains('gestor')) {
        context.go('/gestor');
      } else if (userRole.contains('auditor')) {
        context.go('/auditor');
      } else if (userRole.contains('nutri')) {
        context.go('/nutricao');
      } else if (userRole.contains('licita')) {
        context.go('/licitacao');
      } else if (userRole.contains('transport')) {
        context.go('/transportadora');
      } else if (userRole.contains('admin')) {
        context.go('/admin');
      } else {
        context.go('/operador');
      }
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(errorMsg),
          backgroundColor: errorMsg.contains('revogado') ? Colors.orange : Colors.redAccent,
          duration: const Duration(seconds: 4),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final isFormValid = _emailController.text.isNotEmpty && _senhaController.text.isNotEmpty;

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
                Center(
                  child: Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: [
                        BoxShadow(color: Colors.black.withOpacity(0.2), blurRadius: 10, offset: const Offset(0, 4)),
                      ],
                    ),
                    child: Image.asset(
                      'assets/logo.png',
                      height: 60,
                      fit: BoxFit.contain,
                    ),
                  ),
                ),
                const SizedBox(height: 24),
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
                  'Insira seu e-mail institucional e senha para acessar seu painel de controle personalizado.',
                  style: TextStyle(
                    fontSize: 16,
                    color: Colors.white.withOpacity(0.6),
                    height: 1.5,
                  ),
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
                    Flexible(
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
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
                          const Flexible(
                            child: Text('Manter conectado', style: TextStyle(color: Colors.white60, fontSize: 13), overflow: TextOverflow.ellipsis),
                          ),
                        ],
                      ),
                    ),
                    GestureDetector(
                      onTap: _resetPassword,
                      child: const Text('Esqueceu a senha?', style: TextStyle(color: Color(0xFF10b981), fontSize: 13, fontWeight: FontWeight.w600)),
                    ),
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
                        : const Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(Icons.login, color: Colors.white, size: 20),
                              const SizedBox(width: 12),
                              Text(
                                'Acessar Painel',
                                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white),
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
          filled: false,
          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
        ),
      ),
    );
  }
}
