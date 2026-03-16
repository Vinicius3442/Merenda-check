import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

css_vars = """    :root {
      --primary: #059669; --primary-dark: #047857;
      --bg-base: #ffffff; --bg-surface: #f8fafc;
      --text-main: #0f172a; --text-muted: #64748b;
      --glass-border: rgba(0, 0, 0, 0.1);
      --glass-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      --neon-glow: 0 4px 12px rgba(5, 150, 105, 0.2);
      --alert-red: #ef4444; --alert-red-glow: 0 4px 12px rgba(239, 68, 68, 0.3);
      --alert-yellow: #f59e0b;
    }
    [data-theme="dark"] {
      --primary: #00f260; --primary-dark: #0575e6;
      --bg-base: #030712; --bg-surface: rgba(17, 24, 39, 0.7);
      --text-main: #f9fafb; --text-muted: #9ca3af;
      --glass-border: rgba(255, 255, 255, 0.08);
      --glass-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
      --neon-glow: 0 0 20px rgba(0, 242, 96, 0.4);
      --alert-red: #ef4444; --alert-red-glow: 0 0 20px rgba(239, 68, 68, 0.4);
      --alert-yellow: #facc15;
    }"""

head_script = """  <script>
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
  </script>
</head>"""

body_script = """  <button class="theme-toggle" onclick="toggleTheme()" style="position: fixed; bottom: 30px; right: 30px; z-index: 9999; background: var(--bg-surface); border: 1px solid var(--glass-border); color: var(--text-main); width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: var(--glass-shadow); transition: 0.3s; font-size: 1.2rem;">
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
</body>"""

for f in html_files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # CSS variables
    if ":root" in content:
        content = re.sub(r':root\s*\{[^}]*\}', css_vars, content, count=1)
    
    # Head Script
    if "localStorage.getItem('theme')" not in content:
        content = content.replace("</head>", head_script)
    
    # Body Script
    if "toggleTheme()" not in content:
        content = content.replace("</body>", body_script)
        
    # Replacements
    content = re.sub(r'#030712', 'var(--bg-base)', content)
    content = re.sub(r'#020617', 'var(--bg-base)', content)
    content = re.sub(r'background:\s*rgba\(3,\s*7,\s*18,\s*[0-9.]+\)', 'background: var(--bg-surface)', content)
    content = re.sub(r'background:\s*rgba\(2,\s*6,\s*23,\s*[0-9.]+\)', 'background: var(--bg-surface)', content)
    content = re.sub(r'background:\s*rgba\(15,\s*23,\s*42,\s*[0-9.]+\)', 'background: var(--bg-surface)', content)
    content = re.sub(r'background:\s*rgba\(17,\s*24,\s*39,\s*[0-9.]+\)', 'background: var(--bg-surface)', content)
    
    content = re.sub(r'rgba\(3,7,18,[0-9.]+\)', 'var(--bg-base)', content)
    content = re.sub(r'#0f172a', 'var(--bg-surface)', content)
    
    content = re.sub(r'color:\s*#fff(?:;|)', 'color: var(--text-main);', content)
    content = re.sub(r'color:\s*white(?:;|)', 'color: var(--text-main);', content)
    content = re.sub(r'color:\s*#000(?:;|)', 'color: var(--bg-base);', content)
    
    # Replacing the specific table headers and muted texts that had rgba(255,255,255,...) 
    content = re.sub(r'rgba\(255,\s*255,\s*255,\s*0\.0[2-5]\)', 'var(--glass-border)', content)

    # Replace Logo
    new_logo = r'\1\n      <img src="logo.png" alt="Logo" style="height: 38px; margin-right: 12px; vertical-align: middle;"> Merenda Check\n    \2'
    content = re.sub(r'(<div[^>]*class="logo"[^>]*>).*?(</div>)', new_logo, content, flags=re.DOTALL)
    
    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)

print("Applied light/dark themes and added logos successfully.")
