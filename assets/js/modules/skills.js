/**
 * Logique de la section Compétences (Skills)
 * ------------------------------------------------------------------
 * Gère l'affichage et l'animation des barres de compétences.
 * - Ajoute des info-bulles (tooltips) natives pour les textes tronqués.
 * - Anime le remplissage des barres de progression lorsque la section devient visible.
 */
import { select } from './utils.js';

export const initSkills = () => {
  const skillsContent = select('.skills-content');
  if (skillsContent) {
    /**
     * Ajoute un attribut 'title' et 'aria-label' aux éléments pour afficher le texte complet au survol.
     * Utile quand le texte est tronqué par CSS (text-overflow: ellipsis).
     */
    const setTitle = (el) => {
      const text = (el.textContent || '').trim().replace(/\s+/g, ' ');
      if (!text) return;
      el.setAttribute('title', text);
      if (!el.getAttribute('aria-label')) el.setAttribute('aria-label', text);
    };

    // Applique les tooltips sur les titres et les barres
    skillsContent.querySelectorAll('.title').forEach(setTitle);
    skillsContent.querySelectorAll('.progress .skill').forEach(setTitle);
    skillsContent.querySelectorAll('.progress .skill .label').forEach(setTitle);

    /**
     * Intersection Observer pour l'animation des barres de progression.
     * Déclenche l'animation quand l'utilisateur scrolle sur la section.
     */
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const bars = skillsContent.querySelectorAll('.progress .progress-bar');
        bars.forEach(bar => {
          const val = bar.getAttribute('aria-valuenow') || '0';
          bar.style.width = '0%'; // Réinitialise à 0% avant d'animer
          // Force le reflow pour s'assurer que la transition CSS se joue
          void bar.offsetWidth; 
          bar.style.width = `${val}%`;
        });
        // On arrête d'observer une fois l'animation lancée (jouée une seule fois)
        obs.disconnect();
      });
    }, { threshold: 0.2 }); // Déclenche quand 20% de la section est visible
    obs.observe(skillsContent);
  }
}
