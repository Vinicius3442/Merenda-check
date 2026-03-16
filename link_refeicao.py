import os

with open('operador.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Substituir o href="#" e onclick=... da "Registrar Refeição"
content = content.replace(
    '<a href="#" class="action-card" onclick="alert(\'Funcionalidade de Scanner da Catraca e QRs em breve!\')">',
    '<a href="registrar-refeicao.html" class="action-card">'
)

with open('operador.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Link 'Registrar Refeição' no operador.html atualizado!")
