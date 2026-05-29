import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:go_router/go_router.dart';
import '../../providers/auth_provider.dart';
import '../../utils/theme.dart';


class BaixaInsumoScreen extends StatefulWidget {
  const BaixaInsumoScreen({super.key});

  @override
  State<BaixaInsumoScreen> createState() => _BaixaInsumoScreenState();
}

class _BaixaInsumoScreenState extends State<BaixaInsumoScreen> {
  final _formKey = GlobalKey<FormState>();
  String? _selectedEstoqueId;
  double _quantidadeKg = 0;
  String _observacao = '';
  
  bool _isLoading = true;
  bool _isSubmitting = false;
  List<Map<String, dynamic>> _estoqueItems = [];

  @override
  void initState() {
    super.initState();
    _fetchEstoque();
  }

  Future<void> _fetchEstoque() async {
    try {
      final user = context.read<AuthProvider>().user;
      if (user == null) return;
      
      final response = await Supabase.instance.client
          .from('estoque')
          .select()
          .eq('escola_id', user.escolaId!)
          .gt('volume_kg', 0)
          .order('validade', ascending: true);
          
      setState(() {
        _estoqueItems = List<Map<String, dynamic>>.from(response);
        _isLoading = false;
      });
    } catch (e) {
      if (mounted) {
        setState(() => _isLoading = false);
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Erro ao carregar estoque: $e')));
      }
    }
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    _formKey.currentState!.save();

    final itemSelecionado = _estoqueItems.firstWhere((e) => e['id'] == _selectedEstoqueId);
    final volumeAtual = (itemSelecionado['volume_kg'] as num).toDouble();
    if (_quantidadeKg > volumeAtual) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Quantidade maior que o volume disponível no estoque!'), backgroundColor: Colors.red),
      );
      return;
    }

    setState(() => _isSubmitting = true);
    try {
      final user = context.read<AuthProvider>().user;
      final supabase = Supabase.instance.client;
      
      // 1. Inserir movimentação
      await supabase.from('movimentacoes').insert({
        'estoque_id': _selectedEstoqueId,
        'escola_id': user!.escolaId,
        'tipo': 'baixa',
        'quantidade_kg': _quantidadeKg,
        'observacao': _observacao,
        'usuario_id': user.id,
      });

      // 2. Atualizar estoque
      await supabase.from('estoque').update({
        'volume_kg': volumeAtual - _quantidadeKg,
      }).eq('id', _selectedEstoqueId!);

      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Baixa registrada com sucesso!'), backgroundColor: Colors.green),
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
    return Scaffold(
        appBar: AppBar(title: const Text('Baixa de Insumo (Preparo)')),
        body: _isLoading 
          ? const Center(child: CircularProgressIndicator())
          : Padding(
          padding: const EdgeInsets.all(16.0),
          child: Form(
            key: _formKey,
            child: ListView(
              children: [
                const Text('Selecione o insumo para enviar à cozinha (Siga a regra FIFO):', style: TextStyle(fontSize: 16, color: AppTheme.textSecondary)),
                const SizedBox(height: 24),
                
                DropdownButtonFormField<String>(
                  initialValue: _selectedEstoqueId,
                  decoration: const InputDecoration(labelText: 'Lote / Insumo', border: OutlineInputBorder()),
                  validator: (v) => v == null ? 'Selecione um lote' : null,
                  isExpanded: true,
                  items: _estoqueItems.map((item) {
                    final validade = item['validade'];
                    final nome = item['nome'];
                    final lote = item['lote'];
                    final vol = item['volume_kg'];
                    return DropdownMenuItem<String>(
                      value: item['id'],
                      child: Text('$lote - $nome ($vol kg) - Val: $validade'),
                    );
                  }).toList(),
                  onChanged: (v) => setState(() => _selectedEstoqueId = v),
                ),
                const SizedBox(height: 16),
                
                TextFormField(
                  decoration: const InputDecoration(labelText: 'Quantidade (kg)', border: OutlineInputBorder(), prefixIcon: Icon(Icons.scale)),
                  keyboardType: const TextInputType.numberWithOptions(decimal: true),
                  validator: (v) => v == null || v.isEmpty ? 'Campo obrigatório' : null,
                  onSaved: (v) => _quantidadeKg = double.tryParse(v!.replaceAll(',', '.')) ?? 0,
                ),
                const SizedBox(height: 16),
                
                TextFormField(
                  decoration: const InputDecoration(labelText: 'Observação (Ex: Preparo do almoço)', border: OutlineInputBorder()),
                  onSaved: (v) => _observacao = v ?? '',
                ),
                const SizedBox(height: 32),
                
                ElevatedButton(
                  onPressed: _isSubmitting ? null : _submit,
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    backgroundColor: Colors.orange,
                  ),
                  child: _isSubmitting
                      ? const CircularProgressIndicator(color: Colors.white)
                      : const Text('Registrar Baixa', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white)),
                ),
              ],
            ),
          ),
        ),
    );
  }
}
