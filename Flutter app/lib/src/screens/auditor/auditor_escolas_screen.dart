import 'package:flutter/material.dart';
import '../../widgets/base_layout.dart';

class SchoolCompliance {
  final String name;
  final String director;
  final double complianceRate;
  final int activeAlerts;
  final String lastAudit;

  SchoolCompliance({
    required this.name,
    required this.director,
    required this.complianceRate,
    required this.activeAlerts,
    required this.lastAudit,
  });
}

class AuditorEscolasScreen extends StatefulWidget {
  const AuditorEscolasScreen({super.key});

  @override
  State<AuditorEscolasScreen> createState() => _AuditorEscolasScreenState();
}

class _AuditorEscolasScreenState extends State<AuditorEscolasScreen> {
  final List<SchoolCompliance> _schools = [
    SchoolCompliance(name: 'Escola Municipal Monteiro Lobato', director: 'Ana Paula Silva', complianceRate: 92.4, activeAlerts: 1, lastAudit: 'Ontem'),
    SchoolCompliance(name: 'CMEI Cantinho da Criança', director: 'Roberto Santos', complianceRate: 85.0, activeAlerts: 1, lastAudit: 'Hoje'),
    SchoolCompliance(name: 'EMEF Doutor Ulysses Guimarães', director: 'Maria Oliveira', complianceRate: 100.0, activeAlerts: 1, lastAudit: 'Ontem'),
    SchoolCompliance(name: 'CMEI Casulo Feliz', director: 'Sandra Regina', complianceRate: 100.0, activeAlerts: 0, lastAudit: '3 dias atrás'),
    SchoolCompliance(name: 'Escola Municipal Rui Barbosa', director: 'Carlos Souza', complianceRate: 98.2, activeAlerts: 0, lastAudit: '5 dias atrás'),
  ];

  String _searchQuery = '';

  @override
  Widget build(BuildContext context) {
    final filteredSchools = _schools.where((s) {
      final nameLower = s.name.toLowerCase();
      final directorLower = s.director.toLowerCase();
      final queryLower = _searchQuery.toLowerCase();
      return nameLower.contains(queryLower) || directorLower.contains(queryLower);
    }).toList();

    return BaseLayout(
      title: 'Monitorar Escolas',
      currentRoute: '/auditor/escolas',
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Search Input
            Container(
              decoration: BoxDecoration(
                color: const Color(0xFF1E293B),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.white.withOpacity(0.08)),
              ),
              child: TextField(
                style: const TextStyle(color: Colors.white),
                decoration: InputDecoration(
                  hintText: 'Pesquisar escola ou diretor...',
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

            // Header info
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Conformidade das Unidades',
                  style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16, fontFamily: 'Outfit'),
                ),
                Text(
                  '${filteredSchools.length} escolas',
                  style: TextStyle(color: Colors.white.withOpacity(0.5), fontSize: 12),
                ),
              ],
            ),
            const SizedBox(height: 12),

            // Schools list
            Expanded(
              child: ListView.builder(
                itemCount: filteredSchools.length,
                itemBuilder: (context, index) {
                  final school = filteredSchools[index];
                  final isConforming = school.complianceRate >= 95.0;
                  final rateColor = isConforming
                      ? const Color(0xFF10B981)
                      : school.complianceRate >= 80.0
                          ? const Color(0xFFF59E0B)
                          : const Color(0xFFEF4444);

                  return Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    decoration: BoxDecoration(
                      color: const Color(0xFF1E293B),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: Colors.white.withOpacity(0.05)),
                    ),
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Title and rate info
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Expanded(
                              child: Text(
                                school.name,
                                style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14, fontFamily: 'Outfit'),
                              ),
                            ),
                            const SizedBox(width: 8),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                              decoration: BoxDecoration(
                                color: rateColor.withOpacity(0.1),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Text(
                                '${school.complianceRate}%',
                                style: TextStyle(color: rateColor, fontWeight: FontWeight.bold, fontSize: 13),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),
                        const Divider(color: Colors.white10, height: 1),
                        const SizedBox(height: 12),

                        // Secondary attributes
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text('Direção Escolar', style: TextStyle(color: Colors.white30, fontSize: 10)),
                                const SizedBox(height: 2),
                                Text(school.director, style: const TextStyle(color: Colors.white70, fontSize: 12, fontWeight: FontWeight.w600)),
                              ],
                            ),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text('Alertas Ativos', style: TextStyle(color: Colors.white30, fontSize: 10)),
                                const SizedBox(height: 2),
                                Text(
                                  school.activeAlerts > 0 ? '${school.activeAlerts} ativos' : 'Nenhum',
                                  style: TextStyle(
                                    color: school.activeAlerts > 0 ? const Color(0xFFEF4444) : Colors.white70,
                                    fontSize: 12,
                                    fontWeight: school.activeAlerts > 0 ? FontWeight.bold : FontWeight.normal,
                                  ),
                                ),
                              ],
                            ),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text('Última Auditoria', style: TextStyle(color: Colors.white30, fontSize: 10)),
                                const SizedBox(height: 2),
                                Text(school.lastAudit, style: const TextStyle(color: Colors.white70, fontSize: 12, fontWeight: FontWeight.w600)),
                              ],
                            ),
                          ],
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
