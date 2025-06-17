/**********************************************************************************

Nome: javascript.js

Descrição: Manipulação de interações, proteções, animações e mensagens do site

Autor: Roger Bastos (@roger_19y)

Créditos: Site criado como hobby, sem fins lucrativos. Obrigado por visitar!

Para: Maria 

Versão: 4.0 - Premium Experience
**********************************************************************************/

console.info("Seja bem-vindo ao site!"); 
console.info("Criado por: Roger Bastos (@roger_19y)"); 
console.info("Este site é um projeto de hobby, sem fins financeiros.");

/* ======================== CONSTANTES E CONFIGURAÇÕES ======================== */
const SITE_CONFIG = {
  ALERT_DURATION: 3500,
  MAX_ZOOM: 1.5,
  PARALLAX_FACTOR: 0.3,
  CURSOR_SIZE: 20,
  ROTATION_DURATION: 1000,
  ANIMATION_DELAY: 100
};

/* ======================== ALERTA PERSONALIZADO ======================== */
let currentAlert = null;

function customAlert(message, targetEl, type = 'info') {
  if (currentAlert) currentAlert.remove();
  
  const alertBox = document.createElement('div');
  alertBox.className = `custom-alert alert-${type}`;
  
  const icon = document.createElement('span');
  icon.className = 'alert-icon';
  icon.innerHTML = type === 'warning' ? '⚠️' : 'ℹ️';
  
  const text = document.createElement('span');
  text.className = 'alert-text';
  text.textContent = message;
  
  alertBox.appendChild(icon);
  alertBox.appendChild(text);
  
  if (targetEl) {
    const rect = targetEl.getBoundingClientRect();
    alertBox.style.top = `${rect.bottom + window.scrollY + 10}px`;
    alertBox.style.left = `${rect.left + window.scrollX + rect.width / 2}px`;
    alertBox.style.transform = 'translate(-50%, 0)';
  } else {
    alertBox.style.top = '20px';
    alertBox.style.left = '50%';
    alertBox.style.transform = 'translateX(-50%)';
  }

  document.body.appendChild(alertBox);
  currentAlert = alertBox;
  
  setTimeout(() => {
    alertBox.style.animation = 'fadeOut 0.5s forwards';
    alertBox.addEventListener('animationend', () => {
      alertBox.remove();
      currentAlert = null;
    });
  }, SITE_CONFIG.ALERT_DURATION);
}

/* ======================== PROTEÇÃO DE IMAGENS AVANÇADA ======================== */
function protectImages() {
  console.log("Proteção de imagens ativada");
  
  // Proteção contra clique direito e arrastar
  document.addEventListener('contextmenu', e => {
    if (e.target.matches('.preview-image, .profile-photo, .package-image')) {
      e.preventDefault();
      customAlert('Conteúdo protegido!', e.target, 'warning');
    }
  });
  
  document.querySelectorAll('.preview-image, .profile-photo, .package-image').forEach(img => {
    img.addEventListener('dragstart', e => e.preventDefault());
    
    // Proteção adicional contra captura de tela
    img.style.setProperty('user-select', 'none');
    img.style.setProperty('-webkit-user-drag', 'none');
  });
  
  // Bloqueio de ferramentas de desenvolvedor
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'C' || e.key === 'J')) {
      e.preventDefault();
      customAlert('Acesso às ferramentas de desenvolvedor bloqueado', null, 'warning');
    }
  });
}

/* ======================== BLOQUEIO DE PRÉ-VISUALIZAÇÕES ======================== */
function setupPreviews() {
  console.log("Bloqueio de visualização ativado para itens premium");
  
  document.querySelectorAll('.preview-item').forEach(item => {
    item.removeAttribute('href');
    item.style.cursor = 'default';
    
    item.addEventListener('contextmenu', e => e.preventDefault());
    item.addEventListener('dragstart', e => e.preventDefault());
    
    item.addEventListener('click', e => {
      e.preventDefault();
      customAlert('Compre este pacote para acessar o conteúdo exclusivo!', item, 'warning');
      
      // Animação de "negação"
      item.animate([
        { transform: 'translateX(0)' },
        { transform: 'translateX(-10px)' },
        { transform: 'translateX(10px)' },
        { transform: 'translateX(0)' }
      ], {
        duration: 400,
        iterations: 2
      });
    });
  });
}

/* ======================== SEGURANÇA DE TECLAS E CÓPIA ======================== */
function enhanceSecurity() {
  console.log("Segurança de teclas e proteção contra cópia ativada");
  
  document.addEventListener('keydown', e => {
    // Bloqueio de PrintScreen
    if (e.key === 'PrintScreen') {
      e.preventDefault();
      customAlert('Captura de tela desativada neste site.', null, 'warning');
    }
    
    // Bloqueio de combinações de teclas
    if (e.ctrlKey && ['c', 'x', 'v'].includes(e.key.toLowerCase())) {
      if (document.activeElement.closest('.preview-image, .profile-photo, .package-image')) {
        e.preventDefault();
        customAlert('Copiar/colar desativado para este conteúdo.', null, 'warning');
      }
    }
    
    // Bloqueio de F12 e menu de contexto
    if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
      e.preventDefault();
      customAlert('Acesso às ferramentas de desenvolvedor bloqueado', null, 'warning');
    }
  });
  
  // Proteção contra seleção de texto
  document.addEventListener('selectstart', e => {
    if (e.target.matches('.preview-image, .profile-photo, .package-image, .preview-item')) {
      e.preventDefault();
    }
  });
  
  // Proteção contra cópia via menu de contexto
  document.addEventListener('contextmenu', e => {
    if (e.target.matches('.package-features, .package-title, .profile-info')) {
      e.preventDefault();
      customAlert('Conteúdo protegido contra cópia.', e.target, 'warning');
    }
  });
}

/* ======================== LIMITAR ZOOM EM MOBILE ======================== */
function limitZoom() {
  const metaExists = document.querySelector('meta[name="viewport"]');
  if (!metaExists) {
    const viewport = document.createElement('meta');
    viewport.name = 'viewport';
    viewport.content = `width=device-width, initial-scale=1.0, maximum-scale=${SITE_CONFIG.MAX_ZOOM}, user-scalable=yes`;
    document.head.appendChild(viewport);
  }
  
  document.addEventListener('touchmove', e => {
    if (window.visualViewport?.scale > SITE_CONFIG.MAX_ZOOM) {
      e.preventDefault();
      customAlert('Zoom máximo permitido atingido', null, 'info');
    }
  }, { passive: false });
}

/* ======================== PARALLAX NA FOTO DE CAPA ======================== */
function setupParallax() {
  const cover = document.querySelector('.cover-photo');
  if (!cover) return;
  
  // Adiciona profundidade com múltiplas camadas
  const layers = [
    { element: cover, speed: 0.3 },
    { element: document.querySelector('.profile-container'), speed: 0.15 }
  ].filter(layer => layer.element);
  
  window.addEventListener('scroll', () => {
    const y = window.pageYOffset;
    
    layers.forEach(layer => {
      layer.element.style.transform = `translateY(${y * layer.speed}px)`;
    });
  });
}

/* ======================== CURSOR PERSONALIZADO AVANÇADO ======================== */
function setupCustomCursor() {
  // Cria o cursor personalizado se não existir
  if (!document.querySelector('.custom-cursor')) {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
  }
  
  const customCursor = document.querySelector('.custom-cursor');
  if (!customCursor) return;
  
  // Configuração do cursor
  customCursor.style.width = `${SITE_CONFIG.CURSOR_SIZE}px`;
  customCursor.style.height = `${SITE_CONFIG.CURSOR_SIZE}px`;
  
  // Movimento do cursor
  document.addEventListener('mousemove', e => {
    customCursor.style.transform = `translate(${e.clientX - SITE_CONFIG.CURSOR_SIZE/2}px, ${e.clientY - SITE_CONFIG.CURSOR_SIZE/2}px)`;
  });
  
  // Efeito de clique
  document.addEventListener('mousedown', () => {
    customCursor.classList.add('click');
    customCursor.style.transform += ' scale(0.7)';
  });
  
  document.addEventListener('mouseup', () => {
    customCursor.classList.remove('click');
    customCursor.style.transform = customCursor.style.transform.replace(' scale(0.7)', '');
  });
  
  // Efeitos especiais em elementos interativos
  const interactiveElements = document.querySelectorAll('a, button, .link-button, .package-button');
  
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      customCursor.classList.add('hover');
      customCursor.style.transform += ' scale(1.5)';
    });
    
    el.addEventListener('mouseleave', () => {
      customCursor.classList.remove('hover');
      customCursor.style.transform = customCursor.style.transform.replace(' scale(1.5)', '');
    });
  });
}

/* ======================== ANIMAÇÕES DE SURGIMENTO ======================== */
function setupEntranceAnimations() {
  // Configuração do IntersectionObserver para animações
  const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observerCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Animação personalizada baseada no tipo de elemento
        if (entry.target.classList.contains('link-button')) {
          entry.target.style.animation = 'slideInFromLeft 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards';
        } 
        else if (entry.target.classList.contains('package-item')) {
          entry.target.style.animation = 'floatIn 1s ease-out forwards';
        }
        else {
          entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
        }
        
        observer.unobserve(entry.target);
      }
    });
  };
  
  const observer = new IntersectionObserver(observerCallback, observerOptions);
  
  // Elementos para animar
  const elementsToAnimate = document.querySelectorAll(
    '.header-container, .link-button, .package-item, .section-title, .footer-container'
  );
  
  elementsToAnimate.forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
  });
}

/* ======================== ROTAÇÃO DE PERFIL INTERATIVA ======================== */
function setupProfileRotation() {
  const profileFrame = document.querySelector('.profile-frame');
  if (!profileFrame) return;
  
  // Rotação ao clicar
  profileFrame.addEventListener('click', () => {
    profileFrame.style.transition = 'transform 1s ease';
    profileFrame.style.transform = 'rotateY(360deg)';
    
    setTimeout(() => {
      profileFrame.style.transition = '';
      profileFrame.style.transform = '';
    }, SITE_CONFIG.ROTATION_DURATION);
  });
  
  // Efeito 3D ao mover o mouse
  document.addEventListener('mousemove', e => {
    if (window.innerWidth < 1024) return; // Apenas para desktop
    
    const rect = profileFrame.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;
    
    const rotateY = deltaX / 20;
    const rotateX = -deltaY / 20;
    
    profileFrame.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });
  
  // Reset ao sair
  profileFrame.addEventListener('mouseleave', () => {
    profileFrame.style.transform = '';
    profileFrame.style.transition = 'transform 0.5s ease';
    
    setTimeout(() => {
      profileFrame.style.transition = '';
    }, 500);
  });
}

/* ======================== EFEITOS DE HOVER ESPECIAIS ======================== */
function setupHoverEffects() {
  // Efeito nos botões
  document.querySelectorAll('.link-button, .package-button').forEach(button => {
    button.addEventListener('mouseenter', () => {
      button.animate([
        { transform: 'scale(1)' },
        { transform: 'scale(1.05)' }
      ], {
        duration: 300,
        fill: 'forwards'
      });
    });
    
    button.addEventListener('mouseleave', () => {
      button.animate([
        { transform: 'scale(1.05)' },
        { transform: 'scale(1)' }
      ], {
        duration: 300,
        fill: 'forwards'
      });
    });
  });
  
  // Efeito nas imagens dos pacotes
  document.querySelectorAll('.package-image-container').forEach(container => {
    container.addEventListener('mouseenter', () => {
      const image = container.querySelector('.package-image');
      if (image) {
        image.animate([
          { transform: 'scale(1)' },
          { transform: 'scale(1.1)' }
        ], {
          duration: 500,
          fill: 'forwards'
        });
      }
    });
    
    container.addEventListener('mouseleave', () => {
      const image = container.querySelector('.package-image');
      if (image) {
        image.animate([
          { transform: 'scale(1.1)' },
          { transform: 'scale(1)' }
        ], {
          duration: 500,
          fill: 'forwards'
        });
      }
    });
  });
}

/* ======================== ANIMAÇÕES DE COMPRA ======================== */
function setupPurchaseAnimations() {
  document.querySelectorAll('.package-button').forEach(button => {
    button.addEventListener('click', (e) => {
      if (button.classList.contains('loading')) return;
      
      // Efeito de clique
      e.preventDefault();
      button.classList.add('loading');
      button.innerHTML = '<div class="spinner"></div>Processando...';
      
      // Simulação de processamento
      setTimeout(() => {
        button.classList.remove('loading');
        button.innerHTML = 'COMPRAR AGORA <span class="payment-method">NO PIX</span>';
        
        // Efeito de confirmação
        customAlert('Compra processada com sucesso!', button, 'info');
        
        button.animate([
          { backgroundColor: '#ff4081' },
          { backgroundColor: '#4caf50' },
          { backgroundColor: '#ff4081' }
        ], {
          duration: 1000,
          iterations: 1
        });
      }, 2000);
    });
  });
}

/* ======================== SISTEMA DE NOTIFICAÇÕES ======================== */
function setupNotifications() {
  const notificationCenter = document.createElement('div');
  notificationCenter.id = 'notification-center';
  document.body.appendChild(notificationCenter);
  
  // Exemplo: Notificação de boas-vindas
  setTimeout(() => {
    showNotification('Bem-vindo ao conteúdo exclusivo! 🔞', 'info');
  }, 2000);
  
  // Exemplo: Notificação de promoção
  setTimeout(() => {
    showNotification('Promoção especial: Pacote Premium com 20% OFF!', 'promo');
  }, 10000);
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  
  const icon = type === 'promo' ? '🔥' : '🔔';
  notification.innerHTML = `<span class="notification-icon">${icon}</span> ${message}`;
  
  const notificationCenter = document.getElementById('notification-center');
  notificationCenter.appendChild(notification);
  
  // Animação de entrada
  notification.animate([
    { transform: 'translateX(100%)', opacity: 0 },
    { transform: 'translateX(0)', opacity: 1 }
  ], {
    duration: 500,
    fill: 'forwards'
  });
  
  // Auto-remover após 5 segundos
  setTimeout(() => {
    notification.animate([
      { transform: 'translateX(0)', opacity: 1 },
      { transform: 'translateX(100%)', opacity: 0 }
    ], {
      duration: 500,
      fill: 'forwards'
    }).onfinish = () => notification.remove();
  }, 5000);
}

/* ======================== MODO CRIADOR & PRINT ======================== */
function setupCreatorMode() {
  document.addEventListener('keydown', e => {
    // Ativação do modo criador (Ctrl + R)
    if (e.ctrlKey && e.key.toLowerCase() === 'r') {
      e.preventDefault();
      showMessage('Bem-vindo, Roger Bastos — Modo criador ativado.', true);
      
      // Adiciona borda especial
      document.body.classList.add('creator-mode');
      
      // Mostra elementos ocultos
      document.querySelectorAll('[data-creator-only]').forEach(el => {
        el.style.display = 'block';
      });
    }
    
    // Bloqueio de captura de tela
    if (e.key === 'PrintScreen') {
      e.preventDefault();
      
      const blackout = document.createElement('div');
      Object.assign(blackout.style, {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(45deg, #ff00cc, #333399)',
        mixBlendMode: 'difference',
        zIndex: 99999,
        opacity: '0.8'
      });
      
      document.body.appendChild(blackout);
      setTimeout(() => blackout.remove(), 1000);
      
      customAlert('Captura de tela bloqueada!', null, 'warning');
    }
  });
}

/* ======================== AVISO PERSONALIZADO ======================== */
function showMessage(msg, isPrivate = false) {
  const aviso = document.createElement('div');
  aviso.className = 'custom-message';
  
  if (isPrivate) {
    aviso.classList.add('private');
    aviso.innerHTML = `<span class="creator-icon">👑</span> ${msg}`;
  } else {
    aviso.textContent = msg;
  }
  
  document.body.appendChild(aviso);
  
  // Animação de entrada
  aviso.animate([
    { opacity: 0, transform: 'translateY(20px)' },
    { opacity: 1, transform: 'translateY(0)' }
  ], {
    duration: 500,
    fill: 'forwards'
  });
  
  // Auto-remover após 5 segundos
  setTimeout(() => {
    aviso.animate([
      { opacity: 1, transform: 'translateY(0)' },
      { opacity: 0, transform: 'translateY(-20px)' }
    ], {
      duration: 500,
      fill: 'forwards'
    }).onfinish = () => aviso.remove();
  }, 5000);
}

/* ======================== EXECUÇÃO PRINCIPAL ======================== */
document.addEventListener('DOMContentLoaded', () => {
  // Configurações de segurança
  protectImages();
  setupPreviews();
  enhanceSecurity();
  limitZoom();
  
  // Efeitos visuais
  setupParallax();
  setupCustomCursor();
  setupProfileRotation();
  setupEntranceAnimations();
  setupHoverEffects();
  setupPurchaseAnimations();
  
  // Sistemas adicionais
  setupNotifications();
  setupCreatorMode();
  
  // Marca o site como carregado
  document.body.classList.add('loaded');
});

window.addEventListener('load', () => {
  // Adiciona um pequeno delay para garantir que tudo foi carregado
  setTimeout(() => {
    document.body.classList.add('fully-loaded');
  }, 500);
});

// Proteção adicional contra clique direito
document.addEventListener('contextmenu', e => {
  if (e.target.closest('.protected-content')) {
    e.preventDefault();
    customAlert('Conteúdo protegido!', null, 'warning');
  }
});