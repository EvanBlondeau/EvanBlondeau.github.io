/**
 * Animation des Compteurs
 * ------------------------------------------------------------------
 * Anime les nombres (ex: statistiques) en les incrémentant de 0 à la valeur cible.
 * Utilise Intersection Observer pour déclencher l'animation quand l'élément est visible.
 */
import { select } from './utils.js';

export const initCounters = () => {
  const counters = select('[data-toggle="counter-up"]', true);
  if (counters.length) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.textContent || '0', 10); // Valeur cible
        const duration = 1000; // Durée de l'animation en ms
        const start = performance.now();
        const from = 0;
        
        // Fonction d'animation frame par frame
        const step = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          // Calcul de la valeur courante (interpolation linéaire)
          el.textContent = Math.floor(from + (target - from) * progress).toString();
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        
        // Arrête d'observer une fois l'animation lancée
        obs.unobserve(el);
      });
    }, { threshold: 0.6 }); // Déclenche quand 60% de l'élément est visible
    counters.forEach(el => obs.observe(el));
  }
}
