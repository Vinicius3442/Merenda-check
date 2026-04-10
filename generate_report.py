import os
import glob
import re

html_files = set(glob.glob("*.html"))

link_pattern = re.compile(r'href="([^"]+)"')
onclick_pattern = re.compile(r"onclick=\"(?:window\.)?location(?:\.href)?='([^']+)'\"")

missing_pages = set()
broken_links_by_file = {}
context_links = []

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
        
    links = link_pattern.findall(content)
    onclicks = onclick_pattern.findall(content)
    links.extend(onclicks)
    
    for link in links:
        context_links.append((file, link))
        
        if link.startswith('http') or link.startswith('//') or link.startswith('#') or link.startswith('mailto:') or link.startswith('tel:'):
            continue
            
        base_link = link.split('#')[0].split('?')[0]
        
        if base_link and base_link.endswith('.html') and base_link not in html_files:
            missing_pages.add(base_link)
            if file not in broken_links_by_file:
                broken_links_by_file[file] = set()
            broken_links_by_file[file].add(base_link)

report_path = r"C:\Users\55988051898\.gemini\antigravity\brain\1ba79935-0f65-4f0c-be6e-e47cc7305b83\link_report.md"

with open(report_path, "w", encoding="utf-8") as out:
    out.write("# Relatório de Links e Contexto (Merenda Check)\n\n")
    out.write(f"**Total de páginas HTML reais na pasta:** {len(html_files)}\n\n")
    
    out.write("## 1. Páginas Faltantes (Bad Links / Missing Files)\n")
    out.write(f"Encontramos **{len(missing_pages)} páginas** que estão sendo referenciadas, mas não existem no diretório atual:\n\n")
    for p in sorted(missing_pages):
        out.write(f"- `{p}`\n")
        
    out.write("\n###  Onde essas páginas faltantes estão sendo chamadas:\n")
    for f, missing in broken_links_by_file.items():
        out.write(f"- Em `{f}`: aponta para -> {', '.join(missing)}\n")

    out.write("\n## 2. Mapa de Contexto e Navegação (Quem aponta para Quem)\n")
    link_map = {}
    for f, l in context_links:
        if l.endswith('.html'):
            if f not in link_map: link_map[f] = set()
            link_map[f].add(l)

    for f in sorted(link_map.keys()):
        out.write(f"- **{f}** redireciona para: {', '.join(sorted(link_map[f]))}\n")

print(f"Report saved to {report_path}")
