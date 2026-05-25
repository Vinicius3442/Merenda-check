import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:go_router/go_router.dart';
import '../../providers/auth_provider.dart';
import '../../utils/theme.dart';
import '../../widgets/mascot_chat.dart';

class RegistrarRefeicaoScreen extends StatefulWidget {
  const RegistrarRefeicaoScreen({super.key});

  @override
  State<RegistrarRefeicaoScreen> createState() => _RegistrarRefeicaoScreenState();
}

class _RegistrarRefeicaoScreenState extends State<RegistrarRefeicaoScreen> {
  final _formKey = GlobalKey<FormState>();
  int _totalServidos = 0;
  double _restoKg = 0;
  String _motivo = '';
  String _turno = 'almoco';
  bool _isLoading = false;

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    _formKey.currentState!.save();

    setState(() => _isLoading = true);
    try {
      final user = context.read<AuthProvider>().user;
      if (user == null) throw Exception('Usuário não autenticado');

      await Supabase.instance.client.from('refeicoes').insert({
        'escola_id': user.escolaId,
        'usuario_id': user.id,
        'total_servidos': _totalServidos,
        'resto_kg': _restoKg,
        'motivo_resto': _motivo,
        'turno': _turno,
        'data_ref': DateTime.now().toIso8601String().split('T')[0],
      });

      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Refeição registrada com sucesso!'), backgroundColor: Colors.green),
      );
      context.pop();
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Erro: ${e.toString()}'), backgroundColor: Colors.red),
      );
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return MascotChatOverlay(
      routeContext: 'O usuário está na tela de Registrar Refeição. Ajude-o a preencher a quantidade de refeições servidas e as sobras (resto-ingesta).',
      child: Scaffold(
        appBar: AppBar(title: const Text('Registrar Refeição')),
        body: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Form(
            key: _formKey,
            child: ListView(
              children: [
                const Text('Preencha os dados do atendimento diário:', style: TextStyle(fontSize: 16, color: AppTheme.textSecondary)),
                const SizedBox(height: 24),
                
                DropdownButtonFormField<String>(
                  value: _turno,
                  decoration: const InputDecoration(labelText: 'Turno', border: OutlineInputBorder()),
                  items: const [
                    DropdownMenuItem(value: 'cafe', child: Text('Café da Manhã')),
                    DropdownMenuItem(value: 'almoco', child: Text('Almoço')),
                    DropdownMenuItem(value: 'lanche', child: Text('Lanche da Tarde')),
                    DropdownMenuItem(value: 'janta', child: Text('Jantar')),
                  ],
                  onChanged: (v) => setState(() => _turno = v!),
                ),
                const SizedBox(height: 16),
                
                TextFormField(
                  decoration: const InputDecoration(labelText: 'Total Servidos (Alunos)', border: OutlineInputBorder(), prefixIcon: Icon(Icons.group)),
                  keyboardType: TextInputType.number,
                  validator: (v) => v == null || v.isEmpty ? 'Campo obrigatório' : null,
                  onSaved: (v) => _totalServidos = int.tryParse(v!) ?? 0,
                ),
                const SizedBox(height: 16),
                
                TextFormField(
                  decoration: const InputDecoration(labelText: 'Resto-Ingesta (Sobras no prato em kg)', border: OutlineInputBorder(), prefixIcon: Icon(Icons.delete_sweep)),
                  keyboardType: const TextInputType.numberWithOptions(decimal: true),
                  validator: (v) => v == null || v.isEmpty ? 'Campo obrigatório' : null,
                  onSaved: (v) => _restoKg = double.tryParse(v!.replaceAll(',', '.')) ?? 0,
                ),
                const SizedBox(height: 16),
                
                TextFormField(
                  decoration: const InputDecoration(labelText: 'Motivo (opcional)', border: OutlineInputBorder()),
                  onSaved: (v) => _motivo = v ?? '',
                ),
                const SizedBox(height: 32),
                
                ElevatedButton(
                  onPressed: _isLoading ? null : _submit,
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    backgroundColor: AppTheme.primaryColor,
                  ),
                  child: _isLoading
                      ? const CircularProgressIndicator(color: Colors.white)
                      : const Text('Salvar Registro', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white)),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
