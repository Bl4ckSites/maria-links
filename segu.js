/**********************************************************************************
 * Nome: segu.js
 * Descrição: Arquivo focado em proteção e segurança do site sem interferir no visual
 * Autor: Roger Bastos (@roger_19y)
 * Versão: 1.0
 **********************************************************************************/

/* ========== BLOQUEAR CÓPIA, COLAGEM E INSPEÇÃO EM CONTEÚDOS SENSÍVEIS ========== */
document.addEventListener('keydown', e => {
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const isCopy = e.ctrlKey || (isMac && e.metaKey);

  if (isCopy && ['c', 'x', 'v', 'u'].includes(e.key.toLowerCase())) {
    e.preventDefault();
    alert('Ação não permitida nesta seção.');
  }

  // Bloquear F12
  if (e.key === 'F12') {
    e.preventDefault();
    alert('Inspeção desativada neste site.');
  }

  // Bloquear Ctrl+Shift+I (devtools)
  if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'i') {
    e.preventDefault();
    alert('Ferramentas do desenvolvedor desativadas.');
  }
});

/* ========== BLOQUEAR BOTÃO DIREITO EM ELEMENTOS ESPECÍFICOS ========== */
document.addEventListener('contextmenu', e => {
  if (e.target.matches('img, .bloquear-direito')) {
    e.preventDefault();
    alert('Clique direito desativado para este conteúdo.');
  }
});

/* ========== BLOQUEAR ARRASTO DE IMAGENS ========== */
document.querySelectorAll('img').forEach(img => {
  img.addEventListener('dragstart', e => e.preventDefault());
});

/* ========== BLOQUEAR PRINTSCREEN E ESCURECER A TELA ========== */
document.addEventListener('keyup', e => {
  if (e.key === 'PrintScreen') {
    const blackout = document.createElement('div');
    Object.assign(blackout.style, {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: '#000',
      opacity: 1,
      zIndex: 999999
    });
    document.body.appendChild(blackout);
    setTimeout(() => blackout.remove(), 1000);
  }
});

/* ========== BLOQUEAR SELEÇÃO DE TEXTO EM CLASSES SENSÍVEIS ========== */
document.addEventListener('selectstart', e => {
  if (e.target.matches('.no-select, img')) {
    e.preventDefault();
  }
});

/* ========== BLOQUEAR ZOOM (CTRL + + / - / mousewheel com Ctrl) ========== */
window.addEventListener('wheel', e => {
  if (e.ctrlKey) {
    e.preventDefault();
  }
}, { passive: false });

document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && ['+', '-', '='].includes(e.key)) {
    e.preventDefault();
  }
});

/* ========== ESCONDER CÓDIGO-FONTE HTML (TRUQUE LEVE) ========== */
Object.defineProperty(document, 'cookie', {
  get: function () {
    alert('Acesso restrito ao cookie.');
    return '';
  },
  set: function () {
    alert('Modificação de cookie bloqueada.');
  }
});

/* ========== PROTEÇÃO DE CONSOLE.LOG SENSÍVEL ========== */
(function () {
  const originalLog = console.log;
  console.log = function (...args) {
    if (args.join(' ').toLowerCase().includes('senha') || args.join(' ').includes('token')) {
      originalLog('Acesso negado.');
    } else {
      originalLog.apply(console, args);
    }
  };
})();