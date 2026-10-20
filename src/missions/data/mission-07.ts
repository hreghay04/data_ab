import type { MissionStep } from '../index';

export const steps: MissionStep[] = [
  {
    type: 'intro',
    title: 'L\'algorithme qui trie les dossiers',
    content: `**Une formation sélective reçoit trop de dossiers. Elle décide d'entraîner un algorithme sur les décisions des jurys passés.**

L'idée paraît raisonnable : la machine apprend ce que faisaient les humains, et le fait plus vite. L'école ajoute même une garantie :

> *« Notre algorithme est équitable : il ne regarde même pas le lycée d'origine des candidats. »*

Tu vas auditer ce système. Et découvrir que cette garantie ne vaut rien.

**Ce que tu vas apprendre :**
- Comment un modèle hérite des biais de ses données d'entraînement
- Pourquoi cacher une variable sensible ne suffit pas à rendre un modèle juste
- Ce qu'est une **variable proxy**
- Comment mesurer l'équité d'un modèle, et ce que ça coûte de la corriger

C'est la mission la plus importante du parcours. Pas parce qu'elle est difficile — tu réutiliseras le k-NN de la mission 4 — mais parce que c'est exactement le travail que font aujourd'hui les équipes qui auditent les IA.

⚠️ **Ces 300 candidats sont une simulation**, construite pour démontrer un mécanisme. Ce ne sont pas des données réelles et cela ne décrit aucune formation existante. Le mécanisme, lui, est parfaitement réel.`,
  },
  {
    type: 'hypothesis',
    title: 'Ton intuition sur l\'équité',
    content: `L'école affirme que son algorithme est équitable parce qu'il ignore le lycée d'origine.

**Qu'en penses-tu ?**

- Si un modèle ne voit pas une information, peut-il quand même en tenir compte ?
- Si les décisions passées des jurys étaient injustes, que va apprendre un modèle entraîné dessus ?
- Comment t'y prendrais-tu, concrètement, pour vérifier si un algorithme est juste ?

Note tes réponses. La troisième question est la plus importante : **« être juste » doit se traduire en un calcul**, sinon ce n'est qu'une opinion.`,
  },
  {
    type: 'code',
    title: 'Le constat',
    content: `Avant de toucher à l'algorithme, regarde les **décisions humaines** qui vont lui servir de modèle.

Deux questions à trancher avec des chiffres :
1. Les deux groupes sont-ils admis dans les mêmes proportions ?
2. Si non — est-ce que ça s'explique par un niveau différent ?`,
    code: {
      decouverte: `import pandas as pd

df = pd.read_csv("candidats.csv")
print(f"📋 {len(df)} dossiers\\n")
print(df.head(6))

# 1. Qui est admis ?
print("\\n🎓 Taux d'admission par type de lycée :")
for lycee, groupe in df.groupby('lycee'):
    print(f"   {lycee:7s} : {groupe['admis'].mean():.0%} admis  ({len(groupe)} candidats)")

# 2. Est-ce que le NIVEAU explique cet écart ?
print("\\n📊 Niveau moyen de chaque groupe :")
print(df.groupby('lycee')[['moyenne_generale', 'moyenne_maths', 'lettre_score']].mean().round(2))

print("\\n❗ Les moyennes sont quasiment identiques.")
print("   L'écart d'admission ne vient donc PAS du niveau.")

# 3. Le test qui tranche : à notes égales, que se passe-t-il ?
print("\\n🔬 Taux d'admission À NIVEAU ÉGAL :")
print(f"   {'Moyenne':<12} {'Urbain':>10} {'Rural':>10}")
for bas, haut in [(12, 13), (13, 14), (14, 15), (15, 16), (16, 20)]:
    tranche = df[(df['moyenne_generale'] >= bas) & (df['moyenne_generale'] < haut)]
    ligne = f"   {bas}–{haut}        "
    for lycee in ['Urbain', 'Rural']:
        sous = tranche[tranche['lycee'] == lycee]
        ligne += f"{sous['admis'].mean():>9.0%} " if len(sous) > 0 else f"{'—':>10}"
    print(ligne)

print("\\n⚠️ Voilà la preuve : à notes équivalentes, les candidats ruraux")
print("   sont bien moins souvent admis. Le jury était biaisé.")`,
      exploratrice: `import pandas as pd

df = pd.read_csv("candidats.csv")
print(df.head(6))

# Taux d'admission par type de lycée
print(df.groupby('___')['admis'].___())

# Le niveau moyen de chaque groupe — est-il différent ?
print(df.groupby('lycee')[['moyenne_generale', 'moyenne_maths']].mean().round(2))

# À niveau égal : garde les candidats entre 14 et 15 de moyenne
tranche = df[(df['moyenne_generale'] >= 14) & (df['moyenne_generale'] < ___)]
print("\\nEntre 14 et 15 de moyenne :")
print(tranche.groupby('lycee')['admis'].mean())

# Que conclus-tu ?`,
      experte: `# 1. Compare les taux d'admission entre lycées urbains et ruraux
# 2. Vérifie si un écart de NIVEAU pourrait justifier cet écart d'admission
# 3. Découpe la moyenne générale en tranches et compare les taux à niveau égal
# 4. Regarde aussi l'accès à l'option maths : est-il réparti également ?
# 5. Conclus : l'écart est-il explicable par le mérite, ou par autre chose ?

import pandas as pd
df = pd.read_csv("candidats.csv")

`,
    },
    hints: [
      'df.groupby(\'lycee\')[\'admis\'].mean() donne le taux d\'admission de chaque groupe (admis vaut 0 ou 1)',
      'Pour une tranche : df[(df[\'col\'] >= 14) & (df[\'col\'] < 15)] — attention aux parenthèses autour de chaque condition',
      'Compare aussi df.groupby(\'lycee\')[\'option_maths\'].mean() : l\'accès à l\'option est-il le même partout ?',
    ],
    validation: { type: 'output-contains', expected: 'admis' },
    explanation: `**Les deux groupes ont le même niveau, mais pas le même sort.**

Les moyennes sont quasi identiques (environ 12,9 des deux côtés), et pourtant 43 % des urbains sont admis contre 26 % des ruraux. À notes égales, l'écart est encore plus net : dans la tranche 14–15, environ 90 % des urbains passent contre la moitié des ruraux.

Ces décisions ne sont pas des données neutres : **ce sont les traces d'une injustice passée.** Et c'est précisément ce qu'on s'apprête à donner à apprendre à une machine.`,
  },
  {
    type: 'learn',
    title: 'Comment un modèle hérite d\'un biais',
    content: `Voici le malentendu le plus répandu sur l'intelligence artificielle.

**Un modèle n'apprend pas ce qui est vrai. Il apprend à reproduire ce qu'on lui a montré.**

Dans la mission 4, ton k-NN apprenait à reconnaître des genres de mangas. Il n'avait aucune idée de ce qu'est un manga : il copiait les étiquettes de ses voisins. Ici, c'est pareil — sauf que les étiquettes qu'on lui donne sont des **décisions humaines biaisées**.

Le modèle va donc apprendre, très efficacement, à être injuste de la même façon. Et il le fera avec deux aggravations :

**1. À grande échelle.** Un jury biaisé traite quelques centaines de dossiers. Un algorithme en traite des millions, de façon parfaitement cohérente.

**2. Avec une apparence d'objectivité.** « C'est l'algorithme qui a décidé » sonne neutre et incontestable. Un candidat refusé ne peut pas plaider sa cause auprès d'une fonction Python.

**Et l'argument de l'école ?** Elle dit : *« on ne regarde pas le lycée, donc on ne peut pas discriminer dessus. »*

Cette idée a un nom en recherche — *fairness through unawareness*, l'équité par l'ignorance — et on sait depuis longtemps qu'**elle ne marche pas**. La raison est simple : dans des données réelles, une variable sensible laisse presque toujours des traces dans d'autres variables qui, elles, restent visibles.

Ces traces s'appellent des **variables proxy**. Tu vas en démasquer une.`,
  },
  {
    type: 'code',
    title: 'Le modèle « équitable » de l\'école',
    content: `Construis exactement le système que l'école décrit : un k-NN entraîné sur les décisions passées, **sans jamais lui montrer le lycée d'origine**.

Puis audite-le sur deux critères : **est-il performant ?** et **est-il juste ?**

Chaque candidat est évalué par un modèle entraîné sur tous les autres — jamais sur lui-même.`,
    code: {
      decouverte: `import pandas as pd
import numpy as np

df = pd.read_csv("candidats.csv")

# Le lycée est VOLONTAIREMENT absent : c'est la promesse de l'école.
variables = ['moyenne_generale', 'moyenne_maths', 'option_maths', 'lettre_score']
X = df[variables].values.astype(float)
y = df['admis'].values
X = (X - X.mean(axis=0)) / X.std(axis=0)


def predire_tous(X, y, k=7):
    """Chaque candidat est jugé par les k autres qui lui ressemblent le plus."""
    predictions = []
    for i in range(len(X)):
        distances = np.sqrt(((X - X[i]) ** 2).sum(axis=1))
        distances[i] = np.inf          # on ne se compare pas à soi-même
        voisins = np.argsort(distances)[:k]
        predictions.append(1 if y[voisins].mean() >= 0.5 else 0)
    return np.array(predictions)


pred = predire_tous(X, y)
df['prediction'] = pred

# --- Critère 1 : est-il performant ? ---
precision = (pred == y).mean()
refuser_tout = 1 - y.mean()
print(f"✅ Précision du modèle : {precision:.0%}")
print(f"   (une machine qui refuserait tout le monde ferait {refuser_tout:.0%})")
print("   → Le modèle est donc vraiment bon, pas juste chanceux.\\n")

# --- Critère 2 : est-il juste ? ---
print("⚖️ Taux d'admission décidé par le MODÈLE :")
for lycee, groupe in df.groupby('lycee'):
    print(f"   {lycee:7s} : {groupe['prediction'].mean():.0%}")

taux = df.groupby('lycee')['prediction'].mean()
ecart = taux['Urbain'] - taux['Rural']
print(f"\\n   Écart : {ecart:+.0%}")

print("\\n❗ Le modèle n'a JAMAIS vu la colonne 'lycee'.")
print("   Et pourtant il reproduit presque tout l'écart des jurys humains.")
print("\\n   Comment est-ce possible ? C'est la question de l'étape suivante.")`,
      exploratrice: `import pandas as pd
import numpy as np

df = pd.read_csv("candidats.csv")

# On n'inclut PAS 'lycee' : c'est la promesse de l'école
variables = ['moyenne_generale', 'moyenne_maths', 'option_maths', 'lettre_score']
X = df[variables].values.astype(float)
y = df['admis'].values
X = (X - X.mean(axis=0)) / X.std(axis=0)


def predire_tous(X, y, k=7):
    predictions = []
    for i in range(len(X)):
        distances = np.sqrt(((X - X[i]) ** 2).sum(axis=1))
        distances[i] = np.inf
        voisins = np.argsort(distances)[:___]
        predictions.append(1 if y[voisins].mean() >= 0.5 else 0)
    return np.array(predictions)


df['prediction'] = predire_tous(X, y)

# La précision du modèle
print("Précision :", round((df['prediction'] == y).___(), 2))

# Le taux d'admission qu'il accorde à chaque groupe
print(df.groupby('___')['prediction'].mean())

# L'écart est-il proche de zéro ?`,
      experte: `# 1. Entraîne un k-NN sur 'admis' SANS utiliser la colonne 'lycee'
#    (évaluation : chaque candidat jugé par les autres, pas par lui-même)
# 2. Mesure sa précision, et compare-la à une baseline
# 3. Mesure le taux d'admission qu'il accorde à chaque groupe
# 4. Mesure aussi le taux de faux refus par groupe : parmi les candidats
#    réellement admis par le jury, combien le modèle refuse-t-il, de chaque côté ?
# 5. Lequel de ces deux indicateurs te semble le plus pertinent pour juger l'équité ?

import pandas as pd
import numpy as np
df = pd.read_csv("candidats.csv")

`,
    },
    hints: [
      'distances[i] = np.inf empêche un candidat d\'être son propre voisin',
      'y[voisins].mean() >= 0.5 réalise le vote majoritaire parmi les k voisins',
      '(pred == y).mean() donne la proportion de prédictions correctes',
      'df.groupby(\'lycee\')[\'prediction\'].mean() donne le taux d\'admission accordé par le modèle à chaque groupe',
    ],
    validation: { type: 'output-contains', expected: 'Précision' },
    explanation: `**88 % de précision, et 12 points d'écart entre les deux groupes.**

Relis ces deux chiffres ensemble, parce qu'ils sont le cœur de la mission : **ce modèle est à la fois excellent et injuste.** Aucun test de performance ne l'aurait signalé. Il faut chercher l'injustice exprès pour la trouver.

Et il n'a jamais vu la colonne \`lycee\`. La promesse de l'école était donc sincère — et sans effet.`,
  },
  {
    type: 'code',
    title: 'Démasque la variable proxy',
    content: `Le modèle ne voit pas le lycée. Il voit pourtant quelque chose qui y ressemble beaucoup.

**Cherche quelle variable visible est anormalement liée au lycée d'origine.** Puis retire-la et recommence l'audit.`,
    code: {
      decouverte: `import pandas as pd
import numpy as np

df = pd.read_csv("candidats.csv")

# Quelle variable trahit le lycée d'origine ?
print("🔎 Moyenne de chaque variable selon le lycée :")
print(df.groupby('lycee')[['moyenne_generale', 'moyenne_maths',
                           'lettre_score', 'option_maths']].mean().round(2))

print("\\n❗ Les notes sont identiques… mais pas l'accès à l'option maths :")
for lycee, groupe in df.groupby('lycee'):
    print(f"   {lycee:7s} : {groupe['option_maths'].mean():.0%} ont l'option")

print("\\n   Ce n'est pas une question de mérite : beaucoup de petits lycées")
print("   ne PROPOSENT tout simplement pas cette option.")
print("   → 'option_maths' est donc un PROXY du lycée d'origine.")


def auditer(variables, nom, k=7):
    X = df[variables].values.astype(float)
    y = df['admis'].values
    X = (X - X.mean(axis=0)) / X.std(axis=0)
    pred = []
    for i in range(len(X)):
        d = np.sqrt(((X - X[i]) ** 2).sum(axis=1))
        d[i] = np.inf
        pred.append(1 if y[np.argsort(d)[:k]].mean() >= 0.5 else 0)
    pred = np.array(pred)
    tmp = df.copy()
    tmp['p'] = pred
    taux = tmp.groupby('lycee')['p'].mean()
    ecart = taux['Urbain'] - taux['Rural']
    print(f"   {nom:34s} précision {(pred == y).mean():.0%}   écart {ecart:+.0%}")
    return ecart


print("\\n⚖️ Audit comparatif :")
auditer(['moyenne_generale', 'moyenne_maths', 'option_maths', 'lettre_score'],
        'avec option_maths')
auditer(['moyenne_generale', 'moyenne_maths', 'lettre_score'],
        'SANS option_maths')

print("\\n✅ En retirant le proxy, l'écart se referme.")
print("   Et la précision ne perd que quelques points.")
print("   L'équité n'a presque rien coûté ici — ce n'est pas toujours le cas.")`,
      exploratrice: `import pandas as pd
import numpy as np

df = pd.read_csv("candidats.csv")

# Cherche quelle variable est liée au lycée d'origine
print(df.groupby('lycee')[['moyenne_generale', 'moyenne_maths',
                           'lettre_score', '___']].mean().round(2))

# Laquelle diffère beaucoup entre les deux groupes ?


def auditer(variables, k=7):
    X = df[variables].values.astype(float)
    y = df['admis'].values
    X = (X - X.mean(axis=0)) / X.std(axis=0)
    pred = []
    for i in range(len(X)):
        d = np.sqrt(((X - X[i]) ** 2).sum(axis=1))
        d[i] = np.inf
        pred.append(1 if y[np.argsort(d)[:k]].mean() >= 0.5 else 0)
    tmp = df.copy()
    tmp['p'] = np.array(pred)
    taux = tmp.groupby('lycee')['p'].mean()
    print(f"  précision {(np.array(pred) == y).mean():.0%}  écart {taux['Urbain'] - taux['Rural']:+.0%}")


print("Avec le proxy :")
auditer(['moyenne_generale', 'moyenne_maths', 'option_maths', 'lettre_score'])
print("Sans le proxy :")
auditer(['moyenne_generale', 'moyenne_maths', '___'])`,
      experte: `# 1. Identifie la variable proxy : laquelle prédit le mieux le lycée d'origine ?
#    (astuce : tu peux entraîner un k-NN à prédire 'lycee' à partir des autres colonnes)
# 2. Mesure à quel point elle est prédictive du lycée
# 3. Compare l'audit du modèle avec et sans cette variable
# 4. Mesure ce que coûte l'équité en précision
# 5. Question ouverte : retirer l'option est-il vraiment juste envers les élèves
#    urbains qui l'ont réellement suivie et y ont travaillé ? Argumente.

import pandas as pd
import numpy as np
df = pd.read_csv("candidats.csv")

`,
    },
    hints: [
      'Compare df.groupby(\'lycee\')[\'option_maths\'].mean() entre les deux groupes : l\'écart est énorme',
      'Une variable proxy est une variable qui, sans être la variable sensible, permet de la deviner',
      'Pour mesurer le coût de l\'équité : compare la précision avant et après retrait du proxy',
    ],
    validation: { type: 'output-contains', expected: 'écart' },
    explanation: `**\`option_maths\` était le proxy.** 61 % des candidats urbains l'ont contre 28 % des ruraux — non pas parce qu'ils sont meilleurs, mais parce que leur lycée la **propose**.

En apprenant « ceux qui ont l'option sont admis », le modèle apprenait en réalité « ceux qui viennent d'un gros lycée sont admis ». Cacher la colonne \`lycee\` n'y changeait rien : l'information passait par la porte de derrière.

En retirant le proxy, l'écart se referme et la précision ne perd que **4 points** (88 % → 84 %). Retiens cet ordre de grandeur : on présente souvent l'équité comme un sacrifice énorme de performance. Ce n'est pas ce que montrent les chiffres ici.

Mais attention à ne pas croire le problème résolu pour autant. Tu as corrigé **ce** proxy. Dans des données réelles, il y en a souvent plusieurs, parfois impossibles à retirer — le code postal, l'établissement, le prénom, le vocabulaire d'une lettre de motivation.`,
  },
  {
    type: 'reflect',
    title: 'Le métier qui n\'existait pas il y a dix ans',
    content: `**Tu viens de faire un audit d'équité algorithmique. C'est un vrai métier, et il manque de monde.**

Reprends ce que tu as démontré, étape par étape :

1. Les décisions humaines passées étaient biaisées — tu l'as prouvé en comparant **à niveau égal**.
2. Un modèle entraîné dessus reproduit ce biais, en le passant à l'échelle.
3. **Cacher la variable sensible ne protège de rien**, parce que des proxys la remplacent.
4. On peut mesurer l'injustice, et souvent la réduire pour un coût modeste.
5. Mais « juste » reste une **décision humaine**, pas un calcul automatique.

Ce dernier point mérite qu'on s'y arrête. Tu as égalisé les taux d'admission entre groupes. Est-ce vraiment *la* définition de l'équité ? Les chercheurs en ont formalisé plusieurs — égaliser les taux d'admission, égaliser les taux d'erreur, traiter identiquement les profils identiques — et on a démontré mathématiquement qu'**elles sont incompatibles entre elles**. On ne peut pas toutes les satisfaire en même temps.

Autrement dit : **aucune équation ne dira à ta place ce qui est juste.** Il faut choisir, assumer, et expliquer. C'est une responsabilité, pas un calcul.

Et c'est pour ça que ce domaine a besoin de gens qui savent faire les deux : coder le modèle **et** poser la question qui dérange. Les mêmes systèmes décident aujourd'hui de dossiers scolaires, de crédits bancaires, de diagnostics médicaux, de CV filtrés avant tout regard humain.

La prochaine fois que tu entendras « c'est l'algorithme qui a décidé », tu sauras maintenant quoi demander : **sur quelles décisions passées a-t-il appris, et qui a vérifié ce qu'il en a retenu ?**`,
  },
  {
    type: 'complete',
    title: 'Mission accomplie !',
    content: `🎉 **Bravo — tu as mené un audit d'équité complet.**

**Ce que tu sais faire :**
- ✅ Montrer qu'un écart n'est pas explicable par le mérite, en comparant à niveau égal
- ✅ Expliquer pourquoi un modèle hérite des biais de ses données
- ✅ Mesurer l'équité d'un modèle, et pas seulement sa précision
- ✅ Démasquer une variable proxy
- ✅ Chiffrer ce que coûte une correction
- ✅ Expliquer pourquoi « équitable » n'a pas de définition unique

**Badge débloqué : ⚖️ Auditrice d'algorithmes**

Tu sais désormais qu'un modèle à 88 % de précision peut être inacceptable, et pourquoi. C'est exactement ce qui sépare quelqu'un qui *utilise* l'IA de quelqu'un qui en est *responsable*.`,
  },
];
