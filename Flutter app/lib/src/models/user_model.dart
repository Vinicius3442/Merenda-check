class UserModel {
  final String id;
  final String name;
  final String role;
  final String initials;
  final String? escolaId;
  final String? avatarUrl;

  UserModel({
    required this.id,
    required this.name,
    required this.role,
    required this.initials,
    this.escolaId,
    this.avatarUrl,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] as String,
      name: json['name'] as String,
      role: json['role'] as String,
      initials: json['initials'] as String? ?? 'U',
      escolaId: json['escola_id'] as String?,
      avatarUrl: json['avatar_url'] as String?,
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
    };
  }
}
