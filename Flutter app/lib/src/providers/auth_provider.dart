import 'package:flutter/material.dart';
import '../models/user_model.dart';

class AuthProvider extends ChangeNotifier {
  UserModel? _user;

  UserModel? get user => _user;
  bool get isAuthenticated => _user != null;

  final Map<String, UserModel> _mockUsers = {
    'operador': UserModel(id: '1', name: 'Maria Silva', role: 'Nutricionista / Operador', initials: 'MS'),
    'gestor': UserModel(id: '2', name: 'Carlos Roberto', role: 'Diretor Escolar', initials: 'CR'),
    'auditor': UserModel(id: '3', name: 'Dra. Ana Gomes', role: 'Auditora Chefe', initials: 'AG'),
  };

  Future<bool> login(String role) async {
    // Simulate network delay
    await Future.delayed(const Duration(seconds: 1));
    
    if (_mockUsers.containsKey(role)) {
      _user = _mockUsers[role];
      notifyListeners();
      return true;
    }
    return false;
  }

  Future<void> logout() async {
    _user = null;
    notifyListeners();
  }
}
