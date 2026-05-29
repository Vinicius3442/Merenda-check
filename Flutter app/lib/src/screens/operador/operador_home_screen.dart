import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import '../../providers/auth_provider.dart';
import '../../widgets/base_layout.dart';

class OperadorHomeScreen extends StatelessWidget {
  const OperadorHomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final user = context.watch<AuthProvider>().user;

    return BaseLayout(
      title: 'Painel Geral',
      currentRoute: '/operador',
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Olá, ${user?.name ?? 'Operador'}',
              style: const TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: Colors.white,
                fontFamily: 'Outfit',
              ),
            ),
            const SizedBox(height: 4),
            Text(
              'Perfil: ${user?.role ?? ''}',
              style: TextStyle(
                fontSize: 14,
                color: Colors.white.withOpacity(0.6),
              ),
            ),
            const SizedBox(height: 32),
            _buildActionCard(
              context,
              title: 'Entrada de Insumos',
              icon: Icons.inventory_2_outlined,
              color: const Color(0xFF3B82F6),
              onTap: () => context.push('/operador/entrada'),
            ),
            const SizedBox(height: 16),
            _buildActionCard(
              context,
              title: 'Baixa de Insumo (FIFO)',
              icon: Icons.outbox_outlined,
              color: const Color(0xFFF59E0B),
              onTap: () => context.push('/operador/baixa'),
            ),
            const SizedBox(height: 16),
            _buildActionCard(
              context,
              title: 'Registrar Refeição',
              icon: Icons.restaurant_outlined,
              color: const Color(0xFF10B981),
              onTap: () => context.push('/operador/refeicao'),
            ),
            const SizedBox(height: 16),
            _buildActionCard(
              context,
              title: 'Sobra Limpa',
              icon: Icons.delete_outline,
              color: const Color(0xFFEF4444),
              onTap: () => context.push('/operador/sobra'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildActionCard(BuildContext context, {required String title, required IconData icon, required Color color, required VoidCallback onTap}) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: const Color(0xFF1E293B),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: Colors.white.withOpacity(0.05)),
          boxShadow: [
            BoxShadow(
              color: color.withOpacity(0.05),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: color.withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, color: color, size: 28),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Text(
                title,
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: Colors.white,
                  fontFamily: 'Outfit',
                ),
              ),
            ),
            const Icon(Icons.chevron_right, color: Colors.white38),
          ],
        ),
      ),
    );
  }
}
