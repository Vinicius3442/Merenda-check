import os

with open('operador.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Substituir o href="#" e onclick=... da "Baixa de Insumo"
content = content.replace(
    '<a href="#" class="action-card" onclick="alert(\'Módulo de Controle de Insumos da Cozinha em breve!\')">',
    '<a href="baixa-insumo.html" class="action-card">'
)

# Substituir o href="#" e onclick=... da "Sobra Limpa"
content = content.replace(
    '<a href="#" class="action-card" onclick="alert(\'Notificação de desperdício ou sobra enviada para o Gestor!\')">',
    '<a href="sobra-limpa.html" class="action-card">'
)

with open('operador.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Links no operador.html atualizados!")
