import type { MissionStep } from '../index';

export const steps: MissionStep[] = [
  {
    type: 'intro',
    title: 'Mon premier programme intelligent',
    content: `**Et si tu construisais ton propre outil d'analyse musicale ?**

Jusqu'ici tu as utilisé des commandes pandas toutes faites. Maintenant tu vas apprendre à **programmer** : créer des variables, prendre des décisions avec des conditions, répéter des actions avec des boucles, et organiser ton code avec des fonctions.

**Ce que tu vas apprendre :**
- Variables et types de données
- Conditions (if/elif/else)
- Boucles (for)
- Fonctions`,
  },
  {
    type: 'hypothesis',
    title: 'Le défi',
    content: `À la fin de cette mission, tu auras construit un **mini-analyseur de chansons** : un programme qui prend le nom d'un genre musical et affiche automatiquement ses statistiques et un verdict.

Penses-tu pouvoir le faire ? (Spoiler : oui !)`,
  },
  {
    type: 'learn',
    title: 'Variables et types',
    content: `Une **variable** est une étiquette qui pointe vers une valeur.

\`\`\`python
nom = "Pop"           # str (texte)
popularite = 75.5     # float (nombre décimal)
nb_chansons = 42      # int (nombre entier)
est_populaire = True  # bool (vrai/faux)
\`\`\`

Python devine le type automatiquement. Tu peux le vérifier avec \`type()\`.

**Règles de nommage :**
- Pas d'espaces ni d'accents → \`nb_chansons\` et non \`nb chansons\`
- Commence par une lettre
- Utilise des noms explicites`,
  },
  {
    type: 'code',
    title: 'Variables en action',
    content: `Crée des variables pour décrire une chanson et affiche-les.`,
    code: {
      decouverte: `# Décris une chanson avec des variables
titre = "Blinding Lights"
artiste = "The Weeknd"
duree_sec = 200
popularite = 88
genre = "Pop"

# Affiche les infos
print(f"🎵 {titre} — {artiste}")
print(f"⏱️ Durée : {duree_sec} secondes ({duree_sec // 60} min {duree_sec % 60} sec)")
print(f"⭐ Popularité : {popularite}/100")
print(f"🎶 Genre : {genre}")

# Vérifie les types
print(f"\\nType de titre : {type(titre).__name__}")
print(f"Type de durée : {type(duree_sec).__name__}")
print(f"Type de popularité : {type(popularite).__name__}")`,
      exploratrice: `# Crée des variables pour une chanson de ton choix
titre = "___"
artiste = "___"
duree_sec = ___
popularite = ___

# Affiche les infos avec f-string
print(f"🎵 {___} — {___}")
print(f"⏱️ Durée : {___} secondes")
print(f"⭐ Popularité : {___}/100")

# Calcule la durée en minutes et secondes
minutes = duree_sec // 60
secondes = duree_sec % 60
print(f"  Soit {minutes} min {secondes} sec")`,
      experte: `# Crée des variables pour 3 chansons différentes
# Affiche leurs informations formatées
# Calcule la durée en minutes:secondes
# Trouve la plus populaire des trois

`,
    },
    hints: [
      'f"texte {variable}" permet d\'insérer une variable dans du texte',
      '// donne la division entière (minutes), % donne le reste (secondes)',
    ],
    validation: { type: 'output-contains', expected: 'Durée' },
  },
  {
    type: 'code',
    title: 'Conditions : prendre des décisions',
    content: `Utilise \`if/elif/else\` pour que ton programme prenne des décisions automatiquement.`,
    code: {
      decouverte: `# Système de classement automatique
popularite = 85

if popularite >= 80:
    categorie = "🔥 Hit"
    message = "Cette chanson cartonne !"
elif popularite >= 50:
    categorie = "👍 Populaire"
    message = "Belle performance."
elif popularite >= 20:
    categorie = "😐 Modérée"
    message = "Connue dans son créneau."
else:
    categorie = "🤷 Confidentielle"
    message = "Un trésor caché, peut-être ?"

print(f"Popularité : {popularite}/100")
print(f"Catégorie : {categorie}")
print(f"Verdict : {message}")

# Teste avec d'autres valeurs !
# Change la valeur de 'popularite' et relance.`,
      exploratrice: `# Classe une chanson selon sa popularité
popularite = 65

if popularite >= ___:
    categorie = "Hit"
elif popularite >= ___:
    categorie = "Populaire"
else:
    categorie = "Confidentielle"

print(f"Popularité {popularite} → {categorie}")

# Ajoute une condition pour la durée
duree_sec = 240
if duree_sec > ___:
    duree_cat = "Longue"
else:
    duree_cat = "___"

print(f"Durée {duree_sec}s → {duree_cat}")`,
      experte: `# Crée un système de classement qui prend en compte
# à la fois la popularité ET la durée
# Exemples de catégories : "Hit radio" (populaire + courte),
# "Épopée populaire" (populaire + longue), etc.

`,
    },
    hints: [
      'if condition: ... elif autre_condition: ... else: ...',
      'Tu peux combiner des conditions avec "and" et "or"',
    ],
    validation: { type: 'output-contains', expected: 'Catégorie' },
  },
  {
    type: 'code',
    title: 'Boucles : répéter des actions',
    content: `Avec \`for\`, tu peux appliquer un traitement à chaque élément d'une liste automatiquement.`,
    code: {
      decouverte: `# Liste de genres et leurs scores
genres = ["Pop", "Rock", "Hip-Hop", "Jazz", "Électro"]
scores = [78, 65, 82, 45, 71]

print("🎵 Analyse des genres musicaux :")
print("-" * 35)

for i in range(len(genres)):
    genre = genres[i]
    score = scores[i]

    # Barre de progression visuelle
    barres = "█" * (score // 10)
    espaces = "░" * (10 - score // 10)

    # Classement
    if score >= 75:
        emoji = "🔥"
    elif score >= 50:
        emoji = "👍"
    else:
        emoji = "💤"

    print(f"{emoji} {genre:10s} |{barres}{espaces}| {score}/100")

# Le genre le plus populaire
max_idx = scores.index(max(scores))
print(f"\\n🏆 Champion : {genres[max_idx]} avec {scores[max_idx]}/100")`,
      exploratrice: `# Parcours une liste de genres
genres = ["Pop", "Rock", "Hip-Hop", "Jazz", "Électro"]
scores = [78, 65, 82, 45, 71]

for i in range(len(genres)):
    genre = genres[i]
    score = scores[i]

    # Affiche le genre et son score
    print(f"{genre}: {score}/100")

    # Ajoute une condition pour classer
    if score >= ___:
        print("  → ___")
    else:
        print("  → ___")

# Trouve le max
print(f"\\nChampion : {genres[scores.index(max(scores))]}")`,
      experte: `# Crée une liste de chansons (titre + popularité)
# Parcours-la avec une boucle
# Classe chaque chanson et crée un rapport visuel
# Calcule des statistiques (moyenne, min, max)

`,
    },
    hints: [
      'for element in liste: parcourt chaque élément',
      'for i in range(len(liste)): parcourt avec un index',
    ],
    validation: { type: 'output-contains', expected: 'Champion' },
  },
  {
    type: 'challenge',
    title: 'Défi final : Mon analyseur de données',
    content: `Combine tout ce que tu as appris pour créer une **fonction** qui analyse un genre musical à partir du dataset.`,
    code: {
      decouverte: `import pandas as pd

df = pd.read_csv("chansons.csv")

def analyser_genre(df, genre):
    """Analyse un genre musical et affiche un rapport."""
    # Filtrer les données
    data = df[df['genre'] == genre]

    if len(data) == 0:
        print(f"❌ Genre '{genre}' non trouvé.")
        return

    # Statistiques
    nb = len(data)
    pop_moy = data['popularite'].mean()
    pop_med = data['popularite'].median()
    duree_moy = data['duree_sec'].mean()

    # Classement
    if pop_moy >= 75:
        verdict = "🔥 Genre très populaire !"
    elif pop_moy >= 50:
        verdict = "👍 Genre apprécié"
    else:
        verdict = "💎 Genre de niche"

    # Rapport
    print(f"\\n{'='*40}")
    print(f"📊 RAPPORT : {genre.upper()}")
    print(f"{'='*40}")
    print(f"🎵 Nombre de chansons : {nb}")
    print(f"⭐ Popularité moyenne : {pop_moy:.1f}/100")
    print(f"📊 Popularité médiane : {pop_med:.1f}/100")
    print(f"⏱️ Durée moyenne : {duree_moy:.0f}s ({duree_moy/60:.1f} min)")
    print(f"\\n💬 Verdict : {verdict}")

# Teste avec différents genres !
for genre in df['genre'].unique():
    analyser_genre(df, genre)`,
      exploratrice: `import pandas as pd
df = pd.read_csv("chansons.csv")

def analyser_genre(df, genre):
    """Analyse un genre musical."""
    data = df[df['genre'] == genre]

    if len(data) == 0:
        print(f"Genre '{genre}' non trouvé.")
        return

    # Calcule les stats
    pop_moy = data['popularite'].___()
    duree_moy = data['duree_sec'].___()

    # Affiche le rapport
    print(f"\\n📊 {genre}: {len(data)} chansons")
    print(f"   Popularité: {pop_moy:.1f}")
    print(f"   Durée moy: {duree_moy:.0f}s")

# Appelle ta fonction pour chaque genre
for genre in df['genre'].unique():
    ___(df, genre)`,
      experte: `# Crée une fonction analyser_genre(df, genre) qui :
# 1. Filtre le dataset pour ce genre
# 2. Calcule moyenne, médiane, min, max de popularité
# 3. Classe le genre (hit, populaire, niche)
# 4. Affiche un rapport formaté
# Teste-la sur tous les genres du dataset

import pandas as pd
df = pd.read_csv("chansons.csv")

`,
    },
    hints: [
      'def ma_fonction(param1, param2): pour créer une fonction',
      'data = df[df["genre"] == genre] filtre le DataFrame',
      'N\'oublie pas return ou print() dans ta fonction',
    ],
    validation: { type: 'output-contains', expected: 'RAPPORT' },
    explanation: `**Bravo !** Tu as créé ta première fonction de data science.

Une **fonction** est un bloc de code réutilisable :
- \`def\` la déclare
- Les **paramètres** sont ses entrées
- Elle peut **retourner** un résultat ou juste afficher

Tu peux maintenant analyser n'importe quel genre en une seule ligne !`,
  },
  {
    type: 'reflect',
    title: 'Bilan',
    content: `Tu maîtrises maintenant les bases de la programmation Python :

- **Variables** : stocker et nommer des données
- **Conditions** : prendre des décisions automatiquement
- **Boucles** : répéter un traitement sur beaucoup de données
- **Fonctions** : organiser et réutiliser ton code

Ces outils sont les briques de base de TOUT programme, y compris les systèmes d'intelligence artificielle. Dans les prochaines missions, tu les utiliseras pour mener tes propres enquêtes de données !`,
  },
  {
    type: 'complete',
    title: 'Mission accomplie !',
    content: `🎉 **Félicitations !** Tu as terminé l'Univers 1 !

**Ce que tu sais faire :**
- ✅ Variables, f-strings, types
- ✅ Conditions if/elif/else
- ✅ Boucles for
- ✅ Fonctions def
- ✅ Combiner tout ça pour analyser des données

**Badge débloqué : 🏅 Codeuse en herbe**

Tu es prête pour l'Univers 2 : mener tes propres enquêtes !`,
  },
];
