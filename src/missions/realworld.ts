// Shown at the end of each mission: what she just did, used at full scale.
// Claims are kept to well-established uses of each method — no invented
// company figures.

export interface RealWorld {
  accroche: string;
  usages: { domaine: string; emoji: string; texte: string }[];
  metier: string;
}

export const REAL_WORLD: Record<string, RealWorld> = {
  'mission-01': {
    accroche: 'Charger un fichier, grouper, comparer, tracer — tu viens de faire les quatre gestes qui occupent le plus de temps dans n\'importe quel métier de la donnée.',
    usages: [
      { domaine: 'Industrie musicale', emoji: '🎧', texte: 'Les labels analysent les caractéristiques audio des titres qui marchent pour décider quels artistes signer et quels morceaux pousser en single.' },
      { domaine: 'Santé publique', emoji: '🏥', texte: 'Les mêmes groupements servent à comparer des taux de maladie entre régions ou classes d\'âge.' },
      { domaine: 'Sport', emoji: '🎾', texte: 'Chaque club professionnel emploie des analystes qui agrègent les statistiques de match exactement de cette façon.' },
    ],
    metier: 'Data analyst — traduire des tableaux en décisions.',
  },
  'mission-02': {
    accroche: 'Repérer un axe tronqué et distinguer moyenne et médiane, c\'est le réflexe de base de quiconque doit lire des chiffres produits par quelqu\'un d\'autre.',
    usages: [
      { domaine: 'Journalisme', emoji: '📰', texte: 'Les rédactions ont des cellules de data-journalisme dont le travail consiste à vérifier les graphiques diffusés par les institutions et les entreprises.' },
      { domaine: 'Salaires et inégalités', emoji: '💶', texte: 'L\'écart entre salaire moyen et salaire médian est le premier chiffre que regardent les économistes, précisément parce que les très hauts revenus tirent la moyenne.' },
      { domaine: 'Immobilier', emoji: '🏘️', texte: 'Les prix au m² sont toujours publiés en médiane : quelques ventes exceptionnelles fausseraient complètement la moyenne d\'un quartier.' },
    ],
    metier: 'Data-journaliste — enquêter avec des chiffres, et sur les chiffres.',
  },
  'mission-03': {
    accroche: 'Variables, conditions, boucles, fonctions : tu possèdes maintenant les briques avec lesquelles tout programme est construit, du plus simple au plus gros.',
    usages: [
      { domaine: 'Systèmes de règles', emoji: '⚙️', texte: 'Avant toute IA, l\'immense majorité des logiciels décident encore par des conditions écrites à la main — remboursements, alertes, éligibilités.' },
      { domaine: 'Automatisation', emoji: '🤖', texte: 'Un script de quelques dizaines de lignes peut remplacer des heures de travail répétitif. C\'est souvent la première chose qu\'on fait en stage.' },
    ],
    metier: 'Développeuse — toutes spécialités confondues, le socle est celui-là.',
  },
  'mission-04': {
    accroche: 'Tu as écrit un classifieur depuis zéro. Les k plus proches voisins ne sont pas un exercice pédagogique : c\'est un algorithme utilisé en production.',
    usages: [
      { domaine: 'Recommandation', emoji: '🎵', texte: 'Le principe « des profils proches aiment des choses proches » est au cœur des suggestions musicales, vidéo et commerciales.' },
      { domaine: 'Médecine', emoji: '🔬', texte: 'On compare une image ou une analyse à des cas déjà diagnostiqués pour orienter le médecin — qui garde la décision.' },
      { domaine: 'Détection de fraude', emoji: '💳', texte: 'Une transaction très éloignée de vos habitudes déclenche une alerte, selon exactement cette logique de distance.' },
    ],
    metier: 'Machine learning engineer — construire et faire tourner des modèles.',
  },
  'mission-05': {
    accroche: 'Mesurer un lien sans conclure à une cause : c\'est la compétence qui sépare une analyse sérieuse d\'une statistique de comptoir.',
    usages: [
      { domaine: 'Épidémiologie', emoji: '🧬', texte: 'Tout le débat sur les facteurs de risque — alimentation, pollution, mode de vie — repose sur cette distinction. Les chercheurs y consacrent des carrières entières.' },
      { domaine: 'Économie', emoji: '📉', texte: 'Le prix Nobel d\'économie a récompensé des travaux portant précisément sur la façon d\'établir une causalité quand on ne peut pas faire d\'expérience.' },
      { domaine: 'Éducation', emoji: '🎓', texte: 'Évaluer si un dispositif scolaire fonctionne vraiment, ou si les élèves concernés auraient réussi de toute façon, est le même problème.' },
    ],
    metier: 'Chercheuse, économiste, épidémiologiste — partout où il faut prouver, pas seulement constater.',
  },
  'mission-06': {
    accroche: 'La régression linéaire est le modèle le plus utilisé au monde. Tu sais maintenant l\'ajuster, lire sa pente, et surtout dire ce qu\'elle ne capture pas.',
    usages: [
      { domaine: 'Assurance', emoji: '🚗', texte: 'Les tarifs sont calculés par des modèles de ce type. Les actuaires qui les conçoivent font partie des métiers les mieux payés du secteur.' },
      { domaine: 'Climat', emoji: '🌍', texte: 'Les tendances de température et leurs intervalles d\'incertitude reposent sur des régressions, en version plus sophistiquée.' },
      { domaine: 'Immobilier et commerce', emoji: '🏷️', texte: 'Estimer un prix à partir de caractéristiques — surface, emplacement, état — est une régression, ni plus ni moins.' },
    ],
    metier: 'Actuaire, économètre, data scientist — modéliser pour décider.',
  },
  'mission-07': {
    accroche: 'Tu as mené un audit d\'équité. C\'est un métier qui n\'existait pas il y a dix ans, et qui manque aujourd\'hui de monde.',
    usages: [
      { domaine: 'Recrutement', emoji: '📄', texte: 'Des outils filtrent des CV avant tout regard humain. Des cas documentés ont montré des modèles ayant appris à désavantager certains profils, sans que personne ne l\'ait voulu.' },
      { domaine: 'Crédit', emoji: '🏦', texte: 'Les scores bancaires sont encadrés par la loi, ce qui oblige les banques à prouver qu\'ils ne discriminent pas indirectement.' },
      { domaine: 'Réglementation', emoji: '⚖️', texte: 'Le règlement européen sur l\'IA impose des obligations d\'évaluation aux systèmes dits à haut risque — éducation, emploi, justice.' },
    ],
    metier: 'Auditrice d\'algorithmes, responsable IA éthique — des postes créés en ce moment même.',
  },
  'mission-08': {
    accroche: 'Trouver des groupes que personne n\'a étiquetés, c\'est ce qu\'on fait quand on explore un terrain dont on ne connaît pas encore la carte.',
    usages: [
      { domaine: 'Biologie', emoji: '🧫', texte: 'Le clustering a permis d\'identifier des sous-types de cellules et de cancers que la classification médicale ne distinguait pas.' },
      { domaine: 'Astronomie', emoji: '🔭', texte: 'Des millions d\'objets célestes sont regroupés automatiquement : aucune équipe humaine ne pourrait les trier un par un.' },
      { domaine: 'Marketing', emoji: '🛍️', texte: 'La segmentation de clientèle — trouver des familles de comportements d\'achat — est l\'usage le plus répandu en entreprise.' },
    ],
    metier: 'Data scientist exploratoire — faire parler des données que personne n\'a encore lues.',
  },
};

export function renderRealWorld(missionId: string): string {
  const rw = REAL_WORLD[missionId];
  if (!rw) return '';
  return `
    <section style="margin-top:24px;padding:18px 20px;background:var(--bg-tertiary);
                    border-radius:var(--radius-md);border-left:3px solid var(--accent)">
      <div class="eyebrow" style="margin-bottom:10px">Dans la vraie vie</div>
      <p class="t-sm" style="line-height:1.7;margin-bottom:16px">${rw.accroche}</p>
      <div style="display:grid;gap:12px">
        ${rw.usages.map(u => `
          <div style="display:flex;gap:12px;align-items:flex-start">
            <span style="font-size:var(--text-lg);line-height:1.2">${u.emoji}</span>
            <div>
              <div class="t-sm bold">${u.domaine}</div>
              <div class="t-sm muted" style="line-height:1.6">${u.texte}</div>
            </div>
          </div>
        `).join('')}
      </div>
      <div style="margin-top:16px;padding-top:14px;border-top:1px solid var(--border)">
        <span class="t-xs dim">Le métier qui va avec — </span>
        <span class="t-sm bold" style="color:var(--accent)">${rw.metier}</span>
      </div>
      <a href="#/horizons" class="btn btn-secondary btn-sm" style="margin-top:14px">
        🧭 Voir où mènent ces compétences
      </a>
    </section>
  `;
}
