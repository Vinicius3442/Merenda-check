import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../widgets/base_layout.dart';

class CriticalAlert {
  final String school;
  final String type;
  final String description;
  final String severity;
  final String timeAgo;
  final Color severityColor;

  CriticalAlert({
    required this.school,
    required this.type,
    required this.description,
    required this.severity,
    required this.timeAgo,
    required this.severityColor,
  });
}

class AuditorHomeScreen extends StatefulWidget {
  const AuditorHomeScreen({super.key});

  @override
  State<AuditorHomeScreen> createState() => _AuditorHomeScreenState();
}

class _AuditorHomeScreenState extends State<AuditorHomeScreen> {
  final List<CriticalAlert> _alerts = [
    CriticalAlert(
      school: 'Escola Municipal Monteiro Lobato',
      type: 'Desvio de Resto-Ingesta',
      description: 'Sobras de refeição registradas estão 45% acima da média móvel predita para sexta-feira.',
      severity: 'MÉDIA',
      timeAgo: '2 horas atrás',
      severityColor: const Color(0xFFF59E0B),
    ),
    CriticalAlert(
      school: 'CMEI Cantinho da Criança',
      type: 'Ruptura Inevitável FIFO',
      description: 'Lote #MIL-3022 de leite em pó expira amanhã sem previsão de consumo imediato.',
      severity: 'CRÍTICA',
      timeAgo: '4 horas atrás',
      severityColor: const Color(0xFFEF4444),
    ),
    CriticalAlert(
      school: 'EMEF Doutor Ulysses Guimarães',
      type: 'Recebimento Recusado',
      description: 'Guia de transporte recusada no recebimento por inconformidade de temperatura fria (-2°C).',
      severity: 'MÉDIA',
      timeAgo: '1 dia atrás',
      severityColor: const Color(0xFFF59E0B),
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return BaseLayout(
      title: 'Painel Municipal',
      currentRoute: '/auditor',
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Welcome
            const Text(
              'Auditoria de Alimentos',
              style: TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.bold, fontFamily: 'Outfit'),
            ),
            const SizedBox(height: 4),
            Text(
              'Monitoramento geral da saúde do PNAE municipal.',
              style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 13),
            ),
            const SizedBox(height: 20),

            // Municipal KPIs
            GridView.count(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisCount: 2,
              childAspectRatio: 1.4,
              crossAxisSpacing: 12,
              mainAxisSpacing: 12,
              children: [
                _buildKpiCard('Escolas Monitoradas', '48 Escolas', Icons.school, const Color(0xFF3B82F6)),
                _buildKpiCard('Alertas Ativos', '3 Alertas', Icons.notifications_active, const Color(0xFFEF4444)),
                _buildKpiCard('Média Conformidade', '97.8%', Icons.assignment_turned_in, const Color(0xFF10B981)),
                _buildKpiCard('Refeições Hoje', '12.4K', Icons.restaurant_menu, const Color(0xFFF59E0B)),
              ],
            ),
            const SizedBox(height: 24),

            // Quick Actions
            const Text(
              'Ações do Auditor',
              style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16, fontFamily: 'Outfit'),
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: _buildActionButton(
                    context,
                    Icons.store_mall_directory,
                    'Escolas',
                    '/auditor/escolas',
                    const Color(0xFF3B82F6),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildActionButton(
                    context,
                    Icons.security,
                    'Rastrear',
                    '/auditor/rastrear',
                    const Color(0xFF10B981),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),

            // Active Critical Alerts
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Alertas Críticos Ativos',
                  style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16, fontFamily: 'Outfit'),
                ),
                TextButton(
                  onPressed: () => context.push('/auditor/investigar'),
                  child: const Text('Ver todos', style: TextStyle(color: Color(0xFF10B981), fontSize: 13)),
                ),
              ],
            ),
            const SizedBox(height: 8),

            // Alerts list
            ListView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: _alerts.length,
              itemBuilder: (context, index) {
                final alert = _alerts[index];
                return Container(
                  margin: const EdgeInsets.only(bottom: 12),
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: const Color(0xFF1E293B),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: alert.severityColor.withOpacity(0.2)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: alert.severityColor.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Text(
                              alert.severity,
                              style: TextStyle(color: alert.severityColor, fontWeight: FontWeight.bold, fontSize: 9),
                            ),
                          ),
                          Text(
                            alert.timeAgo,
                            style: TextStyle(color: Colors.white.withOpacity(0.3), fontSize: 10),
                          ),
                        ],
                      ),
                      const SizedBox(height: 10),
                      Text(
                        alert.school,
                        style: const TextStyle(color: Colors.white70, fontSize: 12, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        alert.type,
                        style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14, fontFamily: 'Outfit'),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        alert.description,
                        style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 12, height: 1.4),
                      ),
                      const SizedBox(height: 12),
                      Align(
                        alignment: Alignment.centerRight,
                        child: TextButton.icon(
                          onPressed: () => context.push('/auditor/investigar?escola=${Uri.encodeComponent(alert.school)}&alerta=${Uri.encodeComponent(alert.type)}'),
                          icon: const Icon(Icons.search, size: 14, color: Color(0xFF10B981)),
                          label: const Text('Investigar Alerta', style: TextStyle(color: Color(0xFF10B981), fontSize: 12, fontWeight: FontWeight.bold)),
                          style: TextButton.styleFrom(
                            backgroundColor: const Color(0xFF10B981).withOpacity(0.08),
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                          ),
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
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
