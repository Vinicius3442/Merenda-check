import os
import glob

html_files = glob.glob('*.html')
excludes = ['index.html', 'login.html']

poppins_link = '<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet">'
footer_html = '''      <footer style="margin-top: 40px; padding-top: 20px; border-top: 1px solid var(--border-subtle); text-align: center; color: var(--text-muted); font-size: 0.9rem;">
        &copy; 2026 Merenda Check. Todos os direitos reservados.
      </footer>
'''

for file in html_files:
    if file in excludes:
        continue
        
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
        
    updated = False
    
    # Check for Poppins
    if 'family=Poppins' not in content:
        if '</head>' in content:
            content = content.replace('</head>', f'  {poppins_link}\n</head>')
            updated = True
            
    # Check for footer
    if ('class="app-main"' in content or '<main' in content) and '<footer' not in content:
        if '</main>' in content:
            content = content.replace('</main>', f'{footer_html}    </main>')
            updated = True

    if updated:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {file}")
