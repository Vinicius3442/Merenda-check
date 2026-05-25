import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import 'providers/auth_provider.dart';
import 'screens/auth/login_screen.dart';
import 'screens/operador/operador_home_screen.dart';
import 'screens/operador/entrada_insumo_screen.dart';
import 'screens/operador/baixa_insumo_screen.dart';
import 'screens/operador/registrar_refeicao_screen.dart';
import 'screens/operador/sobra_limpa_screen.dart';

final router = GoRouter(
  initialLocation: '/login',
  redirect: (BuildContext context, GoRouterState state) {
    final auth = context.read<AuthProvider>();
    final isLoggingIn = state.matchedLocation == '/login';

    if (!auth.isAuthenticated && !isLoggingIn) return '/login';
    if (auth.isAuthenticated && isLoggingIn) {
      if (auth.user?.role.toLowerCase().contains('operador') ?? false) {
        return '/operador';
      }
      // Outros papéis podem ser direcionados para suas próprias homes depois.
      return '/operador'; 
    }
    return null;
  },
  routes: [
    GoRoute(
      path: '/login',
      builder: (context, state) => const LoginScreen(),
    ),
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
      path: '/operador/refeicao',
      builder: (context, state) => const RegistrarRefeicaoScreen(),
    ),
    GoRoute(
      path: '/operador/sobra',
      builder: (context, state) => const SobraLimpaScreen(),
    ),
  ],
);
