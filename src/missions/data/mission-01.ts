import type { MissionStep } from '../index';

export const steps: MissionStep[] = [
  {
    type: 'intro',
    title: 'Les secrets de la K-pop en données',
    content: `**Qu'est-ce qui fait le succès d'un titre K-pop ?**

BTS, BLACKPINK, NewJeans, Stray Kids, aespa, LE SSERAFIM… La K-pop domine les charts mondiaux. Mais est-ce la danceabilité qui fait un hit ? L'énergie ? La durée du morceau ?

Tu as devant toi un dataset de **50 titres K-pop** avec leurs caractéristiques musicales et leur nombre de streams.

**Ce que tu vas apprendre :**
- Charger un fichier de données avec Python
- Explorer un tableau (DataFrame)
- Créer ton premier graphique`,
  },
  {
    type: 'hypothesis',
    title: 'Ton hypothèse',
    content: `Avant d'explorer les données, formule ton intuition :

**Les girl groups ont-ils plus de streams que les boy groups ?**

Et toi, quel groupe penses-tu être le plus streamé dans notre dataset ?

Note ta réponse — tu la vérifieras à la fin !`,
  },
  {
    type: 'learn',
    title: 'Qu\'est-ce qu\'un DataFrame ?',
    content: `Un **DataFrame**, c'est un tableau de données organisé en **lignes** et **colonnes**, comme un tableur Excel.

- Chaque **ligne** = un titre K-pop
- Chaque **colonne** = une caractéristique (titre, groupe, streams, énergie…)

En Python, on utilise la bibliothèque **pandas** pour manipuler ces tableaux. La fonction \`pd.read_csv()\` permet de charger un fichier CSV.

**Vocabulaire :**
- **CSV** = Comma-Separated Values (valeurs séparées par des virgules)
- **DataFrame** = le nom du tableau dans pandas
- **pd** = le raccourci habituel pour pandas`,
  },
  {
    type: 'code',
    title: 'Charge et explore le dataset K-pop',
    content: `Utilise pandas pour charger le fichier \`kpop.csv\` et découvre ce qu'il contient.`,
    code: {
      decouverte: `import pandas as pd

# Charger le fichier K-pop
df = pd.read_csv("kpop.csv")

# Afficher les 5 premières lignes
print(df.head())

# Combien de titres et de colonnes ?
print(f"\\n📊 {df.shape[0]} titres K-pop, {df.shape[1]} caractéristiques")

# Quelles sont les colonnes ?
print(f"\\n📋 Colonnes : {list(df.columns)}")

# Quels groupes sont présents ?
print(f"\\n🎤 Groupes : {', '.join(df['groupe'].unique())}")`,
      exploratrice: `import pandas as pd

# Charge le fichier kpop.csv dans un DataFrame appelé df
df = ___

# Affiche les 5 premières lignes
print(___)

# Affiche le nombre de titres et colonnes avec df.shape
print(f"📊 {___} titres, {___} colonnes")

# Affiche les groupes présents avec df['groupe'].unique()
print(f"🎤 Groupes : {', '.join(df['___'].unique())}")`,
      experte: `# Charge le fichier kpop.csv et explore-le :
# 1. Affiche les premières lignes
# 2. Combien de titres ? Combien de colonnes ?
# 3. Quels groupes ? Combien de titres par groupe ?
# 4. Affiche les statistiques de base avec .describe()

import pandas as pd

`,
    },
    hints: [
      'Utilise pd.read_csv("kpop.csv") pour charger le fichier',
      'df.head() affiche les 5 premières lignes, df.shape donne (lignes, colonnes)',
      `Voici le code complet :
import pandas as pd
df = pd.read_csv("kpop.csv")
print(df.head())
print(f"📊 {df.shape[0]} titres, {df.shape[1]} colonnes")
print(f"🎤 Groupes : {', '.join(df['groupe'].unique())}")`,
    ],
    validation: {
      type: 'output-contains',
      expected: 'titres',
    },
  },
  {
    type: 'code',
    title: 'Les groupes les plus streamés',
    content: `Qui domine les charts ? Calcule le nombre moyen de streams par groupe et par type (girl group vs boy group).`,
    code: {
      decouverte: `import pandas as pd
df = pd.read_csv("kpop.csv")

# Streams moyens par groupe (top 5)
streams_groupe = df.groupby('groupe')['streams_millions'].mean().sort_values(ascending=False)
print("🏆 Streams moyens par groupe (en millions) :")
for groupe, streams in streams_groupe.head(8).items():
    print(f"   {groupe:20s} → {streams:,.0f}M streams")

# Girl groups vs Boy groups
print("\\n👫 Girl groups vs Boy groups :")
type_stats = df.groupby('type_groupe')['streams_millions'].agg(['mean', 'median', 'count'])
for t, row in type_stats.iterrows():
    print(f"   {t}: moyenne={row['mean']:.0f}M, médiane={row['median']:.0f}M ({int(row['count'])} titres)")

# Le titre le plus streamé
top = df.loc[df['streams_millions'].idxmax()]
print(f"\\n👑 Plus gros hit : {top['titre']} — {top['groupe']} ({top['streams_millions']}M streams)")`,
      exploratrice: `import pandas as pd
df = pd.read_csv("kpop.csv")

# Streams moyens par groupe avec groupby
streams_groupe = df.groupby('groupe')['streams_millions'].___().sort_values(ascending=False)
print("🏆 Streams moyens par groupe :")
print(streams_groupe.head(8))

# Compare Girl groups vs Boy groups
type_stats = df.groupby('___')['streams_millions'].mean()
print("\\n👫 Moyenne par type :")
print(type_stats)

# Trouve le titre le plus streamé avec idxmax()
top = df.loc[df['streams_millions'].___()]
print(f"\\n👑 Plus gros hit : {top['titre']} — {top['groupe']}")`,
      experte: `# Analyse les streams :
# 1. Classe les groupes par streams moyens
# 2. Compare girl groups vs boy groups (moyenne ET médiane)
# 3. Trouve le titre le plus streamé
# 4. Quel est le titre le moins streamé ? Surprenant ?

import pandas as pd
df = pd.read_csv("kpop.csv")

`,
    },
    hints: [
      'df.groupby("groupe")["streams_millions"].mean() calcule la moyenne par groupe',
      'df.loc[df["streams_millions"].idxmax()] trouve la ligne avec le max',
    ],
    validation: { type: 'output-contains', expected: 'streams' },
  },
  {
    type: 'code',
    title: 'Ton premier graphique K-pop !',
    content: `Visualise la relation entre l'énergie d'un titre et ses streams. Les morceaux énergiques marchent-ils mieux ?`,
    code: {
      decouverte: `import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("kpop.csv")

# Couleurs par type de groupe
colors = df['type_groupe'].map({'Girl group': '#ff6b9d', 'Boy group': '#6366f1'})

plt.figure(figsize=(9, 6))
plt.scatter(df['energie'], df['streams_millions'],
            c=colors, alpha=0.7, s=60, edgecolors='white', linewidth=0.5)

plt.xlabel('Énergie du titre (0-1)')
plt.ylabel('Streams (millions)')
plt.title('Énergie vs Streams des titres K-pop')

# Légende manuelle
plt.scatter([], [], c='#ff6b9d', s=60, label='Girl group')
plt.scatter([], [], c='#6366f1', s=60, label='Boy group')
plt.legend()

plt.grid(True, alpha=0.2)
plt.tight_layout()
plt.show()

print("💡 Observe : y a-t-il un lien clair entre énergie et streams ?")`,
      exploratrice: `import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("kpop.csv")

# Crée un nuage de points : énergie (X) vs streams (Y)
plt.figure(figsize=(9, 6))
plt.scatter(df['___'], df['___'], alpha=0.7, s=60, c='#6366f1')

# Ajoute les labels des axes
plt.xlabel('___')
plt.ylabel('___')
plt.title('Énergie vs Streams K-pop')
plt.show()`,
      experte: `# Crée un graphique montrant énergie vs streams
# Colore les points par type de groupe (girl/boy)
# Bonus : annote les 3 plus gros hits avec leur nom

import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("kpop.csv")

`,
    },
    hints: [
      'plt.scatter(x, y) crée un nuage de points',
      'Pour colorer par catégorie : df["colonne"].map({"val1": "couleur1", "val2": "couleur2"})',
    ],
    validation: { type: 'no-error' },
  },
  {
    type: 'challenge',
    title: 'Défi : Le classement ultime',
    content: `Crée un graphique en barres montrant les **streams moyens par groupe**, classés du plus au moins streamé.

Quel groupe domine dans notre dataset ?`,
    code: {
      decouverte: `import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("kpop.csv")

# Streams moyens par groupe, triés
streams = df.groupby('groupe')['streams_millions'].mean().sort_values()

# Couleurs selon le type
types = df.drop_duplicates('groupe').set_index('groupe')['type_groupe']
colors = [('#ff6b9d' if types.get(g) == 'Girl group' else '#6366f1') for g in streams.index]

plt.figure(figsize=(10, 7))
plt.barh(streams.index, streams.values, color=colors, edgecolor='white', linewidth=0.5)
plt.xlabel('Streams moyens (millions)')
plt.title('Classement des groupes K-pop par streams moyens')

# Légende
plt.barh([], [], color='#ff6b9d', label='Girl group')
plt.barh([], [], color='#6366f1', label='Boy group')
plt.legend(loc='lower right')

plt.tight_layout()
plt.show()

champion = streams.index[-1]
print(f"🏆 Champion du streaming : {champion} avec {streams.values[-1]:.0f}M de streams en moyenne !")`,
      exploratrice: `import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("kpop.csv")

# Calcule les streams moyens par groupe avec groupby
streams = df.groupby('___')['___'].mean().sort_values()

# Crée un graphique en barres horizontales
plt.figure(figsize=(10, 7))
plt.barh(___, ___, color='#6366f1')
plt.xlabel('Streams moyens (millions)')
plt.title('Classement K-pop par streams')
plt.show()

# Affiche le champion
print(f"🏆 Champion : {streams.index[-1]}")`,
      experte: `# Crée le classement ultime des groupes K-pop
# Barres horizontales, triées, colorées par type (girl/boy)
# Affiche le top 3 en texte
# Bonus : ajoute un deuxième graphique avec la danceabilité moyenne

import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("kpop.csv")

`,
    },
    hints: [
      'df.groupby("groupe")["streams_millions"].mean().sort_values() trie par streams',
      'plt.barh(noms, valeurs) crée des barres horizontales',
    ],
    validation: { type: 'no-error' },
    explanation: `**Ce qu'on a découvert :**
Le nombre de streams dépend de beaucoup de facteurs : l'ancienneté du groupe, le nombre de fans, la promotion, l'algorithme des plateformes…

Un groupe avec plus de streams n'est pas "objectivement meilleur" — notre dataset est un échantillon limité et les streams mesurent la popularité commerciale, pas la qualité artistique.`,
  },
  {
    type: 'reflect',
    title: 'Qu\'as-tu découvert ?',
    content: `Reviens à ton hypothèse de départ :

**Les girl groups ont-ils vraiment plus de streams que les boy groups ?**

Ce que les données nous montrent :
- La réponse dépend de quels groupes et quels titres on compare
- Un seul chiffre (la moyenne) ne suffit pas : la médiane et la distribution racontent une histoire différente
- Les streams mesurent la popularité, pas la qualité

**Leçon importante :** Les données aident à nuancer nos intuitions. "Mon groupe préféré est le meilleur" est une opinion ; "ce groupe a le plus de streams" est un fait — mais les deux ne disent pas la même chose.`,
  },
  {
    type: 'complete',
    title: 'Mission accomplie !',
    content: `🎉 **Bravo !** Tu viens d'analyser la K-pop comme une vraie data scientist.

**Ce que tu sais faire maintenant :**
- ✅ Charger un fichier CSV avec \`pd.read_csv()\`
- ✅ Explorer un DataFrame (\`.head()\`, \`.shape\`, \`.describe()\`)
- ✅ Calculer des statistiques par groupe (\`.groupby()\`, \`.mean()\`)
- ✅ Créer des graphiques (nuage de points, barres)
- ✅ Comparer des catégories avec des couleurs

**Badge débloqué : 🏅 Data Detective**

Prochaine mission : les stats du tennis peuvent-elles mentir ?`,
  },
];
