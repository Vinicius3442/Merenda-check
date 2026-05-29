class UserModel {
  final String id;
  final String name;
  final String role;
  final String initials;
  final String? escolaId;
  final String? avatarUrl;
  final String status; // 'ativo' | 'inativo'

  UserModel({
    required this.id,
    required this.name,
    required this.role,
    required this.initials,
    this.escolaId,
    this.avatarUrl,
    this.status = 'ativo',
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] as String,
      name: json['nome'] as String? ?? json['name'] as String? ?? '',
      role: json['role'] as String,
      initials: json['iniciais'] as String? ?? json['initials'] as String? ?? 'U',
      escolaId: json['escola_id'] as String?,
      avatarUrl: json['avatar_url'] as String?,
      status: json['status'] as String? ?? 'ativo',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'role': role,
      'initials': initials,
      'escola_id': escolaId,
      'avatar_url': avatarUrl,
      'status': status,
    };
  }
}
