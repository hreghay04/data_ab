import type { MissionStep } from '../index';

export const steps: MissionStep[] = [
  {
    type: 'intro',
    title: 'Les secrets des chansons populaires',
    content: `**Est-ce que la durée d'une chanson influence sa popularité ?**

Les plateformes musicales collectent des tonnes de données sur les chansons : durée, tempo, énergie, genre…

Dans cette mission, tu vas explorer un vrai tableau de données musicales pour découvrir ce qui rend une chanson populaire — ou pas.

**Ce que tu vas apprendre :**
- Charger un fichier de données avec Python
- Explorer un tableau (DataFrame)
- Créer ton premier graphique`,
  },
  {
    type: 'hypothesis',
    title: 'Ton hypothèse',
    content: `Avant d'explorer les données, formule ton intuition :

**Les chansons courtes (< 3 minutes) sont-elles plus populaires que les longues (> 4 minutes) ?**

Note ta réponse — tu la vérifieras à la fin !`,
  },
  {
    type: 'learn',
    title: 'Qu\'est-ce qu\'un DataFrame ?',
    content: `Un **DataFrame**, c'est un tableau de données organisé en **lignes** et **colonnes**, comme un tableur.

- Chaque **ligne** = une chanson
- Chaque **colonne** = une caractéristique (titre, durée, popularité…)

En Python, on utilise la bibliothèque **pandas** pour manipuler ces tableaux. La fonction \`pd.read_csv()\` permet de charger un fichier CSV (un format de tableau simple).

**Vocabulaire :**
- **CSV** = Comma-Separated Values (valeurs séparées par des virgules)
- **DataFrame** = le nom du tableau dans pandas
- **pd** = le raccourci habituel pour pandas`,
  },
  {
    type: 'code',
    title: 'Charge et explore les données',
    content: `Utilise pandas pour charger le fichier \`chansons.csv\` et affiche les premières lignes.`,
    code: {
      decouverte: `import pandas as pd

# Charger le fichier de données
df = pd.read_csv("chansons.csv")

# Afficher les 5 premières lignes
print(df.head())

# Combien de chansons et de colonnes ?
print(f"\\n📊 {df.shape[0]} chansons, {df.shape[1]} colonnes")

# Quelles sont les colonnes ?
print(f"\\n📋 Colonnes : {list(df.columns)}")`,
      exploratrice: `import pandas as pd

# Charge le fichier chansons.csv dans un DataFrame appelé df
df = ___

# Affiche les 5 premières lignes
print(___)

# Affiche le nombre de lignes et colonnes avec df.shape
print(f"📊 {___} chansons, {___} colonnes")`,
      experte: `# Charge le fichier chansons.csv et explore-le :
# 1. Affiche les premières lignes
# 2. Affiche le nombre de chansons et de colonnes
# 3. Affiche les noms des colonnes
# 4. Affiche les statistiques de base avec .describe()

import pandas as pd

`,
    },
    hints: [
      'Utilise pd.read_csv("chansons.csv") pour charger le fichier',
      'df.head() affiche les 5 premières lignes, df.shape donne (lignes, colonnes)',
      `Voici le code complet :
import pandas as pd
df = pd.read_csv("chansons.csv")
print(df.head())
print(f"📊 {df.shape[0]} chansons, {df.shape[1]} colonnes")`,
    ],
    validation: {
      type: 'output-contains',
      expected: 'chansons',
    },
  },
  {
    type: 'code',
    title: 'Statistiques de base',
    content: `Maintenant, explorons les statistiques de base de notre dataset. Quelle est la durée moyenne ? La popularité ?`,
    code: {
      decouverte: `import pandas as pd
df = pd.read_csv("chansons.csv")

# Statistiques de base
print("📊 Statistiques du dataset :")
print(df.describe().round(1))

# Durée moyenne
print(f"\\n⏱️ Durée moyenne : {df['duree_sec'].mean():.0f} secondes")
print(f"⭐ Popularité moyenne : {df['popularite'].mean():.1f}/100")

# Genres présents
print(f"\\n🎵 Genres : {', '.join(df['genre'].unique())}")`,
      exploratrice: `import pandas as pd
df = pd.read_csv("chansons.csv")

# Affiche les statistiques avec .describe()
print(df.___())

# Calcule la durée moyenne avec .mean()
duree_moy = df['duree_sec'].___()
print(f"\\n⏱️ Durée moyenne : {duree_moy:.0f} secondes")

# Affiche les genres uniques avec .unique()
genres = df['genre'].___()
print(f"\\n🎵 Genres : {', '.join(genres)}")`,
      experte: `# Affiche :
# 1. Les statistiques de base (describe)
# 2. La durée moyenne et médiane
# 3. La popularité moyenne par genre
# 4. Le nombre de chansons par genre

import pandas as pd
df = pd.read_csv("chansons.csv")

`,
    },
    hints: [
      'df.describe() donne les statistiques, df["colonne"].mean() la moyenne',
      'Pour la popularité par genre : df.groupby("genre")["popularite"].mean()',
    ],
    validation: { type: 'output-contains', expected: 'Durée moyenne' },
  },
  {
    type: 'code',
    title: 'Ton premier graphique !',
    content: `C'est le moment de visualiser ! Crée un graphique pour voir la relation entre durée et popularité.`,
    code: {
      decouverte: `import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("chansons.csv")

# Créer un nuage de points
plt.figure(figsize=(8, 5))
plt.scatter(df['duree_sec'], df['popularite'],
            c='#6366f1', alpha=0.6, s=40)

plt.xlabel('Durée (secondes)')
plt.ylabel('Popularité (0-100)')
plt.title('Durée vs Popularité des chansons')
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.show()`,
      exploratrice: `import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("chansons.csv")

# Crée un nuage de points avec plt.scatter()
plt.figure(figsize=(8, 5))
plt.scatter(df['___'], df['___'], c='#6366f1', alpha=0.6)

# Ajoute les labels des axes
plt.xlabel('___')
plt.ylabel('___')
plt.title('Durée vs Popularité des chansons')
plt.show()`,
      experte: `# Crée un graphique montrant la relation entre durée et popularité
# Bonus : colore les points par genre musical

import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("chansons.csv")

`,
    },
    hints: [
      'plt.scatter(x, y) crée un nuage de points',
      'Utilise df["duree_sec"] pour l\'axe X et df["popularite"] pour l\'axe Y',
    ],
    validation: { type: 'no-error' },
  },
  {
    type: 'challenge',
    title: 'Défi : Popularité par genre',
    content: `Crée un graphique en barres montrant la **popularité moyenne par genre musical**.

Quel genre est le plus populaire dans notre dataset ?`,
    code: {
      decouverte: `import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("chansons.csv")

# Calculer la popularité moyenne par genre
pop_genre = df.groupby('genre')['popularite'].mean().sort_values()

# Graphique en barres horizontales
plt.figure(figsize=(8, 5))
plt.barh(pop_genre.index, pop_genre.values, color='#6366f1')
plt.xlabel('Popularité moyenne')
plt.title('Popularité moyenne par genre musical')
plt.tight_layout()
plt.show()

print(f"🏆 Genre le plus populaire : {pop_genre.index[-1]} ({pop_genre.values[-1]:.1f}/100)")`,
      exploratrice: `import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("chansons.csv")

# Calcule la popularité moyenne par genre avec groupby
pop_genre = df.groupby('___')['___'].mean().sort_values()

# Crée un graphique en barres avec plt.barh()
plt.figure(figsize=(8, 5))
plt.barh(___, ___)
plt.xlabel('Popularité moyenne')
plt.title('Popularité moyenne par genre musical')
plt.show()`,
      experte: `# Calcule et affiche la popularité moyenne par genre
# Crée un graphique en barres horizontal trié
# Affiche quel genre est le plus populaire

import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("chansons.csv")

`,
    },
    hints: [
      'df.groupby("genre")["popularite"].mean() groupe et calcule la moyenne',
      'plt.barh(noms, valeurs) crée des barres horizontales',
    ],
    validation: { type: 'no-error' },
    explanation: `**Ce qu'on a découvert :**
La popularité varie selon les genres, mais attention ! Notre dataset est un échantillon limité. On ne peut pas en conclure qu'un genre est "objectivement" meilleur — la popularité dépend de l'époque, du public, et de comment elle est mesurée.`,
  },
  {
    type: 'reflect',
    title: 'Qu\'as-tu découvert ?',
    content: `Reviens à ton hypothèse de départ :

**Les chansons courtes sont-elles vraiment plus populaires ?**

Ce que les données nous montrent :
- La relation durée/popularité est rarement aussi simple qu'on le pense
- Il y a beaucoup de **variation** : des chansons courtes impopulaires et des longues très populaires
- Un seul facteur (la durée) ne suffit pas à expliquer la popularité

**Leçon importante :** Les données nous aident à nuancer nos intuitions, pas à les confirmer automatiquement.`,
  },
  {
    type: 'complete',
    title: 'Mission accomplie !',
    content: `🎉 **Bravo !** Tu viens de terminer ta première mission de data science.

**Ce que tu sais faire maintenant :**
- ✅ Charger un fichier CSV avec \`pd.read_csv()\`
- ✅ Explorer un DataFrame (\`.head()\`, \`.shape\`, \`.describe()\`)
- ✅ Calculer des statistiques (\`.mean()\`, \`.groupby()\`)
- ✅ Créer des graphiques avec Matplotlib

**Badge débloqué : 🏅 Data Detective**`,
  },
];
