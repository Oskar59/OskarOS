// Initialisation du gestionnaire de fenêtres
const windowManager = new WindowManager();

// Charger les paramètres sauvegardés au démarrage
windowManager.loadSavedSettings();

// Fonction pour charger le contenu des fenêtres
async function loadWindowContent(window, type) {
    const content = window.querySelector('.window-content');
    
    switch (type) {
        case 'home':
            content.innerHTML = `
                <div class="home-container">
                    <h1>Bienvenue sur mon portfolio !</h1>
                    <div class="home-content">
                        <p>Je m'appelle Doutreligne Oskar, étudiant en BTS SIO et passionné par l'informatique. Actuellement en alternance à la DISI Nord de la Direction Générale des Finances Publiques, je développe mes compétences en développement et en gestion de systèmes d'information.</p>
                        <p>Sur ce site, vous trouverez mes projets, mon parcours et mes réalisations. Bonne visite !</p>
                    </div>
                </div>
            `;
            break;

        case 'courses':
            content.innerHTML = `
                <div class="courses-list">
                    <div class="course-item" data-year="bts">
                        <div class="course-header">
                            <h3>BTS Services Informatiques aux Organisations (SIO)</h3>
                            <button class="toggle-btn">▶</button>
                        </div>
                        <div class="course-content">
                            <div class="course-item" data-year="B1">
                                <div class="course-header">
                                    <h4>B1 - Première année (En alternance)</h4>
                                    <button class="toggle-btn">▶</button>
                                </div>
                                <div class="course-content">
                                    <ul>
                                        <li>Configuration des postes de travail</li>
                                        <li>Installation des services réseau</li>
                                        <li>Administration des systèmes</li>
                                        <li>Gestion des données</li>
                                        <li>Programmation et développement</li>
                                        <li>Cybersécurité des services informatiques</li>
                                        <li>Culture économique, juridique et managériale</li>
                                        <li>Culture générale et expression</li>
                                        <li>Anglais</li>
                                        <li>Mathématiques</li>
                                    </ul>
                                </div>
                            </div>
                            <div class="course-item" data-year="B2">
                                <div class="course-header">
                                    <h4>B2 - Deuxième année (En alternance)</h4>
                                    <button class="toggle-btn">▶</button>
                                </div>
                                <div class="course-content">
                                    <ul>
                                        <li>Configuration des infrastructures virtualisées</li>
                                        <li>Administration des systèmes et des réseaux</li>
                                        <li>Cybersécurité des infrastructures</li>
                                        <li>Support des services et des applications</li>
                                        <li>Organisation du développement des applications</li>
                                        <li>Culture économique, juridique et managériale</li>
                                        <li>Culture générale et expression</li>
                                        <li>Anglais</li>
                                        <li>Mathématiques</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="course-item" data-year="future">
                        <div class="course-header">
                            <h3>À suivre...</h3>
                            <button class="toggle-btn">▶</button>
                        </div>
                        <div class="course-content">
                            <p>En cours de réflexion pour la suite de mon parcours...</p>
                        </div>
                    </div>
                </div>
            `;
            setupCourseInteractions(content);
            break;

        case 'projects':
            content.innerHTML = `
                <div class="projects-grid">
                    <div class="project-card">
                        <h3>Logiciel d'inventaire</h3>
                        <p>Développement d'un logiciel en Python pour la génération et la comparaison de CSV, facilitant l'inventaire de l'entreprise.</p>
                        <div class="project-tech">
                            <span class="tech-tag">Python</span>
                            <span class="tech-tag">CSV</span>
                        </div>
                    </div>
                    <div class="project-card">
                        <h3>Portfolio OS</h3>
                        <p>Création d'un portfolio interactif simulant une expérience de bureau virtuel (OS) avec HTML, CSS et JavaScript.</p>
                        <div class="project-tech">
                            <span class="tech-tag">HTML</span>
                            <span class="tech-tag">CSS</span>
                            <span class="tech-tag">JavaScript</span>
                        </div>
                    </div>
                    <div class="project-card">
                        <h3>Scripts Codédex</h3>
                        <p>Développement de scripts Python pour la plateforme Codédex, améliorant l'expérience utilisateur.</p>
                        <div class="project-tech">
                            <span class="tech-tag">Python</span>
                        </div>
                    </div>
                    <div class="project-card">
                        <h3>Site de fiches de vocabulaire</h3>
                        <p>Application web générant automatiquement des tests et fiches de révision à partir de fichiers CSV.</p>
                        <div class="project-tech">
                            <span class="tech-tag">Python</span>
                            <span class="tech-tag">CSV</span>
                        </div>
                    </div>
                </div>
            `;
            break;

        case 'profile':
            content.innerHTML = `
                <div class="profile-container">
                    <div class="profile-header">
                        <img src="images/photoCV.jpg" alt="Photo de profil" class="profile-picture">
                        <h2>Oskar Doutreligne</h2>
                    </div>
                    
                    <div class="profile-section">
                        <h2><i class="fas fa-address-card"></i> Informations de contact</h2>
                        <div class="contact-info">
                            <div class="contact-item">
                                <i class="fas fa-map-marker-alt"></i>
                                <span>Saint-Amand-les-Eaux, Nord</span>
                            </div>
                            <div class="contact-item">
                                <i class="fas fa-envelope"></i>
                                <a href="mailto:oskar.dtlg.1@gmail.com">oskar.dtlg.1@gmail.com</a>
                            </div>
                            <div class="contact-item">
                                <i class="fab fa-github"></i>
                                <a href="https://github.com/Oskar59" target="_blank">github.com/Oskar59</a>
                            </div>
                            <div class="contact-item">
                                <i class="fab fa-linkedin"></i>
                                <a href="https://www.linkedin.com/in/oskar-doutreligne-08216b2b4/" target="_blank">LinkedIn</a>
                            </div>
                        </div>
                    </div>

                    <div class="profile-section">
                        <h2><i class="fas fa-graduation-cap"></i> Formation</h2>
                        <ul>
                            <li>🎓 BTS SIO (option SISR) - Lycée Henri Wallon, Valenciennes (En cours)</li>
                            <li>🎓 Bac SSI - Lycée Ernest Couteau, Saint-Amand-les-Eaux</li>
                        </ul>
                    </div>

                    <div class="profile-section">
                        <h2><i class="fas fa-briefcase"></i> Expérience professionnelle</h2>
                        <ul>
                            <li>🏢 Alternance - Finances Publiques, DISI Nord : Assistance utilisateurs, mise à jour des inventaires, résolution de problèmes informatiques</li>
                            <li>🏢 Stage - Service Informatique de la Ville de Saint-Amand-les-Eaux</li>
                        </ul>
                    </div>

                    <div class="profile-section">
                        <h2><i class="fas fa-code"></i> Compétences techniques</h2>
                        <div class="skills-grid">
                            <div class="skill-category">
                                <h3>Langages</h3>
                                <ul>
                                    <li>Python</li>
                                    <li>HTML/CSS</li>
                                    <li>JavaScript (bases)</li>
                                </ul>
                            </div>
                            <div class="skill-category">
                                <h3>Outils</h3>
                                <ul>
                                    <li>VS Code</li>
                                    <li>VirtualBox</li>
                                    <li>Git</li>
                                    <li>Notion</li>
                                    <li>Cisco Packet Tracer</li>
                                </ul>
                            </div>
                            <div class="skill-category">
                                <h3>Systèmes & Réseaux</h3>
                                <ul>
                                    <li>Linux</li>
                                    <li>Virtualisation</li>
                                    <li>Configuration de serveurs</li>
                                    <li>Active Directory</li>
                                </ul>
                            </div>
                            <div class="skill-category">
                                <h3>Cybersécurité</h3>
                                <ul>
                                    <li>En apprentissage pendant le BTS SIO</li>
                                    <li>TryHackMe</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div class="profile-section">
                        <h2><i class="fas fa-project-diagram"></i> Projets réalisés</h2>
                        <ul>
                            <li>🛠 Logiciel d'inventaire en Python : Génération et comparaison de CSV pour faciliter l'inventaire de mon entreprise</li>
                            <li>🌐 Portfolio en HTML/CSS/JS</li>
                            <li>🔍 Scripts Python pour Codédex</li>
                            <li>📝 Site de fiches de vocabulaire : Génère des tests et fiches de révision depuis un CSV</li>
                        </ul>
                    </div>

                    <div class="profile-section">
                        <h2><i class="fas fa-language"></i> Langues</h2>
                        <ul>
                            <li>🇫🇷 Français : Langue maternelle</li>
                            <li>🇬🇧 Anglais : Avancé</li>
                        </ul>
                    </div>

                    <div class="profile-section">
                        <h2><i class="fas fa-heart"></i> Centres d'intérêt</h2>
                        <ul>
                            <li>🏃 Running, Musculation, Trail</li>
                            <li>🎮 Jeux vidéo, Séries, Films</li>
                        </ul>
                    </div>
                </div>
            `;
            break;

        case 'alternance':
            content.innerHTML = `
                <div class="alternance-container">
                    <div class="alternance-header">
                        <img src="images/logo-dgfip.jpg" alt="Logo DGFiP" class="company-logo">
                        <div class="alternance-title">
                            <h3>Direction Générale des Finances Publiques - DISI Nord</h3>
                            <p class="company-description">Service informatique de l'État en charge de la gestion des systèmes d'information des finances publiques du Nord</p>
                        </div>
                    </div>

                    <div class="tabs-container">
                        <div class="tabs-header">
                            <button class="tab-btn active" data-tab="structure">
                                <i class="fas fa-building"></i> Structure
                            </button>
                            <button class="tab-btn" data-tab="planning">
                                <i class="fas fa-clock"></i> Planning
                            </button>
                            <button class="tab-btn" data-tab="missions">
                                <i class="fas fa-tasks"></i> Missions
                            </button>
                            <button class="tab-btn" data-tab="technologies">
                                <i class="fas fa-code"></i> Technologies
                            </button>
                            <button class="tab-btn" data-tab="competences">
                                <i class="fas fa-chart-line"></i> Compétences
                            </button>
                            <button class="tab-btn" data-tab="bilan">
                                <i class="fas fa-lightbulb"></i> Bilan
                            </button>
                        </div>

                        <div class="tabs-content">
                            <div class="tab-pane active" id="structure">
                                <div class="alternance-section">
                                    <h3><i class="fas fa-building"></i> Structure de l'entreprise</h3>
                                    <div class="alternance-details">
                                        <p><strong>Service :</strong> Centre Informatique Départemental (CID)</p>
                                        <p><strong>Effectif :</strong> 18 personnes (dont 2 apprentis)</p>
                                        <p><strong>Responsable :</strong> Benjamin Crocquet</p>
                                        <p><strong>Tuteur :</strong> David Fayolle (Technicien)</p>
                                        <p><strong>Collaborations :</strong></p>
                                        <ul>
                                            <li>SIL (Service des Infrastructures Locales) - Gestion des réseaux</li>
                                            <li>Service d'assistance téléphonique - Support de premier niveau</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div class="tab-pane" id="planning">
                                <div class="alternance-section">
                                    <h3><i class="fas fa-clock"></i> Planning type</h3>
                                    <div class="schedule-grid">
                                        <div class="schedule-item">
                                            <h4>Journée sans intervention prévue</h4>
                                            <ul>
                                                <li>Consultation des emails et gestion de la boîte mail partagée</li>
                                                <li>Gestion des tickets de support à distance</li>
                                                <li>Mise à jour de l'inventaire informatique</li>
                                                <li>Gestion des certificats VPN</li>
                                                <li>Support technique à distance</li>
                                            </ul>
                                        </div>
                                        <div class="schedule-item">
                                            <h4>Journée avec intervention sur site</h4>
                                            <ul>
                                                <li>Préparation de l'intervention</li>
                                                <li>Déplacement sur le site concerné</li>
                                                <li>Résolution du problème technique</li>
                                                <li>Vérification et mise à jour de l'inventaire sur place</li>
                                                <li>Documentation de l'intervention</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="tab-pane" id="missions">
                                <div class="alternance-section">
                                    <h3><i class="fas fa-tasks"></i> Missions principales</h3>
                                    <ul>
                                        <li>Gestion de la boîte mail partagée (tri, archivage, redirection)</li>
                                        <li>Mise à jour des certificats VPN (renouvellement d'accès)</li>
                                        <li>Dépannage des équipements informatiques</li>
                                        <li>Mise à jour du matériel</li>
                                        <li>Assistance aux utilisateurs</li>
                                        <li>Vérification et mise à jour de l'inventaire informatique</li>
                                        <li>Support technique à distance</li>
                                    </ul>
                                </div>
                            </div>

                            <div class="tab-pane" id="technologies">
                                <div class="alternance-section">
                                    <h3><i class="fas fa-code"></i> Technologies utilisées</h3>
                                    <div class="tech-grid">
                                        <div class="tech-category">
                                            <h4>Infrastructure</h4>
                                            <span class="tech-tag">Active Directory</span>
                                            <span class="tech-tag">VPN</span>
                                            <span class="tech-tag">Réseaux</span>
                                        </div>
                                        <div class="tech-category">
                                            <h4>Gestion des incidents</h4>
                                            <span class="tech-tag">Sigma (GLPI modifié)</span>
                                            <span class="tech-tag">Omega</span>
                                        </div>
                                        <div class="tech-category">
                                            <h4>Support</h4>
                                            <span class="tech-tag">Email</span>
                                            <span class="tech-tag">Certificats</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="tab-pane" id="competences">
                                <div class="alternance-section">
                                    <h3><i class="fas fa-chart-line"></i> Compétences développées</h3>
                                    <div class="skills-grid">
                                        <div class="skill-category">
                                            <h4><i class="fas fa-cogs"></i> Compétences techniques</h4>
                                            <div class="skills-list">
                                                <div class="skill-item">
                                                    <div class="skill-header">
                                                        <i class="fas fa-network-wired"></i>
                                                        <span>Administration réseau</span>
                                                    </div>
                                                    <p class="skill-description">Configuration et maintenance des infrastructures réseau, gestion des accès et des permissions</p>
                                                </div>
                                                <div class="skill-item">
                                                    <div class="skill-header">
                                                        <i class="fas fa-shield-alt"></i>
                                                        <span>Gestion des certificats VPN</span>
                                                    </div>
                                                    <p class="skill-description">Renouvellement et configuration des accès VPN pour les utilisateurs</p>
                                                </div>
                                                <div class="skill-item">
                                                    <div class="skill-header">
                                                        <i class="fas fa-headset"></i>
                                                        <span>Support utilisateur</span>
                                                    </div>
                                                    <p class="skill-description">Assistance et résolution des problèmes informatiques des utilisateurs</p>
                                                </div>
                                                <div class="skill-item">
                                                    <div class="skill-header">
                                                        <i class="fas fa-tools"></i>
                                                        <span>Maintenance informatique</span>
                                                    </div>
                                                    <p class="skill-description">Installation, réparation et mise à jour du matériel informatique</p>
                                                </div>
                                                <div class="skill-item">
                                                    <div class="skill-header">
                                                        <i class="fas fa-clipboard-list"></i>
                                                        <span>Gestion d'inventaire</span>
                                                    </div>
                                                    <p class="skill-description">Suivi et mise à jour de l'inventaire du parc informatique</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="skill-category">
                                            <h4><i class="fas fa-users"></i> Compétences professionnelles</h4>
                                            <div class="skills-list">
                                                <div class="skill-item">
                                                    <div class="skill-header">
                                                        <i class="fas fa-user-check"></i>
                                                        <span>Autonomie</span>
                                                    </div>
                                                    <p class="skill-description">Capacité à gérer les tâches et prendre des initiatives</p>
                                                </div>
                                                <div class="skill-item">
                                                    <div class="skill-header">
                                                        <i class="fas fa-users-cog"></i>
                                                        <span>Travail en équipe</span>
                                                    </div>
                                                    <p class="skill-description">Collaboration efficace avec les membres de l'équipe</p>
                                                </div>
                                                <div class="skill-item">
                                                    <div class="skill-header">
                                                        <i class="fas fa-tasks"></i>
                                                        <span>Responsabilité</span>
                                                    </div>
                                                    <p class="skill-description">Gestion des tâches et prise en charge des missions</p>
                                                </div>
                                                <div class="skill-item">
                                                    <div class="skill-header">
                                                        <i class="fas fa-comments"></i>
                                                        <span>Communication</span>
                                                    </div>
                                                    <p class="skill-description">Expression claire et adaptation au niveau technique</p>
                                                </div>
                                                <div class="skill-item">
                                                    <div class="skill-header">
                                                        <i class="fas fa-sort-amount-up"></i>
                                                        <span>Gestion des priorités</span>
                                                    </div>
                                                    <p class="skill-description">Organisation et hiérarchisation des tâches</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="tab-pane" id="bilan">
                                <div class="alternance-section">
                                    <h3><i class="fas fa-lightbulb"></i> Bilan et perspectives</h3>
                                    <div class="alternance-details">
                                        <p>Cette alternance m'a permis de :</p>
                                        <ul>
                                            <li>Confirmer mon intérêt pour l'infrastructure IT</li>
                                            <li>Développer une passion pour l'administration réseau et la cybersécurité</li>
                                            <li>Acquérir une expérience concrète en environnement professionnel</li>
                                            <li>Développer des compétences techniques et relationnelles</li>
                                            <li>Clarifier mon orientation professionnelle</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            setupTabs();
            break;
    }
}

// Configuration des interactions pour les cours
function setupCourseInteractions(content) {
    content.querySelectorAll('.course-item').forEach(item => {
        const header = item.querySelector('.course-header');
        const content = item.querySelector('.course-content');
        const toggleBtn = header.querySelector('.toggle-btn');

        header.addEventListener('click', () => {
            content.style.display = content.style.display === 'none' ? 'block' : 'none';
            toggleBtn.textContent = content.style.display === 'none' ? '▶' : '▼';
        });

        item.addEventListener('mouseenter', () => {
            item.style.backgroundColor = 'rgba(52, 152, 219, 0.1)';
        });

        item.addEventListener('mouseleave', () => {
            item.style.backgroundColor = 'transparent';
        });
    });
}

// Gestion des onglets
function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            const content = document.querySelector(`#${tabId}`);
            if (content) {
                content.classList.add('active');
            }
        });
    });

    // Activer le premier onglet par défaut
    if (tabButtons.length > 0) {
        tabButtons[0].click();
    }
}

// Écouteur d'événements pour la création de fenêtres
document.addEventListener('windowCreated', (e) => {
    const { window, type } = e.detail;
    if (type !== 'home') {
        loadWindowContent(window, type);
    }
});

// Charger la fenêtre d'accueil au démarrage
window.addEventListener('load', () => {
    const homeWindow = windowManager.createHomeWindow();
}); 