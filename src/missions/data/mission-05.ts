import type { MissionStep } from '../index';

export const steps: MissionStep[] = [
  {
    type: 'intro',
    title: 'Les séries longues font-elles les plus gros succès ?',
    content: `**One Piece : 105 tomes, 516 millions d'exemplaires vendus. Paradise Kiss : 5 tomes, 5 millions.**

Coïncidence ? Ou est-ce qu'il existe une vraie règle : *plus une série est longue, plus elle se vend* ?

Tu vas mesurer ce lien avec un outil que les scientifiques utilisent tous les jours : le **coefficient de corrélation**. Un seul nombre qui résume la force d'une relation entre deux variables.

Puis tu vas découvrir le piège le plus célèbre de toute la statistique — celui qui fait dire n'importe quoi à des gens très sérieux : **corrélation n'est pas causalité**.

**Ce que tu vas apprendre :**
- Calculer et lire un coefficient de corrélation
- Repérer qu'une seule valeur extrême peut gonfler un résultat
- Distinguer « ces deux choses varient ensemble » de « l'une cause l'autre »
- Comprendre qu'une absence de lien est aussi un résultat

💡 Dans cette mission, tu travailles sur les colonnes **réelles** du dataset : le nombre de tomes, l'année de parution et les ventes sont de vrais chiffres.`,
  },
  {
    type: 'hypothesis',
    title: 'Ton pari',
    content: `Avant de calculer quoi que ce soit, engage-toi.

**À ton avis, le lien entre le nombre de tomes et les ventes est-il :**
- très fort (les longues séries dominent toujours) ?
- moyen (ça joue, mais il y a plein d'exceptions) ?
- inexistant (c'est la qualité qui fait tout) ?

**Et surtout : si le lien existe, dans quel sens fonctionne-t-il ?** Est-ce qu'une série devient populaire *parce qu'elle est longue* — ou est-ce qu'elle devient longue *parce qu'elle est populaire* ?

Note ta réponse. C'est exactement la question qui occupera la deuxième moitié de la mission.`,
  },
  {
    type: 'code',
    title: 'Mesure le lien',
    content: `Le **coefficient de corrélation** (souvent noté *r*) résume en un seul nombre la façon dont deux variables varient ensemble :

- **r proche de +1** : quand l'une monte, l'autre monte
- **r proche de 0** : aucun lien
- **r proche de −1** : quand l'une monte, l'autre descend

En pandas, c'est une seule ligne : \`df['colonne_a'].corr(df['colonne_b'])\`.`,
    code: {
      decouverte: `import pandas as pd

df = pd.read_csv("mangas.csv")

# Le lien entre longueur de la série et ventes
r = df['nb_volumes'].corr(df['popularite_millions'])
print(f"📈 Tomes vs ventes : r = {r:.2f}")

# Quelques repères pour lire ce chiffre
print("\\n📏 Comment lire r :")
print("   |r| > 0.7  → lien fort")
print("   |r| ~ 0.4  → lien modéré")
print("   |r| < 0.2  → quasiment aucun lien")

# Et les autres paires ?
print("\\n🔍 D'autres liens dans le dataset :")
paires = [
    ('nb_volumes', 'popularite_millions'),
    ('annee', 'nb_volumes'),
    ('annee', 'popularite_millions'),
]
for a, b in paires:
    print(f"   {a:12s} vs {b:20s} r = {df[a].corr(df[b]):+.2f}")

# Les extrêmes du dataset
print("\\n📚 Les 5 séries les plus longues :")
for _, m in df.nlargest(5, 'nb_volumes').iterrows():
    print(f"   {m['titre']:24s} {int(m['nb_volumes']):3d} tomes → {int(m['popularite_millions']):3d} M")`,
      exploratrice: `import pandas as pd

df = pd.read_csv("mangas.csv")

# Calcule la corrélation entre le nombre de tomes et les ventes
r = df['nb_volumes'].___(df['popularite_millions'])
print(f"Tomes vs ventes : r = {r:.2f}")

# Calcule aussi ces deux-là
print("annee vs nb_volumes  : r =", round(df['annee'].corr(df['___']), 2))
print("annee vs ventes      : r =", round(df['___'].corr(df['popularite_millions']), 2))

# Affiche les 5 séries les plus longues avec leurs ventes
print(df.___(5, 'nb_volumes')[['titre', 'nb_volumes', 'popularite_millions']])`,
      experte: `# 1. Calcule la matrice de corrélation des colonnes réelles
#    (annee, nb_volumes, popularite_millions)
# 2. Quelle paire est la plus fortement liée ? La moins liée ?
# 3. Affiche la matrice sous forme de carte de chaleur (plt.imshow)
# 4. La corrélation tient-elle à l'intérieur de chaque genre ? Vérifie avec groupby.

import pandas as pd
import matplotlib.pyplot as plt
df = pd.read_csv("mangas.csv")

`,
    },
    hints: [
      'df[\'a\'].corr(df[\'b\']) calcule le coefficient de corrélation de Pearson',
      'df.nlargest(5, \'colonne\') renvoie les 5 lignes ayant les plus grandes valeurs',
      'Pour la matrice complète : df[[\'annee\',\'nb_volumes\',\'popularite_millions\']].corr()',
    ],
    validation: { type: 'output-contains', expected: 'r =' },
    explanation: `**r ≈ 0,74 : c'est un lien fort.** Les séries longues vendent bien plus que les courtes, et ce n'est pas un hasard du dataset.

Mais attention au mot « fort ». r = 0,74 ne veut pas dire « vrai dans 74 % des cas », ni « la longueur explique 74 % des ventes ». Ça veut dire : *quand on range les mangas par longueur, on les range à peu près aussi par ventes* — avec des exceptions, parfois énormes.

Et tu vas voir que ce 0,74 est plus fragile qu'il n'en a l'air.`,
  },
  {
    type: 'code',
    title: 'Regarde le nuage',
    content: `Un coefficient seul peut cacher beaucoup de choses. **Dessine toujours tes données avant de conclure.**

Place chaque manga : le nombre de tomes en X, les ventes en Y.`,
    code: {
      decouverte: `import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("mangas.csv")

couleurs = {'Shonen': '#6366f1', 'Shojo': '#ec4899', 'Seinen': '#ef4444'}

plt.figure(figsize=(10, 7))
for genre, groupe in df.groupby('genre'):
    plt.scatter(groupe['nb_volumes'], groupe['popularite_millions'],
                c=couleurs[genre], label=genre, s=80, alpha=0.8)

# Mettre en évidence les cas extrêmes
for _, m in df.nlargest(3, 'popularite_millions').iterrows():
    plt.annotate(m['titre'],
                 (m['nb_volumes'], m['popularite_millions']),
                 textcoords="offset points", xytext=(8, 6), fontsize=9)

plt.xlabel('Nombre de tomes →')
plt.ylabel('Ventes (millions) →')
plt.title(f"Tomes vs ventes  (r = {df['nb_volumes'].corr(df['popularite_millions']):.2f})")
plt.legend()
plt.grid(alpha=0.2)
plt.show()

print("👀 Ce que montre le nuage :")
print("   • La tendance monte : les séries longues vendent plus.")
print("   • MAIS le nuage est très étalé — beaucoup d'exceptions.")
print("   • Et un point est très loin des autres, tout en haut à droite…")
print("\\n💡 Ce point tout seul, c'est One Piece. Garde-le en tête.")`,
      exploratrice: `import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("mangas.csv")
couleurs = {'Shonen': '#6366f1', 'Shojo': '#ec4899', 'Seinen': '#ef4444'}

plt.figure(figsize=(10, 7))
for genre, groupe in df.groupby('genre'):
    # Tomes en X, ventes en Y
    plt.scatter(groupe['___'], groupe['___'],
                c=couleurs[genre], label=genre, s=80, alpha=0.8)

plt.xlabel('Nombre de tomes')
plt.ylabel('Ventes (millions)')
plt.legend()
plt.show()

# Quel manga est le point isolé en haut à droite ?
print(df.nlargest(1, '___')[['titre', 'nb_volumes', 'popularite_millions']])`,
      experte: `# 1. Nuage de points tomes vs ventes, une couleur par genre
# 2. Annote les 3 plus gros vendeurs
# 3. Ajoute une droite de tendance (np.polyfit degré 1)
# 4. La droite passe-t-elle bien au milieu du nuage, ou est-elle tirée
#    vers le haut par quelques titres ?

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
df = pd.read_csv("mangas.csv")

`,
    },
    hints: [
      'plt.annotate(texte, (x, y), textcoords="offset points", xytext=(8, 6)) place une étiquette à côté d\'un point',
      'df.nlargest(3, \'popularite_millions\') donne les 3 plus gros vendeurs',
      'Pour une droite de tendance : a, b = np.polyfit(x, y, 1) puis plt.plot(x, a*x + b)',
    ],
    validation: { type: 'no-error' },
  },
  {
    type: 'code',
    title: 'Le test qui fait mal',
    content: `Tu as repéré One Piece, tout seul dans son coin : 105 tomes et 516 millions d'exemplaires, plus du double du deuxième.

**Question de méthode : est-ce que ce seul titre tient le résultat à lui tout seul ?**

Il y a un moyen simple de le savoir — on l'enlève et on recalcule.`,
    code: {
      decouverte: `import pandas as pd

df = pd.read_csv("mangas.csv")

r_tous = df['nb_volumes'].corr(df['popularite_millions'])
print(f"📈 Avec tout le monde      : r = {r_tous:.2f}")

# On retire UN SEUL manga
sans_op = df[df['titre'] != 'One Piece']
r_sans = sans_op['nb_volumes'].corr(sans_op['popularite_millions'])
print(f"📉 Sans One Piece          : r = {r_sans:.2f}")

# Et sans les 3 plus gros succès ?
tres_gros = df.nlargest(3, 'popularite_millions')['titre'].tolist()
sans_trois = df[~df['titre'].isin(tres_gros)]
r_trois = sans_trois['nb_volumes'].corr(sans_trois['popularite_millions'])
print(f"📉 Sans {', '.join(tres_gros)} : r = {r_trois:.2f}")

print(f"\\n⚠️ Retirer UN manga sur 66 fait perdre {r_tous - r_sans:.2f} point de corrélation.")
print("   Le lien existe toujours, mais il était en partie porté")
print("   par une poignée de phénomènes exceptionnels.")
print("\\n💡 Réflexe à garder : un résultat qui dépend d'un seul point")
print("   n'est pas un résultat solide. Teste toujours en retirant les extrêmes.")`,
      exploratrice: `import pandas as pd

df = pd.read_csv("mangas.csv")

r_tous = df['nb_volumes'].corr(df['popularite_millions'])
print(f"Avec tout le monde : r = {r_tous:.2f}")

# Crée un sous-ensemble SANS One Piece
sans_op = df[df['titre'] ___ 'One Piece']
r_sans = sans_op['nb_volumes'].___(sans_op['popularite_millions'])
print(f"Sans One Piece     : r = {r_sans:.2f}")

# De combien la corrélation a-t-elle baissé ?
print(f"Écart : {___ - ___:.2f}")

# À toi : retire aussi les 2 suivants et regarde ce qu'il reste.`,
      experte: `# 1. Calcule r sur l'ensemble du dataset
# 2. Recalcule-le en retirant un à un les mangas les plus vendus (1, 2, 3, 5, 10)
# 3. Trace l'évolution de r en fonction du nombre de titres retirés
# 4. À partir de combien de retraits le lien devient-il « modéré » (< 0.5) ?
# 5. Conclus : ce résultat est-il solide ou porté par quelques exceptions ?

import pandas as pd
import matplotlib.pyplot as plt
df = pd.read_csv("mangas.csv")

`,
    },
    hints: [
      'df[df[\'titre\'] != \'One Piece\'] garde toutes les lignes SAUF celle-là',
      'df[~df[\'titre\'].isin(liste)] exclut toutes les lignes dont le titre est dans la liste ; le ~ veut dire « non »',
      'Une corrélation qui s\'effondre quand on retire un point s\'appelle un résultat « non robuste »',
    ],
    validation: { type: 'output-contains', expected: 'r =' },
    explanation: `**0,74 → 0,61 en retirant un seul manga sur 66.** Et environ 0,57 en retirant les trois plus gros.

Le lien ne disparaît pas — il reste réel et modéré. Mais tu viens de découvrir une chose essentielle : **un coefficient de corrélation est sensible aux valeurs extrêmes**, exactement comme la moyenne dans la mission sur le tennis.

C'est pour ça qu'on ne publie jamais un r tout seul. On montre le nuage de points, et on teste ce qui se passe quand on retire les cas exceptionnels.`,
  },
  {
    type: 'learn',
    title: 'Le piège : corrélation ≠ causalité',
    content: `Tu as établi que longueur et ventes vont ensemble. La tentation est énorme d'en conclure : *« pour vendre, il faut faire long »*.

**C'est exactement l'erreur à ne pas commettre.** Quand A et B varient ensemble, il y a toujours au moins trois explications possibles :

**1. A cause B** — Les séries longues laissent le temps de s'attacher aux personnages, donc elles vendent plus.

**2. B cause A** — *L'inverse.* Un éditeur arrête une série qui ne se vend pas, et prolonge celle qui cartonne. Dans ce cas, ce ne sont pas les tomes qui créent les ventes : ce sont les ventes qui créent les tomes. On appelle ça la **causalité inverse**.

**3. Une troisième cause explique les deux** — Un auteur talentueux avec un bon éditeur produit à la fois une œuvre longue *et* populaire. La qualité expliquerait les deux, sans qu'elles se causent entre elles. On appelle ça un **facteur confondant**.

**Laquelle est la bonne, ici ?** Honnêtement : **on ne peut pas le savoir avec ces données.** L'explication 2 est très plausible — on sait que les éditeurs japonais arrêtent vite les séries qui ne marchent pas. Mais rien dans notre fichier ne permet de trancher.

Et c'est ça, le vrai message : **tes données te disent *que* deux choses sont liées. Elles ne te disent presque jamais *pourquoi*.** Pour établir une cause, il faudrait une expérience — publier au hasard des séries longues et courtes, puis comparer. Personne ne fera ça.

Le réflexe à prendre : chaque fois que tu lis « les gens qui font X réussissent mieux », demande-toi si ce n'est pas simplement que **ceux qui réussissent font X**.`,
  },
  {
    type: 'challenge',
    title: 'Défi : trouve un lien qui n\'existe pas',
    content: `On ne parle jamais des corrélations nulles. Pourtant, **découvrir qu'il n'y a aucun lien est un résultat scientifique à part entière** — souvent plus utile qu'un lien faible.

Explore les colonnes réelles et trouve une paire dont le *r* est quasiment nul. Puis explique ce que ça veut dire concrètement.`,
    code: {
      decouverte: `import pandas as pd

df = pd.read_csv("mangas.csv")

reelles = ['annee', 'nb_volumes', 'popularite_millions']

print("🔍 Toutes les corrélations entre colonnes réelles :\\n")
matrice = df[reelles].corr()
print(matrice.round(2))

print("\\n📊 Interprétation paire par paire :")
for i, a in enumerate(reelles):
    for b in reelles[i + 1:]:
        r = df[a].corr(df[b])
        if abs(r) > 0.7:
            verdict = "lien FORT"
        elif abs(r) > 0.4:
            verdict = "lien modéré"
        elif abs(r) > 0.2:
            verdict = "lien faible"
        else:
            verdict = "AUCUN lien"
        print(f"   {a:20s} vs {b:20s} r = {r:+.2f}  → {verdict}")

print("\\n💡 Regarde 'annee' vs 'nb_volumes' : r est quasiment nul.")
print("   Traduction : les mangas d'aujourd'hui ne sont ni plus longs")
print("   ni plus courts que ceux des années 80. L'époque ne change rien")
print("   à la longueur des séries.")
print("\\n   Ce 'rien' est un vrai résultat : il contredit l'idée reçue")
print("   que les séries modernes s'éterniseraient davantage.")`,
      exploratrice: `import pandas as pd

df = pd.read_csv("mangas.csv")

# Affiche la matrice de corrélation des 3 colonnes réelles
reelles = ['annee', 'nb_volumes', 'popularite_millions']
print(df[reelles].___().round(2))

# Trouve la paire dont le r est le plus proche de zéro
r_annee_volumes = df['annee'].corr(df['___'])
print(f"\\nannee vs nb_volumes : r = {r_annee_volumes:.2f}")

# Écris en une phrase ce que ce chiffre signifie concrètement :
print("Interprétation : ...")`,
      experte: `# 1. Matrice de corrélation complète, colonnes réelles ET synthétiques
# 2. Identifie une corrélation forte, une modérée et une quasi nulle
# 3. Pour chacune, propose les 3 explications causales possibles
#    (A→B, B→A, facteur confondant) et dis laquelle te semble la plus crédible
# 4. Piège : certaines colonnes de ce dataset sont synthétiques. Leurs
#    corrélations décrivent-elles les vrais mangas ? Justifie.

import pandas as pd
df = pd.read_csv("mangas.csv")

`,
    },
    hints: [
      'df[[\'a\',\'b\',\'c\']].corr() renvoie la matrice de toutes les corrélations deux à deux',
      'Sur la diagonale, r vaut toujours 1 : une colonne est parfaitement corrélée avec elle-même',
      'Un r proche de 0 ne veut pas dire « pas de relation du tout » — seulement « pas de relation LINÉAIRE ». Une relation en U donnerait aussi r ≈ 0.',
    ],
    validation: { type: 'output-contains', expected: 'annee' },
    explanation: `**Une corrélation nulle est une information.**

\`annee\` vs \`nb_volumes\` donne r ≈ 0,00 : la longueur des séries n'a pas changé depuis les années 80. Si quelqu'un affirme « les mangas s'éternisent de plus en plus aujourd'hui », tu as maintenant de quoi lui répondre avec un chiffre.

Attention toutefois à une limite importante : **r ne mesure que les relations *linéaires*.** Si deux variables suivaient une courbe en U — augmenter puis diminuer — le coefficient serait proche de zéro alors qu'il existe une relation très nette. C'est une raison de plus de toujours regarder le nuage de points.`,
  },
  {
    type: 'reflect',
    title: 'Le réflexe que tu emportes',
    content: `**Tu viens d'apprendre à mesurer un lien — et surtout à ne pas le surinterpréter.**

Ce que tu sais faire maintenant, tu vas le voir partout. Les titres du type *« les gens qui font X vivent plus longtemps »*, *« les élèves qui dorment plus réussissent mieux »*, *« les entreprises qui font Y sont plus rentables »* reposent tous sur une corrélation. Presque jamais sur une cause démontrée.

**Les trois questions à poser, dans l'ordre :**

1. **Quelle est la force du lien ?** Un r de 0,2 présenté comme une découverte, c'est du vent.

2. **Le résultat tient-il sans les cas extrêmes ?** Tu as vu 0,74 tomber à 0,61 en retirant un seul manga sur 66.

3. **Et si c'était l'inverse ?** C'est la question la plus puissante, et la plus rarement posée. Les séries longues vendent-elles mieux — ou les séries qui vendent bien sont-elles prolongées ?

Un exemple pour la route : on lit souvent que *les gens qui prennent un petit-déjeuner sont plus minces*. Causalité inverse plausible : les personnes qui font attention à leur poids ont aussi des horaires de repas réguliers. Facteur confondant plausible : le niveau de vie influence les deux. La corrélation est réelle ; la conclusion « il faut petit-déjeuner pour maigrir » ne l'est pas.

**Mesurer est facile. Interpréter est le vrai métier.**`,
  },
  {
    type: 'complete',
    title: 'Mission accomplie !',
    content: `🎉 **Bravo — tu sais maintenant lire une corrélation sans te faire avoir.**

**Ce que tu sais faire :**
- ✅ Calculer un coefficient de corrélation avec \`.corr()\`
- ✅ Lire sa force et son signe, et dire ce qu'il ne signifie *pas*
- ✅ Tester la robustesse d'un résultat en retirant les valeurs extrêmes
- ✅ Construire et lire une matrice de corrélation
- ✅ Proposer les trois explications causales d'un lien observé
- ✅ Reconnaître qu'une absence de lien est aussi un résultat

**Badge débloqué : 🔗 Chasseuse de corrélations**

Avec la mission sur le tennis, tu as maintenant les deux réflexes qui font la différence entre lire des chiffres et les comprendre vraiment.`,
  },
];
