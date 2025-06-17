/**
 * Sistema de Animação Avançada
 * Inclui: vibração tátil, animações de entrada, efeitos hover, scroll suave
 * e transições fluidas com física realista
 */

// 1. Sistema de Vibração com Feedback Contextual
document.querySelectorAll('button, .btn, a, [data-vibrate]').forEach(el => {
    el.addEventListener('click', (e) => {
        if (window.navigator.vibrate) {
            // Vibração diferenciada por tipo de elemento
            if (el.classList.contains('btn-primary')) {
                navigator.vibrate([5, 2, 10]); // Padrão mais complexo para ações primárias
            } else if (el.tagName === 'A') {
                navigator.vibrate(5); // Vibração mais suave para links
            } else {
                navigator.vibrate(15); // Vibração padrão
            }
        }
        
        // Efeito de onda ao clicar (ripple effect)
        const ripple = document.createElement('span');
        ripple.classList.add('ripple-effect');
        const rect = el.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${e.clientX - rect.left - size/2}px`;
        ripple.style.top = `${e.clientY - rect.top - size/2}px`;
        
        el.appendChild(ripple);
        
        // Remove o efeito após animação
        setTimeout(() => {
            ripple.remove();
        }, 1000);
    });
});

// 2. Sistema de Aparição com Parallax e Física
const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Calcula o atraso baseado na posição do elemento
            const delay = entry.target.getBoundingClientRect().top / window.innerHeight * 500;
            
            // Aplica animação com transformações dinâmicas
            entry.target.style.transition = `
                opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms,
                transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}ms
            `;
            
            // Configuração inicial para animação
            const direction = entry.target.dataset.animateDirection || 'up';
            const distance = entry.target.dataset.animateDistance || '20px';
            
            let transformStart = '';
            if (direction === 'up') transformStart = `translateY(${distance})`;
            if (direction === 'down') transformStart = `translateY(-${distance})`;
            if (direction === 'left') transformStart = `translateX(${distance})`;
            if (direction === 'right') transformStart = `translateX(-${distance})`;
            
            entry.target.style.opacity = '0';
            entry.target.style.transform = `${transformStart} rotateZ(0.5deg) scale(0.98)`;
            
            // Força o reflow para garantir a animação
            void entry.target.offsetWidth;
            
            // Animação de entrada
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0) translateX(0) rotateZ(0) scale(1)';
            
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

// Observa todos os elementos com animação
document.querySelectorAll('[data-animate], .fade-in, .animate-on-scroll').forEach(el => {
    observer.observe(el);
});

// 3. Sistema de Hover Avançado com Física
document.querySelectorAll('button, .btn, a, .card, .hoverable, [data-hover]').forEach(el => {
    // Configura transições personalizadas por elemento
    const transitionTime = el.dataset.hoverSpeed || '0.4s';
    const easing = el.dataset.hoverEasing || 'cubic-bezier(0.68, -0.6, 0.32, 1.6)';
    
    el.style.transition = `
        transform ${transitionTime} ${easing},
        box-shadow ${transitionTime} ease,
        filter ${transitionTime} ease
    `;
    
    el.addEventListener('mouseenter', () => {
        const scale = el.dataset.hoverScale || '1.05';
        const shadow = el.dataset.hoverShadow || '0 8px 25px rgba(0,0,0,0.1)';
        const zIndex = el.dataset.hoverZindex || '10';
        
        el.style.transform = `scale(${scale}) translateZ(0)`;
        el.style.boxShadow = shadow;
        el.style.zIndex = zIndex;
        el.style.filter = 'brightness(1.03)';
        
        // Efeito de flutuação suave
        if (el.dataset.hoverFloat === 'true') {
            el.style.animation = `float ${transitionTime} ${easing} infinite alternate`;
        }
    });
    
    el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1) translateZ(0)';
        el.style.boxShadow = 'none';
        el.style.zIndex = '';
        el.style.filter = 'brightness(1)';
        el.style.animation = '';
    });
});

// 4. Scroll Suave Avançado com Inércia
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (target) {
            e.preventDefault();
            
            // Calcula a posição com offset (considera headers fixos)
            const offset = 80;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
            
            // Animação personalizada com easing
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Foco acessível no elemento alvo
            setTimeout(() => {
                target.setAttribute('tabindex', '-1');
                target.focus();
                target.style.outline = 'none';
            }, 1000);
        }
    });
});

// 5. Efeito de Carga Dinâmica para Elementos Pesados
const lazyLoader = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const lazyElement = entry.target;
            
            // Simula um tempo de carga
            setTimeout(() => {
                lazyElement.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                lazyElement.style.opacity = '1';
                lazyElement.style.transform = 'translateY(0)';
                
                // Carrega conteúdo ou imagens
                if (lazyElement.dataset.src) {
                    lazyElement.src = lazyElement.dataset.src;
                }
                if (lazyElement.dataset.background) {
                    lazyElement.style.backgroundImage = `url(${lazyElement.dataset.background})`;
                }
                
                lazyLoader.unobserve(lazyElement);
            }, parseInt(lazyElement.dataset.delay || '200'));
        }
    });
}, {
    rootMargin: '200px 0px'
});

document.querySelectorAll('[data-lazy]').forEach(el => {
    lazyLoader.observe(el);
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
});

// 6. Animação de Digitação para Textos
function initTypewriterEffect() {
    document.querySelectorAll('[data-typewriter]').forEach(el => {
        const text = el.textContent;
        el.textContent = '';
        el.style.visibility = 'visible';
        
        let i = 0;
        const speed = parseInt(el.dataset.typewriterSpeed) || 50;
        const cursor = document.createElement('span');
        cursor.className = 'typewriter-cursor';
        cursor.textContent = '|';
        el.appendChild(cursor);
        
        function type() {
            if (i < text.length) {
                el.insertBefore(document.createTextNode(text.charAt(i)), cursor);
                i++;
                setTimeout(type, speed + Math.random() * 50); // Variação aleatória
            } else {
                cursor.style.animation = 'blink 1s infinite';
            }
        }
        
        setTimeout(type, 1000); // Atraso inicial
    });
}

// Inicia quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', initTypewriterEffect);

// 7. Efeito de Movimento Parallax
function updateParallax() {
    document.querySelectorAll('[data-parallax]').forEach(el => {
        const speed = parseFloat(el.dataset.parallax) || 0.5;
        const scrollY = window.scrollY || window.pageYOffset;
        const offset = -scrollY * speed;
        
        el.style.transform = `translate3d(0, ${offset}px, 0)`;
    });
}

window.addEventListener('scroll', () => {
    requestAnimationFrame(updateParallax);
});
window.addEventListener('resize', updateParallax);
updateParallax();