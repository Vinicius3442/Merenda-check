import 'package:flutter/material.dart';

class SafeAvatar extends StatefulWidget {
  final String imageUrl;
  final String initials;
  final Color roleColor;
  final double radius;

  const SafeAvatar({
    super.key,
    required this.imageUrl,
    required this.initials,
    required this.roleColor,
    this.radius = 20,
  });

  @override
  State<SafeAvatar> createState() => _SafeAvatarState();
}

class _SafeAvatarState extends State<SafeAvatar> {
  bool _hasError = false;

  @override
  void didUpdateWidget(covariant SafeAvatar oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.imageUrl != widget.imageUrl) {
      setState(() {
        _hasError = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final String avatarUrl = widget.imageUrl.trim();
    
    // Lista de domínios conhecidos por causar erros de CORS ou bloqueios diretos no Flutter Web
    final bool isCorsBlocked = avatarUrl.contains('randomuser.me') ||
                               avatarUrl.contains('estadao.com.br') ||
                               avatarUrl.contains('senac.br') ||
                               avatarUrl.contains('wikimedia.org');

    if (avatarUrl.isNotEmpty && !_hasError && !isCorsBlocked) {
      return CircleAvatar(
        radius: widget.radius,
        backgroundImage: NetworkImage(avatarUrl),
        backgroundColor: const Color(0xFF1E293B),
        onBackgroundImageError: (exception, stackTrace) {
          if (mounted) {
            setState(() {
              _hasError = true;
            });
          }
        },
      );
    }

    return CircleAvatar(
      radius: widget.radius,
      backgroundColor: widget.roleColor.withOpacity(0.1),
      child: Text(
        widget.initials,
        style: TextStyle(
          color: widget.roleColor, 
          fontWeight: FontWeight.bold,
          fontSize: widget.radius * 0.8,
        ),
      ),
    );
  }
}
