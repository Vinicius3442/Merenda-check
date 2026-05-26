import 'package:flutter/material.dart';
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

class AuditTrailScreen extends StatelessWidget {
  AuditTrailScreen({super.key});

  final List<AuditLog> _logs = [
    AuditLog('26/05/2026 15:42', 'carlos.operador', 'Registrou Recebimento de Lote #BOV-4820', '192.168.1.48', 'REGISTRO', const Color(0xFF10B981)),
    AuditLog('26/05/2026 14:12', 'ana.gestor', 'Homologou prioridade FIFO para Lote #BOV-4820', '192.168.1.11', 'AUTORIZAÇÃO', const Color(0xFF3B82F6)),
    AuditLog('26/05/2026 11:04', 'mariana.nutri', 'Homologou cardápio da semana (Maio S4)', '192.168.1.88', 'REGISTRO', const Color(0xFF10B981)),
    AuditLog('26/05/2026 09:30', 'antonio.motorista', 'Emitiu Guia de Lote Assinada Criptograficamente', '177.42.100.22', 'CRIPTOGRAFIA', const Color(0xFFF59E0B)),
    AuditLog('25/05/2026 16:15', 'admin.sys', 'Atualizou permissões do usuário carlos.operador', '192.168.1.1', 'SEGURANÇA', const Color(0xFFEF4444)),
  ];

  @override
  Widget build(BuildContext context) {
    return BaseLayout(
      title: 'Logs de Auditoria (TI)',
      currentRoute: '/admin/audit-ti',
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
              'Histórico completo de transações públicas assinadas.',
              style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 13),
            ),
            const SizedBox(height: 20),

            // Logs Timeline
            Expanded(
              child: ListView.builder(
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
