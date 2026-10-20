import { renderHeader, bindHeaderEvents } from '../components/header';

interface Metier {
  nom: string;
  emoji: string;
  quotidien: string;
  pourQui: string;
}

const METIERS: Metier[] = [
  {
    nom: 'Data analyst', emoji: '📊',
    quotidien: 'Répondre à des questions concrètes que se posent des gens qui ne savent pas coder : pourquoi les ventes baissent dans telle région, quels utilisateurs partent et quand. Beaucoup de dialogue, des tableaux, des graphiques, des recommandations.',
    pourQui: 'Si tu aimes enquêter et expliquer autant que calculer.',
  },
  {
    nom: 'Data scientist', emoji: '🔬',
    quotidien: 'Construire des modèles qui prédisent ou classent, comme ceux des missions 4, 6 et 8 — en plus gros. Une grande partie du temps part en réalité dans le nettoyage des données et la vérification que le modèle tient la route.',
    pourQui: 'Si tu aimes les maths autant que le code, et l\'idée de prouver qu\'un résultat est solide.',
  },
  {
    nom: 'Machine learning engineer', emoji: '⚙️',
    quotidien: 'Faire passer un modèle du statut de prototype à celui de service qui tourne pour des millions de personnes, sans tomber en panne. Davantage d\'ingénierie logicielle que de statistiques.',
    pourQui: 'Si construire des choses solides t\'attire plus qu\'explorer.',
  },
  {
    nom: 'Data engineer', emoji: '🗄️',
    quotidien: 'Construire les tuyaux : collecter, nettoyer et rendre disponibles les données dont tous les autres ont besoin. Métier peu visible, très demandé, et sans lequel rien ne fonctionne.',
    pourQui: 'Si l\'architecture et la fiabilité te parlent.',
  },
  {
    nom: 'Chercheuse en IA', emoji: '🧪',
    quotidien: 'Inventer de nouvelles méthodes, lire et écrire des articles scientifiques, expérimenter beaucoup pour des résultats incertains. En laboratoire public ou en entreprise.',
    pourQui: 'Si les questions ouvertes t\'excitent plus que les réponses attendues.',
  },
  {
    nom: 'Auditrice d\'algorithmes', emoji: '⚖️',
    quotidien: 'Exactement la mission 7, en vrai : vérifier qu\'un système automatisé ne discrimine pas, documenter ses limites, dialoguer avec juristes et dirigeants. Métier en création, porté par la réglementation européenne.',
    pourQui: 'Si tu veux du technique mais que la question « est-ce que c\'est juste ? » t\'intéresse autant que « est-ce que ça marche ? ».',
  },
];

interface Voie {
  nom: string;
  duree: string;
  description: string;
  couleur: string;
}

const VOIES: Voie[] = [
  {
    nom: 'BUT Science des données', duree: '3 ans · bac+3',
    couleur: 'var(--universe-1)',
    description: 'À l\'IUT, très orienté pratique et statistiques appliquées, avec des stages dès la première année. Permet d\'entrer dans la vie active à bac+3 ou de poursuivre en master.',
  },
  {
    nom: 'Licence puis Master', duree: '5 ans · bac+5',
    couleur: 'var(--universe-2)',
    description: 'Licence de mathématiques, d\'informatique ou MIASHS, puis un master orienté données ou intelligence artificielle. La voie universitaire, la plus souple et la plus répandue.',
  },
  {
    nom: 'Prépa puis école d\'ingénieur', duree: '5 ans · bac+5',
    couleur: 'var(--universe-3)',
    description: 'Deux ans de classe préparatoire scientifique, puis une école d\'ingénieur avec une spécialisation en données ou en IA. Exigeant, généraliste, très reconnu.',
  },
  {
    nom: 'École d\'ingénieur post-bac', duree: '5 ans · bac+5',
    couleur: 'var(--universe-4)',
    description: 'Intégrée directement après le bac, sans passer par la prépa. Le cursus est en cinq ans d\'un seul tenant.',
  },
];

export function renderHorizons(): void {
  const app = document.getElementById('app')!;

  app.innerHTML = `
    ${renderHeader('horizons')}
    <main class="page">
      <div class="page-content">

        <section class="fade-in" style="margin-bottom:40px">
          <div class="eyebrow" style="margin-bottom:10px">Après le lycée</div>
          <h1 class="t-xl" style="font-weight:700;margin-bottom:12px">
            Où mènent ces compétences
          </h1>
          <p class="t-md muted" style="max-width:640px;line-height:1.7">
            Tu as classé, mesuré, prédit, audité. Ce ne sont pas des exercices scolaires :
            ce sont les gestes quotidiens de métiers qui existent, qui recrutent,
            et dont certains viennent tout juste d'être inventés.
          </p>
        </section>

        <!-- L'angle qui compte le plus -->
        <section class="card slide-up" style="margin-bottom:44px;border-left:3px solid var(--accent)">
          <h2 class="t-lg" style="font-weight:700;margin-bottom:12px">
            Tu n'as pas à choisir entre la data et ce que tu aimes
          </h2>
          <p class="t-sm muted" style="line-height:1.75;margin-bottom:18px">
            C'est l'idée fausse la plus répandue sur ces métiers. La donnée n'est pas un
            domaine à part : c'est une compétence qui se greffe sur n'importe quel sujet.
            Les missions que tu as faites le montrent déjà.
          </p>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:14px">
            ${[
              ['🎾', 'Le sport', 'Les clubs professionnels emploient des analystes. Les statistiques de la mission 2 sont leur matière première.'],
              ['🎵', 'La musique', 'Recommandation, détection des tendances, analyse d\'audience : des équipes entières de data dans l\'industrie musicale.'],
              ['📚', 'L\'édition', 'Les éditeurs de mangas analysent ventes et audiences pour décider quelles séries prolonger — exactement la mission 5.'],
              ['💶', 'L\'économie', 'Discipline devenue massivement quantitative : les débats actuels se tranchent avec des données.'],
              ['🏥', 'La santé', 'Imagerie, épidémiologie, recherche de traitements — l\'un des terrains où l\'IA change le plus de choses.'],
              ['🌍', 'Le climat', 'Modéliser, mesurer, projeter : les sciences du climat sont des sciences de données.'],
            ].map(([e, t, d]) => `
              <div style="padding:14px;background:var(--bg-tertiary);border-radius:var(--radius-md)">
                <div style="font-size:var(--text-lg)">${e}</div>
                <div class="t-sm bold" style="margin:6px 0 4px">${t}</div>
                <div class="t-xs muted" style="line-height:1.6">${d}</div>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- Métiers -->
        <h2 class="t-lg" style="font-weight:700;margin-bottom:6px">Six métiers, concrètement</h2>
        <p class="t-sm muted" style="margin-bottom:20px">Ce à quoi ressemble vraiment une journée.</p>
        <section style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:16px;margin-bottom:44px" class="stagger">
          ${METIERS.map(m => `
            <div class="card">
              <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
                <span style="font-size:var(--text-lg)">${m.emoji}</span>
                <h3 class="t-md" style="font-weight:700">${m.nom}</h3>
              </div>
              <p class="t-sm muted" style="line-height:1.7;margin-bottom:12px">${m.quotidien}</p>
              <p class="t-xs" style="color:var(--accent);line-height:1.6">${m.pourQui}</p>
            </div>
          `).join('')}
        </section>

        <!-- Voies -->
        <h2 class="t-lg" style="font-weight:700;margin-bottom:6px">Quatre voies après le bac</h2>
        <p class="t-sm muted" style="margin-bottom:20px">
          Aucune n'est meilleure que les autres : elles mènent toutes au même endroit par des chemins différents.
        </p>
        <section style="display:grid;gap:12px;margin-bottom:44px" class="stagger">
          ${VOIES.map(v => `
            <div class="card" style="border-left:3px solid ${v.couleur}">
              <div style="display:flex;justify-content:space-between;align-items:baseline;gap:12px;flex-wrap:wrap">
                <h3 class="t-md" style="font-weight:700">${v.nom}</h3>
                <span class="t-xs dim bold">${v.duree}</span>
              </div>
              <p class="t-sm muted" style="line-height:1.7;margin-top:8px">${v.description}</p>
            </div>
          `).join('')}
        </section>

        <!-- Honnêteté -->
        <section class="card slide-up" style="margin-bottom:44px">
          <h2 class="t-lg" style="font-weight:700;margin-bottom:12px">Trois choses qu'on te dira rarement</h2>
          <div style="display:grid;gap:16px">
            <div>
              <div class="t-sm bold" style="margin-bottom:4px">Ce n'est pas réservé aux génies des maths.</div>
              <p class="t-sm muted" style="line-height:1.7">
                Il faut être à l'aise avec les maths, pas être un prodige. Les missions que tu viens
                de faire n'utilisent rien au-delà du programme de Terminale : des distances, des
                moyennes, une droite. Le reste est de la rigueur et de la curiosité.
              </p>
            </div>
            <div>
              <div class="t-sm bold" style="margin-bottom:4px">Le métier n'est pas « faire de l'IA ».</div>
              <p class="t-sm muted" style="line-height:1.7">
                Une grande partie du temps part à comprendre le problème, nettoyer des données
                en désordre et expliquer les résultats à des gens qui ne codent pas. Le modèle
                lui-même, c'est souvent la plus petite partie du travail.
              </p>
            </div>
            <div>
              <div class="t-sm bold" style="margin-bottom:4px">Tu peux changer d'avis en route.</div>
              <p class="t-sm muted" style="line-height:1.7">
                Ces compétences se transportent : vers la recherche, l'économie, la santé, le
                journalisme, le droit du numérique. Choisir cette voie à 17 ans ne t'enferme
                pas — c'est plutôt l'inverse.
              </p>
            </div>
          </div>
        </section>

        <!-- Sources -->
        <section class="card" style="margin-bottom:44px;background:var(--bg-tertiary)">
          <div class="eyebrow" style="margin-bottom:10px">Pour des informations officielles</div>
          <p class="t-sm muted" style="line-height:1.7">
            Cette page donne des repères, pas des conseils d'orientation. Les contenus de formation
            et les conditions d'admission changent chaque année : pour décider, appuie-toi sur
            l'<strong>ONISEP</strong>, sur <strong>Parcoursup</strong>, sur les journées portes
            ouvertes, et surtout parle à des gens qui font ces métiers — beaucoup acceptent
            volontiers de répondre à une lycéenne qui leur écrit.
          </p>
        </section>

        <section style="text-align:center;padding-bottom:40px">
          <a href="#/parcours" class="btn btn-primary hero-cta">← Retourner au parcours</a>
        </section>
      </div>
    </main>
  `;

  bindHeaderEvents();
}
