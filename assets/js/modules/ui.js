/**
 * Interactions Interface Utilisateur (UI)
 * ------------------------------------------------------------------
 * Gère les effets visuels globaux et la navigation :
 * - Effet "Machine à écrire" (Typed Effect) dans le Hero.
 * - Défilement fluide (Smooth Scroll) lors du clic sur les liens de navigation.
 * - Gestion du menu mobile (ouverture/fermeture, accessibilité).
 * - Bouton "Retour en haut" (Back to top).
 */
import { select, on, onscroll } from './utils.js';

export const initUI = () => {
  /**
   * Icônes Feather
   * Sur certaines pages (ex: /projects/*.html), les icônes du side panel sont des
   * `<i data-feather="...">` et nécessitent un `feather.replace()` après que le DOM existe.
   */
  const replaceFeather = () => {
    if (window.feather && typeof window.feather.replace === 'function') {
      window.feather.replace();
    }
  };

  // 1) Tentative immédiate (si le DOM est déjà là)
  // 2) Fallback au DOMContentLoaded (cas standard)
  if (document.readyState !== 'loading') replaceFeather();
  document.addEventListener('DOMContentLoaded', replaceFeather);

  /**
   * Effet "Machine à écrire" (Typed Effect)
   * Récupère les chaînes de caractères depuis l'attribut 'data-typed-items'
   * et les affiche/efface caractère par caractère.
   */
  const typedEl = select('.typed');
  if (typedEl) {
    const itemsAttr = typedEl.getAttribute('data-typed-items');
    const strings = itemsAttr ? itemsAttr.split(',').map(s => s.trim()) : [];
    if (strings.length > 0) {
      let strIdx = 0;
      let charIdx = 0;
      let deleting = false;
      const typeSpeed = 100; // Vitesse de frappe
      const backSpeed = 50;  // Vitesse d'effacement
      const backDelay = 1500; // Pause avant d'effacer
      const tick = () => {
        const current = strings[strIdx] || '';
        if (!deleting) {
          charIdx++;
          typedEl.textContent = current.slice(0, charIdx);
          if (charIdx === current.length) {
            deleting = true;
            setTimeout(tick, backDelay);
            return;
          }
        } else {
          charIdx--;
          typedEl.textContent = current.slice(0, charIdx);
          if (charIdx === 0) {
            deleting = false;
            strIdx = (strIdx + 1) % strings.length;
          }
        }
        setTimeout(tick, deleting ? backSpeed : typeSpeed);
      };
      tick();
    }
  }

  /**
   * Défilement fluide (Smooth Scroll)
   * Intercepte les clics sur les liens d'ancrage (#) pour défiler doucement vers la section cible.
   * Gère aussi la mise à jour de la classe 'active' dans le menu et la fermeture du menu mobile.
   */
  const enableSmoothScroll = (selector) => {
    on('click', selector, function(e) {
      const target = e.target.closest(selector);
      if (!target) return;
      const href = target.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      const el = select(href);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Gestion de l'état actif dans le menu
        const li = target.closest('li');
        if (li && li.parentElement) {
          li.parentElement.querySelectorAll('li').forEach(l => l.classList.remove('active'));
          li.classList.add('active');
        }
        
        // Fermeture du menu mobile si ouvert
        if (document.body.classList.contains('mobile-nav-active')) {
          document.body.classList.remove('mobile-nav-active');
          const icon = select('.mobile-nav-toggle i');
          if (icon) {
            icon.classList.toggle('icofont-close');
            icon.classList.toggle('icofont-navigation-menu');
          }
        }
      }
    }, true);
  };

  enableSmoothScroll('.nav-menu a');
  enableSmoothScroll('.scrollto');
  enableSmoothScroll('.p-presentation a');

  /**
   * Resume - switch Vertical / Horizontal + interactions timeline
   * - Boutons: `data-view="vertical|horizontal"`
   * - Contenus: `#vertical` et `#horizontal`
   * - Timeline: clic sur `.timeline-logo` ou `.timeline-bar` → affiche `#desc-${key}`
   */
  const initResumeViews = () => {
    const vertical = document.getElementById('vertical');
    const horizontal = document.getElementById('horizontal');
    const viewBtns = document.querySelectorAll('[data-view]');

    // Rien à faire si on n'est pas sur la page qui contient le resume
    if (!vertical || !horizontal || viewBtns.length === 0) return;

    const setBtnActive = (btn, active) => {
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
      btn.classList.toggle('bg-white', active);
      btn.classList.toggle('shadow', active);
      btn.classList.toggle('text-gray-900', active);
      btn.classList.toggle('hover:text-gray-900', !active);
    };

    const setView = (view) => {
      const isVertical = view !== 'horizontal';
      vertical.classList.toggle('hidden', !isVertical);
      horizontal.classList.toggle('hidden', isVertical);

      viewBtns.forEach((btn) => setBtnActive(btn, btn.getAttribute('data-view') === (isVertical ? 'vertical' : 'horizontal')));

      try {
        localStorage.setItem('resumeView', isVertical ? 'vertical' : 'horizontal');
      } catch (_) {
        // ignore
      }
    };

    // Init depuis storage (si dispo)
    try {
      const saved = localStorage.getItem('resumeView');
      if (saved === 'horizontal') setView('horizontal');
      else setView('vertical');
    } catch (_) {
      setView('vertical');
    }

    viewBtns.forEach((btn) => {
      btn.addEventListener('click', () => setView(btn.getAttribute('data-view') || 'vertical'));
    });

    // Timeline horizontale (descriptions)
    const details = document.getElementById('horizontal-details');
    if (!details) return;

    const blocks = Array.from(details.querySelectorAll('[data-content]'));
    const intro = details.querySelector('[data-content="intro"]');

    const showBlock = (key) => {
      const targetKey = key || 'intro';
      blocks.forEach((b) => {
        const isTarget = b.getAttribute('data-content') === targetKey;
        b.classList.toggle('hidden', !isTarget);
        b.classList.toggle('opacity-0', !isTarget);
        b.classList.toggle('-translate-y-1', !isTarget);
        b.classList.toggle('opacity-100', isTarget);
        b.classList.toggle('translate-y-0', isTarget);
      });

      // Active state sur les logos
      document.querySelectorAll('.timeline-logo').forEach((logo) => {
        logo.classList.toggle('active', logo.getAttribute('data-key') === targetKey);
      });
    };

    // Description par défaut: la "dernière" entrée (ex: Vodalys) si marquée, sinon fallback sur intro.
    const latestLogo = horizontal.querySelector('.timeline-logo[data-latest="true"]');
    const latestKey = latestLogo?.getAttribute('data-key');
    const hasLatestBlock = latestKey && details.querySelector(`[data-content="${latestKey}"]`);
    if (hasLatestBlock) showBlock(latestKey);
    else if (intro) showBlock('intro');

    const onTimelineClick = (e) => {
      const logo = e.target.closest?.('.timeline-logo');
      const bar = e.target.closest?.('.timeline-bar');
      const key = (logo && logo.getAttribute('data-key')) || (bar && bar.getAttribute('data-key'));
      if (!key) return;
      showBlock(key);
    };

    // Écouteur unique (évite d'attacher sur chaque élément)
    horizontal.addEventListener('click', onTimelineClick);
  };

  initResumeViews();

  /**
   * Gestion du défilement au chargement de la page (si URL contient un hash #)
   */
  window.addEventListener('DOMContentLoaded', () => {
    if (window.location.hash) {
      const el = select(window.location.hash);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  /**
   * Menu Mobile
   * Gère l'ouverture/fermeture du menu sur mobile et met à jour les icônes et attributs ARIA.
   */
  const toggleBtns = select('.mobile-nav-toggle', true);
  if (toggleBtns.length) {
    const updateToggleIcons = (isActive) => {
      toggleBtns.forEach(btn => {
        btn.setAttribute('aria-expanded', isActive);
        btn.setAttribute('aria-label', isActive ? 'Fermer le menu de navigation' : 'Ouvrir le menu de navigation');
        
        const icon = btn.querySelector('i, svg');
        if (!icon) return;
        if (icon.tagName.toLowerCase() === 'i') {
          icon.classList.toggle('icofont-navigation-menu', !isActive);
          icon.classList.toggle('icofont-close', isActive);
        } else if (icon.dataset && icon.dataset.feather) {
          icon.dataset.feather = isActive ? 'x' : 'menu';
        }
      });
      if (window.feather && typeof window.feather.replace === 'function') {
        window.feather.replace();
      }
    };

    on('click', '.mobile-nav-toggle', function(e) {
      e.preventDefault(); // Empêche le comportement par défaut
      const isActive = document.body.classList.toggle('mobile-nav-active');
      updateToggleIcons(isActive);
    }, true);

    on('click', '.mobile-nav-overly', function(e) {
      document.body.classList.remove('mobile-nav-active');
      updateToggleIcons(false);
    }, true);
  }

  /**
   * Bouton "Retour en haut"
   * Affiche le bouton quand on scrolle vers le bas (> 100px).
   */
  const backToTop = select('.back-to-top');
  if (backToTop) {
    const toggleBackToTop = () => {
      if (window.scrollY > 100) {
        backToTop.style.display = 'block';
      } else {
        backToTop.style.display = 'none';
      }
    };
    window.addEventListener('load', toggleBackToTop);
    onscroll(document, toggleBackToTop);
  }

  /**
   * Scroll Spy (Espion de défilement)
   * Met à jour la classe 'active' dans le menu de navigation en fonction de la section visible à l'écran.
   */
  const navMenuScrollspy = () => {
    const navMenuLinks = select('.nav-menu a', true);
    const scrollPosition = window.scrollY + 200; // Offset pour déclencher un peu avant

    navMenuLinks.forEach(link => {
      if (!link.hash) return;
      const section = select(link.hash);
      if (!section) return;

      if (scrollPosition >= section.offsetTop && scrollPosition <= (section.offsetTop + section.offsetHeight)) {
        link.closest('li').classList.add('active');
      } else {
        link.closest('li').classList.remove('active');
      }
    });
  };

  window.addEventListener('load', navMenuScrollspy);
  onscroll(document, navMenuScrollspy);
}
