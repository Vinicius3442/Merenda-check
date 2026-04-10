import os
import glob
import re

html_files = set(glob.glob("*.html"))
print(f"Total existing HTML files: {len(html_files)}")

print("\n--- LINK ANALYSIS ---")
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
        
        if link.startswith('http') or link.startswith('//'):
            continue
        if link.startswith('#') or link.startswith('mailto:') or link.startswith('tel:'):
            continue
            
        base_link = link.split('#')[0].split('?')[0]
        
        if base_link and base_link.endswith('.html') and base_link not in html_files:
            missing_pages.add(base_link)
            if file not in broken_links_by_file:
                broken_links_by_file[file] = set()
            broken_links_by_file[file].add(base_link)

print(f"\nMissing HTML Pages ({len(missing_pages)}):")
for p in sorted(missing_pages):
    print(f" - {p}")

print("\nWhere they are referenced:")
for f, missing in broken_links_by_file.items():
    print(f" {f} points to -> {', '.join(missing)}")

print("\nContext Review (Internal links per file):")
link_map = {}
for f, l in context_links:
    if l.endswith('.html'):
        if f not in link_map: link_map[f] = set()
        link_map[f].add(l)

for f in sorted(link_map.keys()):
    print(f" {f}: {', '.join(sorted(link_map[f]))}")
