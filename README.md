# OskarOS - Interface de Bureau Virtuelle

Une interface de bureau virtuelle moderne et interactive développée en HTML, CSS et JavaScript.

## Fonctionnalités

- Interface utilisateur moderne avec un design inspiré de macOS
- Système de fenêtres dynamiques avec :
  - Déplacement par glisser-déposer
  - Redimensionnement
  - Minimisation
  - Maximisation
  - Fermeture
- Barre d'icônes (dock) avec :
  - Accueil
  - Cours
  - Projets
  - Profil
  - Alternance
  - Paramètres
- Horloge en temps réel
- Design responsive
- Animations fluides
- Système de notifications
- Gestionnaire de thèmes
- Menu contextuel

## Installation

1. Clonez ce dépôt :
```bash
git clone [URL_DU_REPO]
```

2. Ouvrez le fichier `index.html` dans votre navigateur web.

## Structure du Projet

```
OskarOS/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── windowManager.js
│   ├── notificationManager.js
│   ├── contextMenu.js
│   ├── themeManager.js
│   └── main.js
└── README.md
```

## Utilisation

- Cliquez sur les icônes du dock pour ouvrir les différentes fenêtres
- Utilisez la barre de titre pour déplacer les fenêtres
- Utilisez les boutons de contrôle pour :
  - Minimiser (-)
  - Maximiser (□)
  - Fermer (×)
- Utilisez la poignée de redimensionnement en bas à droite pour redimensionner les fenêtres
- Cliquez droit pour accéder au menu contextuel
- Personnalisez l'apparence avec le gestionnaire de thèmes

## Technologies Utilisées

- HTML5
- CSS3 (avec variables CSS et Flexbox/Grid)
- JavaScript (ES6+)
- Font Awesome pour les icônes

## Compatibilité

- Chrome (recommandé)
- Firefox
- Safari
- Edge

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request 