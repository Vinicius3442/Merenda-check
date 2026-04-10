import glob

hover_css = """
/* ENFORCED GLOBAL BUTTON HOVER */
.btn, .role-btn { transition: all 0.3s ease !important; }
.btn:hover, .role-btn:hover { 
    transform: translateY(-4px) !important; 
    box-shadow: 0 10px 25px rgba(0,0,0,0.2) !important; 
    filter: brightness(1.1) !important;
}
"""

for filename in glob.glob("*.html"):
    with open(filename, "r", encoding="utf-8") as f:
        content = f.read()

    if "ENFORCED GLOBAL BUTTON HOVER" not in content:
        # Append before the closing </head> to override earlier styles
        if "</head>" in content:
            content = content.replace("</head>", f"<style>\n{hover_css}\n</style>\n</head>")
            with open(filename, "w", encoding="utf-8") as f:
                f.write(content)
            print(f"Enforced strict hover globally on {filename}")
        else:
            print(f"Skipped {filename} (no </head>)")
    else:
        print(f"Already enforced in {filename}")
