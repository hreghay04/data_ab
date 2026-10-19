export interface MissionMeta {
  id: string;
  number: string;
  universe: number;
  title: string;
  description: string;
  badge?: string;
  xp: number;
  dataset?: string;
  datasetSource?: string;
  objectives: string[];
  duration: string;
}

export interface MissionStep {
  type: 'intro' | 'hypothesis' | 'explore' | 'learn' | 'code' | 'challenge' | 'reflect' | 'complete';
  title: string;
  content: string;
  code?: {
    decouverte: string;
    exploratrice: string;
    experte: string;
  };
  hints?: string[];
  validation?: {
    type: 'output-contains' | 'output-matches' | 'no-error';
    expected?: string;
  };
  explanation?: string;
}

export interface MissionData {
  meta: MissionMeta;
  steps: MissionStep[];
}

export const MISSIONS_META: Record<string, MissionMeta> = {
  'mission-01': {
    id: 'mission-01',
    number: '01',
    universe: 1,
    title: 'Les secrets de la K-pop en données',
    description: 'BTS, BLACKPINK, NewJeans… Explore un dataset de 50 titres K-pop pour découvrir ce qui fait un hit.',
    badge: 'Data Detective',
    xp: 50,
    dataset: 'kpop.csv',
    datasetSource: 'Données synthétiques inspirées de caractéristiques musicales publiques de titres K-pop',
    objectives: [
      'Découvrir ce qu\'est un tableau de données (DataFrame)',
      'Utiliser pandas.read_csv() pour charger des données',
      'Calculer des statistiques par groupe (groupby)',
      'Créer des graphiques (nuage de points, barres)',
    ],
    duration: '~45 min',
  },
  'mission-02': {
    id: 'mission-02',
    number: '02',
    universe: 1,
    title: 'Les stats du tennis peuvent-elles mentir ?',
    description: 'Djokovic vs Alcaraz vs Sinner — apprends à repérer les graphiques trompeurs et les pièges statistiques.',
    badge: 'Détective des statistiques',
    xp: 50,
    dataset: 'tennis.csv',
    datasetSource: 'Données synthétiques inspirées de statistiques publiques de joueurs de tennis',
    objectives: [
      'Comprendre moyenne, médiane et valeurs extrêmes',
      'Repérer un axe tronqué et un graphique trompeur',
      'Comparer des données avec esprit critique',
      'Créer des visualisations honnêtes',
    ],
    duration: '~45 min',
  },
  'mission-03': {
    id: 'mission-03',
    number: '03',
    universe: 1,
    title: 'Mon recommandeur de chats',
    description: 'Programme un outil qui recommande la race de chat idéale avec des variables, conditions et fonctions Python.',
    badge: 'Codeuse en herbe',
    xp: 60,
    dataset: 'chats.csv',
    datasetSource: 'Données synthétiques de caractéristiques de races de chats',
    objectives: [
      'Créer et utiliser des variables',
      'Écrire des conditions (if/elif/else)',
      'Utiliser des boucles (for) avec un DataFrame',
      'Créer une fonction avec paramètres par défaut',
    ],
    duration: '~45 min',
  },
  'mission-04': {
    id: 'mission-04',
    number: '04',
    universe: 2,
    title: 'Mon premier modèle d\'IA',
    description: 'Shonen, Shojo ou Seinen ? Construis une IA qui devine le genre d\'un manga — en 15 lignes, sans bibliothèque magique.',
    badge: 'Apprentie IA',
    xp: 80,
    dataset: 'mangas.csv',
    datasetSource: 'Vrais titres de mangas ; notes d\'action, romance et violence synthétiques (inventées pour l\'exercice)',
    objectives: [
      'Comprendre ce que signifie « apprendre à partir d\'exemples »',
      'Coder l\'algorithme des k plus proches voisins depuis zéro',
      'Séparer données d\'entraînement et données de test',
      'Évaluer un modèle en le comparant à une baseline',
    ],
    duration: '~60 min',
  },
  'mission-05': {
    id: 'mission-05',
    number: '05',
    universe: 2,
    title: 'Les séries longues font-elles les plus gros succès ?',
    description: 'One Piece : 105 tomes, 516 millions de ventes. Mesure le lien, puis découvre pourquoi « corrélation » ne veut pas dire « cause ».',
    badge: 'Chasseuse de corrélations',
    xp: 70,
    dataset: 'mangas.csv',
    datasetSource: 'Nombre de tomes, année de parution et ventes : chiffres réels. Notes d\'action, romance et violence : synthétiques.',
    objectives: [
      'Calculer et interpréter un coefficient de corrélation',
      'Tester la robustesse d\'un résultat en retirant les valeurs extrêmes',
      'Distinguer corrélation, causalité inverse et facteur confondant',
      'Comprendre qu\'une absence de lien est aussi un résultat',
    ],
    duration: '~50 min',
  },
};

export async function loadMission(id: string): Promise<MissionData | null> {
  const meta = MISSIONS_META[id];
  if (!meta) return null;

  try {
    const mod = await import(`./data/${id}.ts`);
    return { meta, steps: mod.steps };
  } catch {
    return null;
  }
}

export async function loadDataset(name: string): Promise<string> {
  const resp = await fetch(`${import.meta.env.BASE_URL}datasets/${name}`);
  if (!resp.ok) throw new Error(`Dataset ${name} introuvable`);
  return resp.text();
}
