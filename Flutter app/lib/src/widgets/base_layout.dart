import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';


class BaseLayout extends StatelessWidget {
  final String title;
  final Widget body;
  final String currentRoute;
  final List<Widget>? actions;

  const BaseLayout({
    super.key,
    required this.title,
    required this.body,
    required this.currentRoute,
    this.actions,
  });

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final user = auth.user;
    final role = user?.role.toLowerCase() ?? 'operador';

    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      appBar: AppBar(
        backgroundColor: const Color(0xFF1E293B),
        elevation: 0,
        title: Text(
          title,
          style: const TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
            fontFamily: 'Outfit',
            fontSize: 20,
          ),
        ),
        iconTheme: const IconThemeData(color: Colors.white),
        actions: [
          if (actions != null) ...actions!,
          Padding(
            padding: const EdgeInsets.only(right: 12.0),
            child: CircleAvatar(
              backgroundColor: const Color(0xFF10B981).withOpacity(0.2),
              child: Text(
                user?.initials ?? 'U',
                style: const TextStyle(
                  color: Color(0xFF10B981),
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
        ],
      ),
      drawer: Drawer(
        backgroundColor: const Color(0xFF0F172A),
        child: Column(
          children: [
            // Header Drawer
            UserAccountsDrawerHeader(
              decoration: const BoxDecoration(
                color: Color(0xFF1E293B),
                border: Border(
                  bottom: BorderSide(color: Color(0xFF10B981), width: 1),
                ),
              ),
              currentAccountPicture: CircleAvatar(
                backgroundColor: const Color(0xFF10B981),
                child: Text(
                  user?.initials ?? 'U',
                  style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 24,
                  ),
                ),
              ),
              accountName: Text(
                user?.name ?? 'Usuário',
                style: const TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                  fontFamily: 'Outfit',
                ),
              ),
              accountEmail: Text(
                'Perfil: ${user?.role ?? 'Indefinido'}',
                style: TextStyle(
                  color: Colors.white.withOpacity(0.6),
                  fontSize: 13,
                ),
              ),
            ),

            // Navigation Options by Role
            Expanded(
              child: ListView(
                padding: EdgeInsets.zero,
                children: _buildDrawerItems(context, role),
              ),
            ),

            // Logout Option
            const Divider(color: Colors.white10),
            ListTile(
              leading: const Icon(Icons.logout, color: Colors.redAccent),
              title: const Text(
                'Sair do Sistema',
                style: TextStyle(color: Colors.redAccent, fontWeight: FontWeight.w600),
              ),
              onTap: () async {
                Navigator.of(context).pop(); // Close drawer
                await auth.logout();
                if (context.mounted) {
                  context.go('/login');
                }
              },
            ),
            const SizedBox(height: 16),
          ],
        ),
      ),
      body: body,
    );
  }

  List<Widget> _buildDrawerItems(BuildContext context, String role) {
    List<Widget> items = [];

    // Dashboard Operador
    if (role.contains('operador')) {
      items.addAll([
        _drawerItem(context, Icons.dashboard, 'Painel Geral', '/operador'),
        _drawerItem(context, Icons.qr_code_scanner, 'Entrada de Lote', '/operador/entrada'),
        _drawerItem(context, Icons.warehouse, 'Baixa de Insumo', '/operador/baixa'),
        _drawerItem(context, Icons.restaurant, 'Registrar Refeição', '/operador/refeicao'),
        _drawerItem(context, Icons.scale, 'Resto-Ingesta (Sobras)', '/operador/sobra'),
      ]);
    }
    // Dashboard Gestor
    else if (role.contains('gestor')) {
      items.addAll([
        _drawerItem(context, Icons.analytics, 'Painel Geral', '/gestor'),
        _drawerItem(context, Icons.inventory_2, 'Gestão de Estoque', '/gestor/estoque'),
        _drawerItem(context, Icons.description, 'Relatórios PNAE', '/gestor/relatorios'),
      ]);
    }
    // Dashboard Auditor
    else if (role.contains('auditor')) {
      items.addAll([
        _drawerItem(context, Icons.account_balance, 'Painel Municipal', '/auditor'),
        _drawerItem(context, Icons.school, 'Monitorar Escolas', '/auditor/escolas'),
        _drawerItem(context, Icons.share, 'Rastreabilidade de Lotes', '/auditor/rastrear'),
        _drawerItem(context, Icons.warning_amber, 'Alertas Críticos', '/auditor/investigar'),
      ]);
    }
    // Dashboard Nutrição
    else if (role.contains('nutri')) {
      items.addAll([
        _drawerItem(context, Icons.monitor_weight_outlined, 'Painel Nutrição', '/nutricao'),
        _drawerItem(context, Icons.calendar_month, 'Gestão de Cardápios', '/nutricao/cardapios'),
        _drawerItem(context, Icons.menu_book, 'Fichas Técnicas', '/nutricao/fichas'),
      ]);
    }
    // Dashboard Licitação
    else if (role.contains('licita') || role.contains('compra')) {
      items.addAll([
        _drawerItem(context, Icons.monetization_on, 'Empenhos e Saldo', '/licitacao'),
        _drawerItem(context, Icons.handshake, 'Fornecedores', '/licitacao/fornecedores'),
      ]);
    }
    // Dashboard Admin
    else if (role.contains('admin') || role.contains('sys')) {
      items.addAll([
        _drawerItem(context, Icons.people, 'Gestão de Usuários', '/admin'),
        _drawerItem(context, Icons.lock_person, 'Logs de Auditoria (TI)', '/admin/audit-ti'),
      ]);
    }
    // Dashboard Transportadora
    else if (role.contains('transporte') || role.contains('logist')) {
      items.addAll([
        _drawerItem(context, Icons.local_shipping, 'Painel de Entregas', '/transportadora'),
        _drawerItem(context, Icons.qr_code, 'Emitir Lote Criptográfico', '/transportadora/emitir-lote'),
      ]);
    }

    return items;
  }

  Widget _drawerItem(
    BuildContext context,
    IconData icon,
    String label,
    String route,
  ) {
    final isSelected = currentRoute == route;
    final primaryColor = const Color(0xFF10B981);

    return ListTile(
      leading: Icon(
        icon,
        color: isSelected ? primaryColor : Colors.white54,
      ),
      title: Text(
        label,
        style: TextStyle(
          color: isSelected ? primaryColor : Colors.white70,
          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
        ),
      ),
      selected: isSelected,
      selectedTileColor: primaryColor.withOpacity(0.08),
      onTap: () {
        Navigator.of(context).pop(); // Close drawer
        if (!isSelected) {
          context.go(route);
        }
      },
    );
  }
}
