class WindowManager {
    constructor() {
        this.windows = new Map();
        this.activeWindow = null;
        this.mainContent = document.getElementById('main-content');
        this.setupEventListeners();
        this.setupDockDragAndDrop();
        this.notificationManager = new NotificationManager();
        
        // Utiliser un debounce pour la sauvegarde
        this.saveWindowStatesDebounced = this.debounce(() => this.saveWindowStates(), 1000);
        
        // Restaurer l'état des fenêtres au démarrage
        this.loadWindowStates();
        
        // Écouter les changements de fond d'écran avec un throttle
        document.addEventListener('wallpaperSettingsChanged', this.throttle((e) => {
            if (e.detail.url) {
                this.setWallpaper(e.detail.url);
                this.saveToLocalStorage('wallpaper', e.detail.url);
            } else if (e.detail.wallpaper) {
                this.setWallpaper(e.detail.wallpaper);
            }
        }, 100));
    }

    // Fonction utilitaire pour le debounce
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Fonction utilitaire pour le throttle
    throttle(func, limit) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func(...args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Fonction sécurisée pour sauvegarder dans le localStorage
    saveToLocalStorage(key, value) {
        try {
            const serializedValue = JSON.stringify(value);
            localStorage.setItem(key, serializedValue);
        } catch (error) {
            console.error('Erreur lors de la sauvegarde dans le localStorage:', error);
        }
    }

    // Fonction sécurisée pour lire depuis le localStorage
    getFromLocalStorage(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Erreur lors de la lecture du localStorage:', error);
            return null;
        }
    }

    // Fonction sécurisée pour nettoyer le HTML
    sanitizeHTML(html) {
        const div = document.createElement('div');
        div.textContent = html;
        return div.innerHTML;
    }

    setupEventListeners() {
        // Gestion des icônes du dock
        document.querySelectorAll('.dock-icon').forEach(icon => {
            icon.addEventListener('click', () => {
                const windowType = icon.dataset.window;
                this.toggleWindow(windowType);
            });
        });

        // Mise à jour de l'horloge
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);
    }

    setupDockDragAndDrop() {
        const dock = document.querySelector('.dock');
        const icons = document.querySelectorAll('.dock-icon');
        let draggedIcon = null;

        icons.forEach(icon => {
            icon.draggable = true;
            
            icon.addEventListener('dragstart', (e) => {
                draggedIcon = icon;
                icon.classList.add('dragging');
                e.dataTransfer.setData('text/plain', icon.dataset.window);
            });

            icon.addEventListener('dragend', () => {
                icon.classList.remove('dragging');
                draggedIcon = null;
            });

            icon.addEventListener('dragover', (e) => {
                e.preventDefault();
                if (icon !== draggedIcon) {
                    icon.classList.add('drag-over');
                }
            });

            icon.addEventListener('dragleave', () => {
                icon.classList.remove('drag-over');
            });

            icon.addEventListener('drop', (e) => {
                e.preventDefault();
                icon.classList.remove('drag-over');
                
                if (draggedIcon && icon !== draggedIcon) {
                    const dock = document.querySelector('.dock');
                    const allIcons = [...dock.children];
                    const draggedIndex = allIcons.indexOf(draggedIcon);
                    const dropIndex = allIcons.indexOf(icon);

                    if (draggedIndex < dropIndex) {
                        dock.insertBefore(draggedIcon, icon.nextSibling);
                    } else {
                        dock.insertBefore(draggedIcon, icon);
                    }

                    // Sauvegarder le nouvel ordre
                    this.saveDockOrder();
                }
            });
        });
    }

    saveDockOrder() {
        const dock = document.querySelector('.dock');
        const order = Array.from(dock.children).map(icon => icon.dataset.window);
        localStorage.setItem('dockOrder', JSON.stringify(order));
    }

    loadDockOrder() {
        const savedOrder = localStorage.getItem('dockOrder');
        if (savedOrder) {
            const order = JSON.parse(savedOrder);
            const dock = document.querySelector('.dock');
            order.forEach(windowType => {
                const icon = document.querySelector(`.dock-icon[data-window="${windowType}"]`);
                if (icon) {
                    dock.appendChild(icon);
                }
            });
        }
    }

    updateClock() {
        const clock = document.getElementById('clock');
        const now = new Date();
        const timeString = now.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        clock.textContent = timeString;
    }

    createWindow(type, title) {
        const window = document.createElement('div');
        window.className = 'window';
        window.dataset.type = type;
        
        // Position initiale au centre de la page si pas de position sauvegardée
        const savedStates = localStorage.getItem('windowStates');
        const states = savedStates ? JSON.parse(savedStates) : {};
        const savedState = states[type];
        
        if (savedState) {
            window.style.left = `${savedState.position.x}px`;
            window.style.top = `${savedState.position.y}px`;
            window.style.width = `${savedState.size.width}px`;
            window.style.height = `${savedState.size.height}px`;
        } else {
            const windowWidth = 800;
            const windowHeight = 600;
            const x = (window.innerWidth - windowWidth) / 2;
            const y = (window.innerHeight - windowHeight) / 2;
            
            window.style.left = `${x}px`;
            window.style.top = `${y}px`;
            window.style.width = `${windowWidth}px`;
            window.style.height = `${windowHeight}px`;
        }

        window.innerHTML = `
            <div class="window-header">
                <div class="window-title">${title}</div>
                <div class="window-controls">
                    <div class="window-control window-minimize">-</div>
                    <div class="window-control window-maximize">□</div>
                    <div class="window-control window-close">×</div>
                </div>
            </div>
            <div class="window-content"></div>
        `;

        this.setupWindowControls(window);
        this.setupDragAndDrop(window);
        this.setupResize(window);
        
        this.mainContent.appendChild(window);
        this.windows.set(type, window);
        this.focusWindow(window);

        // Émettre l'événement windowCreated
        const event = new CustomEvent('windowCreated', {
            detail: { window, type }
        });
        document.dispatchEvent(event);
        
        // Ajouter l'écouteur de clic pour mettre la fenêtre au premier plan
        window.addEventListener('click', () => this.bringWindowToFront(window));
        
        return window;
    }

    setupWindowControls(window) {
        const controls = window.querySelector('.window-controls');
        controls.addEventListener('click', (e) => {
            const control = e.target.closest('.window-control');
            if (!control) return;

            if (control.classList.contains('window-close')) {
                this.closeWindow(window);
            } else if (control.classList.contains('window-minimize')) {
                this.minimizeWindow(window);
            } else if (control.classList.contains('window-maximize')) {
                this.maximizeWindow(window);
            }
        });
    }

    setupDragAndDrop(window) {
        const header = window.querySelector('.window-header');
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        header.addEventListener('mousedown', (e) => {
            // Vérifier si on clique sur une poignée de redimensionnement
            if (e.target.closest('.resize-handle')) return;
            
            isDragging = true;
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
            
            header.classList.add('grabbing');
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            e.preventDefault();
            
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;

            // Limiter le déplacement vertical pour ne pas dépasser la barre supérieure
            if (!window.classList.contains('maximized')) {
                currentY = Math.max(0, currentY); // Empêcher le déplacement au-dessus de la barre
            }

            xOffset = currentX;
            yOffset = currentY;

            window.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
            window.style.transition = 'none';
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            header.classList.remove('grabbing');
            window.style.transition = 'all 0.3s ease';
        });
    }

    setupResize(window) {
        const handles = {
            nw: { position: 'top left', cursor: 'nw-resize' },
            n: { position: 'top center', cursor: 'n-resize' },
            ne: { position: 'top right', cursor: 'ne-resize' },
            e: { position: 'middle right', cursor: 'e-resize' },
            se: { position: 'bottom right', cursor: 'se-resize' },
            s: { position: 'bottom center', cursor: 's-resize' },
            sw: { position: 'bottom left', cursor: 'sw-resize' },
            w: { position: 'middle left', cursor: 'w-resize' }
        };

        // Créer un conteneur pour les poignées
        const handlesContainer = document.createElement('div');
        handlesContainer.className = 'resize-handles-container';
        window.appendChild(handlesContainer);

        Object.entries(handles).forEach(([key, value]) => {
            const handle = document.createElement('div');
            handle.className = `resize-handle resize-${key}`;
            handle.style.cursor = value.cursor;
            handlesContainer.appendChild(handle);
        });

        let isResizing = false;
        let currentHandle = null;
        let startX, startY, startWidth, startHeight, startLeft, startTop;

        const startResize = (e, handle) => {
            isResizing = true;
            currentHandle = handle.className.split('resize-')[1];
            
            const rect = window.getBoundingClientRect();
            startX = e.clientX;
            startY = e.clientY;
            startWidth = rect.width;
            startHeight = rect.height;
            startLeft = rect.left;
            startTop = rect.top;

            window.style.transition = 'none';
            window.classList.add('resizing');
            e.preventDefault();
            e.stopPropagation();
        };

        const doResize = (e) => {
            if (!isResizing) return;

            e.preventDefault();
            e.stopPropagation();

            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;

            let newWidth = startWidth;
            let newHeight = startHeight;
            let newLeft = startLeft;
            let newTop = startTop;

            // Calcul des nouvelles dimensions en fonction de la poignée utilisée
            switch (currentHandle) {
                case 'nw':
                    newWidth = startWidth - deltaX;
                    newHeight = startHeight - deltaY;
                    newLeft = startLeft + deltaX;
                    newTop = Math.max(0, startTop + deltaY); // Limiter le redimensionnement vers le haut
                    break;
                case 'n':
                    newHeight = startHeight - deltaY;
                    newTop = Math.max(0, startTop + deltaY); // Limiter le redimensionnement vers le haut
                    break;
                case 'ne':
                    newWidth = startWidth + deltaX;
                    newHeight = startHeight - deltaY;
                    newTop = Math.max(0, startTop + deltaY); // Limiter le redimensionnement vers le haut
                    break;
                case 'e':
                    newWidth = startWidth + deltaX;
                    break;
                case 'se':
                    newWidth = startWidth + deltaX;
                    newHeight = startHeight + deltaY;
                    break;
                case 's':
                    newHeight = startHeight + deltaY;
                    break;
                case 'sw':
                    newWidth = startWidth - deltaX;
                    newHeight = startHeight + deltaY;
                    newLeft = startLeft + deltaX;
                    break;
                case 'w':
                    newWidth = startWidth - deltaX;
                    newLeft = startLeft + deltaX;
                    break;
            }

            // Limites minimales
            newWidth = Math.max(300, newWidth);
            newHeight = Math.max(200, newHeight);

            // Limites maximales (basées sur la taille de l'écran)
            const maxWidth = window.innerWidth - 40; // 40px de marge
            const maxHeight = window.innerHeight - 110; // 110px de marge (40px top + 70px bottom)
            newWidth = Math.min(newWidth, maxWidth);
            newHeight = Math.min(newHeight, maxHeight);

            // Application des nouvelles dimensions
            window.style.width = `${newWidth}px`;
            window.style.height = `${newHeight}px`;
            window.style.left = `${newLeft}px`;
            window.style.top = `${newTop}px`;
            window.style.transform = 'none';
        };

        const stopResize = () => {
            isResizing = false;
            currentHandle = null;
            window.style.transition = 'all 0.3s ease';
            window.classList.remove('resizing');
        };

        // Ajouter les gestionnaires d'événements aux poignées
        window.querySelectorAll('.resize-handle').forEach(handle => {
            handle.addEventListener('mousedown', (e) => startResize(e, handle));
        });

        // Gestionnaires d'événements globaux
        document.addEventListener('mousemove', doResize);
        document.addEventListener('mouseup', stopResize);

        // Empêcher la sélection du texte pendant le redimensionnement
        window.addEventListener('selectstart', (e) => {
            if (isResizing) {
                e.preventDefault();
            }
        });

        // Empêcher le déplacement pendant le redimensionnement
        window.addEventListener('dragstart', (e) => {
            if (isResizing) {
                e.preventDefault();
            }
        });
    }

    toggleWindow(type) {
        const window = this.windows.get(type);
        if (window) {
            if (window.classList.contains('minimized')) {
                this.restoreWindow(window);
            } else {
                this.focusWindow(window);
            }
        } else {
            if (type === 'settings') {
                this.createSettingsWindow();
            } else if (type === 'home') {
                this.createHomeWindow();
            } else {
                this.createWindow(type, this.getWindowTitle(type));
            }
        }
    }

    getWindowTitle(type) {
        const titles = {
            home: 'Accueil',
            courses: 'Formation',
            projects: 'Projets',
            profile: 'Profil',
            security: 'Sécurité',
            settings: 'Paramètres'
        };
        return titles[type] || type;
    }

    focusWindow(window) {
        const windows = document.querySelectorAll('.window');
        let maxZIndex = 0;
        
        // Trouver le z-index le plus élevé actuel
        windows.forEach(w => {
            const zIndex = parseInt(getComputedStyle(w).zIndex) || 0;
            maxZIndex = Math.max(maxZIndex, zIndex);
        });
        
        // Mettre la fenêtre active au premier plan
        window.style.zIndex = maxZIndex + 1;
        this.activeWindow = window;
        document.querySelector('.window-title').textContent = this.getWindowTitle(window.dataset.type);
    }

    minimizeWindow(window) {
        window.classList.add('minimized');
    }

    restoreWindow(window) {
        window.classList.remove('minimized');
        this.focusWindow(window);
    }

    maximizeWindow(window) {
        if (window.classList.contains('maximized')) {
            // Retour à la taille normale
            window.classList.remove('maximized');
            window.style.width = '800px';
            window.style.height = '600px';
            // Positionner la fenêtre juste sous la barre de contrôle
            window.style.left = '20px';
            window.style.top = '60px'; // 40px de la barre + 20px de marge
            window.style.transform = 'none';
        } else {
            // Passage en plein écran
            window.classList.add('maximized');
            // Réinitialiser toutes les transformations et positions
            window.style.transform = 'none';
            window.style.left = '0';
            window.style.top = '0';
            window.style.width = '100vw';
            window.style.height = '100vh';
        }
    }

    closeWindow(window) {
        window.remove();
        this.windows.delete(window.dataset.type);
        if (this.activeWindow === window) {
            this.activeWindow = null;
            document.querySelector('.window-title').textContent = 'Accueil';
        }
    }

    createSettingsWindow() {
        const window = this.createWindow('settings', 'Paramètres');
        const content = window.querySelector('.window-content');
        
        content.innerHTML = `
            <div class="settings-container">
                <div class="settings-section">
                    <h2>Thème</h2>
                    <div class="theme-options">
                        <button class="theme-btn" data-theme="light">Clair</button>
                        <button class="theme-btn" data-theme="dark">Sombre</button>
                        <button class="theme-btn" data-theme="custom">Personnalisé</button>
                    </div>
                    <div class="custom-theme-editor" style="display: none;">
                        <h3>Personnaliser le thème</h3>
                        <div class="color-picker">
                            <label>Couleur principale</label>
                            <input type="color" id="primary-color" value="#2c3e50">
                        </div>
                        <div class="color-picker">
                            <label>Couleur secondaire</label>
                            <input type="color" id="secondary-color" value="#34495e">
                        </div>
                        <div class="color-picker">
                            <label>Couleur d'accent</label>
                            <input type="color" id="accent-color" value="#3498db">
                        </div>
                        <div class="color-picker">
                            <label>Couleur de texte</label>
                            <input type="color" id="text-color" value="#ecf0f1">
                        </div>
                    </div>
                </div>

                <div class="settings-section">
                    <h2>Personnalisation du Dock</h2>
                    <div class="dock-settings">
                        <div class="setting-item">
                            <label>Taille</label>
                            <input type="range" id="dock-size" min="30" max="100" value="50">
                        </div>
                        <div class="setting-item">
                            <label>Transparence</label>
                            <input type="range" id="dock-transparency" min="0" max="100" value="80">
                        </div>
                    </div>
                </div>

                <div class="settings-section">
                    <h2>Fond d'écran</h2>
                    <div class="wallpaper-settings">
                        <div class="wallpaper-options">
                            <div class="wallpaper-grid">
                                <div class="wallpaper-item" data-wallpaper="gradient1">
                                    <div class="wallpaper-preview gradient1"></div>
                                </div>
                                <div class="wallpaper-item" data-wallpaper="gradient2">
                                    <div class="wallpaper-preview gradient2"></div>
                                </div>
                                <div class="wallpaper-item" data-wallpaper="gradient3">
                                    <div class="wallpaper-preview gradient3"></div>
                                </div>
                                <div class="wallpaper-item" data-wallpaper="custom">
                                    <div class="wallpaper-preview custom">
                                        <input type="file" accept="image/*" id="custom-wallpaper">
                                        <label for="custom-wallpaper">Personnalisé</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.setupSettingsHandlers(content);
        return window;
    }

    setupSettingsHandlers(content) {
        // Gestion du thème
        content.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const theme = btn.dataset.theme;
                if (theme === 'custom') {
                    content.querySelector('.custom-theme-editor').style.display = 'block';
                } else {
                    content.querySelector('.custom-theme-editor').style.display = 'none';
                    document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
                }
            });
        });

        // Gestion des couleurs personnalisées
        content.querySelectorAll('.custom-theme-editor input[type="color"]').forEach(input => {
            input.addEventListener('input', () => {
                const customTheme = {
                    primary: content.querySelector('#primary-color').value,
                    secondary: content.querySelector('#secondary-color').value,
                    accent: content.querySelector('#accent-color').value,
                    text: content.querySelector('#text-color').value
                };
                document.dispatchEvent(new CustomEvent('themeChanged', { 
                    detail: { theme: 'custom', customTheme } 
                }));
            });
        });

        // Gestion des paramètres du dock
        content.querySelector('#dock-size').addEventListener('input', (e) => {
            document.dispatchEvent(new CustomEvent('dockSettingsChanged', {
                detail: { size: parseInt(e.target.value) }
            }));
        });

        content.querySelector('#dock-transparency').addEventListener('input', (e) => {
            document.dispatchEvent(new CustomEvent('dockSettingsChanged', {
                detail: { transparency: parseInt(e.target.value) / 100 }
            }));
        });

        // Gestion du fond d'écran
        content.querySelectorAll('.wallpaper-item').forEach(item => {
            item.addEventListener('click', () => {
                const wallpaper = item.dataset.wallpaper;
                if (wallpaper === 'custom') {
                    const input = item.querySelector('input');
                    input.click();
                    input.addEventListener('change', (e) => {
                        const file = e.target.files[0];
                        if (file) {
                            const reader = new FileReader();
                            reader.onload = (e) => {
                                document.dispatchEvent(new CustomEvent('wallpaperSettingsChanged', {
                                    detail: { url: e.target.result }
                                }));
                            };
                            reader.readAsDataURL(file);
                        }
                    });
                } else {
                    document.dispatchEvent(new CustomEvent('wallpaperSettingsChanged', {
                        detail: { wallpaper }
                    }));
                }
            });
        });

        // Charger les paramètres sauvegardés
        this.loadSavedSettings();
    }

    setWallpaper(wallpaper) {
        const wallpapers = {
            gradient1: 'linear-gradient(135deg, #FF6B6B, #4ECDC4, #45B7D1)',
            gradient2: 'linear-gradient(135deg, #FF9A9E, #FAD0C4, #FAD0C4)',
            gradient3: 'linear-gradient(135deg, #A8E6CF, #FFD3B6, #FFAAA5)'
        };

        if (wallpapers[wallpaper]) {
            document.body.style.background = wallpapers[wallpaper];
            localStorage.setItem('wallpaper', wallpaper);
        }
    }

    loadSavedSettings() {
        // Charger le thème
        const theme = localStorage.getItem('theme') || 'light';
        document.body.setAttribute('data-theme', theme);

        // Charger les couleurs
        const primaryColor = localStorage.getItem('--primary-color') || '#2c3e50';
        const accentColor = localStorage.getItem('--accent-color') || '#3498db';
        document.documentElement.style.setProperty('--primary-color', primaryColor);
        document.documentElement.style.setProperty('--accent-color', accentColor);

        // Charger le fond d'écran
        const wallpaper = localStorage.getItem('wallpaper');
        if (wallpaper && wallpaper.startsWith('data:')) {
            document.body.style.background = `url(${wallpaper}) center/cover no-repeat`;
        } else {
            this.setWallpaper(wallpaper || 'gradient1');
        }
    }

    createHomeWindow() {
        const window = this.createWindow('home', 'Accueil');
        const content = window.querySelector('.window-content');
        
        // Créer les onglets
        const tabs = document.createElement('div');
        tabs.className = 'tabs';
        tabs.innerHTML = `
            <button class="tab-btn active" data-tab="welcome">Bienvenue</button>
            <button class="tab-btn" data-tab="tutorial">Tutoriel</button>
        `;
        content.appendChild(tabs);

        // Contenu de l'onglet Bienvenue
        const welcomeContent = document.createElement('div');
        welcomeContent.className = 'tab-content active';
        welcomeContent.id = 'welcome';
        welcomeContent.innerHTML = `
            <div class="home-container">
                <h1>Bienvenue sur mon portfolio !</h1>
                <div class="home-content">
                    <p>Je m'appelle Doutreligne Oskar, étudiant en BTS SIO et passionné par l'informatique. Actuellement en alternance à la DISI Nord de la Direction Générale des Finances Publiques, je développe mes compétences en développement et en gestion de systèmes d'information.</p>
                    <p>Ce site est un portfolio unique qui simule une expérience de bureau virtuel (OS). Inspiré des systèmes d'exploitation modernes, il vous permet de naviguer à travers mes projets, mon parcours et mes réalisations de manière interactive et intuitive.</p>
                    <p>Vous pouvez :</p>
                    <ul>
                        <li>Explorer mes projets dans la section "Projets"</li>
                        <li>Découvrir mon parcours académique dans "Formation"</li>
                        <li>Personnaliser l'interface selon vos préférences dans "Paramètres"</li>
                        <li>Consulter le tutoriel pour une visite guidée</li>
                    </ul>
                    <p>Bonne visite dans mon univers numérique !</p>
                </div>
            </div>
        `;
        content.appendChild(welcomeContent);

        // Contenu de l'onglet Tutoriel
        const tutorialContent = document.createElement('div');
        tutorialContent.className = 'tab-content';
        tutorialContent.id = 'tutorial';
        tutorialContent.innerHTML = `
            <div class="tutorial-container">
                <h2>Guide d'utilisation de CursorOS</h2>
                
                <section class="tutorial-section">
                    <h3>🎯 Le Dock</h3>
                    <p>Le dock est votre barre d'outils principale, située en bas de l'écran :</p>
                    <ul>
                        <li>Cliquez sur les icônes pour ouvrir les applications</li>
                        <li>Survolez les icônes pour voir les effets d'animation</li>
                        <li>En mode plein écran, le dock se cache automatiquement</li>
                        <li>Survolez le bord inférieur pour le faire réapparaître</li>
                    </ul>
                </section>

                <section class="tutorial-section">
                    <h3><i class="fas fa-mouse-pointer"></i> Gestion des Fenêtres</h3>
                    <p>Manipulez les fenêtres comme sur un système d'exploitation classique :</p>
                    <ul>
                        <li>Déplacez les fenêtres en faisant glisser la barre de titre</li>
                        <li>Redimensionnez les fenêtres en utilisant les poignées sur les bords</li>
                        <li>Utilisez les boutons de contrôle pour minimiser, maximiser ou fermer</li>
                        <li>Cliquez sur une fenêtre pour la mettre au premier plan</li>
                    </ul>
                </section>

                <section class="tutorial-section">
                    <h3><i class="fas fa-paint-brush"></i> Personnalisation</h3>
                    <p>Adaptez l'interface à vos préférences :</p>
                    <ul>
                        <li>Changez le thème (clair/sombre)</li>
                        <li>Personnalisez les couleurs de l'interface</li>
                        <li>Modifiez le fond d'écran avec des dégradés ou vos propres images</li>
                        <li>Ajustez les paramètres du dock</li>
                    </ul>
                </section>

                <section class="tutorial-section">
                    <h3><i class="fas fa-ellipsis-v"></i> Menu Contextuel</h3>
                    <p>Accédez à des options supplémentaires :</p>
                    <ul>
                        <li>Faites un clic droit sur le bureau pour ouvrir le menu contextuel</li>
                        <li>Gérez les fenêtres (minimiser, maximiser, fermer)</li>
                        <li>Accédez aux paramètres rapides</li>
                        <li>Personnalisez l'interface</li>
                    </ul>
                </section>
            </div>
        `;
        content.appendChild(tutorialContent);

        // Gestion des onglets
        const tabButtons = tabs.querySelectorAll('.tab-btn');
        const tabContents = content.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Retirer la classe active de tous les boutons et contenus
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));

                // Ajouter la classe active au bouton cliqué et au contenu correspondant
                button.classList.add('active');
                const tabId = button.getAttribute('data-tab');
                content.querySelector(`#${tabId}`).classList.add('active');
            });
        });

        return window;
    }

    // Gestionnaire d'événements pour le clic sur une fenêtre
    handleWindowClick(event) {
        const window = event.currentTarget;
        this.bringWindowToFront(window);
    }

    // Fonction pour mettre une fenêtre au premier plan
    bringWindowToFront(window) {
        const windows = document.querySelectorAll('.window');
        let maxZIndex = 0;
        
        // Trouver le z-index le plus élevé actuel
        windows.forEach(w => {
            const zIndex = parseInt(getComputedStyle(w).zIndex) || 0;
            maxZIndex = Math.max(maxZIndex, zIndex);
        });
        
        // Mettre la fenêtre cliquée au premier plan
        window.style.zIndex = maxZIndex + 1;
    }

    saveWindowStates() {
        const states = {};
        this.windows.forEach((window, type) => {
            if (!window.classList.contains('minimized')) {
                const rect = window.getBoundingClientRect();
                states[type] = {
                    position: {
                        x: rect.left,
                        y: rect.top
                    },
                    size: {
                        width: rect.width,
                        height: rect.height
                    }
                };
            }
        });
        this.saveToLocalStorage('windowStates', states);
    }

    loadWindowStates() {
        const states = this.getFromLocalStorage('windowStates');
        if (states) {
            Object.entries(states).forEach(([type, state]) => {
                const window = this.windows.get(type);
                if (window) {
                    window.style.left = `${state.position.x}px`;
                    window.style.top = `${state.position.y}px`;
                    window.style.width = `${state.size.width}px`;
                    window.style.height = `${state.size.height}px`;
                }
            });
        }
    }
} 