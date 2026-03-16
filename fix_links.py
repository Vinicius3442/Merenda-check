import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

for f in html_files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Replace normal <div class="logo">
    content = content.replace('<div class="logo">', '<a href="index.html" class="logo" style="text-decoration: none;">')
    # Replace footer <div class="logo"...>
    content = content.replace('<div class="logo" style="justify-content: center; margin-bottom: 20px; font-size: 1.5rem;">', '<a href="index.html" class="logo" style="text-decoration: none; justify-content: center; margin-bottom: 20px; font-size: 1.5rem; display: flex; align-items: center;">')
    
    # Replace matching </div> with </a>
    pattern = re.compile(r'(<a href="index\.html" class="logo"[^>]*>[\s\S]*?<span[^>]*>Merenda Check</span>\s*)</div>', re.IGNORECASE)
    content = pattern.sub(r'\1</a>', content)
    
    if f == 'index.html':
        content = content.replace(
            'background: linear-gradient(135deg, #fff, #9ca3af);',
            'background: linear-gradient(135deg, var(--text-main), var(--text-muted));'
        )
        content = content.replace(
            "header.style.background = 'rgba(3, 7, 18, 0.85)';",
            "header.style.background = 'var(--bg-surface)';"
        )
        content = content.replace(
            "header.style.boxShadow = '0 4px 30px rgba(0,0,0,0.5)';",
            "header.style.boxShadow = 'var(--glass-shadow)';"
        )
        content = content.replace(
            "header.style.background = 'rgba(3, 7, 18, 0.6)';",
            "header.style.background = 'transparent';"
        )
    
    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)

print("Updated links and index.html styles successfully.")
