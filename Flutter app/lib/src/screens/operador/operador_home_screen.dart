import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../../providers/auth_provider.dart';
import '../../widgets/base_layout.dart';

class OperadorHomeScreen extends StatefulWidget {
  const OperadorHomeScreen({super.key});

  @override
  State<OperadorHomeScreen> createState() => _OperadorHomeScreenState();
}

class _OperadorHomeScreenState extends State<OperadorHomeScreen> {
  List<dynamic> _estoque = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchEstoque();
  }

  Future<void> _fetchEstoque() async {
    try {
      final user = context.read<AuthProvider>().user;
      var query = Supabase.instance.client
          .from('estoque')
          .select()
          .neq('status', 'arquivado');

      if (user?.escolaId != null) {
        query = query.eq('escola_id', user!.escolaId!);
      }

      final response = await query.order('validade', ascending: true).limit(3);
      setState(() {
        _estoque = response;
        _isLoading = false;
      });
    } catch (e) {
      debugPrint('Erro ao buscar estoque: $e');
      setState(() => _isLoading = false);
    }
  }

  Map<String, dynamic> _calcularStatus(Map<String, dynamic> item) {
    final volume = num.tryParse(item['volume_kg']?.toString() ?? '0') ?? 0;
    if (volume <= 0) {
      return {'alerta': 'Esgotado', 'color': const Color(0xFFF59E0B), 'icon': Icons.inventory_2_outlined};
    }
    if (item['validade'] != null) {
      final validade = DateTime.parse(item['validade']);
      final dias = validade.difference(DateTime.now()).inDays;
      if (dias < 0) {
        return {'alerta': 'Vencido', 'color': const Color(0xFFEF4444), 'icon': Icons.warning_amber_rounded};
      }
      if (dias <= 7) {
        return {'alerta': 'Vence em $dias dias', 'color': const Color(0xFFEF4444), 'icon': Icons.hourglass_bottom};
      }
    }
    return {'alerta': 'Estoque normal', 'color': const Color(0xFF10B981), 'icon': Icons.check_circle_outline};
  }

  @override
  Widget build(BuildContext context) {
    final user = context.watch<AuthProvider>().user;

    return BaseLayout(
      title: 'Painel Operacional',
      currentRoute: '/operador',
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header Hero Banner
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [const Color(0xFF10B981).withOpacity(0.15), Colors.transparent],
                  begin: Alignment.centerLeft,
                  end: Alignment.centerRight,
                ),
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: const Color(0xFF10B981).withOpacity(0.15)),
              ),
              child: Row(
                children: [
                  Container(
                    width: 64,
                    height: 64,
                    decoration: BoxDecoration(
                      color: const Color(0xFF10B981).withOpacity(0.2),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.engineering, color: Color(0xFF10B981), size: 32),
                  ),
                  const SizedBox(width: 20),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Painel Operacional',
                          style: TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                            fontFamily: 'Outfit',
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Bom dia, ${user?.name.split(' ').first ?? 'Operador'}! Controle o fluxo de insumos e refeições de hoje.',
                          style: TextStyle(
                            fontSize: 14,
                            color: Colors.white.withOpacity(0.7),
                            height: 1.4,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Widget Resumo de Estoque
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: const Color(0xFF1E293B).withOpacity(0.8),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.white.withOpacity(0.05)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          const Icon(Icons.inventory_2, color: Color(0xFF10B981), size: 20),
                          const SizedBox(width: 10),
                          Text(
                            'ESTOQUE HOJE',
                            style: TextStyle(
                              color: Colors.white.withOpacity(0.5),
                              fontWeight: FontWeight.bold,
                              fontSize: 12,
                              letterSpacing: 1.2,
                            ),
                          ),
                        ],
                      ),
                      InkWell(
                        onTap: () => context.push('/operador/baixa'),
                        child: const Text(
                          'Ver tudo \u2192',
                          style: TextStyle(color: Color(0xFF10B981), fontSize: 13, fontWeight: FontWeight.bold),
                        ),
                      )
                    ],
                  ),
                  const SizedBox(height: 16),
                  _isLoading
                      ? const Center(child: Padding(padding: EdgeInsets.all(16.0), child: CircularProgressIndicator(color: Color(0xFF10B981))))
                      : _estoque.isEmpty
                          ? Center(
                              child: Text(
                                'Nenhum insumo em estoque.',
                                style: TextStyle(color: Colors.white.withOpacity(0.5)),
                              ),
                            )
                          : Column(
                              children: _estoque.map((item) {
                                final status = _calcularStatus(item);
                                final color = status['color'] as Color;
                                return Padding(
                                  padding: const EdgeInsets.only(bottom: 12.0),
                                  child: Row(
                                    children: [
                                      Icon(status['icon'] as IconData, color: color, size: 18),
                                      const SizedBox(width: 8),
                                      Text(
                                        '${num.tryParse(item['volume_kg']?.toString() ?? '0')?.toStringAsFixed(1) ?? '0.0'} kg',
                                        style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14),
                                      ),
                                      const SizedBox(width: 8),
                                      Expanded(
                                        child: Text(
                                          item['nome'] ?? 'Insumo',
                                          style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 13),
                                          maxLines: 1,
                                          overflow: TextOverflow.ellipsis,
                                        ),
                                      ),
                                      Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                        decoration: BoxDecoration(
                                          color: color.withOpacity(0.15),
                                          border: Border.all(color: color.withOpacity(0.3)),
                                          borderRadius: BorderRadius.circular(6),
                                        ),
                                        child: Text(
                                          status['alerta'] as String,
                                          style: TextStyle(color: color, fontSize: 10, fontWeight: FontWeight.bold),
                                        ),
                                      )
                                    ],
                                  ),
                                );
                              }).toList(),
                            ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Ações Grid
            _buildActionCard(
              context,
              title: 'Receber Insumo',
              desc: 'Conferir entrega via leitura óptica (QR Code) e registrar lote no sistema.',
              icon: Icons.qr_code_scanner,
              color: const Color(0xFF10B981),
              route: '/operador/entrada',
            ),
            const SizedBox(height: 16),
            _buildActionCard(
              context,
              title: 'Retirar para Cozinha',
              desc: 'Selecionar insumo do estoque FIFO e despachar para o preparo.',
              icon: Icons.local_fire_department,
              color: const Color(0xFFF59E0B),
              route: '/operador/baixa',
            ),
            const SizedBox(height: 16),
            _buildActionCard(
              context,
              title: 'Registrar Refeição',
              desc: 'Apontar manualmente a quantidade de refeições servidas.',
              icon: Icons.restaurant,
              color: const Color(0xFF3B82F6),
              route: '/operador/refeicao',
            ),
            const SizedBox(height: 16),
            _buildActionCard(
              context,
              title: 'Resto-Ingesta (Excedente)',
              desc: 'Pesar e declarar o excedente de produção ao final do turno.',
              icon: Icons.delete_outline,
              color: const Color(0xFFEF4444),
              route: '/operador/sobra',
            ),
            const SizedBox(height: 16),
            _buildActionCard(
              context,
              title: 'Movimentação de Saída',
              desc: 'Transferir ou remanejar insumos para outra unidade escolar.',
              icon: Icons.local_shipping,
              color: const Color(0xFF3B82F6),
              route: '/operador/saida',
            ),
            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }

  Widget _buildActionCard(
    BuildContext context, {
    required String title,
    required String desc,
    required IconData icon,
    required Color color,
    required String route,
  }) {
    return InkWell(
      onTap: () => context.push(route),
      borderRadius: BorderRadius.circular(20),
      child: Container(
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [const Color(0xFF1E293B).withOpacity(0.9), const Color(0xFF0F172A).withOpacity(0.95)],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: Colors.white.withOpacity(0.05)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: 56,
              height: 56,
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [color.withOpacity(0.2), color.withOpacity(0.1)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: color.withOpacity(0.3)),
                boxShadow: [
                  BoxShadow(color: color.withOpacity(0.15), blurRadius: 20, offset: const Offset(0, 10)),
                ],
              ),
              child: Icon(icon, color: color, size: 30),
            ),
            const SizedBox(height: 16),
            Text(
              title,
              style: const TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: Colors.white,
                fontFamily: 'Outfit',
              ),
            ),
            const SizedBox(height: 8),
            Text(
              desc,
              style: TextStyle(
                fontSize: 14,
                color: Colors.white.withOpacity(0.6),
                height: 1.5,
              ),
            ),
            const SizedBox(height: 20),
            Container(
              padding: const EdgeInsets.symmetric(vertical: 14),
              decoration: BoxDecoration(
                color: color,
                borderRadius: BorderRadius.circular(12),
                boxShadow: [
                  BoxShadow(color: color.withOpacity(0.4), blurRadius: 16, offset: const Offset(0, 8)),
                ],
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: const [
                  Text(
                    'Iniciar Operação',
                    style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
                  ),
                  SizedBox(width: 8),
                  Icon(Icons.arrow_forward, color: Colors.white, size: 18),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
