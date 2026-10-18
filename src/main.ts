import './styles/global.css';
import { route, initRouter } from './utils/router';
import { initTheme } from './utils/theme';
import { renderHome } from './pages/home';
import { renderParcours } from './pages/parcours';
import { renderLabo } from './pages/labo';
import { renderMission } from './pages/mission';

initTheme();

route('/', () => renderHome());
route('/parcours', () => renderParcours());
route('/labo', () => renderLabo());
route('/mission/:id', (params) => {
  if (params?.id) renderMission(params.id);
});

initRouter();
