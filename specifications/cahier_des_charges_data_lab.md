# DATA LAB — Cahier des charges fonctionnel, pédagogique et technique

> **Document à transmettre à une IA de développement** pour concevoir et réaliser une plateforme web statique d'initiation à Python, à la science des données et à l'intelligence artificielle pour une élève de Terminale, avec possibilité d'extension à d'autres lycéens.

## 1. Vision et besoin

Créer un site **enthousiasmant, élégant, vivant, interactif et réellement fonctionnel**, qui donne envie à une élève de Terminale, même débutante, de découvrir Python et la data science. Ne pas reproduire un manuel scolaire numérisé : faire vivre une aventure d'exploration où l'élève pose des questions sur le monde, analyse des données, code progressivement, visualise ses résultats et réalise ses propres projets.

**Promesse pédagogique :** « Explore. Code. Discover. » — *Je sais poser une question, chercher des données, les analyser et utiliser Python pour trouver des éléments de réponse.*

**Contraintes non négociables :**
- Site **statique**, hébergeable sur un hébergement mutualisé OVH, sans serveur applicatif, sans base de données et sans secrets exposés dans le navigateur.
- Python **réellement exécuté dans le navigateur**, idéalement via Pyodide/WebAssembly ; ne pas simuler l'exécution par des réponses préenregistrées.
- Parcours utilisable sur ordinateur ; interface responsive sur tablette et téléphone (l'édition de code sera plus confortable sur ordinateur).
- Interface et contenus pédagogiques en français ; code et mots-clés Python dans leur syntaxe authentique.
- Progression sauvegardée localement et exportable/importable ; aucune promesse de synchronisation multi-appareils sans service externe.
- Jeux de données intégrés, documentés, réutilisables, sans données personnelles sensibles ; licences vérifiées.
- Fonctionnalités et contenus livrés réellement opérationnels, sans boutons factices ni écrans de démonstration non fonctionnels.

## 2. Public, objectifs et principes

- Public principal : élève de Terminale, débutante ou ayant quelques notions de Python ; spécialités et niveau de mathématiques à préciser.
- Public secondaire : autres lycéens ; prévoir une architecture extensible sans imposer dès le départ un système de comptes.
- Format indicatif : **12 semaines**, **2 séances de 45 minutes par semaine** (24 séances), ajustable selon les besoins.
- Cible d'activité : environ **80 % de manipulation/expérimentation et 20 % d'explications**, sans sacrifier l'enseignement explicite des notions ni leur consolidation.
- Approche : partir d'une question intrigante, observer des données, formuler une hypothèse, découvrir les outils Python nécessaires, expérimenter, interpréter, expliquer les limites.
- Favoriser les réussites rapides, les défis courts, les retours immédiats et l'autonomie ; jamais de punition ou de culpabilisation pour les erreurs.
- Différencier trois modes : **Découverte** (code guidé), **Exploratrice** (code partiellement à compléter), **Experte** (problème plus ouvert).
- Une élève doit pouvoir revenir sur une mission dans un mode plus difficile.

### Compétences visées

1. Formuler une question exploitable et une hypothèse.
2. Lire, décrire, filtrer, nettoyer et comparer des données.
3. Programmer en Python : affichage, variables, types, listes, dictionnaires, conditions, boucles, fonctions et débogage.
4. Utiliser progressivement Pandas, NumPy et Matplotlib.
5. Comprendre moyennes, médianes, dispersion, corrélations, biais et distinction corrélation/causalité.
6. Construire et interpréter des visualisations pertinentes et non trompeuses.
7. Découvrir la régression, la classification, l'entraînement/test et l'évaluation d'un modèle simple.
8. Comprendre les limites, les erreurs et les biais des systèmes d'IA.
9. Présenter une analyse de données de façon intelligible, avec ses incertitudes et ses limites.

## 3. Identité visuelle et expérience utilisateur

**Nom de travail : DATA LAB** ; sous-titre « Ton laboratoire d'exploration des données » ; signature « Explore. Code. Discover. »

Créer un univers graphique moderne, dynamique, stimulant et non infantilisant : contrastes soignés, typographie lisible, cartes de missions, illustrations pertinentes, animations discrètes, états de progression, icônes cohérentes. Éviter à la fois l'interface austère de cours magistral et la surcharge de gadgets.

L'accueil présente :
- Un message personnalisé facultatif (« Bienvenue dans ton laboratoire »).
- Le niveau, les XP, les badges, la progression globale et la prochaine mission.
- Une carte « Reprendre mon aventure ».
- Les quatre univers du parcours et les missions débloquées.
- L'accès au laboratoire libre, aux projets et à la sauvegarde.

**Accessibilité :** navigation clavier, contrastes suffisants, labels accessibles, textes alternatifs, indications non fondées uniquement sur la couleur, respect de la préférence de réduction des animations, taille de police adaptée. Ne pas obliger l'élève à visionner une vidéo pour comprendre la mission.

## 4. Structure pédagogique : 4 univers / 12 missions

Chaque mission comporte : une accroche ou énigme, une question, des données, une hypothèse, un court apport, une exploration interactive, du code Python à exécuter/modifier, un défi, un feedback explicatif, un bilan et une récompense symbolique.

### UNIVERS 1 — Je découvre mes superpouvoirs numériques (semaines 1 à 3)

**Mission 1 — Spotify connaît-il mes goûts mieux que moi ?**
- Explorer un jeu de données de chansons (réel et licencié ou synthétique clairement signalé).
- Découvrir tableau, lignes, colonnes, variables, premières commandes et `pandas.read_csv()`.
- Comparer genres et popularité, créer un premier graphique.
- Ne pas prétendre prédire des goûts personnels à partir de données qui ne le permettent pas.
- Badge : « Data Detective ».

**Mission 2 — Peut-on faire mentir les chiffres ?**
- Manipuler des graphiques et comprendre axes tronqués, moyenne/médiane, valeurs extrêmes et interprétations trompeuses.
- Badge : « Détective des statistiques ».

**Mission 3 — Je programme mon premier outil**
- Construire un mini-outil interactif d'analyse de données.
- Introduire variables, conditions, boucles et fonctions par un besoin concret.

### UNIVERS 2 — Je mène mes propres enquêtes (semaines 4 à 6)

**Mission 4 — Les réseaux sociaux influencent-ils nos comportements ?**
- Explorer des données, comparer groupes et variables, construire des graphiques.
- Expliquer explicitement qu'une corrélation ne démontre pas une influence causale.

**Mission 5 — Les filles et les garçons ont-ils les mêmes opportunités ?**
- Comparer des indicateurs sur un jeu de données public fiable ou synthétique, avec contexte et prudence dans l'interprétation.
- Travailler l'esprit critique et la qualité des sources ; ne pas naturaliser les écarts.

**Mission 6 — Peut-on prédire le prix d'un logement ?**
- Nuage de points, variables explicatives, première régression linéaire et mesure de l'erreur.
- Montrer qu'une prédiction n'est ni une certitude ni une explication causale.

### UNIVERS 3 — Je construis ma première IA (semaines 7 à 9)

**Mission 7 — Comment une IA apprend-elle ?**
- Découvrir données étiquetées, entraînement, test, classification et erreurs.
- Utiliser un petit modèle compatible navigateur (Scikit-learn si disponible dans la version retenue de Pyodide, sinon alternative pédagogique documentée).

**Mission 8 — Mon IA peut-elle prédire l'avenir ?**
- Entraîner un modèle simple sur un jeu de données adapté.
- Séparer entraînement et test, éviter les fuites de données, évaluer la qualité des prédictions.

**Mission 9 — Mon IA est-elle juste ?**
- Explorer biais de données et d'évaluation à partir d'un exemple non stigmatisant.
- Discuter limites, équité, responsabilité et conséquences des décisions automatisées.

### UNIVERS 4 — Mon premier projet de data science (semaines 10 à 12)

**Mission 10 — Je choisis mon enquête**
- Choisir une question personnelle : popularité d'un film, musique, environnement, sport, santé publique, économie, etc.
- Formuler une problématique, vérifier la disponibilité des données, identifier limites et sources.

**Mission 11 — Je mène l'analyse**
- Importer, nettoyer, explorer, visualiser ; construire un modèle simple uniquement s'il est pertinent.
- Tenir un journal de démarche et documenter les décisions.

**Mission 12 — Je présente ma découverte**
- Produire un mini-tableau de bord ou rapport interactif, des graphiques et une synthèse argumentée.
- Exporter le code, les résultats et une présentation/fiche projet.
- Badge/certificat **symbolique** « Junior Data Scientist », sans valeur de diplôme officiel.

### Autres questions mobilisables pour les missions futures

- Pourquoi certaines vidéos deviennent-elles virales ?
- Peut-on détecter des informations trompeuses à partir d'indices ?
- Comment fonctionnent les recommandations de vidéos ?
- Peut-on analyser les résultats scolaires sans stigmatiser les élèves ?
- Peut-on reconnaître des émotions avec une IA ? (à traiter avec prudence : validité scientifique et risques d'interprétation)

## 5. Déroulement standard d'une mission

1. **L'énigme** : une question accessible et une mise en situation courte ; vidéo optionnelle de 45 à 60 secondes si utile.
2. **Je formule mon hypothèse** : saisie d'une intuition ou choix argumenté.
3. **J'explore** : jeu de données et graphiques manipulables.
4. **Je comprends** : notion courte illustrée ; vocabulaire précis.
5. **Je code** : éditeur avec squelette de code adapté au mode choisi.
6. **J'exécute** : vrai résultat Python (texte, tableaux, graphiques, erreurs).
7. **Je relève le défi** : exercice vérifiable, tests explicites ou évaluation guidée.
8. **Je réfléchis** : interprétation et limites.
9. **Je progresse** : XP, badge éventuel, feedback et mission suivante.

La mission doit proposer **Réinitialiser le code**, **Exécuter**, **Indice**, **Voir l'explication**, **Sauvegarder** et **Reprendre** lorsque pertinents. Les indices sont gradués : question d'orientation → indication ciblée → solution commentée, jamais réponse immédiate imposée.

## 6. Laboratoire Python interactif

**Disposition sur ordinateur :** colonne gauche (consignes, données, indices), colonne droite (éditeur Python), zone de sortie (console, tableau ou graphique). Adapter en onglets empilés sur petit écran.

Fonctions attendues :
- Éditeur de code avec coloration syntaxique, indentation et raccourci d'exécution (CodeMirror ou Monaco si le poids reste raisonnable).
- Chargement de Pyodide **à la demande**, état de chargement explicite et indication de compatibilité navigateur.
- Exécution réelle du code Python, avec `stdout`, `stderr`, erreurs lisibles et graphiques intégrés.
- Accès contrôlé aux jeux de données locaux via une couche d'initialisation ; chemins d'accès documentés.
- Exemples et solutions testés avec les versions exactes des bibliothèques retenues.
- Bouton d'arrêt/réinitialisation du moteur ; utiliser un **Web Worker** pour éviter de bloquer l'interface, et prévoir un mécanisme de redémarrage en cas de boucle infinie.
- Gestion des chargements lourds, des échecs réseau et de l'indisponibilité de bibliothèques.
- Séparer l'exécution du code de l'élève des scripts d'évaluation autant que possible ; ne pas traiter les validations locales comme des preuves sécurisées.
- Export `.py` et, si pertinent, export CSV/PNG des résultats.
- Aucun accès à des clés API, comptes ou données sensibles depuis le code utilisateur.

**Bibliothèques visées :** Python via Pyodide, Pandas, NumPy, Matplotlib ; Scikit-learn **sous réserve de compatibilité vérifiée**. Prévoir des missions utilisables avec des jeux de données de petite taille pour garder une bonne réactivité.

## 7. Tableau de bord, motivation et progression

- Parcours visuel par univers, missions verrouillées/déverrouillées et statut : non commencée / en cours / terminée.
- XP et badges (par exemple « Data Detective », « Détective des statistiques », « Exploratrice des données », « Junior Data Scientist »).
- Trois niveaux de difficulté : Découverte, Exploratrice, Experte.
- Critères de réussite clairs et vérifiables ; les XP ne remplacent pas l'acquisition de compétences.
- Historique des tentatives, reprise du code et possibilité de refaire une mission.
- Bilan des compétences découvertes et maîtrisées.
- Pas de classement public nécessaire pour une utilisation individuelle.

## 8. Stockage et données personnelles

Pour la V1, **pas de compte utilisateur** :
- `localStorage` pour les petits réglages et états de progression ; `IndexedDB` pour les sauvegardes de code et données plus volumineuses.
- Export/import manuel de la progression au format JSON versionné, avec validation du schéma et avertissement avant écrasement.
- Export du code `.py` et des projets, sans serveur.
- Informer que vider le stockage du navigateur, utiliser la navigation privée ou changer d'appareil peut faire perdre les données locales.
- Aucune synchronisation multi-appareils sans service externe.
- Éviter collecte de données personnelles, traqueurs et analytics non nécessaires.
- Les fonctions « espace tuteur » sur site statique ne peuvent consulter automatiquement les données d'autres appareils : elles nécessitent l'import d'une sauvegarde ou, plus tard, un service distant.

## 9. Assistant pédagogique et feedback

**V1 100 % statique :** indices scénarisés, aide contextuelle, messages d'erreur expliqués, tests d'exercices et solutions progressives. Ces fonctions sont possibles sans modèle d'IA.

**Option ultérieure :** tuteur conversationnel IA qui guide sans donner systématiquement la réponse, reformule les erreurs et pose des questions. Une API commerciale nécessite un **proxy sécurisé côté serveur ou un service externe**, jamais une clé secrète incluse dans le JavaScript public. Ne pas annoncer un « tuteur IA » réel si seuls des indices prédéfinis sont livrés.

## 10. Architecture technique proposée

Site statique en HTML, CSS et JavaScript/TypeScript, avec compilation éventuelle vers des fichiers statiques (Vite possible). Choisir une architecture sobre et maintenable ; pas de framework imposé si le JavaScript natif suffit.

```text
data-lab/
├── index.html
├── parcours.html
├── laboratoire.html
├── projets.html
├── css/
│   └── style.css
├── js/
│   ├── app.js
│   ├── python-engine.js
│   ├── progression.js
│   ├── mission-runner.js
│   └── storage.js
├── missions/
│   ├── mission-01.json
│   ├── mission-02.json
│   └── ...
├── datasets/
│   ├── chansons.csv
│   ├── logements.csv
│   └── films.csv
├── assets/
│   ├── illustrations/
│   └── videos/
└── README.md
```

Cette arborescence est indicative : l'IA de développement peut proposer une meilleure structure, mais **les missions doivent être décrites sous une forme de données extensible** (JSON ou équivalent) séparée du moteur.

**Schéma de mission suggéré :** identifiant, univers, titre, accroche, objectifs, prérequis, durée, dataset, licence/source, contenu pédagogique, modes et codes initiaux, consignes, indices gradués, tests de validation, explications, compétences, XP et badge. Ajouter une validation de schéma pour éviter les missions incomplètes.

### Hébergement OVH

- Produire un dossier de publication statique transférable par FTP/SFTP sur OVH.
- Tester les chemins relatifs si le site est déployé dans un sous-répertoire.
- HTTPS requis ; prévoir en-têtes et politique de sécurité adaptés quand configurables.
- Pyodide peut être chargé depuis un CDN de confiance ou servi localement ; expliciter dépendances réseau et coût en poids. **Ne pas promettre un fonctionnement hors ligne** sans implémentation/test de cache et service worker.
- Vérifier les conditions de licences des bibliothèques et des jeux de données.

## 11. Priorités de réalisation

### Phase 1 — Prototype opérationnel (priorité absolue)

Livrer un mini-site cohérent avec **trois missions complètes** :
1. Les secrets des chansons populaires : découverte des données et premiers tableaux.
2. Les chiffres peuvent-ils mentir ? : statistiques et graphiques.
3. Mon premier programme intelligent : variables, conditions, fonctions et défi guidé.

Le prototype doit déjà inclure : accueil, navigation, identité visuelle, éditeur Python fonctionnel, exécution, sorties, datasets, indices, validation de défis, progression persistante, export/import et affichage responsive.

### Phase 2 — Parcours complet

Ajouter les missions 4 à 12, les trois modes de difficulté, l'espace projets, les exports et la synthèse des compétences. Vérifier la progressivité et la charge réelle des séances.

### Phase 3 — Extensions facultatives

- Tuteur conversationnel IA via infrastructure sécurisée.
- Synchronisation et comptes via service externe si besoin réel.
- Espace tuteur multiélèves avec autorisations appropriées.
- Nouveaux univers (santé, environnement, économie, sport, culture, recommandations).
- Tableaux de bord plus avancés et portfolio de projets.

## 12. Exigences qualité et critères d'acceptation

L'IA de développement doit **livrer des fichiers complets**, pas seulement des maquettes ou une description.

Vérifier au minimum :

1. Le site fonctionne après déploiement sur un hébergement statique HTTPS.
2. L'exécution Python est réelle : modifier une valeur dans le code modifie effectivement le résultat.
3. Un fichier CSV de mission peut être lu par Python dans le navigateur.
4. Un graphique Matplotlib ou équivalent apparaît à partir de données traitées par Python.
5. Une erreur de syntaxe affiche un message compréhensible sans faire planter le site.
6. Une boucle infinie peut être interrompue en redémarrant l'environnement de calcul.
7. Les trois premières missions sont complètes et pédagogiquement cohérentes, avec solutions vérifiées.
8. La progression et le code persistent après rechargement de la page dans le même navigateur.
9. L'export et l'import restaurent effectivement la progression.
10. Les trois modes sont réellement différenciés, au moins sur une mission du prototype.
11. Les éléments interactifs sont accessibles au clavier et l'interface reste utilisable sur tablette.
12. Aucune clé privée n'est exposée ; aucune fonction IA payante n'est annoncée comme incluse.
13. Un `README.md` explique installation, test local, construction éventuelle, déploiement OVH, dépendances et ajout de missions.
14. Les sources/licences des jeux de données sont précisées ; les données synthétiques sont identifiées comme telles.

## 13. Consignes de travail à l'IA chargée du développement

**Rôle attendu :** agir comme une équipe réunissant UX designer, développeur front-end, ingénieur pédagogique Python/data science et testeur qualité.

**Travail demandé :**
- Proposer brièvement l'architecture retenue et les éventuels arbitrages techniques.
- Réaliser directement **la phase 1** avec du code complet, un design abouti et trois missions pédagogiques fonctionnelles.
- Préparer la structure pour les douze missions, sans créer de fausses missions « terminées » ni de contenus de remplissage.
- Fournir le projet prêt à tester localement puis à publier sur OVH, ainsi qu'une documentation de déploiement.
- Tester réellement le parcours, les sorties Python, les graphiques, les erreurs, la sauvegarde et l'import/export.
- Ne pas faire dépendre les fonctions principales d'une API payante ou d'un backend.
- Signaler explicitement les fonctionnalités impossibles en pur statique, les compromis et les limites.
- Prioriser **le plaisir d'apprendre, la clarté et la fiabilité** plutôt que l'accumulation d'animations ou de badges.

## 14. Points à personnaliser ultérieurement

- Spécialités et niveau réel de l'élève en mathématiques.
- Expérience antérieure en Python.
- Centres d'intérêt prioritaires (musique, cinéma, réseaux sociaux, santé, économie, environnement, etc.).
- Usage individuel ou ouverture à d'autres lycéens.
- Nom définitif, logo, palette graphique et éventuel nom de domaine.

**Décision par défaut tant que ces points ne sont pas précisés :** concevoir pour une élève de Terminale débutante, avec un univers musical pour la première mission, une difficulté douce mais non infantilisante et une architecture réutilisable par d'autres élèves.
