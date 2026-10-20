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
    description: 'BTS, BLACKPINK, NewJeans… Explore un dataset d\'une cinquantaine de titres K-pop pour découvrir ce qui fait un hit.',
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
  'mission-06': {
    id: 'mission-06',
    number: '06',
    universe: 2,
    title: 'Les études longues rapportent-elles vraiment plus ?',
    description: 'Construis un modèle qui prédit un salaire à partir des années d\'études — puis découvre tout ce qu\'il ne voit pas.',
    badge: 'Analyste prédictive',
    xp: 70,
    dataset: 'metiers.csv',
    datasetSource: 'Ordres de grandeur indicatifs construits pour l\'exercice à partir de fourchettes publiques — ce ne sont pas des chiffres officiels. Sources réelles : ONISEP, APEC, INSEE.',
    objectives: [
      'Ajuster une régression linéaire avec np.polyfit',
      'Interpréter une pente et un R² comme des quantités concrètes',
      'Calculer des résidus et y repérer une variable manquante',
      'Distinguer ce qu\'un modèle prédit pour un groupe de ce qu\'il vaut pour un individu',
    ],
    duration: '~55 min',
  },
  'mission-07': {
    id: 'mission-07',
    number: '07',
    universe: 3,
    title: 'L\'algorithme qui trie les dossiers',
    description: 'Une IA sélectionne des candidats sans regarder leur lycée. Prouve qu\'elle discrimine quand même — et trouve par où passe le biais.',
    badge: 'Auditrice d\'algorithmes',
    xp: 90,
    dataset: 'candidats.csv',
    datasetSource: 'Simulation pédagogique de 300 candidatures, construite pour démontrer un mécanisme de biais algorithmique. Ne décrit aucune formation réelle.',
    objectives: [
      'Démontrer qu\'un écart n\'est pas explicable par le mérite',
      'Comprendre comment un modèle hérite des biais de ses données',
      'Mesurer l\'équité d\'un modèle, et pas seulement sa précision',
      'Démasquer une variable proxy et chiffrer le coût d\'une correction',
    ],
    duration: '~60 min',
  },
  'mission-08': {
    id: 'mission-08',
    number: '08',
    universe: 3,
    title: 'La machine qui range sans savoir ce qu\'elle range',
    description: 'Donne une cinquantaine de titres K-pop sans aucune étiquette à un algorithme. Il va trouver les familles tout seul — et regrouper NewJeans sans voir le nom du groupe.',
    badge: 'Exploratrice de structures',
    xp: 80,
    dataset: 'kpop.csv',
    datasetSource: 'kpop.csv et mangas.csv — le second sert de banc de test pour valider la méthode sur des catégories connues.',
    objectives: [
      'Implémenter l\'algorithme des k-moyennes de bout en bout',
      'Comprendre pourquoi les relances multiples sont indispensables',
      'Valider une méthode non supervisée sur des données étiquetées',
      'Expliquer pourquoi le choix du nombre de groupes est un choix humain',
    ],
    duration: '~55 min',
  },
};

export interface Universe {
  num: number;
  title: string;
  emoji: string;
  description: string;
}

const UNIVERSES: Universe[] = [
  { num: 1, title: 'Je découvre mes superpouvoirs numériques', emoji: '✨',
    description: 'Données, tableaux, premiers graphiques et statistiques' },
  { num: 2, title: 'Je mène mes propres enquêtes', emoji: '🔍',
    description: 'Premier modèle d\'IA, prédictions et corrélations' },
  { num: 3, title: 'Je construis ma première IA', emoji: '🤖',
    description: 'Classification, clustering et biais algorithmique' },
  { num: 4, title: 'Mon premier projet data science', emoji: '🎓',
    description: 'Choix de sujet, analyse complète et présentation' },
];

export function missionsOfUniverse(num: number): MissionMeta[] {
  return Object.values(MISSIONS_META)
    .filter(m => m.universe === num)
    .sort((a, b) => a.number.localeCompare(b.number));
}

// Only universes that actually hold missions are shown, so the parcours never
// advertises a slot that does not exist yet.
export function activeUniverses(): Universe[] {
  return UNIVERSES.filter(u => missionsOfUniverse(u.num).length > 0);
}

export function totalMissions(): number {
  return Object.keys(MISSIONS_META).length;
}

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
