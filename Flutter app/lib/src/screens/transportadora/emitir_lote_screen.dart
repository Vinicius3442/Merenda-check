import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../widgets/base_layout.dart';

class EmitirLoteScreen extends StatefulWidget {
  const EmitirLoteScreen({super.key});

  @override
  State<EmitirLoteScreen> createState() => _EmitirLoteScreenState();
}

class _EmitirLoteScreenState extends State<EmitirLoteScreen> {
  final _plateController = TextEditingController(text: 'AXC-1901');
  final _tempController = TextEditingController(text: '-18.2');
  final _quantityController = TextEditingController(text: '80.0');
  String _selectedInsumo = 'Peito de Frango Congelado';
  String _selectedSchool = 'CMEI Cantinho da Criança';

  bool _submitting = false;
  String? _generatedHash;

  void _generateBatch() async {
    setState(() => _submitting = true);
    await Future.delayed(const Duration(seconds: 2));

    if (mounted) {
      setState(() {
        _submitting = false;
        _generatedHash = '9fa2c8b880bc771ef8a192c39ee1e2a0';
      });

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Lote criptografado assinado e emitido com sucesso!'),
          backgroundColor: Color(0xFF10B981),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return BaseLayout(
      title: 'Emitir Lote Criptográfico',
      currentRoute: '/transportadora/emitir-lote',
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Emissão de Guia Rastreável',
              style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold, fontFamily: 'Outfit'),
            ),
            const SizedBox(height: 4),
            Text(
              'Preencha as variáveis de conservação do lote para gerar o QR Code criptográfico.',
              style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 13),
            ),
            const SizedBox(height: 24),

            if (_generatedHash != null) ...[
              // Generated QR Code Panel
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: const Color(0xFF1E293B),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: const Color(0xFF10B981).withOpacity(0.4)),
                ),
                child: Column(
                  children: [
                    const Icon(Icons.qr_code_2, size: 180, color: Colors.white),
                    const SizedBox(height: 16),
                    const Text(
                      'QR CODE ASSINADO CRIPTOGRAFICAMENTE',
                      style: TextStyle(color: Color(0xFF10B981), fontWeight: FontWeight.bold, fontSize: 11),
                    ),
                    const SizedBox(height: 12),
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: const Color(0xFF0F172A),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: SelectableText(
                        'Hash: $_generatedHash',
                        style: const TextStyle(color: Colors.white70, fontSize: 10, fontFamily: 'Courier'),
                        textAlign: Center,
                      ),
                    ),
                    const SizedBox(height: 20),
                    Row(
                      children: [
                        Expanded(
                          child: ElevatedButton.icon(
                            onPressed: () {
                              setState(() {
                                _generatedHash = null;
                              });
                            },
                            icon: const Icon(Icons.arrow_back),
                            label: const Text('Nova Guia'),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFF1E293B),
                              foregroundColor: Colors.white,
                              side: BorderSide(color: Colors.white.withOpacity(0.1)),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: ElevatedButton.icon(
                            onPressed: () => context.go('/transportadora'),
                            icon: const Icon(Icons.check),
                            label: const Text('Concluir'),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFF10B981),
                              foregroundColor: Colors.white,
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ] else ...[
              // Form Panels
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: const Color(0xFF1E293B),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: Colors.white.withOpacity(0.05)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildLabel('Insumo Transportado'),
                    _buildDropdown(
                      value: _selectedInsumo,
                      items: ['Peito de Frango Congelado', 'Carne Moída Bovina', 'Leite Integral em Pó'],
                      onChanged: (val) => setState(() => _selectedInsumo = val!),
                    ),
                    const SizedBox(height: 16),
                    _buildLabel('Unidade Destinatária'),
                    _buildDropdown(
                      value: _selectedSchool,
                      items: ['CMEI Cantinho da Criança', 'E. M. Monteiro Lobato', 'EMEF Doutor Ulysses Guimarães'],
                      onChanged: (val) => setState(() => _selectedSchool = val!),
                    ),
                    const SizedBox(height: 16),
                    _buildLabel('Quantidade (kg/L)'),
                    _buildTextField(_quantityController, 'Ex: 80.0'),
                    const SizedBox(height: 16),
                    _buildLabel('Placa do Veículo Frio'),
                    _buildTextField(_plateController, 'Ex: AAA-0000'),
                    const SizedBox(height: 16),
                    _buildLabel('Temperatura Interna da Câmara (°C)'),
                    _buildTextField(_tempController, 'Ex: -18.0'),
                    const SizedBox(height: 24),
                    SizedBox(
                      width: double.infinity,
                      height: 52,
                      child: ElevatedButton.icon(
                        onPressed: _submitting ? null : _generateBatch,
                        icon: _submitting
                            ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                            : const Icon(Icons.vpn_key),
                        label: const Text('Assinar e Emitir Lote Rastreável', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF10B981),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  Widget _buildLabel(String label) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8.0),
      child: Text(
        label,
        style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 13, fontWeight: FontWeight.w600),
      ),
    );
  }

  Widget _buildTextField(TextEditingController controller, String hint) {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF0F172A),
        borderRadius: BorderRadius.circular(10),
      ),
      child: TextField(
        controller: controller,
        style: const TextStyle(color: Colors.white, fontSize: 14),
        decoration: InputDecoration(
          hintText: hint,
          hintStyle: TextStyle(color: Colors.white.withOpacity(0.2)),
          border: InputBorder.none,
          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        ),
      ),
    );
  }

  Widget _buildDropdown({required String value, required List<String> items, required ValueChanged<String?> onChanged}) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(
        color: const Color(0xFF0F172A),
        borderRadius: BorderRadius.circular(10),
      ),
      child: DropdownButtonHideUnderline(
        child: DropdownButton<String>(
          value: value,
          dropdownColor: const Color(0xFF0F172A),
          style: const TextStyle(color: Colors.white, fontSize: 14),
          icon: const Icon(Icons.arrow_drop_down, color: Colors.white54),
          items: items.map((i) {
            return DropdownMenuItem<String>(
              value: i,
              child: Text(i),
            );
          }).toList(),
          onChanged: onChanged,
        ),
      ),
    );
  }
}
