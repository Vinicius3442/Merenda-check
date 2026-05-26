import 'package:flutter/material.dart';
import '../../widgets/base_layout.dart';

class CustodyStep {
  final String title;
  final String subtitle;
  final String date;
  final String metadata;
  final IconData icon;
  final Color color;
  final bool isCompleted;

  CustodyStep({
    required this.title,
    required this.subtitle,
    required this.date,
    required this.metadata,
    required this.icon,
    required this.color,
    this.isCompleted = true,
  });
}

class RastreabilidadeScreen extends StatefulWidget {
  const RastreabilidadeScreen({super.key});

  @override
  State<RastreabilidadeScreen> createState() => _RastreabilidadeScreenState();
}

class _RastreabilidadeScreenState extends State<RastreabilidadeScreen> {
  final _hashController = TextEditingController(text: '#BOV-4820');
  List<CustodyStep>? _timeline;
  bool _searching = false;

  void _searchHash() async {
    final query = _hashController.text.trim();
    if (query.isEmpty) return;

    setState(() {
      _searching = true;
      _timeline = null;
    });

    await Future.delayed(const Duration(milliseconds: 1200));

    if (mounted) {
      setState(() {
        _searching = false;
        if (query.toUpperCase().contains('BOV') || query.toUpperCase().contains('4820')) {
          _timeline = [
            CustodyStep(
              title: 'Origem: Frigorífico Boi Gordo S/A',
              subtitle: 'Lote de Carne Bovina Patinho industrializado e inspecionado.',
              date: '10/05/2026 06:14',
              metadata: 'SIF: #SIF-4001 • Temp: -18.2°C • Hash: 9fa2c8...39ee1',
              icon: Icons.store,
              color: const Color(0xFF10B981),
            ),
            CustodyStep(
              title: 'Transporte: TransFrio Logística',
              subtitle: 'Deslocamento refrigerado em veículo câmara-fria.',
              date: '10/05/2026 09:30',
              metadata: 'Placa: AAA-0G88 • Temp média: -17.9°C • Assinatura: f771e...880bc',
              icon: Icons.local_shipping,
              color: const Color(0xFF3B82F6),
            ),
            CustodyStep(
              title: 'Recepção: Almoxarifado Central Municipal',
              subtitle: 'Entrada física registrada via QR Code de transportadora.',
              date: '10/05/2026 14:40',
              metadata: 'Responsável: Roberto Souza • Aprovado por FIFO-A1',
              icon: Icons.warehouse,
              color: const Color(0xFFF59E0B),
            ),
            CustodyStep(
              title: 'Cozinha Escolar: E. M. Monteiro Lobato',
              subtitle: 'Entrega física confirmada com assinatura digital biométrica.',
              date: '12/05/2026 08:12',
              metadata: 'Recebido por: Merendeira Maria das Dores • Conforme',
              icon: Icons.kitchen,
              color: const Color(0xFF10B981),
            ),
          ];
        } else {
          _timeline = [
            CustodyStep(
              title: 'Origem: Fornecedor Central Agro',
              subtitle: 'Insumo processado e embalado.',
              date: '15/05/2026 07:15',
              metadata: 'Lote padrão • Hash: a89ef2...1142c',
              icon: Icons.store,
              color: const Color(0xFF10B981),
            ),
            CustodyStep(
              title: 'Transporte: LogMerenda S/A',
              subtitle: 'Lote em trânsito municipal.',
              date: '15/05/2026 11:30',
              metadata: 'Placa: PLK-4519 • Assinatura: b9921...aa1e',
              icon: Icons.local_shipping,
              color: const Color(0xFF3B82F6),
            ),
            CustodyStep(
              title: 'Ponto Intermediário: Depósito Seco Central',
              subtitle: 'Registrado em estoque temporário.',
              date: '15/05/2026 16:00',
              metadata: 'Disponível para distribuição • FIFO cadastrado',
              icon: Icons.warehouse,
              color: const Color(0xFFF59E0B),
              isCompleted: false,
            ),
          ];
        }
      });
    }
  }

  @override
  void initState() {
    super.initState();
    _searchHash();
  }

  @override
  Widget build(BuildContext context) {
    return BaseLayout(
      title: 'Rastreabilidade de Lotes',
      currentRoute: '/auditor/rastrear',
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Rastrear Cadeia de Custódia',
              style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold, fontFamily: 'Outfit'),
            ),
            const SizedBox(height: 4),
            Text(
              'Consulte hashes de lotes criptografados para verificar a trilha completa de fiscalização.',
              style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 13),
            ),
            const SizedBox(height: 20),

            // Search Bar
            Row(
              children: [
                Expanded(
                  child: Container(
                    decoration: BoxDecoration(
                      color: const Color(0xFF1E293B),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: Colors.white.withOpacity(0.08)),
                    ),
                    child: TextField(
                      controller: _hashController,
                      style: const TextStyle(color: Colors.white),
                      decoration: InputDecoration(
                        hintText: 'Insira o hash ou código do lote (ex: #BOV-4820)...',
                        hintStyle: TextStyle(color: Colors.white.withOpacity(0.3)),
                        prefixIcon: Icon(Icons.vpn_key, color: Colors.white.withOpacity(0.5), size: 20),
                        border: InputBorder.none,
                        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                      ),
                      onSubmitted: (_) => _searchHash(),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                ElevatedButton(
                  onPressed: _searching ? null : _searchHash,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF10B981),
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  child: _searching
                      ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                      : const Icon(Icons.search, color: Colors.white),
                ),
              ],
            ),
            const SizedBox(height: 24),

            // Timeline results
            if (_timeline != null) ...[
              Text(
                'Resultados para: ${_hashController.text.toUpperCase()}',
                style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15, fontFamily: 'Outfit'),
              ),
              const SizedBox(height: 16),
              Container(
                decoration: BoxDecoration(
                  color: const Color(0xFF1E293B),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: Colors.white.withOpacity(0.05)),
                ),
                padding: const EdgeInsets.all(16),
                child: ListView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: _timeline!.length,
                  itemBuilder: (context, index) {
                    final step = _timeline![index];
                    final isLast = index == _timeline!.length - 1;

                    return IntrinsicHeight(
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Left side lines and markers
                          Column(
                            children: [
                              Container(
                                width: 36, height: 36,
                                decoration: BoxDecoration(
                                  color: step.isCompleted ? step.color.withOpacity(0.15) : Colors.white10,
                                  shape: BoxShape.circle,
                                  border: Border.all(color: step.isCompleted ? step.color : Colors.white30, width: 2),
                                ),
                                child: Icon(step.icon, color: step.isCompleted ? step.color : Colors.white54, size: 18),
                              ),
                              if (!isLast)
                                Expanded(
                                  child: VerticalDivider(
                                    color: step.isCompleted ? step.color : Colors.white24,
                                    thickness: 2,
                                    width: 36,
                                  ),
                                ),
                            ],
                          ),
                          const SizedBox(width: 16),

                          // Right side description card
                          Expanded(
                            child: Padding(
                              padding: const EdgeInsets.only(bottom: 24.0),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                    children: [
                                      Expanded(
                                        child: Text(
                                          step.title,
                                          style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14, fontFamily: 'Outfit'),
                                        ),
                                      ),
                                      Text(
                                        step.date,
                                        style: TextStyle(color: Colors.white.withOpacity(0.3), fontSize: 10),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    step.subtitle,
                                    style: TextStyle(color: Colors.white.withOpacity(0.7), fontSize: 12, height: 1.4),
                                  ),
                                  const SizedBox(height: 8),
                                  Container(
                                    padding: const EdgeInsets.all(8),
                                    width: double.infinity,
                                    decoration: BoxDecoration(
                                      color: const Color(0xFF0F172A),
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    child: Text(
                                      step.metadata,
                                      style: TextStyle(color: Colors.white.withOpacity(0.4), fontSize: 9, fontFamily: 'Courier'),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                    );
                  },
                ),
              ),
            ],
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }
}
