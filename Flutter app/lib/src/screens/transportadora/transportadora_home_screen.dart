import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../widgets/base_layout.dart';

class Shipment {
  final String batchCode;
  final String school;
  final String quantity;
  final String status;
  final Color color;

  Shipment(this.batchCode, this.school, this.quantity, this.status, this.color);
}

class TransportadoraHomeScreen extends StatelessWidget {
  TransportadoraHomeScreen({super.key});

  final List<Shipment> _shipments = [
    Shipment('#BOV-4820', 'E. M. Monteiro Lobato', '50.0 kg (Carne Bovina Moída)', 'ENTREGUE', const Color(0xFF10B981)),
    Shipment('#FRG-481', 'CMEI Cantinho da Criança', '80.0 kg (Peito de Frango)', 'ENTREGUE', const Color(0xFF10B981)),
    Shipment('#MIL-3022', 'EMEF Doutor Ulysses Guimarães', '120.0 kg (Leite em Pó)', 'EM TRÂNSITO', const Color(0xFF3B82F6)),
  ];

  @override
  Widget build(BuildContext context) {
    return BaseLayout(
      title: 'Painel de Entregas',
      currentRoute: '/transportadora',
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Welcome
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Logística de Distribuição',
                        style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold, fontFamily: 'Outfit'),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Acompanhe remessas e guias de transporte.',
                        style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 13),
                      ),
                    ],
                  ),
                ),
                ElevatedButton.icon(
                  onPressed: () => context.push('/transportadora/emitir-lote'),
                  icon: const Icon(Icons.add, size: 16),
                  label: const Text('Emitir Lote'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF10B981),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),

            // Active deliveries list
            const Text(
              'Guias e Remessas Ativas',
              style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16, fontFamily: 'Outfit'),
            ),
            const SizedBox(height: 12),
            Expanded(
              child: ListView.builder(
                itemCount: _shipments.length,
                itemBuilder: (context, index) {
                  final s = _shipments[index];
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
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              s.batchCode,
                              style: const TextStyle(color: Color(0xFF10B981), fontWeight: FontWeight.bold, fontSize: 14, fontFamily: 'Outfit'),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                              decoration: BoxDecoration(
                                color: s.color.withOpacity(0.1),
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: Text(
                                s.status,
                                style: TextStyle(color: s.color, fontWeight: FontWeight.bold, fontSize: 9),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 10),
                        Text(
                          s.school,
                          style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          s.quantity,
                          style: TextStyle(color: Colors.white.withOpacity(0.5), fontSize: 12),
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
