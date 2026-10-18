type RouteHandler = (params?: Record<string, string>) => void;

interface Route {
  pattern: RegExp;
  handler: RouteHandler;
  keys: string[];
}

const routes: Route[] = [];

export function route(path: string, handler: RouteHandler): void {
  const keys: string[] = [];
  const pattern = new RegExp(
    '^' + path.replace(/:(\w+)/g, (_, key) => {
      keys.push(key);
      return '([^/]+)';
    }) + '$'
  );
  routes.push({ pattern, handler, keys });
}

export function navigate(path: string): void {
  window.history.pushState(null, '', path);
  resolve();
}

export function resolve(): void {
  const path = window.location.hash.slice(1) || '/';
  for (const r of routes) {
    const match = path.match(r.pattern);
    if (match) {
      const params: Record<string, string> = {};
      r.keys.forEach((key, i) => { params[key] = match[i + 1]; });
      r.handler(params);
      return;
    }
  }
  if (routes.length > 0) routes[0].handler();
}

export function initRouter(): void {
  window.addEventListener('hashchange', resolve);
  resolve();
}
