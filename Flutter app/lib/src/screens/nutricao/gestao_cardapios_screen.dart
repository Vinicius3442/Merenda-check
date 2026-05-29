import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../../providers/auth_provider.dart';
import '../../widgets/base_layout.dart';

class MealPlan {
  String breakfast;
  String lunch;
  String snack;

  MealPlan({
    required this.breakfast,
    required this.lunch,
    required this.snack,
  });

  Map<String, dynamic> toJson() => {
    'breakfast': breakfast,
    'lunch': lunch,
    'snack': snack,
  };

  factory MealPlan.fromJson(Map<String, dynamic> json) {
    return MealPlan(
      breakfast: json['breakfast'] ?? '',
      lunch: json['lunch'] ?? '',
      snack: json['snack'] ?? '',
    );
  }
}

class GestaoCardapiosScreen extends StatefulWidget {
  const GestaoCardapiosScreen({super.key});

  @override
  State<GestaoCardapiosScreen> createState() => _GestaoCardapiosScreenState();
}

class _GestaoCardapiosScreenState extends State<GestaoCardapiosScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  bool _isLoading = true;
  bool _isSaving = false;
  String _semanaSelecionada = 'Atual';

  final Map<String, MealPlan> _weeklyPlans = {
    'Segunda': MealPlan(breakfast: 'Leite com cacau', lunch: 'Arroz e feijão', snack: 'Fruta'),
    'Terça': MealPlan(breakfast: 'Iogurte', lunch: 'Frango grelhado', snack: 'Maçã'),
    'Quarta': MealPlan(breakfast: 'Café com leite', lunch: 'Macarrão', snack: 'Biscoito'),
    'Quinta': MealPlan(breakfast: 'Vitamina', lunch: 'Carne moída', snack: 'Suco'),
    'Sexta': MealPlan(breakfast: 'Pão de sal', lunch: 'Feijoada', snack: 'Melancia'),
  };

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 5, vsync: this);
    _fetchCardapios();
  }

  Future<void> _fetchCardapios() async {
    try {
      final user = context.read<AuthProvider>().user;
      if (user == null) return;

      final response = await Supabase.instance.client
          .from('cardapios')
          .select()
          .eq('escola_id', user.escolaId!)
          .eq('semana', _semanaSelecionada)
          .maybeSingle();

      if (response != null && response['plano'] != null) {
        final plano = response['plano'] as Map<String, dynamic>;
        setState(() {
          for (final day in _weeklyPlans.keys) {
            if (plano.containsKey(day)) {
              _weeklyPlans[day] = MealPlan.fromJson(plano[day]);
            }
          }
        });
      } else {
        // Se não tiver plano no banco para a semana, zera para criar um novo
        setState(() {
          for (final day in _weeklyPlans.keys) {
            _weeklyPlans[day] = MealPlan(breakfast: '', lunch: '', snack: '');
          }
        });
      }
    } catch (e) {
      debugPrint('Erro ao buscar cardápios: $e');
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<void> _saveCardapios() async {
    setState(() => _isSaving = true);
    try {
      final user = context.read<AuthProvider>().user;
      if (user == null) return;

      final planoJson = {};
      for (final day in _weeklyPlans.keys) {
        planoJson[day] = _weeklyPlans[day]!.toJson();
      }

      await Supabase.instance.client.from('cardapios').upsert({
        'escola_id': user.escolaId,
        'semana': _semanaSelecionada,
        'plano': planoJson,
        'criado_por': user.id,
      });

      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Cardápio da semana $_semanaSelecionada homologado!'), backgroundColor: const Color(0xFF10B981)),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Erro RLS/Banco: Permissão negada para atualizar tabela cardapios.'), backgroundColor: Colors.red),
      );
    } finally {
      if (mounted) setState(() => _isSaving = false);
    }
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return BaseLayout(
      title: 'Gestão de Cardápios',
      currentRoute: '/nutricao/cardapios',
      actions: [
        if (_isSaving)
          const Padding(padding: EdgeInsets.all(16), child: SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2)))
        else
          IconButton(
            icon: const Icon(Icons.save),
            tooltip: 'Salvar Tudo',
            onPressed: _saveCardapios,
          ),
      ],
      body: _isLoading 
        ? const Center(child: CircularProgressIndicator()) 
        : Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Cardápio Escolar',
                      style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold, fontFamily: 'Outfit'),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                      decoration: BoxDecoration(
                        color: const Color(0xFF1E293B),
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: Colors.white.withOpacity(0.1)),
                      ),
                      child: DropdownButtonHideUnderline(
                        child: DropdownButton<String>(
                          value: _semanaSelecionada,
                          dropdownColor: const Color(0xFF1E293B),
                          icon: const Icon(Icons.arrow_drop_down, color: Colors.white54),
                          style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
                          items: ['Atual', 'Próxima', 'Semana 3', 'Semana 4'].map((String value) {
                            return DropdownMenuItem<String>(
                              value: value,
                              child: Text('Semana $value'),
                            );
                          }).toList(),
                          onChanged: (newValue) {
                            if (newValue != null) {
                              setState(() {
                                _semanaSelecionada = newValue;
                                _isLoading = true;
                              });
                              _fetchCardapios();
                            }
                          },
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                const Text(
                  'Escolha a semana e edite o planejamento. Não se esqueça de salvar!',
                  style: TextStyle(color: Colors.white54, fontSize: 13),
                ),
              ],
            ),
          ),
          TabBar(
            controller: _tabController,
            isScrollable: true,
            labelColor: const Color(0xFF10B981),
            unselectedLabelColor: Colors.white54,
            indicatorColor: const Color(0xFF10B981),
            tabAlignment: TabAlignment.start,
            tabs: const [
              Tab(text: 'Segunda-feira'),
              Tab(text: 'Terça-feira'),
              Tab(text: 'Quarta-feira'),
              Tab(text: 'Quinta-feira'),
              Tab(text: 'Sexta-feira'),
            ],
          ),
          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: _weeklyPlans.keys.map((day) {
                final plan = _weeklyPlans[day]!;
                return SingleChildScrollView(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    children: [
                      _buildMealCard('Desjejum / Café da Manhã', plan.breakfast, (val) => plan.breakfast = val, Icons.wb_sunny_outlined, const Color(0xFFF59E0B)),
                      _buildMealCard('Almoço Escolar', plan.lunch, (val) => plan.lunch = val, Icons.restaurant, const Color(0xFF10B981)),
                      _buildMealCard('Lanche / Sobremesa', plan.snack, (val) => plan.snack = val, Icons.apple, const Color(0xFFEF4444)),
                      const SizedBox(height: 20),
                      SizedBox(
                        width: double.infinity,
                        height: 52,
                        child: ElevatedButton.icon(
                          onPressed: _saveCardapios,
                          icon: const Icon(Icons.check_circle, color: Colors.white),
                          label: const Text('Homologar Semana', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF10B981),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          ),
                        ),
                      ),
                    ],
                  ),
                );
              }).toList(),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMealCard(String mealTitle, String initialValue, Function(String) onChanged, IconData icon, Color color) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
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
            children: [
              CircleAvatar(
                backgroundColor: color.withOpacity(0.1),
                radius: 18,
                child: Icon(icon, color: color, size: 18),
              ),
              const SizedBox(width: 12),
              Text(
                mealTitle,
                style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14, fontFamily: 'Outfit'),
              ),
            ],
          ),
          const SizedBox(height: 12),
          TextFormField(
            initialValue: initialValue,
            onChanged: onChanged,
            maxLines: 3,
            minLines: 1,
            style: TextStyle(color: Colors.white.withOpacity(0.9), fontSize: 13, height: 1.5),
            decoration: InputDecoration(
              isDense: true,
              contentPadding: const EdgeInsets.all(12),
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: BorderSide.none),
              filled: true,
              fillColor: Colors.black.withOpacity(0.2),
              hintText: 'Digite o cardápio...',
              hintStyle: TextStyle(color: Colors.white.withOpacity(0.3)),
            ),
          ),
        ],
      ),
    );
  }
}
