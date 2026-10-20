import type { MissionStep } from '../index';

export const steps: MissionStep[] = [
  {
    type: 'intro',
    title: 'L\'IA qui devine le genre d\'un manga',
    content: `**Aujourd'hui, tu ne vas pas écrire les règles. Tu vas laisser la machine les trouver toute seule.**

Dans la mission 3, tu as programmé un recommandeur de chats : *si* le chat est calme, *alors* il convient à un appartement. C'est toi qui avais écrit chaque règle, à la main.

Une intelligence artificielle, c'est l'inverse. Tu lui montres des **exemples**, et elle en déduit les règles toute seule.

Tu vas construire une IA qui regarde un manga — son niveau d'action, de romance, de violence — et devine s'il s'agit d'un **Shonen**, d'un **Shojo** ou d'un **Seinen**.

**Ce que tu vas apprendre :**
- Ce que veut dire « apprendre à partir d'exemples »
- L'algorithme des k plus proches voisins (k-NN)
- Pourquoi il faut séparer données d'entraînement et données de test
- Comment savoir si ton IA est *vraiment* bonne (et pas juste chanceuse)

⚠️ Les 66 mangas sont de vrais titres, mais leurs notes d'action/romance/violence sont **synthétiques** : on les a inventées pour l'exercice.`,
  },
  {
    type: 'hypothesis',
    title: 'Ton intuition',
    content: `Imagine qu'on te donne un manga que tu n'as jamais lu. On ne te dit pas son titre — seulement trois chiffres :

- **Action** : 8/10
- **Romance** : 2/10
- **Violence** : 9/10

**À ton avis, c'est plutôt un Shonen, un Shojo ou un Seinen ? Et surtout : quel indice t'a le plus aidée à décider ?**

Note ta réponse. À la fin de la mission, tu compareras ton raisonnement à celui de la machine — tu verras qu'ils se ressemblent beaucoup.`,
  },
  {
    type: 'code',
    title: 'Découvre le dataset',
    content: `Avant d'apprendre quoi que ce soit, une IA a besoin d'**exemples étiquetés** : des mangas dont on connaît déjà le genre.

Charge \`mangas.csv\` et regarde ce qu'il contient.`,
    code: {
      decouverte: `import pandas as pd

df = pd.read_csv("mangas.csv")

print("📚 Les 8 premiers mangas :")
print(df[['titre', 'genre', 'action', 'romance', 'violence']].head(8))

print(f"\\n📊 {df.shape[0]} mangas, {df.shape[1]} colonnes")

# Combien de mangas par genre ?
print("\\n🎭 Répartition par genre :")
print(df['genre'].value_counts())

# Le profil moyen de chaque genre
print("\\n📈 Profil moyen de chaque genre :")
print(df.groupby('genre')[['action', 'romance', 'violence', 'humour']].mean().round(1))`,
      exploratrice: `import pandas as pd

df = pd.read_csv("mangas.csv")

# Affiche les 8 premières lignes avec titre, genre, action, romance, violence
print(df[['titre', '___', '___', '___', '___']].head(8))

print(f"\\n{df.shape[0]} mangas")

# Compte combien de mangas par genre
print(df['genre'].___())

# Calcule le profil moyen de chaque genre
print(df.groupby('___')[['action', 'romance', 'violence']].___().round(1))`,
      experte: `# Explore mangas.csv et réponds à ces questions :
# 1. Combien de mangas, combien de genres, et sont-ils équilibrés ?
# 2. Quel est le profil moyen (action/romance/violence/humour) de chaque genre ?
# 3. Quelle variable sépare le mieux les trois genres ? Justifie avec des chiffres.
# 4. Trouve un manga « atypique » : un Shonen très violent, ou un Seinen romantique.

import pandas as pd
df = pd.read_csv("mangas.csv")

`,
    },
    hints: [
      'df[\'genre\'].value_counts() compte les occurrences de chaque valeur',
      'df.groupby(\'genre\')[[...]].mean() calcule la moyenne de chaque colonne, genre par genre',
      'Un dataset « équilibré » a à peu près le même nombre d\'exemples par classe — c\'est important pour l\'entraînement',
    ],
    validation: { type: 'output-contains', expected: 'Shonen' },
  },
  {
    type: 'learn',
    title: 'Comment une machine « apprend »',
    content: `L'algorithme que tu vas coder s'appelle les **k plus proches voisins** (*k-nearest neighbours*, ou k-NN). C'est l'un des plus simples de toute l'IA — et il fonctionne exactement comme ton intuition.

**L'idée en une phrase :** pour deviner le genre d'un nouveau manga, on regarde les **k mangas qui lui ressemblent le plus**, et on prend le genre majoritaire parmi eux.

**Exemple concret.** Un nouveau manga : action 8, romance 2, violence 9. Voici ce que « voir ses voisins » veut dire.

[[fig:knn]]

**« Proche », ça veut dire quoi ?** On mesure la distance comme au collège, avec Pythagore, mais en 3 dimensions :

\`\`\`
distance = √( (action₁-action₂)² + (romance₁-romance₂)² + (violence₁-violence₂)² )
\`\`\`

**Un piège important : la normalisation.** Si une colonne va de 0 à 10 et une autre de 0 à 500, la deuxième écrase complètement la distance. On met donc toutes les colonnes à la même échelle avant de comparer. C'est pour ça que tu verras \`(X - moyenne) / écart_type\` dans le code.

Et c'est tout. **Il n'y a pas de magie** — juste des distances et un vote.`,
  },
  {
    type: 'code',
    title: 'Vois les genres avec tes yeux',
    content: `Avant de coder l'IA, regarde si les genres se séparent vraiment. Place chaque manga sur un graphique : l'action en X, la romance en Y, une couleur par genre.

Si tu vois trois groupes distincts, alors une machine peut les distinguer aussi.`,
    code: {
      decouverte: `import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("mangas.csv")

couleurs = {'Shonen': '#6366f1', 'Shojo': '#ec4899', 'Seinen': '#ef4444'}

plt.figure(figsize=(9, 7))
for genre, groupe in df.groupby('genre'):
    plt.scatter(groupe['action'], groupe['romance'],
                c=couleurs[genre], label=genre, s=90, alpha=0.75,
                edgecolors='white', linewidth=0.5)

plt.xlabel('Action →', fontsize=11)
plt.ylabel('Romance →', fontsize=11)
plt.title('Chaque manga placé selon son action et sa romance', fontsize=12)
plt.legend()
plt.grid(alpha=0.2)
plt.show()

print("👀 Que remarques-tu ?")
print("   • Les Shojo (rose) sont en haut à gauche : peu d'action, beaucoup de romance")
print("   • Les Shonen (bleu) et Seinen (rouge) sont tous les deux à droite…")
print("   • …et ils se MÉLANGENT ! Avec ces 2 indices seulement, impossible de les séparer.")
print("\\n💡 Il nous faudra un troisième indice. Devine lequel.")`,
      exploratrice: `import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("mangas.csv")

couleurs = {'Shonen': '#6366f1', 'Shojo': '#ec4899', 'Seinen': '#ef4444'}

plt.figure(figsize=(9, 7))
for genre, groupe in df.groupby('genre'):
    # Place l'action en X et la romance en Y
    plt.scatter(groupe['___'], groupe['___'],
                c=couleurs[genre], label=genre, s=90, alpha=0.75)

plt.xlabel('Action')
plt.ylabel('Romance')
plt.legend()
plt.show()

# Refais le même graphique avec 'violence' en Y au lieu de 'romance'.
# Les Shonen et les Seinen se séparent-ils mieux ?`,
      experte: `# 1. Fais un nuage de points action vs romance, une couleur par genre
# 2. Fais-en un deuxième : action vs violence
# 3. Lequel sépare le mieux les trois genres ? Pourquoi ?
# 4. Bonus : affiche les deux côte à côte avec plt.subplots(1, 2)

import pandas as pd
import matplotlib.pyplot as plt
df = pd.read_csv("mangas.csv")

`,
    },
    hints: [
      'df.groupby(\'genre\') permet de boucler sur chaque genre séparément : for genre, groupe in df.groupby(\'genre\')',
      'plt.scatter(x, y, c=couleur, label=nom) dessine un nuage de points',
      'Essaie violence en Y : c\'est l\'indice qui sépare Shonen et Seinen',
    ],
    validation: { type: 'no-error' },
  },
  {
    type: 'code',
    title: 'Construis ton IA',
    content: `Le moment est venu. Tu vas écrire l'algorithme k-NN **toi-même**, en une quinzaine de lignes.

**Point crucial :** on sépare les mangas en deux paquets.
- Les **données d'entraînement** (46 mangas) : ceux que l'IA a le droit de regarder.
- Les **données de test** (20 mangas) : ceux qu'elle n'a **jamais vus**, et qui serviront à l'évaluer.

Pourquoi ? Parce que réciter par cœur, ce n'est pas comprendre. Si on testait l'IA sur les mangas qu'elle a déjà vus, on mesurerait sa mémoire, pas son intelligence.`,
    code: {
      decouverte: `import pandas as pd
import numpy as np

df = pd.read_csv("mangas.csv")

# Les 3 indices qu'on donne à l'IA
indices = ['action', 'romance', 'violence']
X = df[indices].values          # les caractéristiques
y = df['genre'].values          # la bonne réponse

# --- Normalisation : tout mettre à la même échelle ---
moyennes = X.mean(axis=0)
ecarts = X.std(axis=0)
X = (X - moyennes) / ecarts

# --- Séparer entraînement et test ---
generateur = np.random.default_rng(42)
ordre = generateur.permutation(len(df))
idx_test, idx_train = ordre[:20], ordre[20:]

X_train, y_train = X[idx_train], y[idx_train]
X_test, y_test = X[idx_test], y[idx_test]

print(f"🎓 Entraînement : {len(X_train)} mangas")
print(f"🧪 Test : {len(X_test)} mangas (jamais vus par l'IA)")


# --- L'IA, en 5 lignes ---
def predire(manga, k=5):
    distances = np.sqrt(((X_train - manga) ** 2).sum(axis=1))
    voisins = np.argsort(distances)[:k]
    genres_voisins = y_train[voisins]
    genres, comptes = np.unique(genres_voisins, return_counts=True)
    return genres[np.argmax(comptes)]


# --- On la teste sur un manga qu'elle n'a jamais vu ---
premier = X_test[0]
vrai_genre = y_test[0]
titre = df.iloc[idx_test[0]]['titre']

print(f"\\n🤖 L'IA analyse « {titre} »…")
print(f"   Sa prédiction : {predire(premier)}")
print(f"   La vérité     : {vrai_genre}")
print("   " + ("✅ Correct !" if predire(premier) == vrai_genre else "❌ Raté."))`,
      exploratrice: `import pandas as pd
import numpy as np

df = pd.read_csv("mangas.csv")

indices = ['action', 'romance', 'violence']
X = df[indices].values
y = df['genre'].values

# Normalise X : soustrais la moyenne, divise par l'écart-type
moyennes = X.mean(axis=0)
ecarts = X.___(axis=0)
X = (X - moyennes) / ___

# Sépare entraînement (46) et test (20)
generateur = np.random.default_rng(42)
ordre = generateur.permutation(len(df))
idx_test, idx_train = ordre[:20], ordre[20:]
X_train, y_train = X[idx_train], y[idx_train]
X_test, y_test = X[idx_test], y[idx_test]


def predire(manga, k=5):
    # 1. Distance entre ce manga et TOUS les mangas d'entraînement
    distances = np.sqrt(((X_train - manga) ** 2).___(axis=1))
    # 2. Les k plus proches
    voisins = np.argsort(distances)[:___]
    # 3. Le genre majoritaire parmi eux
    genres, comptes = np.unique(y_train[voisins], return_counts=True)
    return genres[np.argmax(comptes)]


print("Prédiction :", predire(X_test[0]))
print("Vérité     :", y_test[0])`,
      experte: `# Écris un classifieur k-NN depuis zéro, sans scikit-learn :
# 1. Charge mangas.csv, choisis tes variables, normalise-les
# 2. Sépare 20 mangas de test et 46 d'entraînement (np.random.default_rng(42))
# 3. Écris predire(manga, k) : distance euclidienne → k plus proches → vote majoritaire
# 4. Teste-la sur un manga et affiche prédiction vs vérité
# 5. Bonus : gère les égalités de vote (2-2-1) de façon explicite

import pandas as pd
import numpy as np
df = pd.read_csv("mangas.csv")

`,
    },
    hints: [
      'X.std(axis=0) calcule l\'écart-type de chaque colonne ; axis=0 veut dire « colonne par colonne »',
      '((X_train - manga) ** 2).sum(axis=1) donne la somme des carrés pour chaque ligne — c\'est Pythagore',
      'np.argsort(distances) renvoie les INDICES triés du plus petit au plus grand ; [:k] garde les k premiers',
      'np.unique(..., return_counts=True) renvoie les valeurs uniques ET leur nombre d\'occurrences',
    ],
    validation: { type: 'output-contains', expected: 'Prédiction' },
    explanation: `**Ce que tu viens d'écrire est une vraie IA.** Pas une imitation : l'algorithme k-NN est utilisé en production dans de vrais systèmes de recommandation.

Ce qui la rend « intelligente », ce n'est pas le code — il fait 5 lignes. Ce sont les **exemples** que tu lui as donnés. Change les exemples, et son comportement change complètement, sans toucher une seule ligne de code. C'est ça, l'apprentissage automatique.`,
  },
  {
    type: 'code',
    title: 'Ton IA est-elle vraiment bonne ?',
    content: `Une prédiction juste, ça peut être de la chance. Teste ton IA sur les **20 mangas** qu'elle n'a jamais vus et calcule son score.

Mais attention — et c'est le piège le plus important de toute cette mission : **un score ne veut rien dire tout seul.** Il faut toujours le comparer à quelque chose.`,
    code: {
      decouverte: `import pandas as pd
import numpy as np

df = pd.read_csv("mangas.csv")
indices = ['action', 'romance', 'violence']
X = df[indices].values
y = df['genre'].values
X = (X - X.mean(axis=0)) / X.std(axis=0)

generateur = np.random.default_rng(42)
ordre = generateur.permutation(len(df))
idx_test, idx_train = ordre[:20], ordre[20:]
X_train, y_train = X[idx_train], y[idx_train]
X_test, y_test = X[idx_test], y[idx_test]


def predire(manga, k=5):
    distances = np.sqrt(((X_train - manga) ** 2).sum(axis=1))
    voisins = np.argsort(distances)[:k]
    genres, comptes = np.unique(y_train[voisins], return_counts=True)
    return genres[np.argmax(comptes)]


# --- Le score de ton IA ---
predictions = [predire(m) for m in X_test]
justes = sum(p == v for p, v in zip(predictions, y_test))
score = justes / len(y_test)

print(f"🤖 Ton IA : {justes}/{len(y_test)} bonnes réponses = {score:.0%}")

# --- Le point de comparaison : la "machine paresseuse" ---
# Elle répond TOUJOURS le genre le plus fréquent, sans rien regarder.
genre_le_plus_frequent = pd.Series(y_train).mode()[0]
score_paresseux = (y_test == genre_le_plus_frequent).mean()
print(f"😴 Machine paresseuse (répond toujours « {genre_le_plus_frequent} ») : {score_paresseux:.0%}")

print(f"\\n📊 Ton IA fait {score - score_paresseux:+.0%} mieux que de ne rien comprendre.")

# --- Où se trompe-t-elle ? ---
print("\\n🔍 Ses erreurs :")
erreurs = 0
for i, (p, v) in enumerate(zip(predictions, y_test)):
    if p != v:
        erreurs += 1
        titre = df.iloc[idx_test[i]]['titre']
        print(f"   « {titre} » → elle a dit {p}, c'était {v}")
if erreurs == 0:
    print("   Aucune ! (méfie-toi : c'est peut-être trop beau)")`,
      exploratrice: `import pandas as pd
import numpy as np

df = pd.read_csv("mangas.csv")
indices = ['action', 'romance', 'violence']
X = df[indices].values
y = df['genre'].values
X = (X - X.mean(axis=0)) / X.std(axis=0)

generateur = np.random.default_rng(42)
ordre = generateur.permutation(len(df))
idx_test, idx_train = ordre[:20], ordre[20:]
X_train, y_train = X[idx_train], y[idx_train]
X_test, y_test = X[idx_test], y[idx_test]


def predire(manga, k=5):
    distances = np.sqrt(((X_train - manga) ** 2).sum(axis=1))
    voisins = np.argsort(distances)[:k]
    genres, comptes = np.unique(y_train[voisins], return_counts=True)
    return genres[np.argmax(comptes)]


# Prédis le genre de CHAQUE manga de test
predictions = [predire(m) for m in ___]

# Compte combien sont justes
justes = sum(p == v for p, v in zip(predictions, ___))
print(f"Score de l'IA : {justes / len(y_test):.0%}")

# Compare à la machine paresseuse qui répond toujours le genre le plus fréquent
genre_frequent = pd.Series(y_train).mode()[0]
print(f"Machine paresseuse : {(y_test == ___).mean():.0%}")

# Affiche les titres sur lesquels l'IA s'est trompée`,
      experte: `# Évalue ton IA sérieusement :
# 1. Score sur les 20 mangas de test
# 2. Compare-le à une baseline (toujours la classe majoritaire) — l'écart est-il convaincant ?
# 3. Fais varier k (1, 3, 5, 7, 9) : quel k est le meilleur ? Pourquoi k=1 est-il risqué ?
# 4. Compare 2 variables (action+romance) et 3 (+violence) : combien gagne-t-on ?
# 5. Affiche une matrice de confusion : quels genres sont confondus entre eux ?

import pandas as pd
import numpy as np
df = pd.read_csv("mangas.csv")

`,
    },
    hints: [
      'sum(p == v for p, v in zip(predictions, y_test)) compte les prédictions correctes',
      'pd.Series(y_train).mode()[0] donne la valeur la plus fréquente',
      'La baseline tourne ici autour de 30 % (un tiers), car les trois genres sont équilibrés. Si ton IA fait 85 %, l\'écart est réel.',
      'Pour la matrice de confusion : pd.crosstab(pd.Series(y_test, name=\'vrai\'), pd.Series(predictions, name=\'prédit\'))',
    ],
    validation: { type: 'output-contains', expected: '%' },
    explanation: `**La leçon la plus importante de la mission.**

Ton IA tourne autour de **85 %**, la machine paresseuse autour de **30 %**. L'écart est énorme : ton modèle a vraiment appris quelque chose.

Mais imagine un autre scénario. Si le dataset contenait 95 % de Shonen, la machine paresseuse ferait **95 %** — sans rien comprendre du tout. Une IA à 93 % semblerait excellente alors qu'elle serait *pire que rien*.

C'est exactement le piège de la mission 2, version IA : **un chiffre impressionnant isolé de son contexte ne prouve rien.** Quand quelqu'un t'annonce « notre IA est fiable à 99 % », la bonne question n'est pas « waouh, comment ? » mais **« 99 % comparé à quoi ? »**`,
  },
  {
    type: 'challenge',
    title: 'Défi : fais-lui deviner TON manga',
    content: `À toi de jouer. Donne à ton IA un manga de ton choix — un que tu connais, ou un que tu inventes — et regarde ce qu'elle en dit.

Puis pousse-la dans ses retranchements : **trouve un manga sur lequel elle se trompe**, et comprends *pourquoi*.`,
    code: {
      decouverte: `import pandas as pd
import numpy as np

df = pd.read_csv("mangas.csv")
indices = ['action', 'romance', 'violence']
X_brut = df[indices].values
y = df['genre'].values
moyennes, ecarts = X_brut.mean(axis=0), X_brut.std(axis=0)
X = (X_brut - moyennes) / ecarts


def predire(action, romance, violence, k=5):
    manga = (np.array([action, romance, violence]) - moyennes) / ecarts
    distances = np.sqrt(((X - manga) ** 2).sum(axis=1))
    voisins = np.argsort(distances)[:k]
    genres, comptes = np.unique(y[voisins], return_counts=True)
    gagnant = genres[np.argmax(comptes)]
    confiance = comptes.max() / k
    titres_voisins = df.iloc[voisins]['titre'].tolist()
    return gagnant, confiance, titres_voisins


# ====== CHANGE CES TROIS CHIFFRES ! ======
mon_action = 7
mon_romance = 8
mon_violence = 2
# =========================================

genre, confiance, voisins = predire(mon_action, mon_romance, mon_violence)

print(f"📖 Mon manga : action={mon_action}, romance={mon_romance}, violence={mon_violence}")
print(f"\\n🤖 L'IA dit : {genre}")
print(f"   Confiance : {confiance:.0%} des voisins sont d'accord")
print(f"\\n   Elle s'est basée sur ces mangas :")
for t in voisins:
    print(f"      • {t}")

print("\\n💡 Essaie des profils bizarres :")
print("   • action=9, romance=9, violence=9  → que répond-elle ?")
print("   • action=0, romance=0, violence=0  → et là ?")
print("   Observe la confiance : quand elle descend, l'IA hésite.")`,
      exploratrice: `import pandas as pd
import numpy as np

df = pd.read_csv("mangas.csv")
indices = ['action', 'romance', 'violence']
X_brut = df[indices].values
y = df['genre'].values
moyennes, ecarts = X_brut.mean(axis=0), X_brut.std(axis=0)
X = (X_brut - moyennes) / ecarts


def predire(action, romance, violence, k=5):
    manga = (np.array([action, romance, violence]) - moyennes) / ecarts
    distances = np.sqrt(((X - manga) ** 2).sum(axis=1))
    voisins = np.argsort(distances)[:k]
    genres, comptes = np.unique(y[voisins], return_counts=True)
    # Renvoie le genre gagnant ET la confiance (part des voisins d'accord)
    return genres[np.argmax(comptes)], comptes.max() / ___


# Teste ton propre manga
genre, confiance = predire(___, ___, ___)
print(f"Genre prédit : {genre} (confiance {confiance:.0%})")

# Trouve un profil où la confiance descend à 60 % ou moins.
# Que signifie une confiance basse ?`,
      experte: `# 1. Écris predire(action, romance, violence, k) qui renvoie le genre ET la confiance
# 2. Teste au moins 5 profils de mangas que tu connais — l'IA a-t-elle raison ?
# 3. Trouve un profil où elle se trompe de façon compréhensible, et explique pourquoi
# 4. Trace la "frontière de décision" : balaie une grille de valeurs action × violence
#    (romance fixée) et colorie chaque point selon la prédiction
# 5. Que se passe-t-il aux frontières entre deux zones ?

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
df = pd.read_csv("mangas.csv")

`,
    },
    hints: [
      'comptes.max() / k donne la proportion de voisins d\'accord — c\'est une mesure de confiance',
      'df.iloc[voisins][\'titre\'] récupère les titres des mangas voisins',
      'Un profil action=9, romance=9, violence=9 n\'existe pas vraiment dans le dataset : l\'IA doit extrapoler, et c\'est là qu\'elle devient peu fiable',
      'Pour la frontière de décision : np.meshgrid crée une grille, puis prédis chaque point',
    ],
    validation: { type: 'no-error' },
    explanation: `**Ce que tu viens de voir sur la confiance est fondamental.**

Quand les 5 voisins sont d'accord (confiance 100 %), l'IA est en terrain connu. Quand ils sont partagés 2-2-1 (confiance 40 %), elle devine quasiment au hasard — mais **elle répond quand même, avec le même aplomb**.

C'est le défaut le plus dangereux des IA, y compris des plus modernes : elles ne disent jamais « je ne sais pas ». Elles donnent toujours une réponse, et c'est à nous de savoir quand ne pas y croire.`,
  },
  {
    type: 'reflect',
    title: 'Ce que tu viens vraiment de faire',
    content: `**Tu as construit une intelligence artificielle. En une quinzaine de lignes, sans bibliothèque magique.**

Prends un instant pour mesurer ce que ça veut dire.

**Ce que l'IA a fait :** elle a trouvé toute seule, à partir d'exemples, que « beaucoup de romance et peu d'action » signifie Shojo. Tu ne lui as jamais dit cette règle. Elle l'a déduite.

**Ce que l'IA n'a pas fait :** elle n'a lu aucun manga. Elle ne sait pas ce qu'est une histoire, un personnage, une émotion. Elle a comparé des nombres et voté. **Il n'y a aucune compréhension là-dedans.**

Les IA qui font la une — celles qui écrivent, dessinent, discutent — sont infiniment plus grosses que la tienne. Mais le principe de départ reste celui-ci : **des exemples, des distances, des statistiques.**

**Trois questions à emporter**, qui valent pour n'importe quelle IA que tu croiseras :

1. **Sur quels exemples a-t-elle appris ?** La tienne ne connaît que 66 mangas, tous populaires. Donne-lui un manga expérimental, elle sera perdue. Une IA ne vaut que ce que valent ses données.

2. **À quoi compare-t-on son score ?** 85 % face à 33 %, c'est un vrai résultat. 93 % face à 95 %, c'est un échec déguisé.

3. **Sait-elle qu'elle ne sait pas ?** La tienne répond toujours, même quand ses voisins sont en désaccord total. La plupart des IA font pareil.

Ces trois questions, ce sont celles que se posent les ingénieures en machine learning tous les jours. Tu viens de les poser aussi.`,
  },
  {
    type: 'complete',
    title: 'Mission accomplie !',
    content: `🎉 **Bravo — tu as codé ta première IA.**

**Ce que tu sais faire maintenant :**
- ✅ Expliquer ce que signifie « apprendre à partir d'exemples »
- ✅ Coder l'algorithme des k plus proches voisins depuis zéro
- ✅ Normaliser des données et comprendre pourquoi c'est indispensable
- ✅ Séparer entraînement et test — et dire pourquoi on ne triche pas
- ✅ Évaluer un modèle **en le comparant à une baseline**
- ✅ Repérer quand une IA est en train de deviner

**Badge débloqué : 🤖 Apprentie IA**

Tu as franchi la marche qui sépare « utiliser des données » de « faire de l'IA ». Le reste, ce sont des variations sur ce que tu viens de comprendre.`,
  },
];
