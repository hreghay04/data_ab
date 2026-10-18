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
    title: 'Les secrets des chansons populaires',
    description: 'Explore un dataset musical, découvre les tableaux de données et crée ton premier graphique avec Python.',
    badge: 'Data Detective',
    xp: 50,
    dataset: 'chansons.csv',
    datasetSource: 'Données synthétiques inspirées de caractéristiques musicales publiques',
    objectives: [
      'Découvrir ce qu\'est un tableau de données',
      'Utiliser pandas.read_csv() pour charger des données',
      'Explorer lignes, colonnes et types de variables',
      'Créer un premier graphique avec Matplotlib',
    ],
    duration: '~45 min',
  },
  'mission-02': {
    id: 'mission-02',
    number: '02',
    universe: 1,
    title: 'Les chiffres peuvent-ils mentir ?',
    description: 'Apprends à repérer les graphiques trompeurs et comprends la différence entre moyenne et médiane.',
    badge: 'Détective des statistiques',
    xp: 50,
    dataset: 'temperatures.csv',
    datasetSource: 'Données synthétiques de températures mensuelles',
    objectives: [
      'Comprendre moyenne, médiane et valeurs extrêmes',
      'Repérer un axe tronqué et un graphique trompeur',
      'Créer des visualisations honnêtes',
      'Développer l\'esprit critique face aux chiffres',
    ],
    duration: '~45 min',
  },
  'mission-03': {
    id: 'mission-03',
    number: '03',
    universe: 1,
    title: 'Mon premier programme intelligent',
    description: 'Construis un mini-outil d\'analyse avec des variables, conditions, boucles et fonctions Python.',
    badge: 'Codeuse en herbe',
    xp: 60,
    dataset: 'chansons.csv',
    objectives: [
      'Créer et utiliser des variables',
      'Écrire des conditions (if/else)',
      'Utiliser des boucles (for)',
      'Créer une fonction réutilisable',
    ],
    duration: '~45 min',
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
