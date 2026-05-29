import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../../widgets/base_layout.dart';

class AuditLog {
  final String timestamp;
  final String user;
  final String action;
  final String ip;
  final String type;
  final Color typeColor;

  AuditLog(this.timestamp, this.user, this.action, this.ip, this.type, this.typeColor);
}

class AuditTrailScreen extends StatefulWidget {
  const AuditTrailScreen({super.key});

  @override
  State<AuditTrailScreen> createState() => _AuditTrailScreenState();
}

class _AuditTrailScreenState extends State<AuditTrailScreen> {
  List<AuditLog> _logs = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchLogs();
  }

  Future<void> _fetchLogs() async {
    try {
      final response = await Supabase.instance.client
          .from('audit_trail')
          .select('criado_em, acao, tabela_afetada, ip_origem, usuarios(nome)')
          .order('criado_em', ascending: false)
          .limit(100);

      if (!mounted) return;

      final List<AuditLog> fetchedLogs = (response as List).map((row) {
        final date = DateTime.tryParse(row['criado_em'] ?? '');
        final dateStr = date != null ? '${date.day.toString().padLeft(2, '0')}/${date.month.toString().padLeft(2, '0')}/${date.year} ${date.hour.toString().padLeft(2, '0')}:${date.minute.toString().padLeft(2, '0')}' : '-';
        
        final actionStr = '${row['acao']}_${row['tabela_afetada'].toString().toUpperCase()}';
        
        Color tColor = const Color(0xFF3B82F6);
        if (row['acao'] == 'DELETE') {
          tColor = const Color(0xFFEF4444);
        } else if (row['acao'] == 'UPDATE') tColor = const Color(0xFFF59E0B);
        else if (row['acao'] == 'INSERT') tColor = const Color(0xFF10B981);

        return AuditLog(
          dateStr,
          row['usuarios'] != null ? row['usuarios']['nome'] : 'Sistema / Backend',
          actionStr,
          row['ip_origem'] ?? 'Desconhecido',
          row['acao'] ?? 'DESCONHECIDO',
          tColor,
        );
      }).toList();

      setState(() {
        _logs = fetchedLogs;
        _isLoading = false;
      });
    } catch (e) {
      debugPrint('Erro ao buscar logs de auditoria: $e');
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return BaseLayout(
      title: 'Logs de Auditoria Global',
      currentRoute: '/admin/audit-ti',
      actions: [
        IconButton(
          icon: const Icon(Icons.refresh),
          onPressed: () {
            setState(() => _isLoading = true);
            _fetchLogs();
          },
        ),
      ],
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Audit Trail Imutável',
              style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold, fontFamily: 'Outfit'),
            ),
            const SizedBox(height: 4),
            Text(
              'Registro automático de ações via PostgreSQL Triggers.',
              style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 13),
            ),
            const SizedBox(height: 20),

            // Logs Timeline
            Expanded(
              child: _isLoading
                ? const Center(child: CircularProgressIndicator())
                : _logs.isEmpty
                    ? const Center(child: Text('Nenhum log encontrado. Certifique-se de ter rodado audit_e_avatar.sql.', style: TextStyle(color: Colors.white54)))
                    : ListView.builder(
                        itemCount: _logs.length,
                        itemBuilder: (context, index) {
                          final log = _logs[index];
                          return Container(
                            margin: const EdgeInsets.only(bottom: 12),
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
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                      decoration: BoxDecoration(
                                        color: log.typeColor.withOpacity(0.1),
                                        borderRadius: BorderRadius.circular(6),
                                      ),
                                      child: Text(
                                        log.type,
                                        style: TextStyle(color: log.typeColor, fontWeight: FontWeight.bold, fontSize: 9),
                                      ),
                                    ),
                                    Text(
                                      log.timestamp,
                                      style: TextStyle(color: Colors.white.withOpacity(0.3), fontSize: 10),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 10),
                                Text(
                                  log.action,
                                  style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13, fontFamily: 'Outfit'),
                                ),
                                const SizedBox(height: 6),
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Text(
                                      'Usuário: ${log.user}',
                                      style: TextStyle(color: Colors.white.withOpacity(0.5), fontSize: 11),
                                    ),
                                    Text(
                                      'IP: ${log.ip}',
                                      style: TextStyle(color: Colors.white.withOpacity(0.3), fontSize: 11, fontFamily: 'Courier'),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          );
                        },
                      ),
            ),
          ],
        ),
      ),
    );
  }
}
