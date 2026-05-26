import 'package:flutter/material.dart';
import '../../widgets/base_layout.dart';

class Recipe {
  final String name;
  final String calories;
  final String protein;
  final String carbs;
  final String costPerServing;
  final List<String> ingredients;

  Recipe({
    required this.name,
    required this.calories,
    required this.protein,
    required this.carbs,
    required this.costPerServing,
    required this.ingredients,
  });
}

class FichaTecnicaScreen extends StatefulWidget {
  const FichaTecnicaScreen({super.key});

  @override
  State<FichaTecnicaScreen> createState() => _FichaTecnicaScreenState();
}

class _FichaTecnicaScreenState extends State<FichaTecnicaScreen> {
  final List<Recipe> _recipes = [
    Recipe(
      name: 'Picadinho de Carne Moída com Batatas',
      calories: '380 kcal',
      protein: '28g',
      carbs: '35g',
      costPerServing: 'R\$ 3,20',
      ingredients: ['Carne Bovina Moída (Patinho): 80g', 'Batata Inglesa: 100g', 'Cebola de Cabeça: 15g', 'Óleo de Soja: 5ml', 'Sal Iodado: 1.5g'],
    ),
    Recipe(
      name: 'Feijoada Escolar Leve',
      calories: '490 kcal',
      protein: '32g',
      carbs: '48g',
      costPerServing: 'R\$ 4,10',
      ingredients: ['Feijão Preto Seco: 70g', 'Lombo Suíno Magro: 60g', 'Couve Manteiga Fresca: 50g', 'Alho Picado: 2g', 'Sal Refinado: 1.8g'],
    ),
    Recipe(
      name: 'Almôndegas de Frango ao Molho de Tomate',
      calories: '350 kcal',
      protein: '25g',
      carbs: '28g',
      costPerServing: 'R\$ 2,90',
      ingredients: ['Peito de Frango Moído: 90g', 'Polpa de Tomate Concentrada: 40g', 'Cebolinha Verde: 10g', 'Azeite de Oliva: 4ml', 'Sal Iodado: 1.2g'],
    ),
  ];

  Recipe? _selectedRecipe;

  @override
  void initState() {
    super.initState();
    _selectedRecipe = _recipes.first;
  }

  @override
  Widget build(BuildContext context) {
    return BaseLayout(
      title: 'Fichas Técnicas',
      currentRoute: '/nutricao/fichas',
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Catálogo de Preparações',
              style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold, fontFamily: 'Outfit'),
            ),
            const SizedBox(height: 4),
            Text(
              'Selecione uma receita para ver o perfil nutricional e custo público.',
              style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 13),
            ),
            const SizedBox(height: 20),

            // Recipes horizontal list
            SizedBox(
              height: 48,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                itemCount: _recipes.length,
                itemBuilder: (context, index) {
                  final recipe = _recipes[index];
                  final isSelected = _selectedRecipe == recipe;

                  return Padding(
                    padding: const EdgeInsets.only(right: 8.0),
                    child: ChoiceChip(
                      label: Text(
                        recipe.name.split(' ').take(3).join(' ') + '...',
                        style: TextStyle(
                          color: isSelected ? Colors.white : Colors.white70,
                          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                          fontSize: 12,
                        ),
                      ),
                      selected: isSelected,
                      selectedColor: const Color(0xFF10B981),
                      backgroundColor: const Color(0xFF1E293B),
                      onSelected: (val) {
                        if (val) {
                          setState(() {
                            _selectedRecipe = recipe;
                          });
                        }
                      },
                    ),
                  );
                },
              ),
            ),
            const SizedBox(height: 20),

            // Detailed Recipe Sheet
            if (_selectedRecipe != null)
              Expanded(
                child: Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: const Color(0xFF1E293B),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: Colors.white.withOpacity(0.05)),
                  ),
                  child: SingleChildScrollView(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Title
                        Text(
                          _selectedRecipe!.name,
                          style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 18, fontFamily: 'Outfit'),
                        ),
                        const SizedBox(height: 12),
                        const Divider(color: Colors.white10),
                        const SizedBox(height: 12),

                        // Macronutrients grid
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            _buildNutriItem('Calorias', _selectedRecipe!.calories, const Color(0xFFF59E0B)),
                            _buildNutriItem('Proteína', _selectedRecipe!.protein, const Color(0xFF10B981)),
                            _buildNutriItem('Carbos', _selectedRecipe!.carbs, const Color(0xFF3B82F6)),
                            _buildNutriItem('Custo Prato', _selectedRecipe!.costPerServing, const Color(0xFFEF4444)),
                          ],
                        ),
                        const SizedBox(height: 20),

                        // Ingredients list header
                        const Text(
                          'Ingredientes (Por Aluno):',
                          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14, fontFamily: 'Outfit'),
                        ),
                        const SizedBox(height: 8),

                        // Ingredients items
                        ..._selectedRecipe!.ingredients.map((ing) {
                          return Padding(
                            padding: const EdgeInsets.symmetric(vertical: 4.0),
                            child: Row(
                              children: [
                                const Icon(Icons.circle, color: Color(0xFF10B981), size: 8),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: Text(
                                    ing,
                                    style: TextStyle(color: Colors.white.withOpacity(0.8), fontSize: 13),
                                  ),
                                ),
                              ],
                            ),
                          );
                        }),
                      ],
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildNutriItem(String label, String value, Color color) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        Text(
          label,
          style: TextStyle(color: Colors.white.withOpacity(0.4), fontSize: 10),
        ),
        const SizedBox(height: 4),
        Text(
          value,
          style: TextStyle(color: color, fontWeight: FontWeight.bold, fontSize: 15, fontFamily: 'Outfit'),
        ),
      ],
    );
  }
}
