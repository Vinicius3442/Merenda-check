import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'src/providers/auth_provider.dart';
import 'src/router.dart';
import 'src/utils/theme.dart';

import 'package:supabase_flutter/supabase_flutter.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  await Supabase.initialize(
    url: 'https://hplvaxihexvbogqwkotf.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwbHZheGloZXh2Ym9ncXdrb3RmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3MjQ4MTAsImV4cCI6MjA5NTMwMDgxMH0.Djxb8FbSRrSlDPAWhZgyn6W4qHrZr3gkD9yCNKgrDN8',
  );
  
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
      ],
      child: const MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    // Escuta mudanças de auth para forçar re-avaliação das rotas (redirecionamento)
    context.watch<AuthProvider>();
    
    return MaterialApp.router(
      title: 'Merenda-check Mobile',
      theme: AppTheme.lightTheme,
      routerConfig: router,
      debugShowCheckedModeBanner: false,
    );
  }
}
