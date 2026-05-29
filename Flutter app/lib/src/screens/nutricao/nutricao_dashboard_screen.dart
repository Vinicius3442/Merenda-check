import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../widgets/base_layout.dart';

class NutricaoDashboardScreen extends StatefulWidget {
  const NutricaoDashboardScreen({super.key});

  @override
  State<NutricaoDashboardScreen> createState() => _NutricaoDashboardScreenState();
}

class _NutricaoDashboardScreenState extends State<NutricaoDashboardScreen> {
  @override
  Widget build(BuildContext context) {
    return BaseLayout(
      title: 'Painel Nutrição',
      currentRoute: '/nutricao',
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Welcome
            const Text(
              'Gestão Nutricional',
              style: TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.bold, fontFamily: 'Outfit'),
            ),
            const SizedBox(height: 4),
            Text(
              'Planejamento de cardápios escolares em conformidade com o PNAE.',
              style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 13),
            ),
            const SizedBox(height: 20),

            // Nutrition KPIs
            GridView.count(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisCount: 2,
              childAspectRatio: 1.4,
              crossAxisSpacing: 12,
              mainAxisSpacing: 12,
              children: [
                _buildKpiCard('Calorias Média', '420 kcal', Icons.bolt, const Color(0xFFF59E0B)),
                _buildKpiCard('Conformidade PNAE', '99.5%', Icons.check_circle_outline, const Color(0xFF10B981)),
                _buildKpiCard('Cardápios Ativos', '14 Unidades', Icons.calendar_today, const Color(0xFF3B82F6)),
                _buildKpiCard('Receitas Homologadas', '45 Pratos', Icons.dining, const Color(0xFFEF4444)),
              ],
            ),
            const SizedBox(height: 24),

            // Quick navigation shortcuts
            const Text(
              'Atalhos de Planejamento',
              style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16, fontFamily: 'Outfit'),
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: _buildActionButton(
                    context,
                    Icons.calendar_month,
                    'Cardápios',
                    '/nutricao/cardapios',
                    const Color(0xFF10B981),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildActionButton(
                    context,
                    Icons.assignment,
                    'Fichas Técnicas',
                    '/nutricao/fichas',
                    const Color(0xFFF59E0B),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),

            // Compliance status PNAE Box
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFF1E293B),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFF10B981).withOpacity(0.3)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.verified_user, color: Color(0xFF10B981), size: 20),
                      const SizedBox(width: 10),
                      const Text(
                        'Padrão PNAE de Qualidade',
                        style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14, fontFamily: 'Outfit'),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  Text(
                    'Todos os cardápios em vigência no município atendem aos limites máximos de açúcar adicionado (10% das kcal) e fornecem a quantidade mínima exigida de micronutrientes (ferro, cálcio e vitamina A).',
                    style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 12, height: 1.4),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  Widget _buildKpiCard(String label, String value, IconData icon, Color color) {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withOpacity(0.05)),
      ),
      padding: const EdgeInsets.all(12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                label,
                style: TextStyle(color: Colors.white.withOpacity(0.5), fontSize: 11, fontWeight: FontWeight.w600),
              ),
              Icon(icon, color: color.withOpacity(0.8), size: 18),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            value,
            style: TextStyle(color: color, fontSize: 20, fontWeight: FontWeight.bold, fontFamily: 'Outfit'),
          ),
        ],
      ),
    );
  }

  Widget _buildActionButton(BuildContext context, IconData icon, String label, String route, Color color) {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withOpacity(0.06)),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: () => context.push(route),
          borderRadius: BorderRadius.circular(16),
          child: Padding(
            padding: const EdgeInsets.symmetric(vertical: 20.0),
            child: Column(
              children: [
                CircleAvatar(
                  backgroundColor: color.withOpacity(0.1),
                  child: Icon(icon, color: color),
                ),
                const SizedBox(height: 10),
                Text(
                  label,
                  style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14, fontFamily: 'Outfit'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
