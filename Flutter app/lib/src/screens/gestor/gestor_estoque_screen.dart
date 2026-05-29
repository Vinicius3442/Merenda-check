import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../../providers/auth_provider.dart';
import '../../widgets/base_layout.dart';

class StockItem {
  final String id;
  final String name;
  final String category;
  double quantity;
  final String unit;
  final String validity;
  final String batchCode;
  final bool isCritical;

  StockItem({
    required this.id,
    required this.name,
    required this.category,
    required this.quantity,
    required this.unit,
    required this.validity,
    required this.batchCode,
    this.isCritical = false,
  });
}

class GestorEstoqueScreen extends StatefulWidget {
  const GestorEstoqueScreen({super.key});

  @override
  State<GestorEstoqueScreen> createState() => _GestorEstoqueScreenState();
}

class _GestorEstoqueScreenState extends State<GestorEstoqueScreen> {
  List<StockItem> _items = [];
  bool _isLoading = true;

  String _searchQuery = '';
  final _adjustController = TextEditingController();

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
          .order('validade', ascending: true);
          
      setState(() {
        _items = (response as List).map((e) => StockItem(
          id: e['id'],
          name: e['nome'] ?? 'Desconhecido',
          category: 'Alimentos', 
          quantity: (e['volume_kg'] as num).toDouble(),
          unit: 'kg',
          validity: e['validade']?.toString().split(' ')[0] ?? '-',
          batchCode: e['lote'] ?? '-',
          isCritical: e['status'] == 'urgente',
        )).toList();
        _isLoading = false;
      });
    } catch (e) {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final filteredItems = _items.where((item) {
      final nameLower = item.name.toLowerCase();
      final categoryLower = item.category.toLowerCase();
      final batchLower = item.batchCode.toLowerCase();
      final queryLower = _searchQuery.toLowerCase();
      return nameLower.contains(queryLower) ||
          categoryLower.contains(queryLower) ||
          batchLower.contains(queryLower);
    }).toList();

    return BaseLayout(
      title: 'Gestão de Estoque',
      currentRoute: '/gestor/estoque',
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Search Input
            Container(
              decoration: BoxDecoration(
                color: const Color(0xFF1E293B),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.white.withOpacity(0.08)),
              ),
              child: TextField(
                style: const TextStyle(color: Colors.white),
                decoration: InputDecoration(
                  hintText: 'Pesquisar insumo, categoria ou lote...',
                  hintStyle: TextStyle(color: Colors.white.withOpacity(0.3)),
                  prefixIcon: Icon(Icons.search, color: Colors.white.withOpacity(0.5)),
                  border: InputBorder.none,
                  contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                ),
                onChanged: (val) {
                  setState(() {
                    _searchQuery = val;
                  });
                },
              ),
            ),
            const SizedBox(height: 20),

            // Header of Table/List
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Insumos Cadastrados',
                  style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                    fontFamily: 'Outfit',
                  ),
                ),
                Text(
                  '${filteredItems.length} itens encontrados',
                  style: TextStyle(color: Colors.white.withOpacity(0.5), fontSize: 12),
                ),
              ],
            ),
            const SizedBox(height: 12),

            // Items List
            Expanded(
              child: _isLoading 
                ? const Center(child: CircularProgressIndicator())
                : ListView.builder(
                itemCount: filteredItems.length,
                itemBuilder: (context, index) {
                  final item = filteredItems[index];
                  return _buildStockCard(item);
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStockCard(StockItem item) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: item.isCritical
              ? const Color(0xFFEF4444).withOpacity(0.3)
              : Colors.white.withOpacity(0.05),
        ),
      ),
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header info
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    item.category,
                    style: TextStyle(
                      color: const Color(0xFF10B981),
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 0.5,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    item.name,
                    style: const TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 15,
                      fontFamily: 'Outfit',
                    ),
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                decoration: BoxDecoration(
                  color: const Color(0xFF0F172A),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  '${item.quantity} ${item.unit}',
                  style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          const Divider(color: Colors.white10, height: 1),
          const SizedBox(height: 12),

          // Metadata & Expiration Info
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Lote',
                    style: TextStyle(color: Colors.white30, fontSize: 10),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    item.batchCode,
                    style: const TextStyle(color: Colors.white70, fontSize: 12, fontWeight: FontWeight.w600),
                  ),
                ],
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Vencimento (FIFO)',
                    style: TextStyle(color: Colors.white30, fontSize: 10),
                  ),
                  const SizedBox(height: 2),
                  Row(
                    children: [
                      if (item.isCritical) ...[
                        const Icon(Icons.alarm, color: Color(0xFFEF4444), size: 14),
                        const SizedBox(width: 4),
                      ],
                      Text(
                        item.validity,
                        style: TextStyle(
                          color: item.isCritical ? const Color(0xFFEF4444) : Colors.white70,
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
              ElevatedButton(
                onPressed: () => _showAdjustmentDialog(item),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF3B82F6).withOpacity(0.1),
                  foregroundColor: const Color(0xFF3B82F6),
                  side: BorderSide(color: const Color(0xFF3B82F6).withOpacity(0.3)),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                  minimumSize: const Size(60, 32),
                ),
                child: const Text('Ajustar', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
              ),
            ],
          ),
        ],
      ),
    );
  }

  void _showAdjustmentDialog(StockItem item) {
    _adjustController.clear();
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          backgroundColor: const Color(0xFF1E293B),
          title: Text(
            'Ajustar Estoque: ${item.name}',
            style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold, fontFamily: 'Outfit'),
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                'Saldo atual: ${item.quantity} ${item.unit}. Defina o novo valor absoluto em kg.',
                style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 13),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _adjustController,
                keyboardType: const TextInputType.numberWithOptions(decimal: true, signed: false),
                style: const TextStyle(color: Colors.white),
                decoration: InputDecoration(
                  labelText: 'Novo Saldo (${item.unit})',
                  labelStyle: TextStyle(color: Colors.white.withOpacity(0.5)),
                  enabledBorder: OutlineInputBorder(
                    borderSide: BorderSide(color: Colors.white.withOpacity(0.1)),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderSide: const BorderSide(color: Color(0xFF10B981)),
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('Cancelar', style: TextStyle(color: Colors.white54)),
            ),
            ElevatedButton(
              onPressed: () async {
                final double? newVal = double.tryParse(_adjustController.text.trim().replaceAll(',', '.'));
                if (newVal != null) {
                  final newQuantity = newVal.clamp(0.0, 9999.0);
                  
                  try {
                    final res = await Supabase.instance.client
                        .from('estoque')
                        .update({'volume_kg': newQuantity})
                        .eq('id', item.id)
                        .select();

                    if (res.isEmpty) {
                      throw Exception('Bloqueado por RLS ou item não encontrado.');
                    }

                    setState(() {
                      item.quantity = newQuantity;
                    });
                    
                    if (!mounted) return;
                    Navigator.of(context).pop();
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text('Estoque de "${item.name}" ajustado com sucesso para ${item.quantity} ${item.unit}!'),
                        backgroundColor: const Color(0xFF10B981),
                      ),
                    );
                  } catch (e) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('Erro ao atualizar: $e'), backgroundColor: Colors.red),
                    );
                  }
                }
              },
              style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF10B981)),
              child: const Text('Salvar', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
            ),
          ],
        );
      },
    );
  }
}
