import type { MissionStep } from '../index';

export const steps: MissionStep[] = [
  {
    type: 'intro',
    title: 'Ton enquête : qu\'est-ce qu\'un Pokémon « fort » ?',
    content: `**Jusqu\'ici, je te guidais pas à pas. Cette mission est différente : c\'est la tienne.**

Tu as appris à explorer, à mesurer, à visualiser, à classer et à te méfier des pièges. Tu as maintenant la boîte à outils complète d\'une data scientist. Il est temps de mener une **vraie enquête**, du début à la fin, sur un sujet que tout le monde croit connaître.

Voici **88 Pokémon** avec leurs **vraies statistiques de base**, celles des jeux : points de vie, attaque, défense, attaque et défense spéciales, vitesse. Plus leur type, leur génération, et s\'ils sont légendaires.

Une question simple en apparence : **qu\'est-ce qui fait qu\'un Pokémon est fort ?** Est-ce que « légendaire » veut dire « imbattable » ? Quel type domine ? Y a-t-il un prix à payer pour taper fort ?

Tu ne vas pas suivre une recette. Tu vas **enquêter**, et à la fin tu produiras un graphique dont tu seras fière.

**Ce que tu vas mobiliser :**
- Tout ce que tu sais déjà — exploration, statistiques, corrélation, visualisation
- Et une compétence nouvelle : **mener un projet complet toute seule**

💡 Les statistiques de ce fichier sont **réelles et canoniques** — un fan pourra les vérifier.`,
  },
  {
    type: 'hypothesis',
    title: 'Tes paris, avant de regarder',
    content: `Une bonne enquête commence par des hypothèses qu\'on écrit **avant** de voir les données. Engage-toi sur trois :

1. **« Légendaire » est-il synonyme de « plus fort » ?** Toujours, ou avec des exceptions ?
2. **Quel type te semble le plus puissant en moyenne ?** Dragon ? Psy ? Feu ?
3. **Taper fort a-t-il un prix ?** Un Pokémon très offensif est-il forcément fragile, ou lent ?

Note tes trois réponses. À la fin, tu verras lesquelles les données confirment — et lesquelles sont des idées reçues.`,
  },
  {
    type: 'code',
    title: 'Premier contact avec les données',
    content: `Avant toute question, il faut **connaître son terrain**. Charge le fichier, fabrique la statistique qui va tout structurer — le **total** des six stats — et regarde les extrêmes.`,
    code: {
      decouverte: `import pandas as pd

df = pd.read_csv("pokemon.csv")
print(f"⚡ {len(df)} Pokémon, {df.shape[1]} colonnes\\n")

# LA statistique clé : le total des 6 stats de base
stats = ['pv', 'attaque', 'defense', 'attaque_spe', 'defense_spe', 'vitesse']
df['total'] = df[stats].sum(axis=1)

print("🏆 Les 6 Pokémon les plus puissants :")
for _, p in df.nlargest(6, 'total').iterrows():
    leg = "⭐ légendaire" if p['legendaire'] == 1 else ""
    print(f"   {p['nom']:14s} total {p['total']}   {leg}")

print("\\n🪱 Les 5 plus faibles :")
for _, p in df.nsmallest(5, 'total').iterrows():
    print(f"   {p['nom']:14s} total {p['total']}")

# Les records, stat par stat
print("\\n📊 Les champions de chaque catégorie :")
for s in stats:
    champ = df.loc[df[s].idxmax()]
    print(f"   {s:13s} → {champ['nom']} ({champ[s]})")`,
      exploratrice: `import pandas as pd

df = pd.read_csv("pokemon.csv")
print(f"{len(df)} Pokémon\\n")

# Crée la colonne 'total' = somme des 6 stats
stats = ['pv', 'attaque', 'defense', 'attaque_spe', 'defense_spe', 'vitesse']
df['total'] = df[stats].___(axis=1)

# Les 6 plus puissants
print(df.___(6, 'total')[['nom', 'total', 'legendaire']])

# Les 5 plus faibles
print(df.nsmallest(5, '___')[['nom', 'total']])

# Qui a la plus grosse attaque ? la plus grosse défense ?
print("Attaque max :", df.loc[df['attaque'].idxmax(), 'nom'])
print("Defense max :", df.loc[df['___'].idxmax(), 'nom'])`,
      experte: `# Approprie-toi le dataset :
# 1. Charge pokemon.csv, crée la colonne 'total' (somme des 6 stats)
# 2. Top 10 et bottom 10 par total
# 3. Pour chacune des 6 stats, quel Pokémon détient le record ?
# 4. Combien de types différents ? Combien de légendaires ?
# 5. Note deux choses qui te surprennent — tu les creuseras ensuite.

import pandas as pd
df = pd.read_csv("pokemon.csv")

`,
    },
    hints: [
      'df[stats].sum(axis=1) additionne colonne par colonne, pour chaque ligne (axis=1 = horizontalement)',
      'df.loc[df[\'attaque\'].idxmax()] récupère la ligne entière du Pokémon à l\'attaque maximale',
      'df.nlargest(6, \'total\') et df.nsmallest(5, \'total\') pour les extrêmes',
    ],
    validation: { type: 'output-contains', expected: 'total' },
    explanation: `**Le haut du classement est occupé par des légendaires à 680 — mais garde l\'œil ouvert.**

Mewtwo, Lugia, Ho-Oh, Rayquaza, Dialga, Palkia culminent tous à exactement 680. Tout en bas, Chenipan et Magicarpe autour de 200 : des Pokémon qu\'il faut faire évoluer pour qu\'ils deviennent redoutables.

Les records par stat racontent déjà des histoires : Leveinard a 250 PV mais 5 en attaque, Onix a une défense de 160. **Aucun Pokémon n\'est bon partout.** C\'est exactement cette tension que tu vas explorer.`,
  },
  {
    type: 'learn',
    title: 'Ce qu\'est une enquête de données, pour de vrai',
    content: `Tu as tous les outils techniques. Ce qui fait une data scientist, ce n\'est pas de les connaître — c\'est de savoir **dans quel ordre les utiliser**. Une vraie enquête suit toujours le même fil :

**1. Une question claire.** Pas « regardons les données » mais « les légendaires sont-ils vraiment plus forts ? ». Une question à laquelle un chiffre peut répondre.

**2. Explorer et mesurer.** Calculer, comparer des moyennes, regarder les extrêmes. C\'est ce que tu viens de faire.

**3. Visualiser.** Un bon graphique montre en un coup d\'œil ce qu\'un tableau cache. C\'est souvent là que la vraie découverte surgit.

**4. Chercher la nuance.** La première réponse est presque toujours trop simple. « Oui, mais… » est la phrase préférée d\'une bonne analyste. Tu l\'as vu avec la moyenne (mission 2), la corrélation (mission 5), le R² (mission 6).

**5. Conclure honnêtement.** Dire ce que les données montrent, et ce qu\'elles ne montrent pas.

**Ce cycle, c\'est le métier.** Pas l\'algorithme compliqué : la démarche. Tu vas la dérouler en entier sur une vraie question — et tu verras que la nuance est au rendez-vous.`,
  },
  {
    type: 'code',
    title: 'Enquête : « légendaire » veut-il dire « imbattable » ?',
    content: `C\'est l\'idée reçue à tester. Compare les totaux des légendaires et des autres — puis **cherche la nuance**. Y a-t-il des Pokémon ordinaires qui rivalisent avec des légendaires ?`,
    code: {
      decouverte: `import pandas as pd

df = pd.read_csv("pokemon.csv")
stats = ['pv', 'attaque', 'defense', 'attaque_spe', 'defense_spe', 'vitesse']
df['total'] = df[stats].sum(axis=1)

leg = df[df['legendaire'] == 1]
ordi = df[df['legendaire'] == 0]

print("⭐ La réponse simple :")
print(f"   Légendaires : total moyen {leg['total'].mean():.0f}  ({len(leg)} Pokémon)")
print(f"   Les autres  : total moyen {ordi['total'].mean():.0f}  ({len(ordi)} Pokémon)")
print(f"   → Les légendaires sont bien plus puissants EN MOYENNE.\\n")

print("🔍 Mais cherchons la nuance. Les bornes se chevauchent-elles ?")
print(f"   Légendaire le plus FAIBLE : {leg.loc[leg['total'].idxmin(), 'nom']} ({leg['total'].min()})")
print(f"   Non-légendaire le plus FORT : {ordi.loc[ordi['total'].idxmax(), 'nom']} ({ordi['total'].max()})\\n")

# Les "presque-légendaires" : des Pokémon ordinaires au sommet
costauds = ordi[ordi['total'] >= 600].sort_values('total', ascending=False)
print(f"🐉 {len(costauds)} Pokémon NON légendaires atteignent 600 ou plus :")
for _, p in costauds.iterrows():
    print(f"   {p['nom']:14s} {p['total']}")

print("\\n💡 Verdict : 'légendaire' est un bon indice de puissance,")
print("   mais PAS une garantie. Les meilleurs Pokémon ordinaires")
print("   dépassent les légendaires les plus faibles.")`,
      exploratrice: `import pandas as pd

df = pd.read_csv("pokemon.csv")
stats = ['pv', 'attaque', 'defense', 'attaque_spe', 'defense_spe', 'vitesse']
df['total'] = df[stats].sum(axis=1)

# Sépare légendaires et non-légendaires
leg = df[df['legendaire'] == 1]
ordi = df[df['legendaire'] == ___]

# Compare les totaux moyens
print("Légendaires :", round(leg['total'].mean()))
print("Les autres  :", round(ordi['total'].___()))

# La nuance : le légendaire le plus faible vs le non-légendaire le plus fort
print("Légendaire le plus faible :", leg['total'].min())
print("Non-légendaire le plus fort :", ordi['total'].___())

# Les non-légendaires à 600 ou plus — qui sont-ils ?
print(ordi[ordi['total'] >= ___][['nom', 'total']])`,
      experte: `# Teste rigoureusement l'idée "légendaire = imbattable" :
# 1. Compare les totaux moyens, mais aussi les distributions (min, max, médiane)
# 2. Les intervalles se chevauchent-ils ? Quels non-légendaires battent
#    les légendaires les plus faibles ?
# 3. Si tu devais PRÉDIRE 'legendaire' à partir du total seul, à partir de
#    quel seuil te tromperais-tu le moins ? Combien d'erreurs ?
# 4. Conclus : le statut légendaire est-il une CAUSE de la puissance,
#    ou une étiquette posée par les créateurs du jeu sur des Pokémon
#    qu'ils ont voulus puissants ?

import pandas as pd
df = pd.read_csv("pokemon.csv")

`,
    },
    hints: [
      'df[df[\'legendaire\'] == 1] garde les légendaires, == 0 garde les autres',
      '.mean(), .min(), .max() sur une colonne te donnent les bornes à comparer',
      'df[df[\'total\'] >= 600] filtre les Pokémon dont le total atteint 600',
    ],
    validation: { type: 'output-contains', expected: 'moyen' },
    explanation: `**Légendaires ≈ 647 de moyenne, les autres ≈ 440. L\'écart est énorme — et pourtant.**

Les légendaires les plus faibles (les oiseaux Artikodin, Électhor, Sulfura à 580) sont **dépassés** par les meilleurs Pokémon ordinaires : Dracolosse, Tyranocif, Métalosse et Carchacrok, tous à 600. Les joueurs les appellent les « pseudo-légendaires ».

Tu retrouves ici, sur un sujet ludique, la leçon de la mission 7 : **une étiquette n\'est pas une cause.** « Légendaire » n\'a pas rendu Mewtwo puissant — les créateurs du jeu ont décidé de donner à certains Pokémon un rôle spécial *et* de grosses stats. La corrélation est forte, mais raconter l\'histoire à l\'envers serait une erreur.`,
  },
  {
    type: 'code',
    title: 'Le graphique qui raconte l\'histoire',
    content: `Une enquête se termine par **une image qu\'on peut montrer**. Construis un graphique qui répond à ta deuxième question : *quel type est le plus puissant ?*

Quand il te plaît, utilise le bouton **⬇️ Télécharger** sous le graphique — tu auras produit ta première visualisation de data scientist.`,
    code: {
      decouverte: `import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("pokemon.csv")
stats = ['pv', 'attaque', 'defense', 'attaque_spe', 'defense_spe', 'vitesse']
df['total'] = df[stats].sum(axis=1)

# Total moyen par type principal, pour les types ayant au moins 3 Pokémon
par_type = df.groupby('type1')['total'].agg(['mean', 'count'])
par_type = par_type[par_type['count'] >= 3].sort_values('mean')

plt.figure(figsize=(10, 7))
couleurs = plt.cm.plasma([i / len(par_type) for i in range(len(par_type))])
plt.barh(par_type.index, par_type['mean'], color=couleurs)
plt.xlabel('Total de stats moyen →')
plt.title('Quel type de Pokémon est le plus puissant ?')
for i, (nom, ligne) in enumerate(par_type.iterrows()):
    plt.text(ligne['mean'] + 4, i, f"{ligne['mean']:.0f}", va='center', fontsize=9)
plt.tight_layout()
plt.show()

print("🏆 Classement des types par puissance moyenne :")
for nom, ligne in par_type.sort_values('mean', ascending=False).iterrows():
    print(f"   {nom:10s} {ligne['mean']:.0f}  (sur {int(ligne['count'])} Pokémon)")

print("\\n💡 Psy et Dragon dominent — mais regarde le nombre de Pokémon.")
print("   Psy ne compte que 5 Pokémon, dont Mewtwo, Mew et Lugia :")
print("   quelques stars tirent toute la moyenne vers le haut.")`,
      exploratrice: `import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("pokemon.csv")
stats = ['pv', 'attaque', 'defense', 'attaque_spe', 'defense_spe', 'vitesse']
df['total'] = df[stats].sum(axis=1)

# Total moyen par type (types avec au moins 3 Pokémon)
par_type = df.groupby('___')['total'].agg(['mean', 'count'])
par_type = par_type[par_type['count'] >= 3].sort_values('mean')

# Graphique en barres horizontales
plt.figure(figsize=(10, 7))
plt.barh(par_type.index, par_type['___'])
plt.xlabel('Total moyen')
plt.title('Puissance moyenne par type')
plt.show()

# Affiche le classement
print(par_type.sort_values('mean', ascending=False))`,
      experte: `# Produis UN graphique qui répond à une de tes trois hypothèses de départ.
# Quelques pistes (choisis, ne fais pas tout) :
#  - total moyen par type, en gérant le piège des types à peu d'effectifs
#  - nuage attaque vs vitesse, couleur = légendaire ou non
#  - distribution des totaux : où se situe la "barre" des pseudo-légendaires ?
# Soigne les titres et les axes : ce graphique doit pouvoir être montré
# sans explication. Puis télécharge-le.

import pandas as pd
import matplotlib.pyplot as plt
df = pd.read_csv("pokemon.csv")

`,
    },
    hints: [
      'df.groupby(\'type1\')[\'total\'].agg([\'mean\', \'count\']) donne moyenne ET effectif par type',
      'On filtre les types rares (count >= 3) pour ne pas comparer un type d\'un seul Pokémon aux autres',
      'plt.barh(labels, valeurs) fait des barres horizontales, plus lisibles quand les étiquettes sont des mots',
    ],
    validation: { type: 'no-error' },
    explanation: `**Psy et Dragon arrivent en tête — mais tu as maintenant le réflexe de regarder les effectifs.**

Le type Psy ne compte que 5 Pokémon dans ce fichier, et trois d\'entre eux sont Mewtwo, Mew et Lugia. Sa « domination » tient à une poignée de stars. C\'est exactement le piège de la mission 2 : **une moyenne calculée sur peu de cas, dominée par quelques extrêmes, ne décrit pas grand-chose.**

Un type comme Eau, avec 16 Pokémon du plus faible au plus fort, a une moyenne bien plus représentative. Savoir ça — lire une moyenne avec son effectif — c\'est précisément ce qui te distingue de quelqu\'un qui prend le classement pour argent comptant.`,
  },
  {
    type: 'challenge',
    title: 'Défi : mène ta propre enquête',
    content: `Plus de code pré-écrit. **À toi de poser une question et d\'y répondre**, comme une vraie data scientist.

Reprends ta troisième hypothèse — *taper fort a-t-il un prix ?* — ou invente la tienne. Explore, calcule, trace. Produis une réponse chiffrée **et** un graphique que tu pourrais montrer à quelqu\'un.

C\'est le moment où tu arrêtes de suivre et où tu deviens l\'enquêtrice.`,
    code: {
      decouverte: `import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("pokemon.csv")
stats = ['pv', 'attaque', 'defense', 'attaque_spe', 'defense_spe', 'vitesse']
df['total'] = df[stats].sum(axis=1)

# ENQUÊTE : les gros attaquants sont-ils plus lents ou plus fragiles ?

# 1. Un chiffre : attaque et vitesse varient-elles ensemble ?
print("Corrélation attaque / vitesse :", round(df['attaque'].corr(df['vitesse']), 2))
print("Corrélation attaque / defense :", round(df['attaque'].corr(df['defense']), 2))

# 2. Un graphique : chaque Pokémon placé selon attaque et vitesse
plt.figure(figsize=(10, 7))
couleur = df['legendaire'].map({0: '#8888a8', 1: '#f59e0b'})
plt.scatter(df['attaque'], df['vitesse'], c=couleur, s=60, alpha=0.8)

# On nomme quelques Pokémon connus
for nom in ['Mackogneur', 'Voltali', 'Leviator', 'Onix', 'Mewtwo']:
    p = df[df['nom'] == nom]
    if len(p):
        plt.annotate(nom, (p['attaque'].values[0], p['vitesse'].values[0]),
                     textcoords="offset points", xytext=(6, 4), fontsize=9)

plt.xlabel('Attaque →')
plt.ylabel('Vitesse →')
plt.title('Attaque contre vitesse  (orange = légendaire)')
plt.show()

print("\\n👀 Que vois-tu ? Y a-t-il une zone VIDE en haut à droite")
print("   (très fort ET très rapide) ? Ce sont souvent les légendaires")
print("   qui s'y aventurent. Les autres doivent choisir.")`,
      exploratrice: `import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("pokemon.csv")
stats = ['pv', 'attaque', 'defense', 'attaque_spe', 'defense_spe', 'vitesse']
df['total'] = df[stats].sum(axis=1)

# Choisis DEUX stats à confronter (attaque/vitesse, attaque/defense, pv/vitesse...)
x = '___'
y = '___'

# Le chiffre
print(f"Corrélation {x} / {y} :", round(df[x].corr(df[y]), 2))

# Le graphique
plt.figure(figsize=(10, 7))
plt.scatter(df[x], df[y], alpha=0.7)
plt.xlabel(x)
plt.ylabel(y)
plt.title(f"{x} contre {y}")
plt.show()

# Que conclus-tu ? Y a-t-il un compromis, ou aucun lien ?`,
      experte: `# Ton enquête, ta question, ton graphique.
# Exemples de vraies questions qu'on peut trancher avec ce fichier :
#  - Les Pokémon de première génération sont-ils plus faibles que les récents ?
#  - Existe-t-il un "compromis" universel offensif/défensif ?
#  - Peut-on deviner le type d'un Pokémon à partir de ses stats ? (k-NN, mission 4)
#  - Quels Pokémon sont des "anomalies" (très loin de la moyenne de leur type) ?
# Attendu : une question claire, une mesure, un graphique présentable,
# et deux phrases de conclusion honnête — dont au moins un "oui, mais".

import pandas as pd
import matplotlib.pyplot as plt
df = pd.read_csv("pokemon.csv")

`,
    },
    hints: [
      'df[x].corr(df[y]) mesure le lien entre deux stats ; proche de 0 = pas de compromis net',
      'df[\'legendaire\'].map({0: couleurA, 1: couleurB}) colore les points selon le statut',
      'Une "zone vide" sur un nuage de points est une information : elle montre une combinaison que presque aucun Pokémon n\'atteint',
    ],
    validation: { type: 'no-error' },
    explanation: `**Tu viens de mener un projet de data science complet. Mesure le chemin parcouru.**

Tu es partie d\'une question, tu as exploré, visualisé, trouvé la nuance, conclu honnêtement — et tu as produit un graphique montrable. Personne ne t\'a dit quelle ligne écrire dans le défi. **Tu as fait ce que fait une data scientist devant un jeu de données qu\'elle découvre.**

Et le sujet n\'a aucune importance : la démarche que tu viens d\'appliquer à des Pokémon est, trait pour trait, celle qu\'on applique à des dossiers médicaux, des ventes, des capteurs climatiques. Le terrain change, la méthode non.`,
  },
  {
    type: 'reflect',
    title: 'Tu sais faire de la data science',
    content: `**Ce n\'est plus une formule de politesse : tu sais vraiment faire.**

Regarde ce que tu as accompli en neuf missions. Tu as exploré des données brutes, démasqué des graphiques trompeurs, écrit des programmes, construit une IA, mesuré des liens sans les confondre avec des causes, prédit des valeurs, audité un algorithme pour injustice, découvert des structures cachées — et aujourd\'hui, mené une enquête complète en autonomie.

**C\'est le programme d\'une vraie formation en data science**, en miniature. Pas un aperçu : les vrais gestes, sur de vraies données.

Alors pose-toi la question pour de bon, maintenant que tu sais de quoi il s\'agit : **est-ce que ça t\'a plu ?** Pas « est-ce que c\'était facile » — est-ce que la sensation de faire parler des chiffres, de trouver le « oui, mais », de produire un graphique qui dit quelque chose… est-ce que ça t\'a accrochée ?

Si oui, tu viens de découvrir qu\'un métier entier consiste à faire exactement ça, toute la journée, sur des sujets qui comptent. La page **🧭 Horizons** te montre lesquels, et comment y arriver après le bac.

Et si tu hésites encore : c\'est normal, et tu as tout le temps. Mais tu ne partiras plus de zéro. Tu as déjà écrit ta première IA et mené ta première enquête. Peu de personnes de ton âge peuvent en dire autant.`,
  },
  {
    type: 'complete',
    title: 'Enquête bouclée — et parcours accompli !',
    content: `🎉 **Bravo. Tu as mené un projet de data science complet, toute seule.**

**Ce que tu sais faire, au terme de ce parcours :**
- ✅ Explorer un jeu de données inconnu et en tirer les premières vérités
- ✅ Mener une enquête : question → exploration → visualisation → nuance → conclusion
- ✅ Te méfier des moyennes, des étiquettes et des idées reçues
- ✅ Produire un graphique présentable à partir de rien
- ✅ Reconnaître que la démarche compte plus que l\'outil

**Badge débloqué : 🎓 Maîtresse des données**

Tu as terminé les neuf missions de DATA LAB. Tu es passée de « je n\'ai jamais écrit de Python » à « j\'ai construit une IA et mené ma propre enquête ».

La suite, si elle te tente, ne s\'écrit plus ici : elle s\'appelle les études supérieures. Va voir la page **🧭 Horizons** pour découvrir où ce chemin peut te mener.`,
  },
];
