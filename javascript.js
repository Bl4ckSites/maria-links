/**********************************************************************************
 * Nome: javascript.js
 * Descrição: Manipulação de interações, proteções, animações e mensagens do site
 * Créditos: Desenvolvido por Roger Bastos (@roger_19y) - Versão 3.0 otimizada
 **********************************************************************************/

/* ======================== ALERTA PERSONALIZADO ======================== */
let currentAlert = null;

function customAlert(message, targetEl) {
  if (currentAlert) {
    currentAlert.remove();
    currentAlert = null;
  }

  const alertBox = document.createElement('div');
  alertBox.className = 'custom-alert';
  alertBox.textContent = message;

  if (targetEl) {
    const rect = targetEl.getBoundingClientRect();
    alertBox.style.top = `${rect.bottom + window.scrollY + 5}px`;
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
  }, 3000);
}

/* ======================== PROTEÇÃO DE IMAGENS ======================== */
function protectImages() {
  try {
    document.addEventListener('contextmenu', e => {
      if (e.target.matches('.preview-image, .profile-photo')) {
        e.preventDefault();
      }
    });

    document.querySelectorAll('.preview-image, .profile-photo').forEach(img => {
      img.addEventListener('dragstart', e => e.preventDefault());
    });
  } catch (err) {
    console.error("Erro na proteção de imagens:", err);
  }
}

/* ======================== BLOQUEIO DE PRÉ-VISUALIZAÇÕES ======================== */
function setupPreviews() {
  document.querySelectorAll('.preview-item').forEach(item => {
    item.removeAttribute('href');
    item.addEventListener('contextmenu', e => e.preventDefault());
    item.addEventListener('dragstart', e => e.preventDefault());
    item.addEventListener('click', e => {
      e.preventDefault();
      customAlert('Compre esse pacote para acessar o conteúdo!!!', item);
    });
  });
}

/* ======================== SEGURANÇA DE TECLAS E CÓPIA ======================== */
function enhanceSecurity() {
  document.addEventListener('keydown', e => {
    if (e.key === 'PrintScreen') {
      e.preventDefault();
      customAlert('Captura de tela desativada neste site.');
    }

    if (e.ctrlKey && ['c', 'x', 'v'].includes(e.key.toLowerCase())) {
      if (document.activeElement.closest('.preview-image, .profile-photo')) {
        e.preventDefault();
        customAlert('Copiar/colar desativado para este conteúdo.');
      }
    }
  });

  document.addEventListener('selectstart', e => {
    if (e.target.matches('.preview-image, .profile-photo')) {
      e.preventDefault();
    }
  });
}

/* ======================== ZOOM LIMITADO EM MOBILE ======================== */
function limitZoom() {
  const metaExists = document.querySelector('meta[name="viewport"]');
  if (!metaExists) {
    const viewport = document.createElement('meta');
    viewport.name = 'viewport';
    viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.5, user-scalable=yes';
    document.head.appendChild(viewport);
  }

  document.addEventListener('touchmove', e => {
    if (window.visualViewport?.scale > 1.5) {
      e.preventDefault();
    }
  }, { passive: false });
}

/* ======================== PARALLAX NA FOTO DE CAPA ======================== */
function setupParallax() {
  const cover = document.querySelector('.cover-photo');
  if (!cover) return;

  window.addEventListener('scroll', () => {
    const y = window.pageYOffset;
    cover.style.transform = `translateY(${y * 0.3}px)`;
  });
}

/* ======================== CURSOR PERSONALIZADO ======================== */
function setupCustomCursor() {
  const customCursor = document.querySelector('.custom-cursor');
  if (!customCursor) return;

  document.addEventListener('mousemove', e => {
    customCursor.style.left = `${e.clientX}px`;
    customCursor.style.top = `${e.clientY}px`;
  });

  document.addEventListener('mousedown', () => customCursor.classList.add('click'));
  document.addEventListener('mouseup', () => customCursor.classList.remove('click'));
}

/* ======================== ROTAÇÃO DA FOTO DE PERFIL ======================== */
function setupProfileRotation() {
  const profileFrame = document.getElementById('profileFrame');
  if (!profileFrame) return;

  profileFrame.addEventListener('click', () => {
    profileFrame.style.animation = 'rotateProfile 1s ease forwards';
    profileFrame.addEventListener('animationend', () => {
      profileFrame.style.animation = '';
    }, { once: true });
  });
}

/* ======================== OVERLAY DE IMAGENS ======================== */
function setupOverlay() {
  const overlay = document.getElementById('overlay');
  const overlayImage = document.getElementById('overlayImage');
  const photoCards = document.querySelectorAll('.photo-card');

  if (!overlay || !overlayImage) return;

  photoCards.forEach(card => {
    const img = card.querySelector('img');
    if (!img) return;

    card.addEventListener('click', () => {
      overlayImage.src = img.src;
      overlay.classList.add('active');
    });

    card.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        overlayImage.src = img.src;
        overlay.classList.add('active');
      }
    });
  });

  overlay.addEventListener('click', () => overlay.classList.remove('active'));

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      overlay.classList.remove('active');
    }
  });
}

/* ======================== CARROSSEL ======================== */
function setupCarousel() {
  const carouselInner = document.getElementById('carouselInner');
  const arrowLeft = document.getElementById('arrowLeft');
  const arrowRight = document.getElementById('arrowRight');
  const items = document.querySelectorAll('.carousel-item');
  if (!carouselInner || items.length === 0) return;

  let currentIndex = 0;

  function updateCarousel() {
    carouselInner.style.transform = `translateX(-${currentIndex * 100}%)`;
  }

  arrowLeft?.addEventListener('click', () => {
    currentIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
    updateCarousel();
  });

  arrowRight?.addEventListener('click', () => {
    currentIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
    updateCarousel();
  });
}

/* ======================== MENSAGENS DO CRIADOR ======================== */
function showMessage(msg, isPrivate = false) {
  const aviso = document.createElement('div');
  aviso.textContent = msg;
  Object.assign(aviso.style, {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    background: isPrivate ? '#222' : '#000',
    color: isPrivate ? '#0f0' : '#fff',
    padding: '10px 15px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0,0,0,0.5)',
    zIndex: 9999,
    fontFamily: 'monospace',
    opacity: '0',
    transition: 'opacity 0.5s ease'
  });

  document.body.appendChild(aviso);
  setTimeout(() => aviso.style.opacity = '1', 100);
  setTimeout(() => {
    aviso.style.opacity = '0';
    setTimeout(() => aviso.remove(), 500);
  }, 5000);
}

document.addEventListener('keydown', e => {
  if (e.ctrlKey && e.key.toLowerCase() === 'r') {
    showMessage('Bem-vindo, Roger Bastos — Modo criador ativado.', true);
  }

  if (e.key === 'PrintScreen') {
    const blackout = document.createElement('div');
    Object.assign(blackout.style, {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: '#000',
      mixBlendMode: 'color',
      zIndex: 99999
    });
    document.body.appendChild(blackout);
    setTimeout(() => blackout.remove(), 1000);
  }
});

/* ======================== EXECUÇÃO PRINCIPAL ======================== */
document.addEventListener('DOMContentLoaded', () => {
  protectImages();
  setupPreviews();
  enhanceSecurity();
  limitZoom();
  setupParallax();
  setupCustomCursor();
  setupProfileRotation();
  setupOverlay();
  setupCarousel();
  document.body.classList.add('loaded');
});

window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});

document.addEventListener('contextmenu', e => e.preventDefault());


/**
 * ==================== CONFIGURAÇÃO DO OBSERVADOR DE INTERSEÇÃO ====================
 * Observa quando os elementos entram na viewport para ativar animações
 * de forma performática, sem consumir recursos desnecessários.
 */

// Configurações do Intersection Observer
const observerOptions = {
  // 20% do elemento precisa estar visível para disparar a callback
  threshold: 0.2,
  
  // Margem negativa para carregar um pouco antes do elemento aparecer
  rootMargin: '0px 0px -50px 0px'
};

// Callback que será executada quando os elementos forem observados
const observerCallback = (entries, observer) => {
  entries.forEach(entry => {
    // Verifica se o elemento está intersectando (visível na viewport)
    if (entry.isIntersecting) {
      /**
       * Adiciona a classe 'visible' que:
       * 1. Remove a opacidade 0
       * 2. Reseta qualquer transformação aplicada
       * 3. Dispara as transições/animações CSS
       */
      entry.target.classList.add('visible');
      
      // Para de observar o elemento após a animação para melhor performance
      observer.unobserve(entry.target);
      
      // Debug: Log apenas em desenvolvimento
      if (process.env.NODE_ENV === 'development') {
        console.log(`Elemento animado: ${entry.target.className}`);
      }
    }
  });
};

// Cria a instância do Intersection Observer com as configurações
const observer = new IntersectionObserver(observerCallback, observerOptions);

/**
 * ==================== INICIALIZAÇÃO DAS ANIMAÇÕES ====================
 * Seleciona todos os elementos que devem ser observados para animação:
 * 1. Botões de links
 * 2. Itens da galeria de preview
 */
document.querySelectorAll('.link-button, .preview-item').forEach(element => {
  // Começa a observar cada elemento
  observer.observe(element);
  
  // Adiciona evento de clique para analytics (exemplo)
  element.addEventListener('click', function() {
    // Simulação de tracking - substituir por sua solução de analytics
    trackUserInteraction(this.className, 'click');
  });
});

/**
 * ==================== FUNÇÕES AUXILIARES ====================
 */

/**
 * Simula o tracking de interação do usuário
 * @param {string} elementClass - Classe do elemento interagido
 * @param {string} actionType - Tipo de ação ('click', 'hover', etc)
 */
function trackUserInteraction(elementClass, actionType) {
  // Em produção, substituir por chamada real ao seu sistema de analytics
  console.log(`[Analytics] Interação registrada: ${actionType} no elemento ${elementClass}`);
  
  // Exemplo de como enviaria para o Google Analytics:
  // gtag('event', actionType, {
  //   'event_category': 'User Interaction',
  //   'event_label': elementClass
  // });
}

/**
 * ==================== POLYFILLS E COMPATIBILIDADE ====================
 * Garante que o Intersection Observer funcione em navegadores mais antigos
 */
if (!('IntersectionObserver' in window)) {
  // Carrega o polyfill dinamicamente apenas se necessário
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/intersection-observer@0.7.0/intersection-observer.min.js';
  document.head.appendChild(script);
  
  // Quando o polyfill carregar, re-executa a inicialização
  script.onload = () => {
    console.warn('IntersectionObserver carregado via polyfill');
    initializeAnimations();
  };
}

/**
 * ==================== EVENTOS DE CARREGAMENTO ====================
 * Espera o DOM estar completamente carregado antes de inicializar
 */
document.addEventListener('DOMContentLoaded', function() {
  // Verifica se há elementos animados na página
  const animatedElements = document.querySelectorAll('.link-button, .preview-item');
  
  if (animatedElements.length > 0) {
    console.log(`Inicializando animações para ${animatedElements.length} elementos`);
  } else {
    console.warn('Nenhum elemento animado encontrado na página');
  }
  
  // Adiciona classe ao body quando JS estiver ativo
  document.body.classList.add('js-enabled');
});

/**
 * ==================== OTIMIZAÇÃO PARA DISPOSITIVOS MÓVEIS ====================
 * Ajusta parâmetros de animação baseado no tipo de dispositivo
 */
function checkDeviceType() {
  // Reduz a quantidade de animações em dispositivos com preferência por redução de movimento
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    document.body.classList.add('reduced-motion');
    console.log('Modo de redução de movimento ativado');
  }
}

// Executa a verificação quando a página carrega
window.addEventListener('load', checkDeviceType);

// Também escuta mudanças na preferência (usuário pode alterar durante a sessão)
window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', checkDeviceType);


  // Garante que os estilos sejam aplicados imediatamente
  document.documentElement.style.setProperty('--loaded-opacity', '1');
  document.documentElement.style.setProperty('--loaded-transform', 'translateY(0)');
  
  // Adiciona classe loaded para transições suaves após o carregamento
  window.addEventListener('load', function() {
    document.body.classList.add('loaded');
  });








document.addEventListener('DOMContentLoaded', function() {
  // Efeito 3D na foto de perfil
  const profilePhoto = document.querySelector('.profile-photo');
  let animationFrameId;
  let animationComplete = false;
  
  // Animação 3D única mais rápida
  function animateProfile() {
    if (animationComplete) return;
    
    const progress = Math.min(1, (Date.now() - startTime) / 2000); // Animação de 2 segundos
    const rotateY = progress * 360; // Gira 360 graus
    const rotateX = Math.sin(progress * Math.PI * 2) * 15; // Movimento mais pronunciado
    
    profilePhoto.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
    
    if (progress < 1) {
      animationFrameId = requestAnimationFrame(animateProfile);
    } else {
      animationComplete = true;
      // Retorna à posição inicial suavemente após a animação
      setTimeout(() => {
        profilePhoto.style.transition = 'transform 0.5s ease-out';
        profilePhoto.style.transform = 'rotateY(0) rotateX(0)';
        
        // Remove a transição após voltar ao normal
        setTimeout(() => {
          profilePhoto.style.transition = 'none';
        }, 500);
      }, 500);
    }
  }
  
  // Interação com o mouse
  profilePhoto.addEventListener('mousemove', (e) => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationComplete = true;
    }
    
    const rect = profilePhoto.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateY = (x - centerX) / 10;
    const rotateX = (centerY - y) / 10;
    profilePhoto.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
    profilePhoto.style.transition = 'transform 0.1s ease-out';
  });
  
  profilePhoto.addEventListener('mouseleave', () => {
    // Volta à posição normal quando o mouse sai
    profilePhoto.style.transition = 'transform 0.5s ease-out';
    profilePhoto.style.transform = 'rotateY(0) rotateX(0)';
  });
  
  // Inicia animação
  const startTime = Date.now();
  animateProfile();

  // Animação dos botões conforme o scroll - versão corrigida
  const linkButtons = document.querySelectorAll('.link-button');
  let animatedButtons = [];
  
  function animateButtonsOnScroll() {
    linkButtons.forEach((button, index) => {
      const rect = button.getBoundingClientRect();
      const isVisible = rect.top <= window.innerHeight * 0.8; // 80% da tela
      
      if (isVisible && !animatedButtons.includes(index)) {
        // Alterna a direção da animação (esquerda/direita)
        const direction = index % 2 === 0 ? '-50px' : '50px';
        
        // Configuração inicial
        button.style.opacity = '0';
        button.style.transform = `translateX(${direction})`;
        button.style.transition = 'none';
        
        // Força o reflow para a animação funcionar
        void button.offsetWidth;
        
        // Animação
        button.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';
        button.style.opacity = '1';
        button.style.transform = 'translateX(0)';
        
        animatedButtons.push(index);
      }
    });
  }
  
  // Configura os observadores de scroll de forma mais eficiente
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateButtonsOnScroll();
      }
    });
  }, { threshold: 0.8 }); // 80% visível
  
  // Observa cada botão
  linkButtons.forEach(button => {
    observer.observe(button);
  });
  
  // Inicializa a animação dos botões visíveis
  animateButtonsOnScroll();
});

  // Efeito de hover suave nos botões
    document.querySelectorAll('.link-button, .package-button').forEach(button => {
      button.addEventListener('mouseenter', function() {
        this.style.transform = this.classList.contains('link-button') ? 'translateY(-3px)' : 'scale(1.02)';
      });
      
      button.addEventListener('mouseleave', function() {
        this.style.transform = '';
      });
    });
    
    // Efeito de scroll suave
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
          behavior: 'smooth'
        });
      });
    });
    
    // Rotação 3D da foto de perfil
    const profileFrame = document.querySelector('.profile-frame');
    if(profileFrame) {
      profileFrame.addEventListener('mousemove', (e) => {
        const xAxis = (window.innerWidth / 2 - e.pageX) / 15;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 15;
        profileFrame.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
      });
      
      profileFrame.addEventListener('mouseleave', () => {
        profileFrame.style.transform = 'rotateY(0) rotateX(0)';
      });
    }
      // ==================== MELHORIA DE IMAGENS PARA TELAS GRANDES ====================
    function enhanceImagesForLargeScreens() {
      // Verifica se é uma tela grande (acima de 768px)
      if (window.innerWidth > 768) {
        console.log("Otimizando imagens para tela grande...");
        
        // Atualizar a foto de perfil
        const profileImg = document.querySelector('.profile-photo');
        if (profileImg) {
          // Substituir por versão de maior resolução se disponível
          profileImg.src = profileImg.src.replace('.jpg', '@2x.jpg') || profileImg.src;
          profileImg.loading = "eager";
        }
        
        // Atualizar imagens dos pacotes
        document.querySelectorAll('.package-image').forEach(img => {
          // Substituir por versão de maior resolução
          img.src = img.src.replace('.jpg', '@2x.jpg') || img.src;
          img.loading = "eager";
        });
        
        // Forçar alta qualidade de renderização
        document.querySelectorAll('img').forEach(img => {
          img.style.imageRendering = "crisp-edges";
        });
      }
    }
    
    // ==================== AJUSTE DE ESCALA DINÂMICA ====================
    function adjustScaling() {
      const baseFontSize = 16;
      const minWidth = 320; // Largura mínima (celular)
      const maxWidth = 1920; // Largura máxima (desktop grande)
      const currentWidth = Math.min(Math.max(window.innerWidth, minWidth), maxWidth);
      
      // Calcular o fator de escala (0.8 a 1.2)
      const scaleFactor = 0.8 + (0.4 * ((currentWidth - minWidth) / (maxWidth - minWidth)));
      
      // Aplicar escala no elemento raiz
      document.documentElement.style.fontSize = `${baseFontSize * scaleFactor}px`;
      
      console.log(`Ajuste de escala: ${(scaleFactor * 100).toFixed(1)}%`);
    }
    
    // ==================== INICIALIZAÇÃO ====================
    document.addEventListener('DOMContentLoaded', () => {
      // Ajustar escala inicial
      adjustScaling();
      
      // Melhorar imagens para telas grandes
      enhanceImagesForLargeScreens();
      
      // Adicionar Font Awesome (se necessário)
      if (!document.querySelector('.fa')) {
        const faLink = document.createElement('link');
        faLink.rel = 'stylesheet';
        faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
        document.head.appendChild(faLink);
      }
    });
    
    // Ajustar escala quando a janela for redimensionada
    window.addEventListener('resize', () => {
      adjustScaling();
      enhanceImagesForLargeScreens();