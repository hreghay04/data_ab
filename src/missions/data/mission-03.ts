import type { MissionStep } from '../index';

export const steps: MissionStep[] = [
  {
    type: 'intro',
    title: 'Programme ton guide des races de chats',
    content: `**Et si tu construisais ton propre outil pour trouver le chat parfait ?**

Tu as devant toi un dataset de **25 races de chats** avec leurs caractéristiques : poids, espérance de vie, niveau d'affection, énergie, intelligence, prix…

Tu vas apprendre à **programmer** : créer des variables, prendre des décisions avec des conditions, répéter des actions avec des boucles, et organiser ton code en fonctions.

À la fin, tu auras créé un **recommandeur de races de chats** !

**Ce que tu vas apprendre :**
- Variables et types de données
- Conditions (if/elif/else)
- Boucles (for)
- Fonctions`,
  },
  {
    type: 'hypothesis',
    title: 'Le défi',
    content: `À la fin de cette mission, tu auras construit un **recommandeur de chats** : un programme qui pose des critères (appartement ? enfants ? budget ?) et recommande les meilleures races.

Avant de commencer, note :
- **Quelle race penses-tu être la plus intelligente ?**
- **Les chats les plus chers sont-ils les plus affectueux ?**

Tu vérifieras avec les données !`,
  },
  {
    type: 'learn',
    title: 'Variables et types',
    content: `Une **variable** est une étiquette qui pointe vers une valeur.

\`\`\`python
race = "Maine Coon"       # str (texte)
poids = 7.5               # float (nombre décimal)
intelligence = 4           # int (nombre entier)
adapte_appart = True       # bool (vrai/faux)
\`\`\`

Python devine le type automatiquement. Tu peux le vérifier avec \`type()\`.

**Règles de nommage :**
- Pas d'espaces ni d'accents → \`poids_moyen\` et non \`poids moyen\`
- Commence par une lettre
- Utilise des noms explicites`,
  },
  {
    type: 'code',
    title: 'Variables : décris ton chat idéal',
    content: `Crée des variables pour décrire un chat et affiche sa fiche.`,
    code: {
      decouverte: `# Décris un chat avec des variables
race = "Maine Coon"
poids_kg = 7.5
taille_cm = 40
esperance_vie = 14
affection = 4  # sur 5
energie = 3    # sur 5
intelligence = 4  # sur 5
prix_euro = 1100

# Affiche la fiche du chat
print(f"🐱 {race}")
print(f"⚖️  Poids : {poids_kg} kg")
print(f"📏 Taille : {taille_cm} cm")
print(f"❤️  Espérance de vie : {esperance_vie} ans")
print(f"🤗 Affection : {'❤️' * affection} ({affection}/5)")
print(f"⚡ Énergie : {'⚡' * energie} ({energie}/5)")
print(f"🧠 Intelligence : {'🧠' * intelligence} ({intelligence}/5)")
print(f"💰 Prix moyen : {prix_euro}€")

# Vérifie les types
print(f"\\nType de race : {type(race).__name__}")
print(f"Type de poids : {type(poids_kg).__name__}")
print(f"Type d'intelligence : {type(intelligence).__name__}")`,
      exploratrice: `# Crée des variables pour un chat de ton choix
race = "___"
poids_kg = ___
affection = ___  # sur 5
intelligence = ___  # sur 5
prix_euro = ___

# Affiche la fiche avec f-string
print(f"🐱 {___}")
print(f"⚖️  Poids : {___} kg")
print(f"🤗 Affection : {'❤️' * ___} ({___}/5)")
print(f"💰 Prix : {___}€")

# Calcule le "rapport qualité/prix"
rapport = affection / (prix_euro / 1000)
print(f"\\n📊 Rapport affection/prix : {rapport:.1f}")`,
      experte: `# Crée des variables pour 3 races de chats
# Affiche leurs fiches formatées
# Calcule un "score global" basé sur affection + intelligence + espérance de vie
# Trouve le meilleur rapport qualité/prix

`,
    },
    hints: [
      'f"texte {variable}" permet d\'insérer une variable dans du texte',
      '"❤️" * 4 répète le cœur 4 fois → ❤️❤️❤️❤️',
    ],
    validation: { type: 'output-contains', expected: 'Poids' },
  },
  {
    type: 'code',
    title: 'Conditions : quel chat pour quel mode de vie ?',
    content: `Utilise \`if/elif/else\` pour recommander automatiquement un type de chat selon des critères.`,
    code: {
      decouverte: `# Recommandeur de chat basique
vit_en_appart = True
a_des_enfants = True
budget_max = 1200
veut_calme = False

print("🐱 Analyse de ton profil...")
print(f"   Appartement : {'Oui' if vit_en_appart else 'Non'}")
print(f"   Enfants : {'Oui' if a_des_enfants else 'Non'}")
print(f"   Budget : {budget_max}€")
print(f"   Préfère un chat calme : {'Oui' if veut_calme else 'Non'}")

# Recommandation
if vit_en_appart and a_des_enfants and veut_calme:
    reco = "Ragdoll ou British Shorthair"
    raison = "Calmes, adaptés à l'appartement et aux enfants"
elif vit_en_appart and not veut_calme:
    reco = "Bengal ou Abyssin"
    raison = "Énergiques et joueurs, parfaits en appartement actif"
elif not vit_en_appart and a_des_enfants:
    reco = "Maine Coon ou Norvégien"
    raison = "Grands, doux avec les enfants, adorent l'extérieur"
elif budget_max < 600:
    reco = "European Shorthair"
    raison = "Abordable, robuste et indépendant"
else:
    reco = "Persan ou Birman"
    raison = "Élégants et affectueux"

print(f"\\n✨ Recommandation : {reco}")
print(f"   Raison : {raison}")

# Teste avec d'autres valeurs !
# Change vit_en_appart, a_des_enfants, etc. et relance.`,
      exploratrice: `# Recommandeur de chat
vit_en_appart = True
a_des_enfants = False
budget_max = 1500

# Recommandation basée sur les critères
if vit_en_appart and budget_max > ___:
    reco = "Bengal"
    raison = "___"
elif vit_en_appart and a_des_enfants:
    reco = "___"
    raison = "Calme et adapté aux enfants"
else:
    reco = "___"
    raison = "___"

print(f"✨ Recommandation : {reco}")
print(f"   Raison : {raison}")`,
      experte: `# Crée un recommandeur complet qui prend en compte :
# - Appartement ou maison
# - Enfants ou non
# - Budget
# - Niveau d'énergie souhaité
# - Tolérance à la perte de poils
# Propose au moins 5 combinaisons différentes

`,
    },
    hints: [
      'if condition: ... elif autre_condition: ... else: ...',
      'Tu peux combiner des conditions avec "and" et "or"',
    ],
    validation: { type: 'output-contains', expected: 'Recommandation' },
  },
  {
    type: 'code',
    title: 'Boucles : analyse toutes les races',
    content: `Avec \`for\`, parcours automatiquement toutes les races et classe-les.`,
    code: {
      decouverte: `import pandas as pd

df = pd.read_csv("chats.csv")

print("🐱 Analyse des races de chats :")
print("=" * 50)

for _, chat in df.iterrows():
    race = chat['race']
    affection = int(chat['affection'])
    energie = int(chat['energie'])
    intelligence = int(chat['intelligence'])
    prix = int(chat['prix_moyen_euro'])

    # Score global
    score = affection + intelligence + int(chat['esperance_vie']) / 4

    # Barre visuelle
    coeurs = "❤️" * affection
    cerveaux = "🧠" * intelligence

    # Catégorie
    if affection >= 5 and energie <= 3:
        categorie = "😻 Câlin parfait"
    elif energie >= 5:
        categorie = "⚡ Boule d'énergie"
    elif intelligence >= 5:
        categorie = "🎓 Petit génie"
    elif prix <= 500:
        categorie = "💰 Bon plan"
    else:
        categorie = "🐱 Classique"

    print(f"\\n{race:20s} | {coeurs} | {cerveaux} | {prix}€ | {categorie}")

# Les plus affectueux
print("\\n\\n🏆 Top 3 les plus affectueux :")
top_affection = df.nlargest(3, 'affection')[['race', 'affection', 'prix_moyen_euro']]
for _, row in top_affection.iterrows():
    print(f"   ❤️ {row['race']} (affection: {int(row['affection'])}/5, prix: {int(row['prix_moyen_euro'])}€)")`,
      exploratrice: `import pandas as pd
df = pd.read_csv("chats.csv")

# Parcours chaque race
for _, chat in df.iterrows():
    race = chat['race']
    affection = int(chat['affection'])
    prix = int(chat['prix_moyen_euro'])

    # Classe selon l'affection
    if affection >= ___:
        categorie = "Très affectueux"
    elif affection >= ___:
        categorie = "Affectueux"
    else:
        categorie = "Indépendant"

    print(f"{race}: {categorie} ({prix}€)")

# Trouve le plus affectueux
print(f"\\n🏆 Plus affectueux : {df.loc[df['affection'].idxmax()]['race']}")`,
      experte: `# Parcours toutes les races et crée un rapport complet :
# 1. Classe chaque race par catégorie (câlin, énergique, génie, bon plan)
# 2. Calcule un score global personnalisé
# 3. Affiche un tableau visuel avec des émojis
# 4. Top 3 de chaque catégorie

import pandas as pd
df = pd.read_csv("chats.csv")

`,
    },
    hints: [
      'for _, row in df.iterrows(): parcourt chaque ligne du DataFrame',
      'df.nlargest(3, "colonne") renvoie les 3 plus grandes valeurs',
    ],
    validation: { type: 'output-contains', expected: 'affectueux' },
  },
  {
    type: 'challenge',
    title: 'Défi final : Mon recommandeur de chats',
    content: `Combine tout ce que tu as appris pour créer une **fonction** qui recommande des races de chats selon des critères.`,
    code: {
      decouverte: `import pandas as pd

df = pd.read_csv("chats.csv")

def recommander_chat(df, appart=True, enfants=False, budget=1500, calme=True, poils_ok=True):
    """Recommande des races de chats selon tes critères."""

    print(f"\\n{'='*50}")
    print(f"🐱 RECOMMANDEUR DE CHATS")
    print(f"{'='*50}")
    print(f"🏠 Appartement : {'Oui' if appart else 'Non'}")
    print(f"👶 Enfants : {'Oui' if enfants else 'Non'}")
    print(f"💰 Budget max : {budget}€")
    print(f"😌 Chat calme : {'Oui' if calme else 'Non'}")
    print(f"🧶 Poils OK : {'Oui' if poils_ok else 'Non'}")

    # Filtrer
    resultats = df.copy()

    if appart:
        resultats = resultats[resultats['adapte_appartement'] >= 4]
    if enfants:
        resultats = resultats[resultats['enfants_ok'] >= 4]
    resultats = resultats[resultats['prix_moyen_euro'] <= budget]
    if calme:
        resultats = resultats[resultats['energie'] <= 3]
    if not poils_ok:
        resultats = resultats[resultats['perte_poils'] <= 2]

    if len(resultats) == 0:
        print("\\n❌ Aucune race ne correspond exactement. Essaie d'élargir tes critères !")
        return

    # Trier par score (affection + intelligence)
    resultats['score'] = resultats['affection'] + resultats['intelligence']
    resultats = resultats.sort_values('score', ascending=False)

    print(f"\\n✨ {len(resultats)} races correspondent :\\n")
    for _, chat in resultats.iterrows():
        print(f"  🐱 {chat['race']}")
        print(f"     ❤️ Affection: {'❤️' * int(chat['affection'])}  🧠 Intelligence: {'🧠' * int(chat['intelligence'])}")
        print(f"     💰 ~{int(chat['prix_moyen_euro'])}€  📏 {chat['poids_moyen_kg']}kg  ❤️‍🩹 Vit ~{int(chat['esperance_vie'])} ans")
        print()

    top = resultats.iloc[0]
    print(f"🏆 Meilleure recommandation : {top['race']} !")

# Teste avec différents profils !
recommander_chat(df, appart=True, enfants=True, budget=1200, calme=True)
print("\\n" + "─" * 50)
recommander_chat(df, appart=True, enfants=False, budget=2000, calme=False, poils_ok=False)`,
      exploratrice: `import pandas as pd
df = pd.read_csv("chats.csv")

def recommander_chat(df, appart=True, budget=1500, calme=True):
    """Recommande des races selon tes critères."""

    resultats = df.copy()

    # Filtre par appartement
    if appart:
        resultats = resultats[resultats['adapte_appartement'] >= ___]

    # Filtre par budget
    resultats = resultats[resultats['prix_moyen_euro'] <= ___]

    # Filtre par énergie
    if calme:
        resultats = resultats[resultats['energie'] <= ___]

    print(f"\\n✨ {len(resultats)} races trouvées :")
    for _, chat in resultats.iterrows():
        print(f"  🐱 {chat['race']} — {int(chat['prix_moyen_euro'])}€")

# Teste ta fonction
recommander_chat(df, appart=True, budget=1000, calme=True)`,
      experte: `# Crée une fonction recommander_chat() qui :
# 1. Accepte des critères (appart, enfants, budget, calme, poils)
# 2. Filtre le dataset
# 3. Calcule un score d'affinité
# 4. Affiche un rapport détaillé avec les meilleures races
# 5. Gère le cas "aucun résultat"
# Teste avec au moins 3 profils différents

import pandas as pd
df = pd.read_csv("chats.csv")

`,
    },
    hints: [
      'def ma_fonction(param1, param2): pour créer une fonction',
      'df[df["colonne"] >= valeur] filtre les lignes',
      'Tu peux chaîner les filtres : df[condition1][condition2]',
    ],
    validation: { type: 'output-contains', expected: 'races' },
    explanation: `**Bravo !** Tu as créé ton premier outil de data science utile !

Une **fonction** est un bloc de code réutilisable :
- \`def\` la déclare
- Les **paramètres** sont ses entrées (avec des valeurs par défaut !)
- Elle peut filtrer, calculer et afficher

Le même principe est utilisé dans les vrais sites de recommandation — en beaucoup plus complexe, mais la logique de base est la même : filtrer des données selon des critères.`,
  },
  {
    type: 'reflect',
    title: 'Bilan',
    content: `Tu maîtrises maintenant les bases de la programmation Python :

- **Variables** : stocker et nommer des données (race, poids, prix…)
- **Conditions** : prendre des décisions automatiquement (si appartement ET enfants…)
- **Boucles** : parcourir toutes les races d'un coup
- **Fonctions** : créer un outil réutilisable

Ton recommandeur de chats utilise exactement les mêmes principes que les algorithmes de recommandation de Netflix, Spotify ou Amazon — en version simplifiée !

Dans les prochaines missions, tu utiliseras ces outils pour mener tes propres enquêtes de données.`,
  },
  {
    type: 'complete',
    title: 'Mission accomplie !',
    content: `🎉 **Félicitations !** Tu as terminé l'Univers 1 !

**Ce que tu sais faire :**
- ✅ Variables, f-strings, types
- ✅ Conditions if/elif/else
- ✅ Boucles for avec des DataFrames
- ✅ Fonctions avec paramètres par défaut
- ✅ Filtrer et trier des données
- ✅ Créer un outil de recommandation

**Badge débloqué : 🏅 Codeuse en herbe**

Tu es prête pour l'Univers 2 : mener tes propres enquêtes !`,
  },
];
