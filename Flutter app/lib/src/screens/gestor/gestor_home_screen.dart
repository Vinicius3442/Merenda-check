import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../widgets/base_layout.dart';

class GestorHomeScreen extends StatefulWidget {
  const GestorHomeScreen({super.key});

  @override
  State<GestorHomeScreen> createState() => _GestorHomeScreenState();
}

class _GestorHomeScreenState extends State<GestorHomeScreen> {
  bool _submitting = false;
  String? _toastMsg;

  @override
  void initState() {
    super.initState();
    Future.delayed(const Duration(milliseconds: 1500), () {
      if (mounted) {
        setState(() {
          _toastMsg = '⚠️ ALERTA FIFO: Lote crítico #BOV-4820 de Carne Moída vence em 3 dias! Priorize no cardápio de Segunda-feira.';
        });
      }
    });
  }

  void _syncData() async {
    setState(() => _submitting = true);
    await Future.delayed(const Duration(seconds: 1));
    if (mounted) {
      setState(() {
        _submitting = false;
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Dados atualizados com sucesso (Sincronizado).'),
            backgroundColor: Color(0xFF10B981),
          ),
        );
      });
    }
  }

  void _applyFifoPriority() async {
    setState(() => _submitting = true);
    await Future.delayed(const Duration(milliseconds: 800));
    if (mounted) {
      setState(() {
        _submitting = false;
        _toastMsg = null;
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Priorização aplicada: Lote #BOV-4820 programado para Segunda-feira!'),
            backgroundColor: Color(0xFF10B981),
          ),
        );
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return BaseLayout(
      title: 'Painel Preditivo',
      currentRoute: '/gestor',
      body: Stack(
        children: [
          SingleChildScrollView(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Welcome and Sync Button
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Gestão Escolar',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 22,
                              fontWeight: FontWeight.bold,
                              fontFamily: 'Outfit',
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'Visão preditiva de insumos em tempo real.',
                            style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 13),
                          ),
                        ],
                      ),
                    ),
                    ElevatedButton.icon(
                      onPressed: _submitting ? null : _syncData,
                      icon: _submitting
                          ? const SizedBox(
                              width: 14, height: 14,
                              child: CircularProgressIndicator(color: Colors.white, strokeWidth: 1.5),
                            )
                          : const Icon(Icons.sync, size: 16),
                      label: Text(_submitting ? 'Sincronizando...' : 'Atualizar'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF10B981),
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 20),

                // KPI Grid
                GridView.count(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  crossAxisCount: 2,
                  childAspectRatio: 1.5,
                  crossAxisSpacing: 12,
                  mainAxisSpacing: 12,
                  children: [
                    _buildKpiCard('Estoque Atual', '380 kg', Icons.kitchen, const Color(0xFF10B981)),
                    _buildKpiCard('Alertas FIFO', '2 Ativos', Icons.warning_amber, const Color(0xFFEF4444)),
                    _buildKpiCard('Adesão Alimentar', '94.2%', Icons.group, const Color(0xFF3B82F6)),
                    _buildKpiCard('Conformidade', '100%', Icons.shield, const Color(0xFFF59E0B)),
                  ],
                ),
                const SizedBox(height: 24),

                // Shortcuts (Ações Rápidas)
                const Text(
                  'Ações Rápidas',
                  style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16, fontFamily: 'Outfit'),
                ),
                const SizedBox(height: 12),
                _buildActionRow(
                  context,
                  Icons.description,
                  'Emitir Relatórios',
                  'Extratos e certificados PNAE.',
                  '/gestor/relatorios',
                  const Color(0xFF10B981),
                ),
                const SizedBox(height: 8),
                _buildActionRow(
                  context,
                  Icons.inventory_2,
                  'Gestão de Estoque',
                  'Ajustes e monitoramento de saldos.',
                  '/gestor/estoque',
                  const Color(0xFFEF4444),
                ),
                const SizedBox(height: 24),

                // Alerta FIFO Section
                const Text(
                  'Validade FIFO & Alertas',
                  style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16, fontFamily: 'Outfit'),
                ),
                const SizedBox(height: 12),
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: const Color(0xFF1E293B),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: const Color(0xFFEF4444).withOpacity(0.3)),
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
                              color: const Color(0xFFEF4444).withOpacity(0.1),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: const Text(
                              '⚠️ FIFO CRÍTICO',
                              style: TextStyle(color: Color(0xFFEF4444), fontWeight: FontWeight.bold, fontSize: 10),
                            ),
                          ),
                          const Text(
                            'Lote #BOV-4820',
                            style: TextStyle(color: Colors.white54, fontSize: 11),
                          )
                        ],
                      ),
                      const SizedBox(height: 12),
                      const Text(
                        'Carne Moída Bovina (Patinho)',
                        style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16, fontFamily: 'Outfit'),
                      ),
                      const SizedBox(height: 6),
                      const Text(
                        'O algoritmo FIFO detectou que 50kg deste insumo estão a exatamente 3 dias do vencimento. Recomenda-se priorizar o uso no cardápio da próxima segunda-feira.',
                        style: TextStyle(color: Colors.white70, fontSize: 13, height: 1.4),
                      ),
                      const SizedBox(height: 16),
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton.icon(
                          onPressed: _submitting ? null : _applyFifoPriority,
                          icon: const Icon(Icons.calendar_month, size: 18),
                          label: const Text('Aplicar Priorização no Cardápio'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF10B981),
                            foregroundColor: Colors.white,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                            padding: const EdgeInsets.symmetric(vertical: 12),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 32),
              ],
            ),
          ),

          // Toast Message overlay inside view
          if (_toastMsg != null)
            Positioned(
              top: 16,
              left: 16,
              right: 16,
              child: Material(
                elevation: 10,
                borderRadius: BorderRadius.circular(12),
                color: const Color(0xFFEF4444),
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
                  child: Row(
                    children: [
                      const Icon(Icons.warning, color: Colors.white),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          _toastMsg!,
                          style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w600, fontSize: 12),
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.close, color: Colors.white70, size: 18),
                        onPressed: () => setState(() => _toastMsg = null),
                      ),
                    ],
                  ),
                ),
              ),
            ),
        ],
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

  Widget _buildActionRow(BuildContext context, IconData icon, String title, String desc, String route, Color color) {
    return InkWell(
      onTap: () => context.go(route),
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: const Color(0xFF1E293B),
          borderRadius: BorderRadius.circular(16),
          border: Border(left: BorderSide(color: color, width: 4)),
        ),
        child: Row(
          children: [
            Container(
              width: 42, height: 42,
              decoration: BoxDecoration(
                color: color.withOpacity(0.1),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Icon(icon, color: color, size: 20),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14, fontFamily: 'Outfit'),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    desc,
                    style: TextStyle(color: Colors.white.withOpacity(0.5), fontSize: 11),
                  ),
                ],
              ),
            ),
            const Icon(Icons.chevron_right, color: Colors.white54, size: 18),
          ],
        ),
      ),
    );
  }
}
