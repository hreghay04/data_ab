// Inline SVG explainers for the `learn` steps. Written as CSS `style` attributes
// (not presentation attributes) so var() actually resolves and the figures
// follow the light/dark theme.

const ink = 'style="fill:var(--text-primary)"';
const dim = 'style="fill:var(--text-tertiary)"';
const muted = 'style="fill:var(--text-secondary)"';
const stroke = 'style="stroke:var(--text-tertiary);fill:none"';

function frame(titre: string, legende: string, inner: string, h = 230): string {
  return `
  <figure class="fig">
    <div class="eyebrow" style="margin-bottom:12px">${titre}</div>
    <svg viewBox="0 0 560 ${h}" style="font-family:var(--font-sans)" role="img" aria-label="${titre}">
      ${inner}
    </svg>
    <figcaption class="t-xs dim" style="margin-top:10px;line-height:1.5">${legende}</figcaption>
  </figure>`;
}

// ---------------------------------------------------------------- moyenne/médiane
const moyenneMediane = frame(
  'Pourquoi la moyenne se laisse tirer',
  'Cinq matchs ordinaires et un match exceptionnel. La médiane ne bouge pas ; la moyenne est entraînée vers l\'exception.',
  `
  <line x1="40" y1="120" x2="520" y2="120" style="stroke:var(--text-tertiary);stroke-width:1.5"/>
  ${[0, 10, 20, 30, 40].map(v => {
    const x = 40 + (v / 40) * 480;
    return `<line x1="${x}" y1="115" x2="${x}" y2="125" style="stroke:var(--text-tertiary);stroke-width:1.5"/>
            <text x="${x}" y="142" text-anchor="middle" font-size="11" ${dim}>${v}</text>`;
  }).join('')}
  ${[5, 6, 7, 7, 8].map((v, i) => {
    const x = 40 + (v / 40) * 480;
    return `<circle cx="${x}" cy="${98 - (i % 2) * 16}" r="7" style="fill:var(--universe-4)"/>`;
  }).join('')}
  <circle cx="${40 + (35 / 40) * 480}" cy="98" r="9" style="fill:var(--error)"/>
  <text x="${40 + (35 / 40) * 480}" y="78" text-anchor="middle" font-size="11" ${muted}>le match fou</text>

  <line x1="${40 + (7 / 40) * 480}" y1="120" x2="${40 + (7 / 40) * 480}" y2="176"
        style="stroke:var(--universe-4);stroke-width:2.5"/>
  <text x="${40 + (7 / 40) * 480}" y="194" text-anchor="middle" font-size="12" style="fill:var(--universe-4);font-weight:700">médiane 7</text>

  <line x1="${40 + (11.3 / 40) * 480}" y1="120" x2="${40 + (11.3 / 40) * 480}" y2="208"
        style="stroke:var(--error);stroke-width:2.5"/>
  <text x="${40 + (11.3 / 40) * 480}" y="226" text-anchor="middle" font-size="12" style="fill:var(--error);font-weight:700">moyenne 11,3</text>

  <path d="M ${40 + (7.6 / 40) * 480} 158 Q ${40 + (9.5 / 40) * 480} 150 ${40 + (10.9 / 40) * 480} 158"
        style="stroke:var(--error);fill:none;stroke-width:1.5" marker-end="url(#fl)"/>
  <defs><marker id="fl" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
    <path d="M0,0 L7,3.5 L0,7 z" style="fill:var(--error)"/></marker></defs>
  `, 240);

// ---------------------------------------------------------------- k plus proches voisins
const knn = frame(
  'Les k plus proches voisins — ici k = 5',
  'Le point noir est le manga à classer. On regarde ses 5 voisins les plus proches : 4 Seinen contre 1 Shonen, donc on prédit Seinen.',
  `
  <text x="12" y="20" font-size="11" ${dim}>romance →</text>
  <line x1="40" y1="200" x2="40" y2="30" ${stroke} stroke-width="1.5"/>
  <line x1="40" y1="200" x2="400" y2="200" ${stroke} stroke-width="1.5"/>
  <text x="360" y="218" font-size="11" ${dim}>action →</text>

  ${[[90, 70], [120, 55], [75, 95], [140, 80], [105, 110]].map(([x, y]) =>
    `<circle cx="${x}" cy="${y}" r="6" style="fill:var(--universe-2)"/>`).join('')}
  ${[[300, 95], [330, 120], [285, 135], [345, 80], [260, 110], [315, 155]].map(([x, y]) =>
    `<circle cx="${x}" cy="${y}" r="6" style="fill:var(--error)"/>`).join('')}
  ${[[200, 165], [235, 180], [175, 150]].map(([x, y]) =>
    `<circle cx="${x}" cy="${y}" r="6" style="fill:var(--universe-1)"/>`).join('')}

  <circle cx="305" cy="120" r="62" style="fill:none;stroke:var(--accent);stroke-width:2;stroke-dasharray:5 4"/>
  <circle cx="305" cy="120" r="9" ${ink}/>
  <text x="305" y="125" text-anchor="middle" font-size="11" style="fill:var(--bg-primary);font-weight:700">?</text>

  <rect x="420" y="55" width="130" height="118" rx="10"
        style="fill:var(--bg-secondary);stroke:var(--border)"/>
  <text x="435" y="78" font-size="11" style="fill:var(--text-secondary);font-weight:700">Le vote</text>
  <circle cx="443" cy="98" r="5" style="fill:var(--error)"/>
  <text x="456" y="102" font-size="11" ${muted}>Seinen × 4</text>
  <circle cx="443" cy="120" r="5" style="fill:var(--universe-1)"/>
  <text x="456" y="124" font-size="11" ${muted}>Shonen × 1</text>
  <line x1="435" y1="134" x2="535" y2="134" style="stroke:var(--border)"/>
  <text x="435" y="156" font-size="12" style="fill:var(--accent);font-weight:700">→ Seinen</text>
  `, 230);

// ---------------------------------------------------------------- corrélation
function nuage(cx: number, titre: string, r: string, points: number[][]): string {
  return `
  <g transform="translate(${cx},0)">
    <rect x="0" y="20" width="150" height="130" rx="8" style="fill:var(--bg-secondary);stroke:var(--border)"/>
    ${points.map(([x, y]) => `<circle cx="${20 + x * 110}" cy="${140 - y * 110}" r="4" style="fill:var(--accent)"/>`).join('')}
    <text x="75" y="172" text-anchor="middle" font-size="13" style="fill:var(--text-primary);font-weight:700">${titre}</text>
    <text x="75" y="190" text-anchor="middle" font-size="11" ${dim}>r = ${r}</text>
  </g>`;
}
const correlation = frame(
  'À quoi ressemble un coefficient de corrélation',
  'Le signe donne le sens de la pente, la valeur absolue indique à quel point les points serrent la tendance. Un r proche de 0 ne veut pas dire « aucune relation » — seulement aucune relation linéaire.',
  nuage(20, 'Lien positif', '+0,9',
    [[0.1, 0.15], [0.25, 0.3], [0.35, 0.28], [0.5, 0.55], [0.6, 0.5], [0.72, 0.75], [0.85, 0.8], [0.95, 0.92]]) +
  nuage(205, 'Aucun lien', '0,0',
    [[0.1, 0.7], [0.3, 0.2], [0.45, 0.85], [0.55, 0.4], [0.7, 0.15], [0.8, 0.65], [0.9, 0.35], [0.2, 0.5]]) +
  nuage(390, 'Lien négatif', '−0,9',
    [[0.1, 0.9], [0.22, 0.8], [0.35, 0.72], [0.5, 0.5], [0.62, 0.45], [0.75, 0.3], [0.88, 0.2], [0.95, 0.1]]),
  200);

// ---------------------------------------------------------------- régression et résidus
const regression = frame(
  'La droite et ce qu\'elle rate',
  'La régression cherche la droite qui rend la somme des carrés de ces écarts la plus petite possible. Chaque trait pointillé est un résidu : la part que le modèle n\'explique pas.',
  `
  <line x1="50" y1="190" x2="50" y2="25" ${stroke} stroke-width="1.5"/>
  <line x1="50" y1="190" x2="520" y2="190" ${stroke} stroke-width="1.5"/>
  <text x="8" y="30" font-size="11" ${dim}>salaire</text>
  <text x="455" y="208" font-size="11" ${dim}>années d'études</text>

  <line x1="60" y1="170" x2="510" y2="55" style="stroke:var(--accent);stroke-width:2.5"/>

  ${[[110, 150, 141], [170, 110, 126], [230, 130, 111], [290, 70, 95],
     [350, 100, 80], [410, 40, 65], [470, 72, 49]].map(([x, y, ly]) => `
    <line x1="${x}" y1="${y}" x2="${x}" y2="${ly}" style="stroke:var(--error);stroke-width:1.5;stroke-dasharray:3 3"/>
    <circle cx="${x}" cy="${y}" r="5.5" style="fill:var(--universe-4)"/>`).join('')}

  <text x="300" y="36" font-size="11" style="fill:var(--accent);font-weight:700">droite de régression</text>
  <text x="120" y="182" font-size="11" style="fill:var(--error)">écart (résidu)</text>
  `, 215);

// ---------------------------------------------------------------- variable proxy
const proxy = frame(
  'Pourquoi cacher une variable ne suffit pas',
  'On empêche le modèle de lire le lycée, mais l\'accès à l\'option dépend du lycée. L\'information arrive quand même, par un détour.',
  `
  <rect x="20" y="80" width="130" height="54" rx="10" style="fill:var(--bg-secondary);stroke:var(--border);stroke-width:1.5"/>
  <text x="85" y="104" text-anchor="middle" font-size="12" style="fill:var(--text-primary);font-weight:700">Lycée</text>
  <text x="85" y="121" text-anchor="middle" font-size="10" ${dim}>urbain / rural</text>

  <rect x="215" y="150" width="140" height="54" rx="10" style="fill:var(--warning-light);stroke:var(--warning);stroke-width:1.5"/>
  <text x="285" y="174" text-anchor="middle" font-size="12" style="fill:var(--warning);font-weight:700">Option maths</text>
  <text x="285" y="191" text-anchor="middle" font-size="10" ${muted}>le proxy</text>

  <rect x="410" y="80" width="130" height="54" rx="10" style="fill:var(--bg-secondary);stroke:var(--border);stroke-width:1.5"/>
  <text x="475" y="104" text-anchor="middle" font-size="12" style="fill:var(--text-primary);font-weight:700">Le modèle</text>
  <text x="475" y="121" text-anchor="middle" font-size="10" ${dim}>décide</text>

  <line x1="150" y1="107" x2="400" y2="107" style="stroke:var(--text-tertiary);stroke-width:2;stroke-dasharray:6 5"/>
  <g transform="translate(275,107)">
    <circle r="17" style="fill:var(--bg-tertiary);stroke:var(--error);stroke-width:2"/>
    <line x1="-8" y1="-8" x2="8" y2="8" style="stroke:var(--error);stroke-width:2.5"/>
    <line x1="-8" y1="8" x2="8" y2="-8" style="stroke:var(--error);stroke-width:2.5"/>
  </g>
  <text x="275" y="72" text-anchor="middle" font-size="11" style="fill:var(--error);font-weight:700">variable cachée</text>

  <path d="M 85 134 L 85 177 L 215 177" style="stroke:var(--warning);stroke-width:2.5;fill:none" marker-end="url(#fw)"/>
  <path d="M 355 177 L 475 177 L 475 134" style="stroke:var(--warning);stroke-width:2.5;fill:none" marker-end="url(#fw)"/>
  <defs><marker id="fw" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
    <path d="M0,0 L8,4 L0,8 z" style="fill:var(--warning)"/></marker></defs>
  `, 215);

// ---------------------------------------------------------------- k-means
function panneau(x: number, n: string, titre: string, contenu: string): string {
  return `
  <g transform="translate(${x},0)">
    <rect x="0" y="26" width="122" height="116" rx="9" style="fill:var(--bg-secondary);stroke:var(--border)"/>
    <circle cx="14" cy="16" r="11" style="fill:var(--accent)"/>
    <text x="14" y="20" text-anchor="middle" font-size="11" style="fill:#fff;font-weight:700">${n}</text>
    <text x="34" y="20" font-size="11" style="fill:var(--text-primary);font-weight:700">${titre}</text>
    ${contenu}
  </g>`;
}
const pts = [[30, 50], [52, 38], [40, 70], [88, 60], [100, 88], [78, 100], [55, 112], [95, 45]];
const kmeans = frame(
  'Les k-moyennes, étape par étape',
  'On place des centres au hasard, chaque point rejoint le plus proche, les centres se replacent au milieu de leur groupe, et on recommence jusqu\'à ce que plus rien ne bouge.',
  panneau(10, '1', 'Au hasard',
    pts.map(([x, y]) => `<circle cx="${x}" cy="${y + 26}" r="4.5" ${dim}/>`).join('') +
    `<path d="M 36 66 l 8 8 M 44 66 l -8 8" style="stroke:var(--accent);stroke-width:2.5"/>
     <path d="M 92 100 l 8 8 M 100 100 l -8 8" style="stroke:var(--universe-4);stroke-width:2.5"/>`) +
  panneau(152, '2', 'Chacun rejoint',
    pts.map(([x, y]) => {
      const c = Math.hypot(x - 40, y - 44) < Math.hypot(x - 96, y - 78);
      return `<circle cx="${x}" cy="${y + 26}" r="4.5" style="fill:var(${c ? '--accent' : '--universe-4'})"/>`;
    }).join('') +
    `<path d="M 36 66 l 8 8 M 44 66 l -8 8" style="stroke:var(--accent);stroke-width:2.5"/>
     <path d="M 92 100 l 8 8 M 100 100 l -8 8" style="stroke:var(--universe-4);stroke-width:2.5"/>`) +
  panneau(294, '3', 'Centres déplacés',
    pts.map(([x, y]) => {
      const c = Math.hypot(x - 40, y - 44) < Math.hypot(x - 96, y - 78);
      return `<circle cx="${x}" cy="${y + 26}" r="4.5" style="fill:var(${c ? '--accent' : '--universe-4'})"/>`;
    }).join('') +
    `<path d="M 40 78 l 8 8 M 48 78 l -8 8" style="stroke:var(--accent);stroke-width:2.5"/>
     <path d="M 84 108 l 8 8 M 92 108 l -8 8" style="stroke:var(--universe-4);stroke-width:2.5"/>`) +
  panneau(436, '4', 'Stable',
    pts.map(([x, y]) => {
      const c = Math.hypot(x - 44, y - 56) < Math.hypot(x - 88, y - 86);
      return `<circle cx="${x}" cy="${y + 26}" r="4.5" style="fill:var(${c ? '--accent' : '--universe-4'})"/>`;
    }).join('') +
    `<path d="M 40 78 l 8 8 M 48 78 l -8 8" style="stroke:var(--accent);stroke-width:2.5"/>
     <path d="M 84 108 l 8 8 M 92 108 l -8 8" style="stroke:var(--universe-4);stroke-width:2.5"/>`),
  160);

// ---------------------------------------------------------------- axe tronqué
function barres(x: number, titre: string, base: number, couleur: string, note: string): string {
  const vals = [84, 82, 81, 79];
  return `
  <g transform="translate(${x},0)">
    <text x="115" y="18" text-anchor="middle" font-size="12" style="fill:${couleur};font-weight:700">${titre}</text>
    <line x1="34" y1="150" x2="230" y2="150" ${stroke} stroke-width="1.5"/>
    <line x1="34" y1="150" x2="34" y2="32" ${stroke} stroke-width="1.5"/>
    ${vals.map((v, i) => {
      const h = ((v - base) / (100 - base)) * 115;
      return `<rect x="${48 + i * 45}" y="${150 - h}" width="30" height="${h}" rx="3" style="fill:${couleur}"/>
              <text x="${63 + i * 45}" y="165" text-anchor="middle" font-size="9" ${dim}>${v}%</text>`;
    }).join('')}
    <text x="28" y="154" text-anchor="end" font-size="9" ${dim}>${base}</text>
    <text x="28" y="38" text-anchor="end" font-size="9" ${dim}>100</text>
    <text x="115" y="186" text-anchor="middle" font-size="10" ${muted}>${note}</text>
  </g>`;
}
const axeTronque = frame(
  'Les mêmes chiffres, deux impressions',
  'Rien n\'a changé dans les données : seule l\'origine de l\'axe vertical diffère. Premier réflexe devant un graphique en barres : vérifier où commence l\'axe.',
  barres(10, '😱 Écrasant !', 78, 'var(--error)', 'axe de 78 à 100') +
  barres(300, '📊 Honnête', 0, 'var(--universe-4)', 'axe de 0 à 100'),
  195);

export const DIAGRAMS: Record<string, string> = {
  'moyenne-mediane': moyenneMediane,
  'knn': knn,
  'correlation': correlation,
  'regression': regression,
  'proxy': proxy,
  'kmeans': kmeans,
  'axe-tronque': axeTronque,
};

// Replaces [[fig:key]] placeholders. Run AFTER markdown so the SVG markup is
// never mangled by the newline-to-<br> pass.
export function injectFigures(html: string): string {
  return html.replace(/\[\[fig:([a-z-]+)\]\]/g, (_, key) => DIAGRAMS[key] || '');
}
