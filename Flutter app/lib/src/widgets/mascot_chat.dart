import 'package:flutter/material.dart';
import 'package:google_generative_ai/google_generative_ai.dart';

class MascotChatOverlay extends StatefulWidget {
  final Widget child;
  final String routeContext;
  
  const MascotChatOverlay({super.key, required this.child, required this.routeContext});

  @override
  State<MascotChatOverlay> createState() => _MascotChatOverlayState();
}

class _MascotChatOverlayState extends State<MascotChatOverlay> {
  bool _chatOpen = false;
  bool _isTyping = false;
  final List<Map<String, dynamic>> _messages = [];
  final _textController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  ChatSession? _chatSession;
  
  // Substitua pela sua chave Gemini para testar no Flutter, ou carregue do dotenv
  final String _apiKey = const String.fromEnvironment('GEMINI_API_KEY', defaultValue: '');

  @override
  void initState() {
    super.initState();
    _initChat();
  }

  void _initChat() {
    if (_apiKey.isEmpty) {
      _messages.add({
        'role': 'assistant',
        'text': '⚠️ Chave de API Gemini não configurada no app Flutter. Configure para falar comigo!',
      });
      return;
    }

    final model = GenerativeModel(
      model: 'gemini-2.0-flash',
      apiKey: _apiKey,
      systemInstruction: Content.system('Você é o Checky, o assistente virtual simpático do sistema Merenda Check. Ajude o usuário de forma curta e direta com dicas contextuais. Contexto atual: ${widget.routeContext}'),
    );
    
    _chatSession = model.startChat();
    _messages.add({
      'role': 'assistant',
      'text': 'Oi! Sou o Checky! Como posso te ajudar aqui?',
    });
  }

  void _sendMessage() async {
    final text = _textController.text.trim();
    if (text.isEmpty || _isTyping || _chatSession == null) return;

    _textController.clear();
    setState(() {
      _messages.add({'role': 'user', 'text': text});
      _isTyping = true;
    });
    
    _scrollToBottom();

    try {
      final response = await _chatSession!.sendMessage(Content.text(text));
      setState(() {
        _messages.add({'role': 'assistant', 'text': response.text ?? 'Ops, algo deu errado.'});
      });
    } catch (e) {
      setState(() {
        _messages.add({'role': 'assistant', 'text': '😔 Ops! Não consegui responder agora.'});
      });
    } finally {
      setState(() {
        _isTyping = false;
      });
      _scrollToBottom();
    }
  }

  void _scrollToBottom() {
    Future.delayed(const Duration(milliseconds: 100), () {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        widget.child,
        
        // Chat Panel
        if (_chatOpen)
          Positioned(
            right: 16,
            bottom: 90,
            child: Material(
              color: Colors.transparent,
              child: Container(
                width: MediaQuery.of(context).size.width * 0.85,
                height: 400,
                decoration: BoxDecoration(
                  color: const Color(0xFF0F172A).withOpacity(0.95),
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: const Color(0xFF10b981).withOpacity(0.3)),
                  boxShadow: [
                    BoxShadow(color: Colors.black.withOpacity(0.5), blurRadius: 20, offset: const Offset(0, 10))
                  ],
                ),
                child: Column(
                  children: [
                    // Header
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                      decoration: BoxDecoration(
                        border: Border(bottom: BorderSide(color: Colors.white.withOpacity(0.1))),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              const CircleAvatar(
                                backgroundColor: Color(0xFF10b981),
                                radius: 16,
                                child: Text('🍎', style: TextStyle(fontSize: 16)),
                              ),
                              const SizedBox(width: 8),
                              const Text('Checky', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                            ],
                          ),
                          IconButton(
                            icon: const Icon(Icons.close, color: Colors.white54, size: 20),
                            onPressed: () => setState(() => _chatOpen = false),
                          ),
                        ],
                      ),
                    ),
                    
                    // Messages
                    Expanded(
                      child: ListView.builder(
                        controller: _scrollController,
                        padding: const EdgeInsets.all(16),
                        itemCount: _messages.length + (_isTyping ? 1 : 0),
                        itemBuilder: (context, index) {
                          if (index == _messages.length && _isTyping) {
                            return const Align(
                              alignment: Alignment.centerLeft,
                              child: Padding(
                                padding: EdgeInsets.all(8.0),
                                child: Text('Checky digitando...', style: TextStyle(color: Colors.white54, fontSize: 12)),
                              ),
                            );
                          }
                          final msg = _messages[index];
                          final isUser = msg['role'] == 'user';
                          return Align(
                            alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
                            child: Container(
                              margin: const EdgeInsets.only(bottom: 8),
                              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                              decoration: BoxDecoration(
                                color: isUser ? const Color(0xFF10b981).withOpacity(0.2) : Colors.white.withOpacity(0.05),
                                borderRadius: BorderRadius.circular(16),
                                border: Border.all(color: isUser ? const Color(0xFF10b981) : Colors.white.withOpacity(0.1)),
                              ),
                              child: Text(
                                msg['text'],
                                style: const TextStyle(color: Colors.white, fontSize: 14),
                              ),
                            ),
                          );
                        },
                      ),
                    ),
                    
                    // Input
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        border: Border(top: BorderSide(color: Colors.white.withOpacity(0.1))),
                      ),
                      child: Row(
                        children: [
                          Expanded(
                            child: TextField(
                              controller: _textController,
                              style: const TextStyle(color: Colors.white, fontSize: 14),
                              decoration: InputDecoration(
                                hintText: 'Pergunte algo...',
                                hintStyle: TextStyle(color: Colors.white.withOpacity(0.3)),
                                border: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(12),
                                  borderSide: BorderSide.none,
                                ),
                                filled: true,
                                fillColor: Colors.white.withOpacity(0.05),
                                contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 0),
                              ),
                              onSubmitted: (_) => _sendMessage(),
                            ),
                          ),
                          const SizedBox(width: 8),
                          CircleAvatar(
                            backgroundColor: const Color(0xFF10b981),
                            child: IconButton(
                              icon: const Icon(Icons.send, color: Colors.white, size: 18),
                              onPressed: _sendMessage,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
          
        // Mascot Toggle Button
        Positioned(
          right: 16,
          bottom: 16,
          child: GestureDetector(
            onTap: () => setState(() => _chatOpen = !_chatOpen),
            child: Material(
              elevation: 8,
              shape: const CircleBorder(),
              shadowColor: const Color(0xFF10b981).withOpacity(0.5),
              child: CircleAvatar(
                radius: 28,
                backgroundColor: const Color(0xFF0F172A),
                child: Container(
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(color: const Color(0xFF10b981), width: 2),
                  ),
                  child: const Center(
                    child: Text('🍎', style: TextStyle(fontSize: 28)),
                  ),
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }
}
