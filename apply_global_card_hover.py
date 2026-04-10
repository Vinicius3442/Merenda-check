import glob

hover_css = """
/* ENFORCED GLOBAL CARD HOVER */
.card, .glass-panel, .kpi-card, .cta-box { transition: all 0.3s ease !important; }
.card:hover, .glass-panel:hover, .kpi-card:hover, .cta-box:hover { 
    transform: translateY(-6px) !important; 
    box-shadow: 0 15px 35px rgba(0,0,0,0.3) !important; 
    border-color: rgba(37, 211, 113, 0.4) !important;
}
"""

for filename in glob.glob("*.html"):
    with open(filename, "r", encoding="utf-8") as f:
        content = f.read()

    if "ENFORCED GLOBAL CARD HOVER" not in content:
        if "</head>" in content:
            content = content.replace("</head>", f"<style>\n{hover_css}\n</style>\n</head>")
            with open(filename, "w", encoding="utf-8") as f:
                f.write(content)
            print(f"Enforced strict card hover globally on {filename}")
