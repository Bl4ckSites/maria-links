/**********************************************************************************
 * Nome: ux_utils.js
 * Descrição: Utilitários de UX e performance – lazy‐load, theme switcher, network,
 *            scroll to top, debounce/throttle, service worker, performance.
 * Autor: Roger Bastos (@roger_19y)
 * Versão: 1.0
 **********************************************************************************/

// 1) UTILITÁRIOS DEFUNÇÕES: DEBOUNCE e THROTTLE
export function debounce(fn, delay = 200) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

export function throttle(fn, limit = 100) {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      fn.apply(this, args);
    }
  };
}

// 2) LAZY-LOAD PARA IMAGENS E IFRAME
export function initLazyLoad() {
  if (!('IntersectionObserver' in window)) return; 
  const obs = new IntersectionObserver((entries, observer) => {
    entries.forEach(({ isIntersecting, target }) => {
      if (!isIntersecting) return;
      const src = target.dataset.src;
      if (src) {
        target.src = src;
        target.onload = () => target.classList.add('loaded');
      }
      observer.unobserve(target);
    });
  }, { rootMargin: '0px 0px 200px 0px', threshold: 0.01 });

  document.querySelectorAll('img[data-src], iframe[data-src]').forEach(el => {
    obs.observe(el);
  });
}

// 3) MODO DARK / LIGHT COM PREFEÊNCIA
export function initThemeSwitcher() {
  const toggle = document.getElementById('theme-toggle');
  const userPref = localStorage.getItem('theme');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = userPref || (systemDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);

  if (toggle) {
    toggle.checked = (theme === 'dark');
    toggle.addEventListener('change', () => {
      const newTheme = toggle.checked ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }
}

// 4) DETECÇÃO DE STATUS DE REDE
export function initNetworkStatus() {
  function updateStatus() {
    const banner = document.getElementById('network-banner');
    if (!banner) return;
    if (navigator.onLine) {
      banner.textContent = 'Você está online ✔️';
      banner.classList.remove('offline');
    } else {
      banner.textContent = 'Você está offline ❌';
      banner.classList.add('offline');
    }
    banner.classList.add('visible');
    setTimeout(() => banner.classList.remove('visible'), 3000);
  }
  window.addEventListener('online',  updateStatus);
  window.addEventListener('offline', updateStatus);
  updateStatus();
}

// 5) BOTÃO “SCROLL TO TOP”
export function initScrollTop() {
  const btn = document.createElement('button');
  btn.id = 'scrollTopBtn';
  btn.title = 'Voltar ao topo';
  btn.innerHTML = '↑';
  document.body.appendChild(btn);

  const showBtn = throttle(() => {
    if (window.scrollY > window.innerHeight) btn.classList.add('show');
    else btn.classList.remove('show');
  }, 200);

  window.addEventListener('scroll', showBtn);
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// 6) REGISTRO DE SERVICE WORKER
export function initServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(reg => console.log('[SW] Registrado com sucesso:', reg.scope))
        .catch(err => console.warn('[SW] Falha ao registrar:', err));
    });
  }
}

// 7) MÉTRICAS SIMPLES DE PERFORMANCE (FCP / LCP básico)
export function initPerfMetrics() {
  if (!PerformanceObserver) return;
  const obs = new PerformanceObserver(list => {
    list.getEntries().forEach(entry => {
      console.log(`[Perf] ${entry.name}: ${Math.round(entry.startTime + entry.duration)}ms`);
    });
  });
  obs.observe({ type: 'paint', buffered: true });
}

// 8) INICIALIZAÇÃO AUTOMÁTICA
export function initUxUtils() {
  initLazyLoad();
  initThemeSwitcher();
  initNetworkStatus();
  initScrollTop();
  initServiceWorker();
  initPerfMetrics();
}

// Auto‐init quando usar <script type="module" defer src="ux_utils.js">
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', initUxUtils);
}