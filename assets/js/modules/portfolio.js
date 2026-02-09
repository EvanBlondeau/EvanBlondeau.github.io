/**
 * Logique du Portfolio (Filtres & Carrousel)
 * ------------------------------------------------------------------
 * Gère les fonctionnalités interactives de la section Portfolio :
 * - Filtrage des éléments (App, Web, Card...) via les boutons.
 * - Carrousel d'images simple (sans dépendance lourde) pour les détails du projet.
 */
import { select, on } from './utils.js';

export const initPortfolio = () => {
  /**
   * Filtre du Portfolio
   * Affiche/Masque les éléments en fonction de la catégorie sélectionnée.
   */
  window.addEventListener('load', () => {
    const container = select('.portfolio-container');
    const filters = select('#portfolio-flters li', true);
    if (container && filters.length) {
      filters.forEach(btn => {
        btn.addEventListener('click', () => {
          // Gestion de la classe active sur les boutons de filtre
          filters.forEach(b => b.classList.remove('filter-active'));
          btn.classList.add('filter-active');
          
          const filter = btn.getAttribute('data-filter');
          const items = container.querySelectorAll('.portfolio-item');
          
          // Filtrage des éléments
          items.forEach(item => {
            if (filter === '*' || item.matches(filter)) {
              item.style.display = ''; // Affiche (reset display)
            } else {
              item.style.display = 'none'; // Masque
            }
          });
        });
      });
    }
  });

  /**
   * Carrousel simple pour les détails du portfolio
   * Crée dynamiquement les contrôles (précédent/suivant, points) et gère le défilement des images.
   */
  const initSimpleCarousel = () => {
    const carousels = select('.portfolio-details-carousel', true);
    carousels.forEach(carousel => {
      // Évite la double initialisation
      if (carousel.dataset.carouselInit === 'true') return;

      // Marque tôt pour activer les styles "carrousel" (et éviter le flash de toutes les images).
      // Si on sort tôt (0/1 slide), on retire le flag pour garder le fallback CSS.
      carousel.dataset.carouselInit = 'true';

      // Structure du carrousel (crée un conteneur 'track' si inexistant)
      let track = carousel.querySelector('.carousel-track');
      let slides = track ? Array.from(track.querySelectorAll('img')) : Array.from(carousel.querySelectorAll('img'));

      if (!track) {
        track = document.createElement('div');
        track.className = 'carousel-track';
        slides.forEach(img => track.appendChild(img));
        carousel.insertBefore(track, carousel.firstChild);
      }

      slides = Array.from(track.querySelectorAll('img'));

      // Si une seule image ou moins, pas besoin de carrousel
      if (slides.length <= 1) {
        slides.forEach(img => { img.style.display = 'block'; });
        delete carousel.dataset.carouselInit;
        return;
      }

      // Masque toutes les images sauf la première
      slides.forEach((img, i) => {
        img.style.display = i === 0 ? 'block' : 'none';
      });

      let currentIndex = 0;

      // Création des boutons de navigation
      const createNavBtn = (cls, icon) => {
        const btn = document.createElement('button');
        btn.className = `carousel-nav ${cls}`;
        btn.innerHTML = icon;
        btn.type = 'button';
        return btn;
      };

      const prevBtn = createNavBtn('carousel-prev', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>');
      const nextBtn = createNavBtn('carousel-next', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>');

      carousel.appendChild(prevBtn);
      carousel.appendChild(nextBtn);

      // Création des points de navigation (dots)
      const dotsContainer = document.createElement('div');
      dotsContainer.className = 'carousel-dots';
      slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = `carousel-dot ${i === 0 ? 'active' : ''}`;
        dot.type = 'button';
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
      });
      carousel.appendChild(dotsContainer);

      // Met à jour l'état actif des points
      const updateDots = () => {
        const dots = dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((d, i) => {
          d.classList.toggle('active', i === currentIndex);
        });
      };

      // Change la diapositive active
      const goToSlide = (index) => {
        slides[currentIndex].style.display = 'none';
        currentIndex = (index + slides.length) % slides.length; // Boucle infinie
        slides[currentIndex].style.display = 'block';
        updateDots();
      };

      prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
      nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

    });
  };

  window.addEventListener('load', initSimpleCarousel);
}
