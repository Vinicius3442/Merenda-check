import 'package:flutter/material.dart';
import '../../widgets/base_layout.dart';

class MealPlan {
  final String breakfast;
  final String lunch;
  final String snack;

  MealPlan({
    required this.breakfast,
    required this.lunch,
    required this.snack,
  });
}

class GestaoCardapiosScreen extends StatefulWidget {
  const GestaoCardapiosScreen({super.key});

  @override
  State<GestaoCardapiosScreen> createState() => _GestaoCardapiosScreenState();
}

class _GestaoCardapiosScreenState extends State<GestaoCardapiosScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  final Map<String, MealPlan> _weeklyPlans = {
    'Segunda': MealPlan(
      breakfast: 'Leite integral com cacau em pó e pão francês com manteiga.',
      lunch: 'Arroz branco, feijão carioca, carne moída bovina ensopada com batatas e salada de alface.',
      snack: 'Banana prata orgânica e biscoito de polvilho.',
    ),
    'Terça': MealPlan(
      breakfast: 'Iogurte natural batido com morangos e bolo de fubá caseiro.',
      lunch: 'Arroz branco, feijão de corda, peito de frango grelhado e purê de abóbora cabotiá.',
      snack: 'Maçã gala vermelha.',
    ),
    'Quarta': MealPlan(
      breakfast: 'Café com leite de soja e torrada integral com creme de ricota.',
      lunch: 'Arroz de carreteiro com carne bovina desfiada, feijão preto e salada de acelga.',
      snack: 'Mamão formosa picado.',
    ),
    'Quinta': MealPlan(
      breakfast: 'Vitamina de banana e aveia com pão de queijo caseiro.',
      lunch: 'Macarrão espaguete ao molho de tomate com almôndegas de frango e legumes ralados.',
      snack: 'Suco natural de laranja.',
    ),
    'Sexta': MealPlan(
      breakfast: 'Leite integral com mel e pão de sal com ovo mexido.',
      lunch: 'Feijoada leve escolar (feijão preto, carne magra, lombo), arroz, couve refogada e fatias de laranja.',
      snack: 'Melancia cortada em triângulos.',
    ),
  };

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 5, vsync: this);
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
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header info
          const Padding(
            padding: EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Cardápio Escolar Semanal',
                  style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold, fontFamily: 'Outfit'),
                ),
                SizedBox(height: 4),
                Text(
                  'Planejamento alimentar semanal das escolas municipais.',
                  style: TextStyle(color: Colors.white54, fontSize: 13),
                ),
              ],
            ),
          ),

          // Tab Bar of Days
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

          // Tab views of Meal plans
          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: _weeklyPlans.keys.map((day) {
                final plan = _weeklyPlans[day]!;
                return SingleChildScrollView(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    children: [
                      _buildMealCard('Desjejum / Café da Manhã', plan.breakfast, Icons.wb_sunny_outlined, const Color(0xFFF59E0B)),
                      _buildMealCard('Almoço Escolar', plan.lunch, Icons.restaurant, const Color(0xFF10B981)),
                      _buildMealCard('Lanche / Sobremesa', plan.snack, Icons.apple, const Color(0xFFEF4444)),
                      const SizedBox(height: 20),

                      // Approve cardápio button
                      SizedBox(
                        width: double.infinity,
                        height: 52,
                        child: ElevatedButton.icon(
                          onPressed: () {
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: Text('Cardápio de $day-feira homologado com sucesso!'),
                                backgroundColor: const Color(0xFF10B981),
                              ),
                            );
                          },
                          icon: const Icon(Icons.check_circle, color: Colors.white),
                          label: const Text('Homologar Cardápio Diário', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
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

  Widget _buildMealCard(String mealTitle, String description, IconData icon, Color color) {
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
          Text(
            description,
            style: TextStyle(color: Colors.white.withOpacity(0.7), fontSize: 13, height: 1.5),
          ),
        ],
      ),
    );
  }
}
