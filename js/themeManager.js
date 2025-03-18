class ThemeManager {
    constructor() {
        this.themes = {
            light: {
                primary: '#2c3e50',
                secondary: '#34495e',
                accent: '#3498db',
                text: '#ecf0f1',
                windowBg: 'rgba(255, 255, 255, 0.95)',
                contextMenuBg: 'rgba(255, 255, 255, 0.95)',
                contextMenuHover: 'rgba(52, 152, 219, 0.1)',
                bgColor: '#ffffff',
                textPrimary: '#333333',
                textSecondary: '#666666',
                borderColor: '#e0e0e0'
            },
            dark: {
                primary: '#1a1a1a',
                secondary: '#2c3e50',
                accent: '#3498db',
                text: '#ecf0f1',
                windowBg: 'rgba(30, 30, 30, 0.95)',
                contextMenuBg: 'rgba(30, 30, 30, 0.95)',
                contextMenuHover: 'rgba(52, 152, 219, 0.2)',
                bgColor: '#1a1a1a',
                textPrimary: '#ffffff',
                textSecondary: '#cccccc',
                borderColor: '#333333'
            }
        };
        this.currentTheme = 'light';
        this.customTheme = null;
        this.shortcuts = new Map();
        this.dockSettings = {
            size: 50,
            position: 'bottom',
            transparency: 0.8
        };
        this.wallpaperSettings = {
            type: 'static',
            url: '',
            animation: 'none',
            interval: 300000 // 5 minutes
        };
    }

    init() {
        this.loadSettings();
        this.applyTheme();
        this.setupEventListeners();
    }

    loadSettings() {
        // Charger le thème
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.currentTheme = savedTheme;

        // Charger les raccourcis
        const savedShortcuts = localStorage.getItem('shortcuts');
        if (savedShortcuts) {
            this.shortcuts = new Map(JSON.parse(savedShortcuts));
        }

        // Charger les paramètres du dock
        const savedDockSettings = localStorage.getItem('dockSettings');
        if (savedDockSettings) {
            this.dockSettings = JSON.parse(savedDockSettings);
        }

        // Charger les paramètres du fond d'écran
        const savedWallpaperSettings = localStorage.getItem('wallpaperSettings');
        if (savedWallpaperSettings) {
            this.wallpaperSettings = JSON.parse(savedWallpaperSettings);
        }
    }

    saveSettings() {
        localStorage.setItem('theme', this.currentTheme);
        localStorage.setItem('shortcuts', JSON.stringify(Array.from(this.shortcuts.entries())));
        localStorage.setItem('dockSettings', JSON.stringify(this.dockSettings));
        localStorage.setItem('wallpaperSettings', JSON.stringify(this.wallpaperSettings));
    }

    applyTheme() {
        const theme = this.customTheme || this.themes[this.currentTheme];
        const root = document.documentElement;

        // Appliquer les variables CSS
        Object.entries(theme).forEach(([key, value]) => {
            const cssVar = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
            root.style.setProperty(cssVar, value);
        });

        // Appliquer le thème au body
        document.body.setAttribute('data-theme', this.currentTheme);
    }

    setCustomTheme(theme) {
        this.customTheme = theme;
        this.applyTheme();
        this.saveSettings();
    }

    setShortcut(action, key) {
        this.shortcuts.set(action, key);
        this.saveSettings();
        this.updateShortcutDisplay();
    }

    updateShortcutDisplay() {
        document.querySelectorAll('.shortcut-hint').forEach(hint => {
            const action = hint.closest('.dock-icon').dataset.window;
            const shortcut = this.shortcuts.get(action);
            if (shortcut) {
                hint.textContent = shortcut;
            }
        });
    }

    updateDockSettings(settings) {
        this.dockSettings = { ...this.dockSettings, ...settings };
        this.applyDockSettings();
        this.saveSettings();
    }

    applyDockSettings() {
        const dock = document.querySelector('.dock');
        if (!dock) return;

        // Appliquer la taille
        dock.style.setProperty('--dock-size', `${this.dockSettings.size}px`);
        
        // Appliquer la position
        dock.style.setProperty('--dock-position', this.dockSettings.position);
        
        // Appliquer la transparence
        dock.style.backgroundColor = `rgba(0, 0, 0, ${1 - this.dockSettings.transparency})`;
    }

    setWallpaperSettings(settings) {
        this.wallpaperSettings = { ...this.wallpaperSettings, ...settings };
        this.applyWallpaperSettings();
        this.saveSettings();
    }

    applyWallpaperSettings() {
        const body = document.body;
        
        if (this.wallpaperSettings.type === 'static') {
            if (this.wallpaperSettings.url) {
                body.style.background = `url(${this.wallpaperSettings.url}) center/cover no-repeat`;
            }
        } else if (this.wallpaperSettings.type === 'dynamic') {
            this.startWallpaperRotation();
        }
    }

    startWallpaperRotation() {
        if (this.wallpaperInterval) {
            clearInterval(this.wallpaperInterval);
        }

        this.wallpaperInterval = setInterval(() => {
            // Logique de rotation du fond d'écran
            // À implémenter selon vos besoins
        }, this.wallpaperSettings.interval);
    }

    setupEventListeners() {
        // Écouter les changements de thème
        document.addEventListener('themeChanged', (e) => {
            this.currentTheme = e.detail.theme;
            this.applyTheme();
            this.saveSettings();
        });

        // Écouter les changements de raccourcis
        document.addEventListener('shortcutChanged', (e) => {
            this.setShortcut(e.detail.action, e.detail.key);
        });

        // Écouter les changements des paramètres du dock
        document.addEventListener('dockSettingsChanged', (e) => {
            this.updateDockSettings(e.detail);
        });

        // Écouter les changements des paramètres du fond d'écran
        document.addEventListener('wallpaperSettingsChanged', (e) => {
            this.setWallpaperSettings(e.detail);
        });
    }
}

// Initialiser le gestionnaire de thèmes
const themeManager = new ThemeManager();
themeManager.init(); 