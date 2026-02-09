/**
 * Chargement dynamique du Portfolio
 * ------------------------------------------------------------------
 * Ce script gère le chargement et l'affichage des projets du portfolio
 * à partir d'un fichier JSON externe (data/projects.json).
 * 
 * Il génère une structure HTML compatible avec le CSS existant (style.css).
 */

(() => {
  const init = () => {
    const container = document.querySelector('.portfolio-container');
    
    if (!container) {
      setTimeout(init, 100);
      return;
    }

    const render = (items) => {
      container.innerHTML = '';
      
      items.forEach((p) => {
        const wrap = document.createElement('div');
        // Structure compatible avec le CSS existant et le système de filtre
        const filterClass = p.category ? `filter-${p.category}` : '';
        wrap.className = `portfolio-item ${filterClass}`; 

        // Structure HTML avec icône SVG pour correspondre au style.css
        wrap.innerHTML = `
          <div class="portfolio-wrap">
            <img src="${p.image}" class="img-fluid" alt="${p.title}" loading="lazy">
            <div class="portfolio-links">
              <div class="portfolio-links-title">${p.title}</div>
              <a class="portfolio-links-btn" href="${p.path}" title="Voir le projet: ${p.title}" aria-label="Voir le projet: ${p.title}">
                Voir le projet
              </a>
            </div>
          </div>
        `;
        container.appendChild(wrap);
      });

      // Réinitialise les icônes feather pour les cartes générées
      if (window.feather && typeof window.feather.replace === 'function') window.feather.replace();
    };

    fetch('data/projects.json')
      .then(r => r.json())
      .then((projects) => {
        render(projects);
      })
      .catch((e) => {
        console.error("Erreur chargement projets:", e);
      });
  };
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
