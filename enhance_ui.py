import os
import glob

html_files = glob.glob('*.html')

old_hover = '''.glass-panel:hover {
  box-shadow: var(--shadow-hover);
  transform: translateY(-4px);
}'''

new_hover = '''.glass-panel:hover {
  box-shadow: var(--shadow-hover);
  transform: translateY(-6px);
  border-color: rgba(37, 211, 113, 0.3);
}'''

old_btn_primary = '''.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: var(--neon-glow);
  color: #ffffff;
}'''

new_btn_primary = '''.btn-primary:hover {
  transform: translateY(-5px);
  box-shadow: 0 0 25px rgba(37, 211, 113, 0.6);
  color: #ffffff;
  filter: brightness(1.1);
}'''

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
        
    updated = False
    
    if old_hover in content:
        content = content.replace(old_hover, new_hover)
        updated = True
        
    if old_btn_primary in content:
        content = content.replace(old_btn_primary, new_btn_primary)
        updated = True

    if updated:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Enhanced {file}")
