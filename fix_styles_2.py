import os

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

for f in html_files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Fix contrast for light pink/red and light green that were hardcoded
    content = content.replace("color: #fca5a5;", "color: var(--alert-red);")
    content = content.replace("color: #4ade80;", "color: var(--primary);")
    
    # Border colors for danger
    content = content.replace("border-color: rgba(239, 68, 68, 0.3);", "border-color: var(--alert-red);")
    content = content.replace("border: 1px solid rgba(239,68,68,0.3);", "border: 1px solid var(--alert-red);")
    
    # Replace the remaining white texts in inline styles
    content = content.replace("color: #fff;", "color: var(--text-main);")
    content = content.replace("color: white;", "color: var(--text-main);")

    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)

print("Fixed specific hardcoded contrast colors.")
