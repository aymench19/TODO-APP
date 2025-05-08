class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('theme-toggle');
        this.currentTheme = localStorage.getItem('theme') || 'light';
        
        this.init();
    }
    
    init() {
        this.setTheme(this.currentTheme);
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }
    
    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Mettre à jour le texte et l'icône du bouton
        const icon = theme === 'dark' ? '☀️' : '🌙';
        const text = theme === 'dark' ? 'Mode clair' : 'Mode sombre';
        
        this.themeToggle.querySelector('.icon').textContent = icon;
        this.themeToggle.querySelector('.text').textContent = text;
        
        // Mettre à jour les graphiques si nécessaire
        if (window.dashboard) {
            window.dashboard.updateCharts();
        }
    }
    
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(this.currentTheme);
    }
}