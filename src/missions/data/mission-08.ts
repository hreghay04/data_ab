import type { MissionStep } from '../index';

export const steps: MissionStep[] = [
  {
    type: 'intro',
    title: 'La machine qui range sans savoir ce qu\'elle range',
    content: `**Jusqu'ici, tu as toujours donné les réponses à la machine.**

Dans la mission 4, tu lui as montré 66 mangas **avec leur genre**, et elle a appris à imiter. Dans la mission 7, tu lui as montré des dossiers **avec la décision du jury**. À chaque fois, quelqu'un avait déjà fait le travail d'étiquetage.

Maintenant, on lui retire les étiquettes.

Tu vas lui donner une cinquantaine de titres K-pop **sans aucune catégorie**, et lui demander de les ranger en familles. Personne ne lui dira ce qu'est une ballade, ni ce qu'est un titre de scène. Elle devra le découvrir toute seule, à partir des chiffres.

Ça s'appelle l'**apprentissage non supervisé**, et c'est une famille entièrement différente de ce que tu as fait jusqu'ici.

**Ce que tu vas apprendre :**
- L'algorithme des k-moyennes (*k-means*), de bout en bout
- Comment une machine trouve une structure que personne ne lui a indiquée
- Pourquoi il faut relancer l'algorithme plusieurs fois
- Et surtout : **comment vérifier qu'un résultat sans étiquettes veut dire quelque chose**

Cette dernière question est la plus difficile du domaine. Tu vas la résoudre avec une astuce élégante.`,
  },
  {
    type: 'hypothesis',
    title: 'Ton intuition',
    content: `Imagine qu'on te donne une cinquantaine de titres K-pop sans aucune information sur les groupes, et qu'on te demande de faire **trois piles**.

**Sur quoi te baserais-tu ?** Le tempo ? L'énergie ? La durée ? L'ambiance ?

Et une question plus dérangeante :

**Si une machine fait trois piles à partir de chiffres, comment sauras-tu si ces piles veulent dire quelque chose — ou si elle a juste coupé le nuage au hasard ?**

Prends le temps sur celle-là. Dans tout ce que tu as fait jusqu'ici, tu pouvais vérifier : la prédiction était juste ou fausse. Ici, **il n'y a pas de bonne réponse à comparer.**`,
  },
  {
    type: 'learn',
    title: 'L\'algorithme des k-moyennes',
    content: `L'idée est d'une simplicité surprenante. On veut former **k groupes**, alors on place k points de repère et on les laisse se déplacer jusqu'à trouver leur place.

**L'algorithme, en quatre temps :**

1. **Place k centres au hasard** parmi les données.
2. **Attribue** chaque titre au centre dont il est le plus proche. Tu sais déjà calculer une distance — c'est exactement la même qu'en mission 4.
3. **Déplace** chaque centre au milieu des titres qui viennent de lui être attribués.
4. **Recommence** les étapes 2 et 3 jusqu'à ce que plus rien ne bouge.

C'est tout. Les centres se repositionnent progressivement au cœur des zones denses du nuage, et les groupes se stabilisent.

**Comment mesurer la qualité d'un découpage ?** On additionne les distances au carré entre chaque point et le centre de son groupe. Ce nombre s'appelle l'**inertie**. Plus elle est faible, plus les groupes sont compacts.

**Un piège important.** Les centres de départ sont tirés au hasard — et selon le tirage, l'algorithme peut se bloquer sur un mauvais découpage. Un mauvais tirage donne parfois un groupe réduit à un seul titre.

La parade est simple et universelle : **on relance tout l'algorithme plusieurs fois, et on garde le découpage dont l'inertie est la plus basse.** Ce n'est pas un détail d'implémentation, c'est indispensable — tu vas le vérifier toi-même.

⚠️ Ne confonds pas le **k de k-means** (le nombre de groupes à former) avec le **k du k-NN** de la mission 4 (le nombre de voisins consultés). Même lettre, deux idées différentes.`,
  },
  {
    type: 'code',
    title: 'Range les titres K-pop',
    content: `Écris l'algorithme complet et lance-le sur le dataset K-pop, en utilisant uniquement **l'énergie, la dansabilité et la durée**.

Les colonnes \`groupe\` et \`titre\` ne servent qu'à lire le résultat — l'algorithme ne les voit jamais.`,
    code: {
      decouverte: `import pandas as pd
import numpy as np

df = pd.read_csv("kpop.csv")

# L'algorithme ne voit QUE ces trois nombres
variables = ['energie', 'danceabilite', 'duree_sec']
X = df[variables].values.astype(float)
X = (X - X.mean(axis=0)) / X.std(axis=0)


def kmeans(X, k, n_essais=10):
    """Renvoie le meilleur découpage trouvé sur n_essais départs différents."""
    meilleur = None
    for essai in range(n_essais):
        rng = np.random.default_rng(essai)
        centres = X[rng.choice(len(X), k, replace=False)].astype(float)

        for _ in range(50):
            # distance de chaque titre à chaque centre
            d = np.sqrt(((X[:, None, :] - centres) ** 2).sum(axis=2))
            groupes = d.argmin(axis=1)          # chacun rejoint le centre le plus proche
            for c in range(k):                  # chaque centre va au milieu des siens
                if (groupes == c).any():
                    centres[c] = X[groupes == c].mean(axis=0)

        inertie = ((X - centres[groupes]) ** 2).sum()
        if meilleur is None or inertie < meilleur[2]:
            meilleur = (groupes, centres, inertie)
    return meilleur


groupes, centres, inertie = kmeans(X, 3)
df['cluster'] = groupes

print(f"🎯 Inertie du meilleur découpage : {inertie:.1f}\\n")

for c in sorted(df['cluster'].unique()):
    sous = df[df['cluster'] == c]
    print(f"━━━ Groupe {c}  ({len(sous)} titres) ━━━")
    print(f"   énergie {sous['energie'].mean():.2f}   "
          f"dansabilité {sous['danceabilite'].mean():.2f}   "
          f"durée {sous['duree_sec'].mean():.0f}s")
    print(f"   {', '.join(sous['titre'].head(6))}…\\n")

print("👀 Lis les titres de chaque groupe. Est-ce que tu reconnais")
print("   une logique musicale derrière ces trois familles ?")`,
      exploratrice: `import pandas as pd
import numpy as np

df = pd.read_csv("kpop.csv")
variables = ['energie', 'danceabilite', 'duree_sec']
X = df[variables].values.astype(float)
X = (X - X.mean(axis=0)) / X.std(axis=0)


def kmeans(X, k, n_essais=10):
    meilleur = None
    for essai in range(n_essais):
        rng = np.random.default_rng(essai)
        centres = X[rng.choice(len(X), k, replace=False)].astype(float)
        for _ in range(50):
            d = np.sqrt(((X[:, None, :] - centres) ** 2).sum(axis=2))
            # chaque titre rejoint le centre le PLUS PROCHE
            groupes = d.___(axis=1)
            for c in range(k):
                if (groupes == c).any():
                    # le centre se place au MILIEU de son groupe
                    centres[c] = X[groupes == c].___(axis=0)
        inertie = ((X - centres[groupes]) ** 2).sum()
        if meilleur is None or inertie < meilleur[2]:
            meilleur = (groupes, centres, inertie)
    return meilleur


# Forme 3 groupes
groupes, centres, inertie = kmeans(X, ___)
df['cluster'] = groupes

print("Inertie :", round(inertie, 1))
for c in sorted(df['cluster'].unique()):
    sous = df[df['cluster'] == c]
    print(f"\\nGroupe {c} ({len(sous)}) :", ", ".join(sous['titre'].head(5)))
    print("  energie moyenne :", round(sous['energie'].mean(), 2))`,
      experte: `# 1. Écris k-means depuis zéro : initialisation, attribution, déplacement, répétition
# 2. Ajoute les relances multiples et la sélection par inertie minimale
# 3. Applique-le à kpop.csv sur energie, danceabilite, duree_sec
# 4. Affiche la composition de chaque groupe et interprète-la musicalement
# 5. Bonus : visualise le résultat en nuage de points, une couleur par groupe,
#    avec les centres marqués d'une croix

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
df = pd.read_csv("kpop.csv")

`,
    },
    hints: [
      'd.argmin(axis=1) donne, pour chaque titre, l\'indice du centre le plus proche',
      'X[groupes == c].mean(axis=0) calcule le point moyen des titres du groupe c',
      'X[:, None, :] - centres compare chaque titre à chaque centre d\'un seul coup',
      'Normaliser est indispensable ici : la durée est en centaines de secondes, l\'énergie entre 0 et 1',
    ],
    validation: { type: 'output-contains', expected: 'Groupe' },
    explanation: `**Les trois familles se lisent dans les moyennes.**

L'une regroupe des titres longs à dansabilité plus basse — les morceaux posés, les ballades. Une autre rassemble les titres de scène les plus énergiques. La troisième réunit des morceaux courts, très dansants mais moins intenses.

Regarde maintenant la composition par groupe de K-pop : tu verras que **les cinq titres de NewJeans se retrouvent dans le même cluster**. L'algorithme n'a jamais vu la colonne \`groupe\`. Il a simplement constaté que ces cinq morceaux partagent une signature sonore — ce que les fans appellent justement le « son NewJeans ».

C'est exactement ça, l'apprentissage non supervisé : **la structure était déjà dans les données**, il fallait juste la laisser apparaître.`,
  },
  {
    type: 'code',
    title: 'Mais est-ce que ça veut vraiment dire quelque chose ?',
    content: `Tu viens d'obtenir trois groupes qui *semblent* cohérents. Mais c'est une impression — et les impressions trompent. Un algorithme coupera toujours un nuage en trois, même s'il n'y a aucune structure dedans.

**Voici l'astuce pour trancher** : on applique la méthode à un jeu de données dont on connaît **déjà** les vraies catégories. Si la machine les retrouve sans qu'on les lui donne, c'est que la méthode trouve des structures réelles.

On va donc reprendre les mangas de la mission 4 — en cachant soigneusement la colonne \`genre\`.`,
    code: {
      decouverte: `import pandas as pd
import numpy as np

df = pd.read_csv("mangas.csv")

# On cache le genre ! L'algorithme ne verra que ces trois nombres.
variables = ['action', 'romance', 'violence']
X = df[variables].values.astype(float)
X = (X - X.mean(axis=0)) / X.std(axis=0)


def kmeans(X, k, n_essais=10):
    meilleur = None
    for essai in range(n_essais):
        rng = np.random.default_rng(essai)
        centres = X[rng.choice(len(X), k, replace=False)].astype(float)
        for _ in range(50):
            d = np.sqrt(((X[:, None, :] - centres) ** 2).sum(axis=2))
            groupes = d.argmin(axis=1)
            for c in range(k):
                if (groupes == c).any():
                    centres[c] = X[groupes == c].mean(axis=0)
        inertie = ((X - centres[groupes]) ** 2).sum()
        if meilleur is None or inertie < meilleur[2]:
            meilleur = (groupes, centres, inertie)
    return meilleur


groupes, centres, inertie = kmeans(X, 3)
df['cluster'] = groupes

# Moment de vérité : on ressort les vrais genres
print("🔍 Composition réelle de chaque groupe trouvé :\\n")
table = pd.crosstab(df['cluster'], df['genre'])
print(table)

# Chaque cluster correspond-il à un genre dominant ?
print("\\n📊 Genre majoritaire de chaque groupe :")
justes = 0
for c in sorted(df['cluster'].unique()):
    sous = df[df['cluster'] == c]
    dominant = sous['genre'].mode()[0]
    part = (sous['genre'] == dominant).mean()
    justes += (sous['genre'] == dominant).sum()
    print(f"   Groupe {c} ({len(sous):2d} titres) → {dominant:7s} à {part:.0%}")

print(f"\\n🎯 Au total, {justes}/{len(df)} mangas sont dans le groupe")
print(f"   correspondant à leur vrai genre, soit {justes/len(df):.0%}.")
print("\\n✅ La machine a reconstitué les genres SANS JAMAIS LES VOIR.")
print("   La méthode trouve donc bien de vraies structures.")
print("   On peut maintenant faire confiance aux familles K-pop.")`,
      exploratrice: `import pandas as pd
import numpy as np

df = pd.read_csv("mangas.csv")

# On cache la colonne 'genre'
variables = ['action', 'romance', '___']
X = df[variables].values.astype(float)
X = (X - X.mean(axis=0)) / X.std(axis=0)


def kmeans(X, k, n_essais=10):
    meilleur = None
    for essai in range(n_essais):
        rng = np.random.default_rng(essai)
        centres = X[rng.choice(len(X), k, replace=False)].astype(float)
        for _ in range(50):
            d = np.sqrt(((X[:, None, :] - centres) ** 2).sum(axis=2))
            groupes = d.argmin(axis=1)
            for c in range(k):
                if (groupes == c).any():
                    centres[c] = X[groupes == c].mean(axis=0)
        inertie = ((X - centres[groupes]) ** 2).sum()
        if meilleur is None or inertie < meilleur[2]:
            meilleur = (groupes, centres, inertie)
    return meilleur


groupes, _, _ = kmeans(X, 3)
df['cluster'] = groupes

# Croise les groupes trouvés avec les VRAIS genres
print(pd.crosstab(df['___'], df['genre']))

# Chaque ligne du tableau est-elle dominée par un seul genre ?`,
      experte: `# 1. Applique ton k-means aux mangas en cachant la colonne 'genre'
# 2. Croise les clusters obtenus avec les vrais genres (pd.crosstab)
# 3. Calcule un taux de correspondance : combien de mangas sont dans le
#    cluster dont le genre majoritaire est le leur ?
# 4. Compare ce résultat au k-NN supervisé de la mission 4 (~85%).
#    Le non supervisé fait-il aussi bien ? Est-ce surprenant ?
# 5. Relance SANS les relances multiples (n_essais=1) avec plusieurs graines.
#    De combien le résultat varie-t-il ? Conclus sur leur utilité.

import pandas as pd
import numpy as np
df = pd.read_csv("mangas.csv")

`,
    },
    hints: [
      'pd.crosstab(df[\'cluster\'], df[\'genre\']) croise les deux colonnes dans un tableau',
      'sous[\'genre\'].mode()[0] donne le genre le plus fréquent d\'un cluster',
      'Les numéros de clusters sont arbitraires : le cluster 0 peut correspondre à n\'importe quel genre',
    ],
    validation: { type: 'output-contains', expected: 'Groupe' },
    explanation: `**Environ 86 % des mangas tombent dans le cluster correspondant à leur vrai genre.**

Compare ce chiffre au k-NN supervisé de la mission 4, qui atteignait environ 85 % — **en ayant accès aux étiquettes**. Ici, la machine n'a rien eu du tout, et fait aussi bien.

Ce n'est pas un hasard : si les trois genres se distinguent vraiment par leurs niveaux d'action, de romance et de violence, alors ils forment **naturellement** trois amas dans les données. Les étiquettes ne créaient pas la structure — elles la nommaient.

Et ça valide rétroactivement ton travail sur la K-pop. Puisque la méthode retrouve de vraies catégories quand il y en a, les familles qu'elle a formées sur les chansons ne sont pas des coupures arbitraires.

Un dernier point qui compte : **les numéros de clusters n'ont aucun sens en soi.** Le groupe 0 n'est pas « le premier genre ». C'est à toi d'aller voir ce qu'il contient pour lui donner un nom. L'algorithme sépare ; **l'interprétation reste humaine.**`,
  },
  {
    type: 'challenge',
    title: 'Défi : combien de groupes faut-il ?',
    content: `On a choisi 3 groupes. Pourquoi 3 ? Parce que ça semblait raisonnable. **Ce n'est pas une méthode.**

Voici le vrai problème du clustering : *k* est un choix, et aucune bonne réponse ne te sera donnée. Explore ce qui se passe quand tu le fais varier.`,
    code: {
      decouverte: `import pandas as pd
import numpy as np

df = pd.read_csv("kpop.csv")
X = df[['energie', 'danceabilite', 'duree_sec']].values.astype(float)
X = (X - X.mean(axis=0)) / X.std(axis=0)


def kmeans(X, k, n_essais=10):
    meilleur = None
    for essai in range(n_essais):
        rng = np.random.default_rng(essai)
        centres = X[rng.choice(len(X), k, replace=False)].astype(float)
        for _ in range(50):
            d = np.sqrt(((X[:, None, :] - centres) ** 2).sum(axis=2))
            groupes = d.argmin(axis=1)
            for c in range(k):
                if (groupes == c).any():
                    centres[c] = X[groupes == c].mean(axis=0)
        inertie = ((X - centres[groupes]) ** 2).sum()
        if meilleur is None or inertie < meilleur[2]:
            meilleur = (groupes, centres, inertie)
    return meilleur


print("📉 Inertie selon le nombre de groupes :\\n")
precedente = None
for k in range(1, 8):
    _, _, inertie = kmeans(X, k)
    gain = f"gagne {precedente - inertie:5.1f}" if precedente else ""
    print(f"   k={k} : inertie {inertie:6.1f}   {gain}")
    precedente = inertie

print("\\n🤔 L'inertie baisse TOUJOURS quand k augmente.")
print("   Avec k = 50, chaque titre serait seul dans son groupe : inertie nulle,")
print("   et résultat parfaitement inutile.")
print("\\n   On cherche donc le moment où les gains deviennent faibles —")
print("   ce qu'on appelle la « méthode du coude ».")
print("   Ici le coude n'est pas net : c'est le cas le plus fréquent en pratique.")

# L'effet des relances, démontré
print("\\n🎲 Et sans les relances multiples ? (un seul départ au hasard)")
for essai in range(5):
    rng = np.random.default_rng(essai)
    centres = X[rng.choice(len(X), 3, replace=False)].astype(float)
    for _ in range(50):
        d = np.sqrt(((X[:, None, :] - centres) ** 2).sum(axis=2))
        groupes = d.argmin(axis=1)
        for c in range(3):
            if (groupes == c).any():
                centres[c] = X[groupes == c].mean(axis=0)
    inertie = ((X - centres[groupes]) ** 2).sum()
    tailles = sorted(np.bincount(groupes, minlength=3))
    print(f"   départ {essai} : inertie {inertie:5.1f}   tailles {tailles}")

print("\\n   Les résultats diffèrent selon le hasard du départ.")
print("   D'où la règle : relancer, et garder la plus petite inertie.")`,
      exploratrice: `import pandas as pd
import numpy as np

df = pd.read_csv("kpop.csv")
X = df[['energie', 'danceabilite', 'duree_sec']].values.astype(float)
X = (X - X.mean(axis=0)) / X.std(axis=0)

# (reprends la fonction kmeans de l'étape précédente)

# Fais varier k de 1 à 7 et note l'inertie à chaque fois
for k in range(1, ___):
    _, _, inertie = kmeans(X, k)
    print(f"k={k} : {inertie:.1f}")

# L'inertie augmente-t-elle ou diminue-t-elle quand k grandit ?
# Que vaudrait l'inertie si k était égal au nombre de titres ?
# Pourquoi « la plus petite inertie » est-il un mauvais critère
# pour choisir k ?`,
      experte: `# 1. Trace la courbe d'inertie en fonction de k (de 1 à 10)
# 2. Y a-t-il un coude net ? Que conclus-tu si ce n'est pas le cas ?
# 3. Essaie k=2 et k=5 sur la K-pop : les familles obtenues sont-elles
#    plus ou moins interprétables qu'avec k=3 ?
# 4. Documente-toi sur le « score de silhouette » et implémente-le :
#    donne-t-il une réponse plus claire que le coude ?
# 5. Conclusion : le choix de k est-il un problème technique ou un choix humain ?

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
df = pd.read_csv("kpop.csv")

`,
    },
    hints: [
      'L\'inertie diminue mécaniquement quand k augmente : on ne peut donc pas choisir k en minimisant l\'inertie',
      'np.bincount(groupes) compte le nombre de titres dans chaque groupe',
      'La « méthode du coude » cherche le k au-delà duquel les gains deviennent marginaux — elle donne rarement une réponse franche',
    ],
    validation: { type: 'output-contains', expected: 'inertie' },
    explanation: `**Deux leçons, et la seconde est inconfortable.**

D'abord, les relances servent à quelque chose : selon le départ tiré au hasard, l'inertie change et les tailles de groupes aussi. Un seul essai peut tomber sur un découpage franchement mauvais.

Ensuite, le choix de *k*. L'inertie décroît toujours — de 153 à k=1 jusqu'à frôler zéro quand chaque titre est seul dans son groupe. **On ne peut donc pas choisir k en cherchant la plus petite inertie**, ce serait choisir le résultat le plus inutile possible.

La méthode du coude cherche le point où les gains s'aplatissent. Ici : −63 puis −24 puis −22 puis −7… Le coude n'est pas franc, et c'est la situation habituelle avec de vraies données.

**Conclusion honnête : il n'existe pas de bonne valeur de k.** Il existe des valeurs *utiles* selon ce que tu cherches. Pour trier une playlist, 3 familles sont pratiques. Pour une étude musicologique fine, il en faudrait vingt. **C'est une question de but, pas de mathématiques.**`,
  },
  {
    type: 'reflect',
    title: 'Deux façons d\'apprendre',
    content: `**Tu connais maintenant les deux grandes familles de l'apprentissage automatique.**

**L'apprentissage supervisé** (missions 4, 6 et 7) a besoin d'exemples déjà étiquetés : des mangas avec leur genre, des candidats avec la décision du jury. Il est précis, évaluable — tu peux toujours dire s'il s'est trompé. Mais il dépend entièrement d'un travail humain d'étiquetage, lent, coûteux, et parfois biaisé comme tu l'as vu en mission 7.

**L'apprentissage non supervisé** (cette mission) se passe d'étiquettes. Il révèle des structures que personne n'avait formulées. Mais il ne donne jamais de réponse « juste » : il propose un découpage, et **c'est toi qui décides s'il a du sens.**

Tu croises le second tous les jours sans le savoir. Quand une plateforme te dit *« les personnes qui aiment ça écoutent aussi… »*, elle t'a placée dans un groupe que personne n'a nommé. Les banques l'utilisent pour repérer des transactions atypiques, les biologistes pour découvrir des sous-types de maladies qu'aucun médecin n'avait distingués.

**Ce qu'il faut retenir, et qui vaut bien au-delà du clustering :**

L'algorithme a trouvé que cinq chansons se ressemblent. Il n'a pas trouvé que ces chansons sont « du NewJeans », ni qu'elles sont « de la pop douce ». **Il a produit une séparation ; le sens, c'est toi qui l'as apporté.**

Cette répartition des rôles — la machine calcule, l'humain interprète — est exactement ce que font les data scientists toute la journée. La partie difficile n'a jamais été le calcul.`,
  },
  {
    type: 'complete',
    title: 'Mission accomplie !',
    content: `🎉 **Bravo — tu as écrit un algorithme de clustering de A à Z.**

**Ce que tu sais faire :**
- ✅ Implémenter k-means : initialisation, attribution, déplacement, convergence
- ✅ Mesurer un découpage avec l'inertie
- ✅ Comprendre pourquoi les relances multiples sont indispensables
- ✅ **Valider une méthode non supervisée** en la testant sur des données étiquetées
- ✅ Expliquer pourquoi le choix de k est un choix humain
- ✅ Distinguer apprentissage supervisé et non supervisé

**Badge débloqué : 🧩 Exploratrice de structures**

Tu as maintenant fait les deux : apprendre avec des réponses, et apprendre sans. Il te reste une question à affronter — **comment savoir si un modèle est vraiment fiable**, et pourquoi les meilleurs sur le papier sont souvent les pires en vrai.`,
  },
];
