/**
 * Merenda Check - Global JavaScript
 * Handles Theme, Toasts, and shared UI logic
 */

const App = {
  init() {
    this.initTheme();
    this.createToastContainer();
    this.setupNetworkMock();
  },

  // --- THEME MANAGEMENT ---
  initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark'; // Defaulting to dark for wow factor
    document.documentElement.setAttribute('data-theme', savedTheme);
    this.updateThemeIcon(savedTheme);

    const toggleBtn = document.getElementById('themeToggle');
    if(toggleBtn) {
      toggleBtn.addEventListener('click', () => this.toggleTheme());
    }
  },

  toggleTheme() {
    const html = document.documentElement;
    const isDark = html.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    this.updateThemeIcon(newTheme);

    // Dispatch event so charts can update
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: newTheme } }));
  },

  updateThemeIcon(theme) {
    const icon = document.querySelector('#themeToggle i');
    if(icon) {
      icon.className = theme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
    }
  },

  // --- TOAST NOTIFICATIONS ---
  createToastContainer() {
    if(!document.getElementById('toastWrapper')) {
      const wrapper = document.createElement('div');
      wrapper.id = 'toastWrapper';
      wrapper.className = 'toast-container';
      document.body.appendChild(wrapper);
    }
  },

  /**
   * Show a toast notification
   * @param {string} title 
   * @param {string} message 
   * @param {string} type 'success' | 'error' | 'warning'
   */
  showToast(title, message, type = 'success') {
    const wrapper = document.getElementById('toastWrapper');
    
    const icons = {
      'success': 'fa-circle-check',
      'error': 'fa-triangle-exclamation',
      'warning': 'fa-circle-exclamation'
    };

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    toast.innerHTML = `
      <div class="toast-icon">
        <i class="fa-solid ${icons[type]}"></i>
      </div>
      <div class="toast-content">
        <h4>${title}</h4>
        <p>${message}</p>
      </div>
    `;

    wrapper.appendChild(toast);

    // Slide in
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        toast.classList.add('show');
      });
    });

    // Remove after 5s
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
      }, 400); // Wait for transition
    }, 5000);
  },

  // --- MOCK NETWORK ---
  setupNetworkMock() {
    // Adds a generic simulated delay for buttons with data-action="mock-submit"
    document.querySelectorAll('[data-action="mock-submit"]').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Prevent double click
        if(this.dataset.loading === 'true') return;
        
        const originalText = this.innerHTML;
        const msg = this.dataset.successMsg || 'Ação concluída com sucesso no blockchain.';
        const title = this.dataset.successTitle || 'Sincronizado';
        const isError = this.dataset.error === 'true';

        this.dataset.loading = 'true';
        this.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Processando...';
        this.style.opacity = '0.8';

        setTimeout(() => {
          this.innerHTML = originalText;
          this.dataset.loading = 'false';
          this.style.opacity = '1';
          
          if(isError) {
             App.showToast('Erro de Validação', 'Inconsistência identificada pelo oráculo.', 'error');
          } else {
             App.showToast(title, msg, 'success');
             
             // Optional redirect
             if(this.dataset.redirect) {
               setTimeout(() => {
                 window.location.href = this.dataset.redirect;
               }, 1000);
             }
          }
        }, 1500 + Math.random() * 1000);
      });
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // Add Theme Toggle button globally if not present
  if(!document.getElementById('themeToggle')) {
    const btn = document.createElement('button');
    btn.id = 'themeToggle';
    btn.className = 'theme-toggle-btn';
    btn.title = "Alternar Tema Escuro/Claro";
    btn.innerHTML = '<i></i>';
    document.body.appendChild(btn);
  }

  App.init();
});
