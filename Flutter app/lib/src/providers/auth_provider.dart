import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../models/user_model.dart';

class AuthProvider extends ChangeNotifier {
  UserModel? _user;
  bool _isLoading = true;
  
  UserModel? get user => _user;
  bool get isAuthenticated => _user != null;
  bool get isLoading => _isLoading;

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
          .select('id, nome, role, iniciais, escola_id')
          .eq('auth_id', authId)
          .maybeSingle();

      if (data != null) {
        _user = UserModel(
          id: data['id'],
          name: data['nome'],
          role: data['role'],
          initials: data['iniciais'],
          escolaId: data['escola_id'],
        );
      }
    } catch (e) {
      debugPrint('Error fetching user profile: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> login(String email, String password) async {
    try {
      await Supabase.instance.client.auth.signInWithPassword(
        email: email,
        password: password,
      );
      return true;
    } catch (e) {
      debugPrint('Login error: $e');
      return false;
    }
  }

  Future<void> logout() async {
    await Supabase.instance.client.auth.signOut();
    _user = null;
    notifyListeners();
  }
}
