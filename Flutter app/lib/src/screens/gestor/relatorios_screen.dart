import 'package:flutter/material.dart';
import '../../widgets/base_layout.dart';

class ReportType {
  final String title;
  final String desc;
  final IconData icon;
  final Color color;

  ReportType(this.title, this.desc, this.icon, this.color);
}

class RelatoriosScreen extends StatefulWidget {
  const RelatoriosScreen({super.key});

  @override
  State<RelatoriosScreen> createState() => _RelatoriosScreenState();
}

class _RelatoriosScreenState extends State<RelatoriosScreen> {
  final List<ReportType> _reportTypes = [
    ReportType('Demonstrativo de Consumo', 'Consolidação de refeições servidas e insumos utilizados por período.', Icons.analytics, const Color(0xFF10B981)),
    ReportType('Razão de Movimentação Física', 'Livro de registro de entradas e saídas físicas do almoxarifado escolar.', Icons.swap_horiz, const Color(0xFF3B82F6)),
    ReportType('Certidão de Conformidade PNAE', 'Certificado de alinhamento com fichas técnicas e cardápio nutricional.', Icons.gavel, const Color(0xFFF59E0B)),
  ];

  final List<Map<String, String>> _pastReports = [
    {'title': 'Conformidade_Maio_2026.pdf', 'date': '24/05/2026', 'size': '240 KB'},
    {'title': 'Consumo_Semanal_15_Maio.pdf', 'date': '17/05/2026', 'size': '1.2 MB'},
    {'title': 'Razao_Movimentacao_Abril.pdf', 'date': '30/04/2026', 'size': '3.4 MB'},
  ];

  bool _generating = false;
  String? _generatingTitle;

  void _generateReport(ReportType type) async {
    setState(() {
      _generating = true;
      _generatingTitle = type.title;
    });

    await Future.delayed(const Duration(seconds: 2));

    if (mounted) {
      setState(() {
        _generating = false;
        _pastReports.insert(0, {
          'title': '${type.title.replaceAll(' ', '_')}_Gerado_${DateTime.now().day}_${DateTime.now().month}.pdf',
          'date': 'Hoje',
          'size': '450 KB',
        });
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Sucesso: "${type.title}" gerado e salvo em downloads!'),
          backgroundColor: const Color(0xFF10B981),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return BaseLayout(
      title: 'Relatórios PNAE',
      currentRoute: '/gestor/relatorios',
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Geração de Relatórios',
              style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold, fontFamily: 'Outfit'),
            ),
            const SizedBox(height: 4),
            Text(
              'Emita documentos oficiais, extratos de conformidade e auditorias.',
              style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 13),
            ),
            const SizedBox(height: 24),

            // Loading overlay state
            if (_generating) ...[
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: const Color(0xFF3B82F6).withOpacity(0.1),
                  border: Border.all(color: const Color(0xFF3B82F6).withOpacity(0.3)),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Row(
                  children: [
                    const SizedBox(
                      width: 24, height: 24,
                      child: CircularProgressIndicator(color: Color(0xFF3B82F6), strokeWidth: 2),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Processando e assinando criptograficamente...',
                            style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            'Gerando: $_generatingTitle',
                            style: TextStyle(color: Colors.white.withOpacity(0.5), fontSize: 11),
                          ),
                        ],
                      ),
                    )
                  ],
                ),
              ),
              const SizedBox(height: 24),
            ],

            // Available report configurations list
            ListView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: _reportTypes.length,
              itemBuilder: (context, index) {
                final type = _reportTypes[index];
                return Container(
                  margin: const EdgeInsets.only(bottom: 12),
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: const Color(0xFF1E293B),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: Colors.white.withOpacity(0.05)),
                  ),
                  child: Row(
                    children: [
                      Container(
                        width: 44, height: 44,
                        decoration: BoxDecoration(
                          color: type.color.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: Icon(type.icon, color: type.color, size: 20),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              type.title,
                              style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14, fontFamily: 'Outfit'),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              type.desc,
                              style: TextStyle(color: Colors.white.withOpacity(0.5), fontSize: 11, height: 1.4),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 8),
                      IconButton(
                        onPressed: _generating ? null : () => _generateReport(type),
                        icon: const Icon(Icons.download, color: Color(0xFF10B981)),
                        style: IconButton.styleFrom(
                          backgroundColor: const Color(0xFF10B981).withOpacity(0.1),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
            const SizedBox(height: 28),

            // History section
            const Text(
              'Histórico de Emissões Recentes',
              style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16, fontFamily: 'Outfit'),
            ),
            const SizedBox(height: 12),
            Container(
              decoration: BoxDecoration(
                color: const Color(0xFF1E293B),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.white.withOpacity(0.05)),
              ),
              child: ListView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: _pastReports.length,
                itemBuilder: (context, index) {
                  final report = _pastReports[index];
                  return Container(
                    decoration: BoxDecoration(
                      border: index == _pastReports.length - 1
                          ? null
                          : Border(bottom: BorderSide(color: Colors.white.withOpacity(0.05))),
                    ),
                    child: ListTile(
                      leading: const Icon(Icons.picture_as_pdf, color: Color(0xFFEF4444)),
                      title: Text(
                        report['title']!,
                        style: const TextStyle(color: Colors.white70, fontSize: 13, fontWeight: FontWeight.w600),
                      ),
                      subtitle: Text(
                        'Emissão: ${report['date']} • Tamanho: ${report['size']}',
                        style: TextStyle(color: Colors.white.withOpacity(0.3), fontSize: 10),
                      ),
                      trailing: const Icon(Icons.remove_red_eye, color: Colors.white38, size: 18),
                      onTap: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text('Visualizando ${report['title']}...'),
                            backgroundColor: const Color(0xFF3B82F6),
                          ),
                        );
                      },
                    ),
                  );
                },
              ),
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }
}
