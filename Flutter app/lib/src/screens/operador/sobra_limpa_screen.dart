import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:go_router/go_router.dart';
import '../../providers/auth_provider.dart';
import '../../utils/theme.dart';
import '../../widgets/mascot_chat.dart';

class SobraLimpaScreen extends StatefulWidget {
  const SobraLimpaScreen({super.key});

  @override
  State<SobraLimpaScreen> createState() => _SobraLimpaScreenState();
}

class _SobraLimpaScreenState extends State<SobraLimpaScreen> {
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
      
      // Busca insumos para os quais registrar sobras
      final response = await Supabase.instance.client
          .from('estoque')
          .select()
          .eq('escola_id', user.escolaId)
          .gt('volume_kg', 0)
          .order('nome', ascending: true);
          
      setState(() {
        _estoqueItems = List<Map<String, dynamic>>.from(response);
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
      
      // Inserir movimentação do tipo sobra
      await supabase.from('movimentacoes').insert({
        'estoque_id': _selectedEstoqueId,
        'escola_id': user!.escolaId,
        'tipo': 'sobra',
        'quantidade_kg': _quantidadeKg,
        'observacao': _observacao,
        'usuario_id': user.id,
      });

      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Sobra Limpa registrada com sucesso!'), backgroundColor: Colors.green),
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
      routeContext: 'Tela de Sobra Limpa. O usuário vai registrar alimentos que foram preparados mas não servidos (sobra limpa).',
      child: Scaffold(
        appBar: AppBar(title: const Text('Registrar Sobra Limpa')),
        body: _isLoading 
          ? const Center(child: CircularProgressIndicator())
          : Padding(
          padding: const EdgeInsets.all(16.0),
          child: Form(
            key: _formKey,
            child: ListView(
              children: [
                const Text('Registre alimentos preparados que não saíram da cozinha:', style: TextStyle(fontSize: 16, color: AppTheme.textSecondary)),
                const SizedBox(height: 24),
                
                DropdownButtonFormField<String>(
                  value: _selectedEstoqueId,
                  decoration: const InputDecoration(labelText: 'Lote / Insumo', border: OutlineInputBorder()),
                  validator: (v) => v == null ? 'Selecione um lote' : null,
                  isExpanded: true,
                  items: _estoqueItems.map((item) {
                    final nome = item['nome'];
                    final lote = item['lote'];
                    return DropdownMenuItem<String>(
                      value: item['id'],
                      child: Text('$lote - $nome'),
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
                  decoration: const InputDecoration(labelText: 'Destino/Motivo', border: OutlineInputBorder()),
                  onSaved: (v) => _observacao = v ?? '',
                ),
                const SizedBox(height: 32),
                
                ElevatedButton(
                  onPressed: _isSubmitting ? null : _submit,
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    backgroundColor: Colors.red,
                  ),
                  child: _isSubmitting
                      ? const CircularProgressIndicator(color: Colors.white)
                      : const Text('Registrar Sobra Limpa', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white)),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
