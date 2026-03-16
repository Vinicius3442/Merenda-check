import os

media_query_operador = """
    /* Destkop Responsiveness */
    @media (min-width: 900px) {
      body { flex-direction: row; }
      
      .bottom-nav {
        position: sticky; top: 0; left: 0; width: 250px; height: 100vh;
        flex-direction: column; justify-content: flex-start; align-items: flex-start;
        padding: 40px 24px; border-top: none; border-right: 1px solid var(--glass-border);
      }
      .nav-btn {
        flex-direction: row; font-size: 1rem; padding: 16px; width: 100%; gap: 16px;
        border-radius: 12px; margin-bottom: 8px; justify-content: flex-start;
      }
      .nav-btn.active { background: rgba(0, 242, 96, 0.1); }
      .nav-btn.active i { transform: translateY(0); }
      
      .main-content { padding: 40px 50px; max-width: 1200px; }
      .app-header { display: none; } /* Hide mobile header on desktop for main dashboard */
    }
  </style>
"""

media_query_subpages = """
    /* Desktop Responsiveness */
    @media (min-width: 900px) {
      .main-content { padding: 60px 40px; max-width: 800px; }
      .app-header { padding: 20px 50px; }
      
      .form-box, .scanner-box, .camera-frame { padding: 50px; border-radius: 30px; }
      .camera-frame { height: 500px; }
      
      .type-grid { gap: 30px; }
      .type-btn { padding: 24px; font-size: 1.2rem; }
      .type-btn i { font-size: 2.5rem; }
      
      .btn-submit { padding: 20px; font-size: 1.2rem; }
    }
  </style>
"""

files = ['operador.html', 'baixa-insumo.html', 'sobra-limpa.html', 'registrar-refeicao.html']

for fname in files:
    if not os.path.exists(fname): continue
    with open(fname, 'r', encoding='utf-8') as f:
        content = f.read()

    # Apply media query before closing </style>
    if fname == 'operador.html':
        content = content.replace('  </style>', media_query_operador)
    else:
        content = content.replace('  </style>', media_query_subpages)
        
    # Adjust theme toggle placement on desktop so it doesn't overlap the mobile bottom nav placement
    content = content.replace("bottom: 90px;", "bottom: 30px;")

    with open(fname, 'w', encoding='utf-8') as f:
        f.write(content)

print("Responsive desktop CSS injected.")
