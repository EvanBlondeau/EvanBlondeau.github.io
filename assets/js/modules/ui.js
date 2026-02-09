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
}
