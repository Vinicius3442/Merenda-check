import os

files_to_fix = ['baixa-insumo.html', 'sobra-limpa.html', 'registrar-refeicao.html']

theme_toggle_html = """
  <button class="theme-toggle" onclick="toggleTheme()" style="position: fixed; bottom: 30px; right: 30px; z-index: 9999; background: var(--bg-surface); border: 1px solid var(--glass-border); color: var(--text-main); width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: var(--glass-shadow); transition: 0.3s; font-size: 1.2rem;">
    <i class="fa-solid fa-moon"></i>
  </button>
  <script>
    function toggleTheme() {
      const html = document.documentElement;
      const isDark = html.getAttribute('data-theme') === 'dark';
      html.setAttribute('data-theme', isDark ? 'light' : 'dark');
      const icon = document.querySelector('.theme-toggle i');
      if(icon) icon.className = isDark ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
      localStorage.setItem('theme', isDark ? 'light' : 'dark');
    }
    window.addEventListener('DOMContentLoaded', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const icon = document.querySelector('.theme-toggle i');
      if(icon) icon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    });
  </script>
</body>
"""

for fname in files_to_fix:
    if not os.path.exists(fname): continue
    
    with open(fname, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Fix contrast issue in light mode for form-group, labels, and text
    content = content.replace(
        'background: #000;',
        'background: var(--text-main);' # make camera frame adapt its empty background
    )
    content = content.replace(
        'background: linear-gradient(135deg, #111, #222);',
        'background: var(--bg-surface);' # make camera feed background adaptive
    )
    
    # If the theme toggle is missing, add it before </body>
    if 'class="theme-toggle"' not in content:
        content = content.replace('</body>', theme_toggle_html)
        
    with open(fname, 'w', encoding='utf-8') as f:
        f.write(content)

print("Operator UI fixes applied.")
