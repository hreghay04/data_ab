import type { MissionStep } from '../index';

export const steps: MissionStep[] = [
  {
    type: 'intro',
    title: 'Les chiffres peuvent-ils mentir ?',
    content: `**Un même jeu de données peut raconter des histoires très différentes selon comment on le présente.**

Les statistiques et les graphiques sont des outils puissants — mais ils peuvent aussi induire en erreur, volontairement ou non.

Dans cette mission, tu vas apprendre à repérer les pièges courants et à créer des visualisations honnêtes.

**Ce que tu vas apprendre :**
- La différence entre moyenne et médiane
- Repérer un graphique trompeur
- L'impact des valeurs extrêmes
- Créer des visualisations fiables`,
  },
  {
    type: 'hypothesis',
    title: 'Ton intuition',
    content: `Regarde cette affirmation :

*"La température moyenne a augmenté de 0.5°C en 10 ans"*

**Est-ce alarmant ? Rassurant ? Ça dépend ?**

Note ton ressenti — tu verras comment la présentation change tout.`,
  },
  {
    type: 'learn',
    title: 'Moyenne vs Médiane',
    content: `**La moyenne** additionne tout et divise par le nombre de valeurs. Elle est sensible aux **valeurs extrêmes**.

**La médiane** est la valeur du milieu quand on trie les données. Elle résiste mieux aux extrêmes.

**Exemple :** Salaires dans une startup de 5 personnes :
- Employés : 2 000€, 2 200€, 2 500€, 2 800€
- PDG : 15 000€

→ **Moyenne** : 4 900€ (le PDG tire tout vers le haut)
→ **Médiane** : 2 500€ (reflète mieux la réalité du groupe)

Quand tu lis "en moyenne", demande-toi toujours : **y a-t-il des valeurs extrêmes qui faussent le calcul ?**`,
  },
  {
    type: 'code',
    title: 'Moyenne vs Médiane en pratique',
    content: `Explore les températures et compare moyenne et médiane.`,
    code: {
      decouverte: `import pandas as pd
import numpy as np

df = pd.read_csv("temperatures.csv")

print("📊 Températures moyennes par ville :")
print(df.head(10))

# Moyenne et médiane pour chaque ville
for ville in df['ville'].unique():
    data = df[df['ville'] == ville]['temperature']
    moy = data.mean()
    med = data.median()
    print(f"\\n🏙️ {ville}:")
    print(f"   Moyenne : {moy:.1f}°C")
    print(f"   Médiane : {med:.1f}°C")
    if abs(moy - med) > 1:
        print(f"   ⚠️ Écart important ! Des valeurs extrêmes influencent la moyenne.")`,
      exploratrice: `import pandas as pd

df = pd.read_csv("temperatures.csv")

# Affiche les premières lignes
print(df.head())

# Pour chaque ville, calcule la moyenne et la médiane
for ville in df['ville'].unique():
    data = df[df['ville'] == ville]['temperature']
    moy = data.___()
    med = data.___()
    print(f"\\n{ville}: Moyenne={moy:.1f}°C, Médiane={med:.1f}°C")`,
      experte: `# Charge temperatures.csv
# Compare moyenne et médiane par ville
# Identifie les cas où l'écart est significatif
# Explique pourquoi dans chaque cas

import pandas as pd
df = pd.read_csv("temperatures.csv")

`,
    },
    hints: [
      '.mean() calcule la moyenne, .median() calcule la médiane',
      'Un écart important entre moyenne et médiane signale des valeurs extrêmes',
    ],
    validation: { type: 'output-contains', expected: 'Moyenne' },
  },
  {
    type: 'code',
    title: 'L\'art du graphique trompeur',
    content: `Un même graphique peut donner une impression très différente selon les axes. Compare ces deux versions.`,
    code: {
      decouverte: `import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("temperatures.csv")
paris = df[df['ville'] == 'Paris'].sort_values('mois')

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))

# Graphique TROMPEUR : axe Y tronqué
ax1.plot(paris['mois'], paris['temperature'], 'r-o', linewidth=2)
ax1.set_ylim(14, 17)  # Axe tronqué !
ax1.set_title('😱 ALERTE : explosion des températures !', fontsize=11)
ax1.set_xlabel('Mois')
ax1.set_ylabel('Température (°C)')
ax1.grid(True, alpha=0.3)

# Graphique HONNÊTE : axe Y complet
ax2.plot(paris['mois'], paris['temperature'], 'b-o', linewidth=2)
ax2.set_ylim(0, 40)  # Axe complet
ax2.set_title('📊 Vue complète des températures', fontsize=11)
ax2.set_xlabel('Mois')
ax2.set_ylabel('Température (°C)')
ax2.grid(True, alpha=0.3)

plt.tight_layout()
plt.show()

print("👆 Mêmes données, impression totalement différente !")
print("L'axe tronqué à gauche exagère visuellement les variations.")`,
      exploratrice: `import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("temperatures.csv")
paris = df[df['ville'] == 'Paris'].sort_values('mois')

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))

# Graphique trompeur : utilise set_ylim() pour tronquer l'axe
ax1.plot(paris['mois'], paris['temperature'], 'r-o')
ax1.set_ylim(___, ___)  # Choisis un intervalle très serré
ax1.set_title('Version trompeuse')

# Graphique honnête : axe complet
ax2.plot(paris['mois'], paris['temperature'], 'b-o')
ax2.set_ylim(___, ___)  # De 0 à 40
ax2.set_title('Version honnête')

plt.tight_layout()
plt.show()`,
      experte: `# Crée deux graphiques côte à côte avec les températures de Paris :
# 1. Un graphique volontairement trompeur (axe tronqué)
# 2. Le même graphique mais honnête
# Explique la différence en print()

import pandas as pd
import matplotlib.pyplot as plt
df = pd.read_csv("temperatures.csv")

`,
    },
    hints: [
      'ax.set_ylim(min, max) définit les bornes de l\'axe Y',
      'Un axe de 14 à 17 exagère les variations ; un axe de 0 à 40 montre le contexte réel',
    ],
    validation: { type: 'no-error' },
  },
  {
    type: 'challenge',
    title: 'Défi : Détecte le piège !',
    content: `Crée une visualisation qui compare **honnêtement** les températures de toutes les villes, avec la moyenne ET la médiane visibles.`,
    code: {
      decouverte: `import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

df = pd.read_csv("temperatures.csv")

# Calculer moyenne et médiane par ville
stats = df.groupby('ville')['temperature'].agg(['mean', 'median']).round(1)
stats = stats.sort_values('mean')

# Graphique comparatif
x = np.arange(len(stats))
width = 0.35

plt.figure(figsize=(10, 6))
plt.bar(x - width/2, stats['mean'], width, label='Moyenne', color='#6366f1')
plt.bar(x + width/2, stats['median'], width, label='Médiane', color='#06b6d4')
plt.xticks(x, stats.index, rotation=45, ha='right')
plt.ylabel('Température (°C)')
plt.title('Moyenne vs Médiane des températures par ville')
plt.legend()
plt.ylim(0, max(stats['mean'].max(), stats['median'].max()) * 1.2)
plt.tight_layout()
plt.show()

# Verdict
for ville in stats.index:
    diff = abs(stats.loc[ville, 'mean'] - stats.loc[ville, 'median'])
    if diff > 1:
        print(f"⚠️ {ville} : écart de {diff:.1f}°C — des valeurs extrêmes influencent la moyenne")
    else:
        print(f"✅ {ville} : moyenne et médiane proches ({diff:.1f}°C d'écart)")`,
      exploratrice: `import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

df = pd.read_csv("temperatures.csv")

# Calcule moyenne et médiane par ville
stats = df.groupby('ville')['temperature'].agg(['___', '___'])

# Crée un graphique comparatif avec des barres groupées
# Indice : utilise plt.bar() deux fois avec un décalage

`,
      experte: `# Compare honnêtement les températures de toutes les villes
# Montre moyenne et médiane côte à côte
# Identifie les villes où l'écart est suspect

import pandas as pd
import matplotlib.pyplot as plt
df = pd.read_csv("temperatures.csv")

`,
    },
    hints: [
      'df.groupby("ville")["temperature"].agg(["mean", "median"]) calcule les deux en une fois',
      'Pour des barres groupées, décale la position : x - width/2 et x + width/2',
    ],
    validation: { type: 'no-error' },
    explanation: `**Ce qu'on a appris :**
- La **moyenne** peut être trompeuse quand il y a des valeurs extrêmes
- La **médiane** est plus robuste mais moins connue
- Un **axe tronqué** exagère visuellement les différences
- Toujours vérifier l'échelle des axes et se demander si la visualisation est honnête`,
  },
  {
    type: 'reflect',
    title: 'Esprit critique activé',
    content: `**Les chiffres ne mentent pas, mais on peut leur faire dire n'importe quoi.**

Quand tu lis une statistique ou un graphique, pose-toi ces questions :
1. L'axe Y commence-t-il à zéro ?
2. Utilise-t-on la moyenne ou la médiane ? Pourquoi ?
3. L'échantillon est-il représentatif ?
4. Qui a produit ce graphique et dans quel but ?

Ces réflexes te protègeront des manipulations statistiques, qu'elles soient volontaires ou non.`,
  },
  {
    type: 'complete',
    title: 'Mission accomplie !',
    content: `🎉 **Bravo !** Tu es maintenant capable de déjouer les pièges statistiques.

**Ce que tu sais faire :**
- ✅ Distinguer moyenne et médiane
- ✅ Repérer un graphique trompeur
- ✅ Comprendre l'impact des valeurs extrêmes
- ✅ Créer des visualisations honnêtes

**Badge débloqué : 🏅 Détective des statistiques**`,
  },
];
