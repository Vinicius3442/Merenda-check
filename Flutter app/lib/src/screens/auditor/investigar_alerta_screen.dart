import 'package:flutter/material.dart';
import '../../widgets/base_layout.dart';

class InvestigarAlertaScreen extends StatefulWidget {
  const InvestigarAlertaScreen({super.key});

  @override
  State<InvestigarAlertaScreen> createState() => _InvestigarAlertaScreenState();
}

class _InvestigarAlertaScreenState extends State<InvestigarAlertaScreen> {
  bool _submitting = false;

  void _dispatchAudit() async {
    setState(() => _submitting = true);
    await Future.delayed(const Duration(milliseconds: 1500));
    if (mounted) {
      setState(() => _submitting = false);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Sucesso: Equipe de vigilância sanitária despachada para auditoria local!'),
          backgroundColor: Color(0xFF10B981),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return BaseLayout(
      title: 'Investigar Alerta',
      currentRoute: '/auditor/investigar',
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Investigação de Anomalias',
              style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold, fontFamily: 'Outfit'),
            ),
            const SizedBox(height: 4),
            Text(
              'Analise e investigue desvios graves de insumos ou desperdícios relatados.',
              style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 13),
            ),
            const SizedBox(height: 24),

            // Main Alert Case Card
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: const Color(0xFF1E293B),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: const Color(0xFFEF4444).withOpacity(0.4)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                        decoration: BoxDecoration(
                          color: const Color(0xFFEF4444).withOpacity(0.1),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Text(
                          'ALERTA CRÍTICO ATIVO',
                          style: TextStyle(color: Color(0xFFEF4444), fontWeight: FontWeight.bold, fontSize: 10),
                        ),
                      ),
                      const Text(
                        'Caso: #AL-20881',
                        style: TextStyle(color: Colors.white30, fontSize: 12),
                      )
                    ],
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'CMEI Cantinho da Criança',
                    style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 18, fontFamily: 'Outfit'),
                  ),
                  const SizedBox(height: 4),
                  const Text(
                    'Inconsistência de Peso no Recebimento de Lote',
                    style: TextStyle(color: Color(0xFFF59E0B), fontWeight: FontWeight.w600, fontSize: 14),
                  ),
                  const SizedBox(height: 12),
                  const Divider(color: Colors.white10),
                  const SizedBox(height: 12),

                  // Detail rows
                  _buildDetailRow('Insumo Afetado', 'Peito de Frango Congelado (Lote #FRG-481)'),
                  _buildDetailRow('Quantidade Recebida Declarada', '80.0 kg'),
                  _buildDetailRow('Quantidade Registrada no Escaneamento', '45.0 kg'),
                  _buildDetailRow('Discrepância Observada', 'Diferença de -35.0 kg (43.7% a menos)'),
                  _buildDetailRow('Motorista da Transportadora', 'Antônio Fagundes (Placa: AXC-1901)'),

                  const SizedBox(height: 20),
                  const Text(
                    'Histórico e Comentário do Recebimento:',
                    style: TextStyle(color: Colors.white70, fontSize: 12, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 6),
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: const Color(0xFF0F172A),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: const Text(
                      '"Caixas vieram com volume menor que o habitual. Ao pesar o lote, constatamos apenas 45kg. Motorista informou que o carregamento central continha apenas esse peso destinado à escola."',
                      style: TextStyle(color: Colors.white60, fontSize: 12, fontStyle: FontStyle.italic, height: 1.4),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Action section
            const Text(
              'Ações Administrativas',
              style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16, fontFamily: 'Outfit'),
            ),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFF1E293B),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.white.withOpacity(0.05)),
              ),
              child: Column(
                children: [
                  SizedBox(
                    width: double.infinity,
                    height: 52,
                    child: ElevatedButton.icon(
                      onPressed: _submitting ? null : _dispatchAudit,
                      icon: const Icon(Icons.send_rounded, size: 18),
                      label: const Text('Despachar Auditoria Sanitária Local'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFEF4444),
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                        elevation: 4,
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),
                  SizedBox(
                    width: double.infinity,
                    height: 52,
                    child: OutlinedButton.icon(
                      onPressed: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Alerta sob análise. Fornecedor notificado por e-mail.'),
                            backgroundColor: Color(0xFF3B82F6),
                          ),
                        );
                      },
                      icon: const Icon(Icons.mail_outline, size: 18),
                      label: const Text('Notificar Fornecedor de Insumo'),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: const Color(0xFF3B82F6),
                        side: BorderSide(color: const Color(0xFF3B82F6).withOpacity(0.5)),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      ),
                    ),
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

  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            '$label: ',
            style: const TextStyle(color: Colors.white38, fontSize: 12, fontWeight: FontWeight.bold),
          ),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(color: Colors.white70, fontSize: 12),
            ),
          ),
        ],
      ),
    );
  }
}
