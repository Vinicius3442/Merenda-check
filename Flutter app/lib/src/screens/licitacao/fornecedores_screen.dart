import 'package:flutter/material.dart';
import '../../widgets/base_layout.dart';

class Supplier {
  final String name;
  final String category;
  final double score;
  final String status;
  final Color statusColor;

  Supplier(this.name, this.category, this.score, this.status, this.statusColor);
}

class FornecedoresScreen extends StatelessWidget {
  FornecedoresScreen({super.key});

  final List<Supplier> _suppliers = [
    Supplier('Hortifrúti Campo Limpo', 'Hortifrúti Frescos', 97.4, 'ATIVO', const Color(0xFF10B981)),
    Supplier('Distribuidora Laticínios Sul', 'Laticínios e Frios', 95.0, 'ATIVO', const Color(0xFF10B981)),
    Supplier('Cooperativa AgroFamiliar', 'Agricultura Familiar', 99.8, 'ATIVO', const Color(0xFF10B981)),
    Supplier('Frigorífico Boi Gordo S/A', 'Carnes e Proteínas', 89.2, 'EM AUDITORIA', const Color(0xFFF59E0B)),
  ];

  @override
  Widget build(BuildContext context) {
    return BaseLayout(
      title: 'Fornecedores',
      currentRoute: '/licitacao/fornecedores',
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Parceiros Homologados',
              style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold, fontFamily: 'Outfit'),
            ),
            const SizedBox(height: 4),
            Text(
              'Fornecedores cadastrados e seus índices de conformidade de entrega.',
              style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 13),
            ),
            const SizedBox(height: 20),

            // Suppliers List
            Expanded(
              child: ListView.builder(
                itemCount: _suppliers.length,
                itemBuilder: (context, index) {
                  final s = _suppliers[index];
                  return Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: const Color(0xFF1E293B),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: Colors.white.withOpacity(0.05)),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Header
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  s.category,
                                  style: const TextStyle(color: Color(0xFF10B981), fontSize: 10, fontWeight: FontWeight.bold),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  s.name,
                                  style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14, fontFamily: 'Outfit'),
                                ),
                              ],
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                              decoration: BoxDecoration(
                                color: s.statusColor.withOpacity(0.1),
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: Text(
                                s.status,
                                style: TextStyle(color: s.statusColor, fontWeight: FontWeight.bold, fontSize: 9),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),
                        const Divider(color: Colors.white10, height: 1),
                        const SizedBox(height: 12),

                        // Performance info
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text('Índice de Entrega Conforme', style: TextStyle(color: Colors.white30, fontSize: 10)),
                                const SizedBox(height: 2),
                                Row(
                                  children: [
                                    const Icon(Icons.star, color: Color(0xFFF59E0B), size: 14),
                                    const SizedBox(width: 4),
                                    Text(
                                      '${s.score}%',
                                      style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                            OutlinedButton(
                              onPressed: () {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(content: Text('Carregando auditoria completa de "${s.name}"...')),
                                );
                              },
                              style: OutlinedButton.styleFrom(
                                side: BorderSide(color: Colors.white.withOpacity(0.15)),
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                              ),
                              child: const Text('Auditar Fatura', style: TextStyle(color: Colors.white70, fontSize: 11)),
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
