import type { MissionStep } from '../index';

export const steps: MissionStep[] = [
  {
    type: 'intro',
    title: 'Les études longues rapportent-elles vraiment plus ?',
    content: `**Tu es en Terminale. On te répète qu'il faut « faire des études ». Et si tu vérifiais toi-même ?**

Dans la mission précédente, tu as appris à *mesurer* un lien. Maintenant tu vas apprendre à le **transformer en prédiction** : combien gagne-t-on, en moyenne, après *n* années d'études ?

L'outil s'appelle la **régression linéaire**. C'est le modèle le plus utilisé au monde — en économie, en médecine, en sciences sociales. Et il tient en une ligne de code.

Tu vas découvrir trois choses :
- Les études **comptent vraiment** — tu vas chiffrer combien, par année
- Mais elles n'expliquent **qu'une partie** de l'écart entre les métiers
- Et les exceptions sont souvent plus instructives que la règle

⚠️ **Lis ceci attentivement.** Les salaires de ce fichier sont des **ordres de grandeur** construits pour l'exercice, pas des chiffres officiels. Ils servent à apprendre une méthode, **pas à choisir ton orientation**. Pour de vrais chiffres, va voir l'ONISEP, l'APEC ou l'INSEE — et on en reparle à la fin.`,
  },
  {
    type: 'hypothesis',
    title: 'Ton pari chiffré',
    content: `Cette fois, engage-toi sur un **nombre**.

**À ton avis, chaque année d'études supplémentaire rapporte combien, en moyenne, sur le salaire de début de carrière ?**

- +500 € par an ?
- +2 000 € par an ?
- +5 000 € par an ?
- +10 000 € par an ?

Et une deuxième question, plus subtile : **selon toi, les années d'études expliquent quelle part des écarts de salaire entre métiers ?** 20 % ? La moitié ? Presque tout ?

Note tes deux réponses. Tu vas les confronter à des chiffres dans quelques minutes.`,
  },
  {
    type: 'code',
    title: 'Explore et mesure',
    content: `Commence par regarder les données, puis applique ce que tu as appris dans la mission précédente : **mesure la corrélation** entre années d'études et salaire de début.`,
    code: {
      decouverte: `import pandas as pd

df = pd.read_csv("metiers.csv")

print(f"💼 {df.shape[0]} métiers dans le fichier\\n")
print(df[['metier', 'secteur', 'annees_etudes', 'salaire_debut']].head(8))

# Le lien entre études et salaire
r = df['annees_etudes'].corr(df['salaire_debut'])
print(f"\\n📈 Études vs salaire de début : r = {r:.2f}")

# Les extrêmes
print("\\n💰 Les 5 salaires de début les plus élevés :")
for _, m in df.nlargest(5, 'salaire_debut').iterrows():
    print(f"   {m['metier']:24s} bac+{int(m['annees_etudes'])}  {int(m['salaire_debut']):>6d} €")

print("\\n📉 Les 5 plus bas :")
for _, m in df.nsmallest(5, 'salaire_debut').iterrows():
    print(f"   {m['metier']:24s} bac+{int(m['annees_etudes'])}  {int(m['salaire_debut']):>6d} €")

# Par secteur
print("\\n🏢 Salaire de début moyen par secteur :")
parsecteur = df.groupby('secteur')['salaire_debut'].mean().sort_values(ascending=False)
for secteur, salaire in parsecteur.items():
    print(f"   {secteur:14s} {salaire:>7.0f} €")`,
      exploratrice: `import pandas as pd

df = pd.read_csv("metiers.csv")

print(df[['metier', 'secteur', 'annees_etudes', 'salaire_debut']].head(8))

# Calcule la corrélation entre annees_etudes et salaire_debut
r = df['annees_etudes'].___(df['salaire_debut'])
print(f"\\nr = {r:.2f}")

# Les 5 salaires de début les plus élevés
print(df.___(5, 'salaire_debut')[['metier', 'annees_etudes', 'salaire_debut']])

# Le salaire moyen par secteur, du plus élevé au plus bas
print(df.groupby('___')['salaire_debut'].___().sort_values(ascending=False))`,
      experte: `# 1. Explore metiers.csv : combien de métiers, quels secteurs ?
# 2. Corrélation entre annees_etudes et salaire_debut, puis avec salaire_10ans
# 3. Le lien est-il plus fort en début ou en milieu de carrière ? Pourquoi ?
# 4. Quel secteur paie le mieux à niveau d'études égal ? Compare les bac+5 entre eux.

import pandas as pd
df = pd.read_csv("metiers.csv")

`,
    },
    hints: [
      'df[\'a\'].corr(df[\'b\']) — tu l\'as utilisé dans la mission précédente',
      'df.nlargest(5, \'colonne\') et df.nsmallest(5, \'colonne\') donnent les extrêmes',
      'Pour comparer les bac+5 entre eux : df[df[\'annees_etudes\'] == 5].groupby(\'secteur\')',
    ],
    validation: { type: 'output-contains', expected: 'r =' },
    explanation: `**r ≈ 0,66 : un lien réel et assez fort.** Les études et le salaire montent bien ensemble.

Mais souviens-toi de la mission précédente : une corrélation dit *qu'il y a un lien*, pas *combien ça rapporte*. Pour répondre à ta question chiffrée, il faut passer à l'étape suivante — tracer une droite.`,
  },
  {
    type: 'learn',
    title: 'La droite qui résume tout',
    content: `Une **régression linéaire**, c'est chercher la droite qui passe au plus près de tous les points du nuage.

Cette droite a une équation que tu connais depuis la seconde :

\`\`\`
salaire = pente × années_d'études + ordonnée_à_l'origine
\`\`\`

**La pente est le chiffre qui t'intéresse.** C'est exactement la réponse à ta question : *combien rapporte une année d'études supplémentaire*.

**Comment la machine choisit-elle « la meilleure » droite ?** Pour chaque droite possible, on mesure l'erreur : la distance verticale entre chaque point réel et la droite. On élève ces écarts au carré (pour que les erreurs négatives ne compensent pas les positives), puis on les additionne. **La meilleure droite est celle qui rend cette somme la plus petite possible.**

C'est tout. Ça s'appelle la *méthode des moindres carrés*, inventée par Gauss il y a plus de deux siècles, et c'est encore aujourd'hui la base d'une bonne partie de l'économie et de l'IA.

En Python, numpy fait le calcul en une ligne :

\`\`\`python
pente, ordonnee = np.polyfit(x, y, 1)
\`\`\`

Le \`1\` signifie « droite » (polynôme de degré 1).`,
  },
  {
    type: 'code',
    title: 'Trace la droite et lis la pente',
    content: `Ajuste la droite sur les données, affiche son équation, et compare la pente à ton pari du début.`,
    code: {
      decouverte: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

df = pd.read_csv("metiers.csv")

x = df['annees_etudes'].values
y = df['salaire_debut'].values

# La régression : une seule ligne
pente, ordonnee = np.polyfit(x, y, 1)

print(f"📐 Équation trouvée :")
print(f"   salaire = {pente:.0f} × années + {ordonnee:.0f}")
print(f"\\n💡 Chaque année d'études rapporte en moyenne {pente:.0f} € de plus par an.")

# Quelques prédictions
print("\\n🔮 Ce que le modèle prédit :")
for annees in [2, 3, 5, 8]:
    print(f"   bac+{annees} → {pente * annees + ordonnee:>7.0f} €")

# Quelle part des écarts le modèle explique-t-il ?
r = df['annees_etudes'].corr(df['salaire_debut'])
print(f"\\n📊 R² = {r**2:.2f}")
print(f"   Les études expliquent environ {r**2:.0%} des écarts de salaire.")
print(f"   Les {1 - r**2:.0%} restants viennent d'autre chose.")

# Le graphique
plt.figure(figsize=(10, 7))
plt.scatter(x, y, s=70, alpha=0.75, c='#6366f1', label='Métiers')
xs = np.array([x.min(), x.max()])
plt.plot(xs, pente * xs + ordonnee, color='#f59e0b', linewidth=2.5, label='Droite de régression')
plt.xlabel("Années d'études après le bac →")
plt.ylabel('Salaire de début (€ brut/an) →')
plt.title(f"Études et salaire  (pente = {pente:.0f} €/an, R² = {r**2:.2f})")
plt.legend()
plt.grid(alpha=0.2)
plt.show()`,
      exploratrice: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

df = pd.read_csv("metiers.csv")
x = df['annees_etudes'].values
y = df['salaire_debut'].values

# Ajuste une droite (degré 1)
pente, ordonnee = np.polyfit(x, y, ___)
print(f"salaire = {pente:.0f} x annees + {ordonnee:.0f}")

# Prédis le salaire pour bac+5
print("bac+5 →", round(pente * ___ + ordonnee))

# Calcule R² (c'est le carré de la corrélation)
r = df['annees_etudes'].corr(df['salaire_debut'])
print(f"R2 = {r**___:.2f}")

# Trace le nuage ET la droite
plt.scatter(x, y, alpha=0.7)
xs = np.array([x.min(), x.max()])
plt.plot(xs, pente * xs + ordonnee, color='orange')
plt.show()`,
      experte: `# 1. Ajuste une régression salaire_debut ~ annees_etudes et affiche l'équation
# 2. Calcule R². Que signifie-t-il exactement ?
# 3. Refais la même chose pour salaire_10ans. La pente est-elle plus forte ?
# 4. Trace les deux droites sur le même graphique et commente l'écart
# 5. Bonus : la relation est-elle vraiment linéaire ? Essaie un polynôme de
#    degré 2 et regarde si l'ajustement s'améliore vraiment.

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
df = pd.read_csv("metiers.csv")

`,
    },
    hints: [
      'np.polyfit(x, y, 1) renvoie [pente, ordonnée] — le 1 veut dire « droite »',
      'Pour une régression simple, R² est exactement le carré du coefficient de corrélation',
      'Pour tracer la droite, il suffit de deux points : le x minimum et le x maximum',
    ],
    validation: { type: 'output-contains', expected: 'salaire' },
    explanation: `**Pente ≈ +3 180 € par année d'études. R² ≈ 0,43.**

Ces deux nombres racontent une histoire nuancée, et c'est le cœur de la mission.

La pente dit : **oui, les études paient.** Trois années de plus, c'est environ 9 500 € de plus par an au démarrage. Ce n'est pas rien.

Le R² dit : **mais les études n'expliquent que 43 % des écarts.** Plus de la moitié de ce qui sépare un salaire d'un autre vient d'ailleurs — le secteur, le métier précis, le statut.

Autrement dit : savoir combien d'années quelqu'un a étudié te donne une idée très approximative de son salaire. Tu te tromperais souvent, et parfois énormément. C'est précisément ce que tu vas regarder maintenant.`,
  },
  {
    type: 'code',
    title: 'Les exceptions sont plus parlantes que la règle',
    content: `L'écart entre le salaire réel d'un métier et celui que prédit la droite s'appelle le **résidu**. C'est là que l'information intéressante se cache.

Un gros résidu positif = ce métier paie beaucoup plus que ne le laisseraient penser ses années d'études. Un gros résidu négatif = l'inverse.`,
    code: {
      decouverte: `import pandas as pd
import numpy as np

df = pd.read_csv("metiers.csv")
pente, ordonnee = np.polyfit(df['annees_etudes'], df['salaire_debut'], 1)

# Ce que le modèle prévoit, et l'écart avec la réalité
df['prevu'] = pente * df['annees_etudes'] + ordonnee
df['ecart'] = df['salaire_debut'] - df['prevu']

print("🚀 Paient BEAUCOUP PLUS que prévu :")
for _, m in df.nlargest(5, 'ecart').iterrows():
    print(f"   {m['metier']:22s} {m['secteur']:11s} bac+{int(m['annees_etudes'])}  "
          f"{int(m['salaire_debut']):>6d} € au lieu de {int(m['prevu']):>6d} €  ({m['ecart']:+7.0f})")

print("\\n🪂 Paient BEAUCOUP MOINS que prévu :")
for _, m in df.nsmallest(5, 'ecart').iterrows():
    print(f"   {m['metier']:22s} {m['secteur']:11s} bac+{int(m['annees_etudes'])}  "
          f"{int(m['salaire_debut']):>6d} € au lieu de {int(m['prevu']):>6d} €  ({m['ecart']:+7.0f})")

print("\\n🔍 Regarde bien ces deux listes.")
print("   Un chercheur a fait bac+8 — plus qu'un ingénieur IA en bac+5 —")
print("   et démarre nettement plus bas.")
print("\\n   La durée des études ne suffit donc pas à expliquer un salaire.")
print("   Le SECTEUR pèse au moins autant. Vérifions :")

print("\\n🏢 Écart moyen à la droite, par secteur :")
for secteur, ecart in df.groupby('secteur')['ecart'].mean().sort_values(ascending=False).items():
    signe = "au-dessus" if ecart > 0 else "en dessous"
    print(f"   {secteur:14s} {ecart:+8.0f} €  ({signe} de la prédiction)")`,
      exploratrice: `import pandas as pd
import numpy as np

df = pd.read_csv("metiers.csv")
pente, ordonnee = np.polyfit(df['annees_etudes'], df['salaire_debut'], 1)

# Calcule la prédiction du modèle pour chaque métier
df['prevu'] = pente * df['___'] + ordonnee

# Le résidu = le vrai salaire MOINS la prédiction
df['ecart'] = df['salaire_debut'] - df['___']

# Les 5 métiers qui paient le plus par rapport à la prédiction
print(df.___(5, 'ecart')[['metier', 'secteur', 'annees_etudes', 'salaire_debut', 'ecart']])

# Les 5 qui paient le moins
print(df.nsmallest(5, '___')[['metier', 'secteur', 'annees_etudes', 'salaire_debut', 'ecart']])

# Écart moyen par secteur : quel secteur est le plus au-dessus de la droite ?
print(df.groupby('secteur')['ecart'].mean().sort_values())`,
      experte: `# 1. Calcule les résidus de ta régression
# 2. Identifie les 5 plus gros écarts positifs et négatifs — que remarques-tu ?
# 3. Les résidus sont-ils répartis au hasard, ou structurés par secteur ?
#    (indice : groupby('secteur') sur les résidus)
# 4. Un résidu structuré signale une variable manquante dans le modèle.
#    Laquelle manque ici ?
# 5. Bonus : trace les résidus en fonction de annees_etudes. Vois-tu un motif ?

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
df = pd.read_csv("metiers.csv")

`,
    },
    hints: [
      'Le résidu, c\'est simplement la valeur réelle moins la valeur prédite',
      'df.nlargest(5, \'ecart\') pour les plus gros écarts positifs, df.nsmallest pour les négatifs',
      'Si les résidus d\'un secteur sont tous du même côté de la droite, c\'est que le secteur porte une information que le modèle ignore',
    ],
    validation: { type: 'output-contains', expected: 'prévu' },
    explanation: `**Les résidus ne sont pas répartis au hasard — ils sont organisés par secteur.**

Finance et Tech sont systématiquement au-dessus de la droite. Éducation, Médias et Social, systématiquement en dessous. Ce n'est pas du bruit : c'est une **information que le modèle ignore**.

C'est un diagnostic très important en statistique. Quand les erreurs d'un modèle suivent un motif, cela signifie qu'il manque une variable. Ici, la variable manquante est évidente : **le secteur**.

Un modèle qui prendrait en compte à la fois les années d'études *et* le secteur serait bien plus précis. C'est exactement ce que fait la **régression multiple** — la suite logique de ce que tu viens d'apprendre.`,
  },
  {
    type: 'challenge',
    title: 'Défi : teste ton propre parcours',
    content: `À toi. Choisis un parcours qui t'intéresse, demande une prédiction au modèle, puis **cherche où il se trompe**.

Un modèle utile, c'est un modèle dont on connaît les limites.`,
    code: {
      decouverte: `import pandas as pd
import numpy as np

df = pd.read_csv("metiers.csv")
pente, ordonnee = np.polyfit(df['annees_etudes'], df['salaire_debut'], 1)

# ====== CHANGE CETTE VALEUR ======
mes_annees = 5
# =================================

prediction = pente * mes_annees + ordonnee
print(f"🎓 Avec bac+{mes_annees}, le modèle prédit : {prediction:.0f} € brut/an\\n")

# Mais que gagnent VRAIMENT les métiers à ce niveau d'études ?
memes_etudes = df[df['annees_etudes'] == mes_annees]
if len(memes_etudes) > 0:
    mini = memes_etudes['salaire_debut'].min()
    maxi = memes_etudes['salaire_debut'].max()
    print(f"⚠️ En réalité, les {len(memes_etudes)} métiers à bac+{mes_annees} de ce fichier")
    print(f"   vont de {mini:.0f} € à {maxi:.0f} € — un écart de {maxi - mini:.0f} €.")
    print(f"\\n   Voici le détail :")
    for _, m in memes_etudes.sort_values('salaire_debut', ascending=False).iterrows():
        print(f"      {m['metier']:24s} {m['secteur']:11s} {int(m['salaire_debut']):>6d} €")

    print(f"\\n💡 La prédiction du modèle ({prediction:.0f} €) est une MOYENNE.")
    print(f"   Elle ne dit rien de l'écart énorme entre ces métiers.")

# Et le taux d'emploi, qu'on a complètement ignoré jusqu'ici ?
print("\\n📉 Attention à une colonne qu'on n'a pas regardée : le taux d'emploi.")
fragiles = df.nsmallest(5, 'taux_emploi')
for _, m in fragiles.iterrows():
    print(f"   {m['metier']:24s} bac+{int(m['annees_etudes'])}  "
          f"{int(m['salaire_debut']):>6d} €  mais seulement {int(m['taux_emploi'])}% en emploi")
print("\\n   Un bon salaire moyen ne sert à rien si on ne trouve pas de poste.")`,
      exploratrice: `import pandas as pd
import numpy as np

df = pd.read_csv("metiers.csv")
pente, ordonnee = np.polyfit(df['annees_etudes'], df['salaire_debut'], 1)

# Choisis un nombre d'années d'études
mes_annees = ___

# Calcule la prédiction du modèle
prediction = pente * ___ + ordonnee
print(f"bac+{mes_annees} → prédiction : {prediction:.0f} €")

# Compare au vrai minimum et maximum des métiers à ce niveau
memes = df[df['annees_etudes'] == ___]
print("Minimum réel :", memes['salaire_debut'].min())
print("Maximum réel :", memes['salaire_debut'].___())

# Affiche les métiers avec le plus faible taux d'emploi
print(df.nsmallest(5, '___')[['metier', 'salaire_debut', 'taux_emploi']])`,
      experte: `# 1. Prédis le salaire pour un niveau d'études de ton choix
# 2. Compare la prédiction à la distribution réelle à ce niveau (min, max, écart-type)
# 3. Construis un modèle meilleur : ajoute le secteur comme variable
#    (indice : calcule l'écart moyen par secteur et ajoute-le à la prédiction)
# 4. Ton modèle à deux variables fait-il mieux ? Mesure-le.
# 5. Enfin, croise salaire et taux_emploi : quel métier offre le meilleur
#    compromis entre les deux ? Justifie ton critère.

import pandas as pd
import numpy as np
df = pd.read_csv("metiers.csv")

`,
    },
    hints: [
      'df[df[\'annees_etudes\'] == 5] sélectionne les métiers à bac+5',
      'Pour améliorer le modèle : prediction_amelioree = pente * annees + ordonnee + ecart_moyen_du_secteur',
      'Un modèle qui prédit une moyenne peut être très bon « en moyenne » et très mauvais pour chaque cas individuel',
    ],
    validation: { type: 'output-contains', expected: 'prédit' },
    explanation: `**Le modèle prédit une moyenne. Toi, tu ne seras pas une moyenne.**

À bac+5, ce fichier va d'environ 25 000 € à 50 000 € selon le métier. La prédiction du modèle tombe au milieu — et se trompe donc d'au moins 10 000 € dans les deux sens.

C'est la limite fondamentale de ce type de modèle, et elle vaut bien au-delà des salaires : **une moyenne décrit un groupe, pas un individu.** Un modèle qui dit « les bac+5 gagnent 34 000 € » est juste pour le groupe et faux pour presque chaque personne du groupe.`,
  },
  {
    type: 'reflect',
    title: 'Ce que ces chiffres disent — et ne disent pas',
    content: `**Tu viens d'utiliser l'outil le plus répandu de l'analyse de données. Prends un moment pour mesurer ce qu'il vaut.**

**Ce que tu as établi :** une année d'études supplémentaire va de pair avec environ +3 000 € de salaire de départ, et la durée des études explique un peu plus de 40 % des écarts entre métiers.

**Ce que tu n'as pas établi**, et c'est tout aussi important :

**Ce n'est pas une causalité.** Tu connais le piège depuis la mission précédente. Les études longues *mènent-elles* à de meilleurs salaires ? Ou bien les métiers bien payés *exigent-ils* des études longues ? Ou bien d'autres facteurs — milieu social, réseau, opportunités — influencent-ils à la fois la durée des études et le salaire ? Cette question occupe des économistes à plein temps depuis cinquante ans.

**Ce ne sont pas tes chiffres.** Les salaires de ce fichier sont des ordres de grandeur pédagogiques. Pour de vrais chiffres, va voir l'**ONISEP**, l'**APEC** et l'**INSEE**, qui publient des données réelles par formation et par métier.

**Le salaire n'est qu'une colonne.** Tu as vu que le taux d'emploi change complètement la lecture. Et le fichier ne dit rien de l'intérêt du travail, des horaires, du stress, du sens qu'on y trouve. Un chercheur du CNRS gagne moins qu'un trader, et beaucoup de gens feraient ce choix sans hésiter.

**Le vrai enseignement est méthodologique.** Tu sais maintenant qu'une moyenne ne décrit personne en particulier, qu'un R² de 0,43 veut dire « plus de la moitié m'échappe », et que les erreurs d'un modèle sont souvent plus instructives que ses réussites.

Ces réflexes valent pour un salaire, un diagnostic médical, un score de crédit ou une recommandation d'IA. **C'est le métier de ceux qui travaillent avec les données : savoir ce qu'un chiffre ne dit pas.**`,
  },
  {
    type: 'complete',
    title: 'Mission accomplie !',
    content: `🎉 **Bravo — tu sais construire et critiquer un modèle prédictif.**

**Ce que tu sais faire :**
- ✅ Ajuster une régression linéaire avec \`np.polyfit\`
- ✅ Lire une pente et une ordonnée à l'origine comme des quantités concrètes
- ✅ Interpréter un R² — et dire ce qu'il laisse inexpliqué
- ✅ Calculer des résidus et y repérer une variable manquante
- ✅ Distinguer ce qu'un modèle prédit pour un groupe de ce qu'il vaut pour un individu

**Badge débloqué : 📈 Analyste prédictive**

**L'Univers 2 est terminé.** Tu as mené trois enquêtes complètes : tu as classé (IA), mesuré (corrélation) et prédit (régression). Ce sont les trois gestes de base de toute data scientist.`,
  },
];
