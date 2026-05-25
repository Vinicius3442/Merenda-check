import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:go_router/go_router.dart';
import '../../providers/auth_provider.dart';
import '../../utils/theme.dart';
import '../../widgets/mascot_chat.dart';

class EntradaInsumoScreen extends StatefulWidget {
  const EntradaInsumoScreen({super.key});

  @override
  State<EntradaInsumoScreen> createState() => _EntradaInsumoScreenState();
}

class _EntradaInsumoScreenState extends State<EntradaInsumoScreen> {
  final _formKey = GlobalKey<FormState>();
  String? _selectedLoteId;
  
  bool _isLoading = true;
  bool _isSubmitting = false;
  List<Map<String, dynamic>> _lotesPendentes = [];

  @override
  void initState() {
    super.initState();
    _fetchLotes();
  }

  Future<void> _fetchLotes() async {
    try {
      final user = context.read<AuthProvider>().user;
      if (user == null) return;
      
      final response = await Supabase.instance.client
          .from('lotes_transporte')
          .select()
          .eq('destino_escola', user.escolaId)
          .eq('status', 'em_transito')
          .order('criado_em', ascending: false);
          
      setState(() {
        _lotesPendentes = List<Map<String, dynamic>>.from(response);
        _isLoading = false;
      });
    } catch (e) {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    _formKey.currentState!.save();

    setState(() => _isSubmitting = true);
    try {
      final user = context.read<AuthProvider>().user;
      final supabase = Supabase.instance.client;
      
      final lote = _lotesPendentes.firstWhere((l) => l['id'] == _selectedLoteId);
      
      // 1. Atualizar status do lote para entregue
      await supabase.from('lotes_transporte').update({
        'status': 'entregue',
        'entregue_em': DateTime.now().toIso8601String(),
      }).eq('id', _selectedLoteId!);

      // 2. Extrair os itens do JSONB do lote e inserir no estoque
      final List<dynamic> itens = lote['itens'] ?? [];
      for (var item in itens) {
        final volume = (item['qtd'] as num).toDouble();
        final inserted = await supabase.from('estoque').insert({
          'escola_id': user!.escolaId,
          'lote_transporte_id': _selectedLoteId,
          'lote': 'LT-${_selectedLoteId!.substring(0, 5).toUpperCase()}',
          'nome': item['descricao'],
          'volume_kg': volume,
          'validade': item['validade'],
          'status': 'normal',
        }).select();
        
        final novoEstoqueId = inserted[0]['id'];
        
        // 3. Registrar movimentação de entrada
        await supabase.from('movimentacoes').insert({
          'estoque_id': novoEstoqueId,
          'escola_id': user.escolaId,
          'tipo': 'entrada',
          'quantidade_kg': volume,
          'observacao': 'Recebimento de romaneio',
          'usuario_id': user.id,
        });
      }

      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Lote recebido e inserido no estoque com sucesso!'), backgroundColor: Colors.green),
      );
      context.pop();
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Erro: ${e.toString()}'), backgroundColor: Colors.red),
      );
    } finally {
      if (mounted) setState(() => _isSubmitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return MascotChatOverlay(
      routeContext: 'O usuário está na tela de Entrada de Insumos. Ele deve conferir o romaneio pendente (simulando a leitura do QR Code).',
      child: Scaffold(
        appBar: AppBar(title: const Text('Receber Romaneio (QR Code)')),
        body: _isLoading 
          ? const Center(child: CircularProgressIndicator())
          : Padding(
          padding: const EdgeInsets.all(16.0),
          child: _lotesPendentes.isEmpty 
          ? const Center(child: Text('Nenhum lote em trânsito para esta escola.', style: TextStyle(fontSize: 16)))
          : Form(
            key: _formKey,
            child: ListView(
              children: [
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.blue.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.blue.shade200),
                  ),
                  child: const Row(
                    children: [
                      Icon(Icons.qr_code_scanner, size: 40, color: Colors.blue),
                      SizedBox(width: 16),
                      Expanded(child: Text('Na versão final, a câmera será aberta aqui. Selecione o lote abaixo para simular o recebimento via leitura óptica.')),
                    ],
                  ),
                ),
                const SizedBox(height: 24),
                
                DropdownButtonFormField<String>(
                  value: _selectedLoteId,
                  decoration: const InputDecoration(labelText: 'Romaneio em Trânsito', border: OutlineInputBorder()),
                  validator: (v) => v == null ? 'Selecione um lote' : null,
                  isExpanded: true,
                  items: _lotesPendentes.map((item) {
                    final motorista = item['motorista'];
                    final placa = item['placa'];
                    return DropdownMenuItem<String>(
                      value: item['id'],
                      child: Text('Caminhão $placa - $motorista'),
                    );
                  }).toList(),
                  onChanged: (v) => setState(() => _selectedLoteId = v),
                ),
                const SizedBox(height: 32),
                
                ElevatedButton(
                  onPressed: _isSubmitting ? null : _submit,
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    backgroundColor: Colors.blue,
                  ),
                  child: _isSubmitting
                      ? const CircularProgressIndicator(color: Colors.white)
                      : const Text('Confirmar Conferência', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white)),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
