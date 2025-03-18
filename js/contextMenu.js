class ContextMenu {
    constructor() {
        this.menu = null;
        this.createMenu();
        this.setupEventListeners();
    }

    createMenu() {
        this.menu = document.createElement('div');
        this.menu.className = 'context-menu';
        this.menu.innerHTML = `
            <div class="context-menu-item" data-action="minimize">
                <i class="fas fa-minus"></i>
                <span>Minimiser</span>
            </div>
            <div class="context-menu-item" data-action="maximize">
                <i class="fas fa-expand"></i>
                <span>Maximiser</span>
            </div>
            <div class="context-menu-item" data-action="close">
                <i class="fas fa-times"></i>
                <span>Fermer</span>
            </div>
            <div class="context-menu-separator"></div>
            <div class="context-menu-item" data-action="alwaysOnTop">
                <i class="fas fa-thumbtack"></i>
                <span>Toujours au premier plan</span>
            </div>
            <div class="context-menu-item" data-action="refresh">
                <i class="fas fa-sync"></i>
                <span>Actualiser</span>
            </div>
        `;
        document.body.appendChild(this.menu);
    }

    setupEventListeners() {
        document.addEventListener('contextmenu', (e) => {
            const target = e.target.closest('.window, .dock-icon');
            if (target) {
                e.preventDefault();
                this.showMenu(e.clientX, e.clientY, target);
            }
        });

        document.addEventListener('click', () => {
            this.hideMenu();
        });

        this.menu.addEventListener('click', (e) => {
            const action = e.target.closest('.context-menu-item')?.dataset.action;
            if (action) {
                this.handleAction(action);
            }
        });
    }

    showMenu(x, y, target) {
        this.menu.style.left = `${x}px`;
        this.menu.style.top = `${y}px`;
        this.menu.style.display = 'block';
        this.menu.dataset.target = target.dataset.window || target.dataset.type;
    }

    hideMenu() {
        this.menu.style.display = 'none';
    }

    handleAction(action) {
        const target = this.menu.dataset.target;
        const window = document.querySelector(`.window[data-type="${target}"]`);
        
        switch (action) {
            case 'minimize':
                windowManager.minimizeWindow(window);
                break;
            case 'maximize':
                windowManager.maximizeWindow(window);
                break;
            case 'close':
                windowManager.closeWindow(window);
                break;
            case 'alwaysOnTop':
                window.classList.toggle('always-on-top');
                break;
            case 'refresh':
                if (window) {
                    loadWindowContent(window, target);
                }
                break;
        }
        this.hideMenu();
    }
}

// Initialiser le menu contextuel
const contextMenu = new ContextMenu(); 