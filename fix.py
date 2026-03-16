import os

for f in [f for f in os.listdir('.') if f.endswith('.html')]:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    content = content.replace("--text-main: var(--bg-surface);", "--text-main: #0f172a;")
    # Also index header background: header.style.background = 'rgba(3, 7, 18, 0.85)'; was replaced.
    # It might have been replaced to 'header.style.background = 'var(--bg-surface)';'.
    
    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)
print("Fixed.")
