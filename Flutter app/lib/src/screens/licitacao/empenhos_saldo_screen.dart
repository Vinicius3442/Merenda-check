import 'package:flutter/material.dart';
import '../../widgets/base_layout.dart';

class EmpenhosSaldoScreen extends StatelessWidget {
  const EmpenhosSaldoScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return BaseLayout(
      title: 'Empenhos e Saldo',
      currentRoute: '/licitacao',
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Orçamento e Compras',
              style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold, fontFamily: 'Outfit'),
            ),
            const SizedBox(height: 4),
            Text(
              'Gerenciamento financeiro dos contratos de merenda municipal.',
              style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 13),
            ),
            const SizedBox(height: 20),

            // Budget cards
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: const Color(0xFF1E293B),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: Colors.white.withOpacity(0.05)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Saldo Total Empenhado (Exercício 2026)', style: TextStyle(color: Colors.white30, fontSize: 12)),
                  const SizedBox(height: 6),
                  const Text(
                    'R\$ 4.250.000,00',
                    style: TextStyle(color: Color(0xFF10B981), fontSize: 26, fontWeight: FontWeight.bold, fontFamily: 'Outfit'),
                  ),
                  const SizedBox(height: 16),
                  const Divider(color: Colors.white10),
                  const SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      _buildMiniValue('Liquidado / Pago', 'R\$ 1.820.000,00', const Color(0xFF3B82F6)),
                      _buildMiniValue('Saldo a Executar', 'R\$ 2.430.000,00', const Color(0xFFF59E0B)),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Contracts
            const Text(
              'Contratos Públicos Ativos',
              style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16, fontFamily: 'Outfit'),
            ),
            const SizedBox(height: 12),
            _buildContractCard('Contrato #45/2025 • Hortifrúti Campo Limpo', 'Saldo Disponível: R\$ 420.000,00', 'Execução: 42%', const Color(0xFF10B981)),
            const SizedBox(height: 12),
            _buildContractCard('Contrato #88/2025 • Distribuidora Laticínios Sul', 'Saldo Disponível: R\$ 880.000,00', 'Execução: 65%', const Color(0xFF3B82F6)),
            const SizedBox(height: 12),
            _buildContractCard('Contrato #92/2025 • Cooperativa AgroFamiliar', 'Saldo Disponível: R\$ 1.130.000,00', 'Execução: 12%', const Color(0xFFF59E0B)),
          ],
        ),
      ),
    );
  }

  Widget _buildMiniValue(String label, String value, Color color) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(color: Colors.white30, fontSize: 10)),
        const SizedBox(height: 4),
        Text(value, style: TextStyle(color: color, fontSize: 14, fontWeight: FontWeight.bold, fontFamily: 'Outfit')),
      ],
    );
  }

  Widget _buildContractCard(String title, String subtitle, String status, Color color) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withOpacity(0.05)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13, fontFamily: 'Outfit')),
                const SizedBox(height: 4),
                Text(subtitle, style: TextStyle(color: Colors.white.withOpacity(0.5), fontSize: 11)),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(
              color: color.withOpacity(0.1),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Text(
              status,
              style: TextStyle(color: color, fontWeight: FontWeight.bold, fontSize: 11),
            ),
          ),
        ],
      ),
    );
  }
}
