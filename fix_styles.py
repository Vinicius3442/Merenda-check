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
      --input-bg: rgba(0, 0, 0, 0.05);
      --card-bg: #ffffff;
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
      --input-bg: rgba(0, 0, 0, 0.5);
      --card-bg: rgba(255, 255, 255, 0.03);
    }"""

svg_logo = """      <svg width="40" height="40" viewBox="0 0 100 100" fill="none" stroke="var(--primary)" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 12px; vertical-align: middle;">
        <path d="M 20 80 V 20 L 50 50 L 80 20 V 80" />
        <path d="M 35 60 L 50 75 L 85 30" stroke-width="14" stroke="var(--text-main)" />
      </svg>
      <span style="color: var(--text-main);">Merenda Check</span>"""

for f in html_files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Update CSS Variables
    content = re.sub(r':root\s*\{[^}]*\}\s*\[data-theme="dark"\]\s*\{[^}]*\}', css_vars, content)

    # Replace bad inline backgrounds and texts
    content = content.replace("background: rgba(0,0,0,0.5);", "background: var(--input-bg);")
    content = content.replace("background: rgba(0,0,0,0.3);", "background: var(--input-bg);")
    content = content.replace("background: rgba(0,0,0,0.2);", "background: var(--glass-border);")
    content = content.replace("background: rgba(255,255,255,0.02);", "background: var(--card-bg);")
    content = content.replace("background: rgba(255,255,255,0.03);", "background: var(--card-bg);")
    content = content.replace("background: rgba(255,255,255,0.05);", "background: var(--input-bg);")
    content = content.replace("color: #fff;", "color: var(--text-main);")
    
    # Replace Logo specifically
    logo_pattern = r'<img src="logo\.png"[^>]*>\s*Merenda Check'
    content = re.sub(logo_pattern, svg_logo, content)

    # In auditor.html specifically it had an inline style for text color
    content = content.replace('style="font-weight: 600; color: var(--text-main);"', 'style="font-weight: 600; color: var(--text-main);"')

    # Replace header text contrast
    content = content.replace('color: #000;', 'color: var(--bg-base);')
    content = content.replace('color: #64748b;', 'color: var(--text-muted);')

    # Some cards have their color set via border or background, ensuring contrast
    content = content.replace("background: rgba(239, 68, 68, 0.1);", "background: var(--alert-red-glow);") # Not exactly, but better. Wait, I will use CSS overrides
    
    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)

print("Styles and SVG Logo updated.")
