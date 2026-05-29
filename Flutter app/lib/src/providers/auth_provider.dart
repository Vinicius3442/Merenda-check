import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../models/user_model.dart';

class AuthProvider extends ChangeNotifier {
  UserModel? _user;
  bool _isLoading = true;
  String? _loginError;
  
  UserModel? get user => _user;
  bool get isAuthenticated => _user != null;
  bool get isLoading => _isLoading;
  String? get loginError => _loginError;

  AuthProvider() {
    _initialize();
  }

  Future<void> _initialize() async {
    final session = Supabase.instance.client.auth.currentSession;
    if (session != null) {
      await _fetchUserProfile(session.user.id);
    } else {
      _isLoading = false;
      notifyListeners();
    }

    Supabase.instance.client.auth.onAuthStateChange.listen((data) async {
      final session = data.session;
      if (session != null) {
        if (_user == null || _user!.id != session.user.id) {
          await _fetchUserProfile(session.user.id);
        }
      } else {
        _user = null;
        notifyListeners();
      }
    });
  }

  Future<void> _fetchUserProfile(String authId) async {
    try {
      final data = await Supabase.instance.client
          .from('usuarios')
          .select('id, nome, role, iniciais, escola_id, avatar_url, status')
          .eq('auth_id', authId)
          .maybeSingle();

      if (data != null) {
        // ✋ Bloquear usuários com status inativo
        if (data['status'] == 'inativo') {
          debugPrint('[Auth] Usuário inativo tentou acessar: ${data['email'] ?? authId}');
          await Supabase.instance.client.auth.signOut();
          _user = null;
          _loginError = 'Acesso revogado. Entre em contato com o administrador do sistema.';
          notifyListeners();
          return;
        }

        _user = UserModel(
          id: data['id'],
          name: data['nome'] ?? '',
          role: data['role'],
          initials: data['iniciais'] ?? 'U',
          escolaId: data['escola_id'],
          avatarUrl: data['avatar_url'],
          status: data['status'] ?? 'ativo',
        );
        _loginError = null;
      }
    } catch (e) {
      debugPrint('Error fetching user profile: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  void updateUser({String? name, String? avatarUrl}) {
    if (_user != null) {
      _user = UserModel(
        id: _user!.id,
        name: name ?? _user!.name,
        role: _user!.role,
        initials: _user!.initials,
        escolaId: _user!.escolaId,
        avatarUrl: avatarUrl ?? _user!.avatarUrl,
      );
      notifyListeners();
    }
  }

  /// Retorna null em sucesso, ou uma mensagem de erro em falha
  Future<String?> login(String email, String password) async {
    _loginError = null;
    try {
      final response = await Supabase.instance.client.auth.signInWithPassword(
        email: email,
        password: password,
      );
      
      if (response.session != null) {
        await _fetchUserProfile(response.session!.user.id);
        // Se _loginError foi setado, o usuário está inativo
        if (_loginError != null) {
          return _loginError;
        }
      }
      
      return null; // Sucesso
    } catch (e) {
      debugPrint('Login error: $e');
      final msg = e.toString();
      if (msg.contains('Invalid login credentials')) {
        return 'E-mail ou senha incorretos.';
      }
      return 'Erro ao fazer login. Tente novamente.';
    }
  }

  Future<void> logout() async {
    try {
      await Supabase.instance.client.auth.signOut();
    } catch (e) {
      debugPrint('Logout API error (e.g., 403): $e');
    } finally {
      _user = null;
      notifyListeners();
    }
  }
}
