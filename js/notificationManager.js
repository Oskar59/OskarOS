class NotificationManager {
    constructor() {
        this.container = this.createNotificationContainer();
        this.notifications = [];
        this.setupEventListeners();
    }

    createNotificationContainer() {
        const container = document.createElement('div');
        container.className = 'notification-container';
        container.style.cssText = `
            position: fixed;
            top: 60px;
            right: 20px;
            z-index: 9999;
        `;
        document.body.appendChild(container);
        return container;
    }

    show(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            background: var(--window-bg);
            color: var(--text-color);
            padding: 12px 24px;
            margin-bottom: 10px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            display: flex;
            align-items: center;
            justify-content: space-between;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;

        const icon = this.getIcon(type);
        const content = document.createElement('div');
        content.style.marginLeft = '10px';
        content.textContent = message;

        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '×';
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: var(--text-color);
            font-size: 20px;
            cursor: pointer;
            padding: 0 5px;
            margin-left: 10px;
        `;

        notification.appendChild(icon);
        notification.appendChild(content);
        notification.appendChild(closeBtn);
        this.container.appendChild(notification);

        // Animation d'entrée
        requestAnimationFrame(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        });

        closeBtn.addEventListener('click', () => this.hide(notification));

        if (duration > 0) {
            setTimeout(() => this.hide(notification), duration);
        }

        this.notifications.push(notification);
        return notification;
    }

    hide(notification) {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentElement === this.container) {
                this.container.removeChild(notification);
            }
            this.notifications = this.notifications.filter(n => n !== notification);
        }, 300);
    }

    getIcon(type) {
        const icon = document.createElement('i');
        icon.className = 'fas';
        switch (type) {
            case 'success':
                icon.className += ' fa-check-circle';
                icon.style.color = '#4CAF50';
                break;
            case 'error':
                icon.className += ' fa-exclamation-circle';
                icon.style.color = '#F44336';
                break;
            case 'warning':
                icon.className += ' fa-exclamation-triangle';
                icon.style.color = '#FFC107';
                break;
            default:
                icon.className += ' fa-info-circle';
                icon.style.color = '#2196F3';
        }
        return icon;
    }

    setupEventListeners() {
        // Écouter les événements système
        document.addEventListener('windowCreated', (e) => {
            this.show(`Fenêtre ${e.detail.type} ouverte`, 'info', 3000);
        });

        document.addEventListener('settingsChanged', (e) => {
            this.show('Paramètres sauvegardés', 'success', 3000);
        });
    }
} 