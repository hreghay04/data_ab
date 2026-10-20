import type { MissionStep } from '../index';

export const steps: MissionStep[] = [
  {
    type: 'intro',
    title: 'Les stats du tennis peuvent-elles mentir ?',
    content: `**Un même palmarès peut raconter des histoires très différentes selon comment on le présente.**

Djokovic est-il vraiment le GOAT ? Sinner est-il déjà meilleur qu'Alcaraz ? Les chiffres semblent donner des réponses claires… mais attention aux pièges !

Tu vas explorer un dataset de **25 joueurs et joueuses de tennis** pour apprendre à repérer les graphiques trompeurs et comprendre la différence entre moyenne et médiane.

**Ce que tu vas apprendre :**
- La différence entre moyenne et médiane
- Repérer un graphique trompeur
- L'impact des valeurs extrêmes
- Créer des visualisations honnêtes`,
  },
  {
    type: 'hypothesis',
    title: 'Ton intuition',
    content: `Regarde cette affirmation :

*"Djokovic a 84% de victoires et Alcaraz seulement 81%. Djokovic est donc clairement meilleur."*

**Est-ce aussi simple que ça ? Qu'est-ce qui pourrait rendre cette comparaison trompeuse ?**

Note ton ressenti — tu verras comment la présentation change tout.`,
  },
  {
    type: 'learn',
    title: 'Moyenne vs Médiane',
    content: `**La moyenne** additionne tout et divise par le nombre de valeurs. Elle est sensible aux **valeurs extrêmes**.

**La médiane** est la valeur du milieu quand on trie les données. Elle résiste mieux aux extrêmes.

**Exemple tennis :** Aces par match dans un tournoi :
- Matchs normaux : 5, 6, 7, 8, 7
- Un match fou : 35 aces

→ **Moyenne** : 11.3 aces (le match fou tire tout vers le haut)
→ **Médiane** : 7 aces (reflète mieux la réalité habituelle)

[[fig:moyenne-mediane]]

Quand tu lis "en moyenne", demande-toi toujours : **y a-t-il des valeurs extrêmes qui faussent le calcul ?**`,
  },
  {
    type: 'code',
    title: 'Explore les stats du tennis',
    content: `Charge le dataset et compare les joueurs. Qui a le meilleur pourcentage de victoires ? Le plus d'aces ?`,
    code: {
      decouverte: `import pandas as pd

df = pd.read_csv("tennis.csv")

print("🎾 Dataset tennis :")
print(df[['joueur', 'titres_grand_chelem', 'pourcentage_victoires', 'aces_par_match']].head(10))

# Stats globales
print(f"\\n📊 {df.shape[0]} joueurs/joueuses")
print(f"\\n🏆 Moyenne de Grand Chelems : {df['titres_grand_chelem'].mean():.1f}")
print(f"📊 Médiane de Grand Chelems : {df['titres_grand_chelem'].median():.1f}")
print(f"⚠️ Écart important ! Quelques légendes tirent la moyenne vers le haut.")

# Top 5 victoires
top = df.nlargest(5, 'pourcentage_victoires')[['joueur', 'pourcentage_victoires', 'titres_grand_chelem']]
print(f"\\n🏅 Top 5 pourcentage de victoires :")
for _, row in top.iterrows():
    print(f"   {row['joueur']:25s} {row['pourcentage_victoires']}% ({int(row['titres_grand_chelem'])} GC)")`,
      exploratrice: `import pandas as pd

df = pd.read_csv("tennis.csv")

# Affiche les premières lignes
print(df[['joueur', 'titres_grand_chelem', 'pourcentage_victoires']].head(10))

# Calcule moyenne et médiane des Grand Chelems
moy = df['titres_grand_chelem'].___()
med = df['titres_grand_chelem'].___()
print(f"\\nMoyenne GC : {moy:.1f}")
print(f"Médiane GC : {med:.1f}")

# Top 5 par pourcentage de victoires
top = df.nlargest(5, '___')
print("\\n🏅 Top 5 :")
print(top[['joueur', 'pourcentage_victoires']])`,
      experte: `# Charge tennis.csv et explore :
# 1. Compare moyenne et médiane des Grand Chelems — pourquoi l'écart ?
# 2. Top 5 joueurs par % victoires
# 3. Compare hommes et femmes (indices : cherche dans les noms ou crée un filtre)
# 4. Qui a le plus d'aces par match ? Est-ce corrélé aux victoires ?

import pandas as pd
df = pd.read_csv("tennis.csv")

`,
    },
    hints: [
      '.mean() calcule la moyenne, .median() calcule la médiane',
      'df.nlargest(5, "colonne") renvoie les 5 plus grandes valeurs',
    ],
    validation: { type: 'output-contains', expected: 'Moyenne' },
  },
  {
    type: 'code',
    title: 'L\'art du graphique trompeur',
    content: `Un même classement peut paraître écrasant ou serré selon comment tu dessines les axes.

[[fig:axe-tronque]]

Compare maintenant ces deux versions en les traçant toi-même.`,
    code: {
      decouverte: `import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("tennis.csv")
top6 = df.nlargest(6, 'pourcentage_victoires')

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5))

# Graphique TROMPEUR : axe tronqué
ax1.barh(top6['joueur'], top6['pourcentage_victoires'], color='#ef4444')
ax1.set_xlim(60, 86)
ax1.set_title('😱 Djokovic ÉCRASE tout le monde !', fontsize=11)
ax1.set_xlabel('% victoires')
ax1.invert_yaxis()

# Graphique HONNÊTE : axe complet
ax2.barh(top6['joueur'], top6['pourcentage_victoires'], color='#6366f1')
ax2.set_xlim(0, 100)
ax2.set_title('📊 Comparaison honnête', fontsize=11)
ax2.set_xlabel('% victoires')
ax2.invert_yaxis()

plt.tight_layout()
plt.show()

print("👆 Mêmes données, impression totalement différente !")
print("À gauche, l'axe commence à 60% → les écarts paraissent énormes.")
print("À droite, l'axe va de 0 à 100% → on voit que tous sont excellents.")`,
      exploratrice: `import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("tennis.csv")
top6 = df.nlargest(6, 'pourcentage_victoires')

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5))

# Graphique trompeur : tronque l'axe X
ax1.barh(top6['joueur'], top6['pourcentage_victoires'], color='#ef4444')
ax1.set_xlim(___, ___)  # Choisis un intervalle serré
ax1.set_title('Version trompeuse')
ax1.invert_yaxis()

# Graphique honnête : axe complet
ax2.barh(top6['joueur'], top6['pourcentage_victoires'], color='#6366f1')
ax2.set_xlim(___, ___)  # De 0 à 100
ax2.set_title('Version honnête')
ax2.invert_yaxis()

plt.tight_layout()
plt.show()`,
      experte: `# Crée deux graphiques côte à côte avec les % de victoires :
# 1. Un graphique volontairement trompeur (axe tronqué)
# 2. Le même mais honnête
# 3. Explique en print() ce qui change visuellement

import pandas as pd
import matplotlib.pyplot as plt
df = pd.read_csv("tennis.csv")

`,
    },
    hints: [
      'ax.set_xlim(min, max) définit les bornes de l\'axe X',
      'Un axe de 60 à 86 exagère les différences ; de 0 à 100 donne le contexte',
    ],
    validation: { type: 'no-error' },
  },
  {
    type: 'challenge',
    title: 'Défi : Alcaraz vs Sinner',
    content: `Crée une **comparaison honnête et visuelle** entre Alcaraz et Sinner sur plusieurs critères : victoires, Grand Chelems, aces, taille, âge.

Qui est "meilleur" ? Ça dépend de quel critère !`,
    code: {
      decouverte: `import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

df = pd.read_csv("tennis.csv")

# Extraire Alcaraz et Sinner
alcaraz = df[df['joueur'] == 'Carlos Alcaraz'].iloc[0]
sinner = df[df['joueur'] == 'Jannik Sinner'].iloc[0]

# Critères à comparer
criteres = ['pourcentage_victoires', 'titres_grand_chelem', 'aces_par_match', 'taille_cm', 'points_classement']
labels = ['% Victoires', 'Grand Chelems', 'Aces/match', 'Taille (cm)', 'Points ATP']

vals_a = [alcaraz[c] for c in criteres]
vals_s = [sinner[c] for c in criteres]

x = np.arange(len(labels))
width = 0.35

fig, ax = plt.subplots(figsize=(10, 6))
bars1 = ax.bar(x - width/2, vals_a, width, label='Alcaraz', color='#ef4444')
bars2 = ax.bar(x + width/2, vals_s, width, label='Sinner', color='#6366f1')

ax.set_xticks(x)
ax.set_xticklabels(labels, rotation=15, ha='right')
ax.set_title('Alcaraz vs Sinner — Qui est le meilleur ?')
ax.legend()

plt.tight_layout()
plt.show()

print("⚠️ Attention ! Ce graphique mélange des échelles très différentes.")
print("   Taille en cm (~180) et Grand Chelems (~3) sur le même axe = trompeur !")
print("\\n💡 Une comparaison honnête normaliserait les valeurs ou utiliserait")
print("   des graphiques séparés pour chaque critère.")
print(f"\\n📊 Verdict : Alcaraz mène sur {sum(1 for a, s in zip(vals_a, vals_s) if a > s)} critères,")
print(f"   Sinner sur {sum(1 for a, s in zip(vals_a, vals_s) if s > a)}.")
print("   Le 'meilleur' dépend de ce qu'on mesure !")`,
      exploratrice: `import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

df = pd.read_csv("tennis.csv")

alcaraz = df[df['joueur'] == 'Carlos Alcaraz'].iloc[0]
sinner = df[df['joueur'] == 'Jannik Sinner'].iloc[0]

# Choisis 4 critères à comparer
criteres = ['pourcentage_victoires', '___', '___', '___']

vals_a = [alcaraz[c] for c in criteres]
vals_s = [sinner[c] for c in criteres]

x = np.arange(len(criteres))
plt.figure(figsize=(10, 6))
plt.bar(x - 0.2, vals_a, 0.35, label='Alcaraz', color='#ef4444')
plt.bar(x + 0.2, vals_s, 0.35, label='Sinner', color='#6366f1')
plt.xticks(x, criteres, rotation=20)
plt.legend()
plt.title('Alcaraz vs Sinner')
plt.show()`,
      experte: `# Compare Alcaraz et Sinner de manière honnête :
# 1. Choisis au moins 5 critères pertinents
# 2. Normalise les valeurs (0-100) pour une comparaison juste
# 3. Crée un graphique radar ou des barres groupées
# 4. Conclus : qui est "meilleur" et pourquoi c'est une question piège

import pandas as pd
import matplotlib.pyplot as plt
df = pd.read_csv("tennis.csv")

`,
    },
    hints: [
      'df[df["joueur"] == "Nom"].iloc[0] extrait une ligne comme un dictionnaire',
      'Attention aux échelles : comparer des cm et des titres sur le même axe est trompeur',
    ],
    validation: { type: 'no-error' },
    explanation: `**Ce qu'on a appris :**
- La **moyenne** peut être trompeuse quand il y a des valeurs extrêmes (le Big 3 fausse la moyenne des Grand Chelems)
- Un **axe tronqué** exagère visuellement les différences
- Comparer des **échelles différentes** sur un même graphique est trompeur
- Le "meilleur" joueur dépend entièrement du **critère choisi**
- Toujours vérifier : l'axe commence-t-il à zéro ? Les échelles sont-elles comparables ?`,
  },
  {
    type: 'reflect',
    title: 'Esprit critique activé',
    content: `**Les stats du tennis ne mentent pas, mais on peut leur faire dire n'importe quoi.**

La prochaine fois que tu vois un débat Djokovic vs Nadal vs Federer :
1. Regarde **quel critère** est utilisé (Grand Chelems ? % victoires ? Semaines n°1 ?)
2. Vérifie si l'axe **commence à zéro**
3. Demande-toi si la **période** de comparaison est juste (un joueur en fin de carrière vs un débutant)
4. Cherche la **médiane** en plus de la moyenne

Ces réflexes s'appliquent partout : économie, santé, réseaux sociaux, politique…`,
  },
  {
    type: 'complete',
    title: 'Mission accomplie !',
    content: `🎉 **Bravo !** Tu es maintenant capable de déjouer les pièges statistiques.

**Ce que tu sais faire :**
- ✅ Distinguer moyenne et médiane
- ✅ Repérer un graphique trompeur (axe tronqué, échelles mélangées)
- ✅ Comprendre l'impact des valeurs extrêmes
- ✅ Créer des visualisations honnêtes
- ✅ Comparer des données avec esprit critique

**Badge débloqué : 🏅 Détective des statistiques**

Prochaine mission : programme ton propre outil d'analyse des races de chats !`,
  },
];
