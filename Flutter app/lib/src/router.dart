import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import 'providers/auth_provider.dart';
import 'screens/auth/landing_screen.dart';
import 'screens/auth/login_screen.dart';
import 'screens/auth/profile_screen.dart';
import 'screens/operador/operador_home_screen.dart';
import 'screens/operador/entrada_insumo_screen.dart';
import 'screens/operador/baixa_insumo_screen.dart';
import 'screens/operador/registrar_refeicao_screen.dart';
import 'screens/operador/sobra_limpa_screen.dart';
import 'screens/operador/qr_scanner_screen.dart';

// Gestor
import 'screens/gestor/gestor_home_screen.dart';
import 'screens/gestor/gestor_estoque_screen.dart';
import 'screens/gestor/relatorios_screen.dart';

// Auditor
import 'screens/auditor/auditor_home_screen.dart';
import 'screens/auditor/auditor_escolas_screen.dart';
import 'screens/auditor/rastreabilidade_screen.dart';
import 'screens/auditor/investigar_alerta_screen.dart';

// Nutrição
import 'screens/nutricao/nutricao_dashboard_screen.dart';
import 'screens/nutricao/gestao_cardapios_screen.dart';
import 'screens/nutricao/ficha_tecnica_screen.dart';

// Licitação
import 'screens/licitacao/empenhos_saldo_screen.dart';
import 'screens/licitacao/fornecedores_screen.dart';

// Admin
import 'screens/admin/gestao_usuarios_screen.dart';
import 'screens/admin/audit_trail_screen.dart';

// Transportadora
import 'screens/transportadora/transportadora_home_screen.dart';
import 'screens/transportadora/emitir_lote_screen.dart';

final router = GoRouter(
  initialLocation: '/',
  redirect: (BuildContext context, GoRouterState state) {
    final auth = context.read<AuthProvider>();
    final isLoggingIn = state.matchedLocation == '/login';
    final isLanding = state.matchedLocation == '/';

    if (!auth.isAuthenticated && !isLoggingIn && !isLanding) return '/';
    if (auth.isAuthenticated && (isLoggingIn || isLanding)) {
      final role = auth.user?.role.toLowerCase() ?? '';
      
      if (role.contains('operador')) return '/operador';
      if (role.contains('gestor')) return '/gestor';
      if (role.contains('auditor')) return '/auditor';
      if (role.contains('nutri')) return '/nutricao';
      if (role.contains('licita') || role.contains('compra')) return '/licitacao';
      if (role.contains('transporte') || role.contains('logist')) return '/transportadora';
      if (role.contains('admin') || role.contains('sys')) return '/admin';
      
      return '/operador'; 
    }
    return null;
  },
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => const LandingScreen(),
    ),
    GoRoute(
      path: '/login',
      builder: (context, state) => const LoginScreen(),
    ),
    // Profile
    GoRoute(
      path: '/profile',
      builder: (context, state) => const ProfileScreen(),
    ),
    // Operador
    GoRoute(
      path: '/operador',
      builder: (context, state) => const OperadorHomeScreen(),
    ),
    GoRoute(
      path: '/operador/entrada',
      builder: (context, state) => const EntradaInsumoScreen(),
    ),
    GoRoute(
      path: '/operador/baixa',
      builder: (context, state) => const BaixaInsumoScreen(),
    ),
    GoRoute(
      path: '/operador/scanner',
      builder: (context, state) => const QRScannerScreen(),
    ),
    GoRoute(
      path: '/operador/refeicao',
      builder: (context, state) => const RegistrarRefeicaoScreen(),
    ),
    GoRoute(
      path: '/operador/sobra',
      builder: (context, state) => const SobraLimpaScreen(),
    ),
    // Gestor
    GoRoute(
      path: '/gestor',
      builder: (context, state) => const GestorHomeScreen(),
    ),
    GoRoute(
      path: '/gestor/estoque',
      builder: (context, state) => const GestorEstoqueScreen(),
    ),
    GoRoute(
      path: '/gestor/relatorios',
      builder: (context, state) => const RelatoriosScreen(),
    ),
    // Auditor
    GoRoute(
      path: '/auditor',
      builder: (context, state) => const AuditorHomeScreen(),
    ),
    GoRoute(
      path: '/auditor/escolas',
      builder: (context, state) => const AuditorEscolasScreen(),
    ),
    GoRoute(
      path: '/auditor/rastrear',
      builder: (context, state) => const RastreabilidadeScreen(),
    ),
    GoRoute(
      path: '/auditor/investigar',
      builder: (context, state) => const InvestigarAlertaScreen(),
    ),
    // Nutrição
    GoRoute(
      path: '/nutricao',
      builder: (context, state) => const NutricaoDashboardScreen(),
    ),
    GoRoute(
      path: '/nutricao/cardapios',
      builder: (context, state) => const GestaoCardapiosScreen(),
    ),
    GoRoute(
      path: '/nutricao/fichas',
      builder: (context, state) => const FichaTecnicaScreen(),
    ),
    // Licitação
    GoRoute(
      path: '/licitacao',
      builder: (context, state) => const EmpenhosSaldoScreen(),
    ),
    GoRoute(
      path: '/licitacao/fornecedores',
      builder: (context, state) => FornecedoresScreen(),
    ),
    // Admin
    GoRoute(
      path: '/admin',
      builder: (context, state) => const GestaoUsuariosScreen(),
    ),
    GoRoute(
      path: '/admin/audit-ti',
      builder: (context, state) => AuditTrailScreen(),
    ),
    // Transportadora
    GoRoute(
      path: '/transportadora',
      builder: (context, state) => TransportadoraHomeScreen(),
    ),
    GoRoute(
      path: '/transportadora/emitir-lote',
      builder: (context, state) => const EmitirLoteScreen(),
    ),
  ],
);
