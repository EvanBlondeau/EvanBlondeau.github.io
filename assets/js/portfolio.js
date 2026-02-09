/**
 * Chargement dynamique du Portfolio
 * ------------------------------------------------------------------
 * Ce script gère le chargement et l'affichage des projets du portfolio
 * à partir d'un fichier JSON externe (data/projects.json).
 * 
 * Fonctionnalités :
 * - Récupération des données via fetch().
 * - Génération dynamique du HTML pour chaque carte projet.
 * - Gestion des interactions au survol (hover) et des transitions.
 * - Initialisation différée si le conteneur n'est pas encore prêt.
 */

(() => {
  /**
   * Fonction d'initialisation principale
   * Vérifie la présence du conteneur et lance le chargement des projets.
   */
  const init = () => {
    const container = document.querySelector('.portfolio-container');
    
    // Si le conteneur n'est pas encore dans le DOM, on réessaie dans 100ms
    if (!container) {
      console.log('Conteneur Portfolio introuvable, nouvelle tentative...');
      setTimeout(init, 100);
      return;
    }

    /**
     * Génère et injecte le HTML des projets dans le conteneur.
     * @param {Array} items - Liste des objets projets récupérés du JSON.
     */
    const render = (items) => {
      container.innerHTML = ''; // Nettoie le conteneur (loader ou ancien contenu)
      
      items.forEach((p) => {
        const wrap = document.createElement('div');
        // Classes Tailwind pour le style de la carte (grille, hover, arrondi)
        wrap.className = 'portfolio-item group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg rounded-3xl';

        // Structure HTML de la carte projet
        wrap.innerHTML = `
          <div class="portfolio-wrap relative overflow-hidden rounded-3xl shadow-md group">
            <!-- Image du projet avec effet de zoom au survol -->
            <img src="${p.image}" class="img-fluid w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110 rounded-3xl" alt="${p.title}" loading="lazy">
            
            <!-- Overlay (superposition) apparaissant au survol -->
            <div class="portfolio-links absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-300 flex flex-col items-center justify-center rounded-3xl">
              <!-- Titre du projet -->
              <h3 class="text-white text-sm sm:text-base md:text-lg font-semibold mb-2 sm:mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center px-2 sm:px-4">${p.title}</h3>
              
              <!-- Lien vers les détails -->
              <a href="${p.path}" class="inline-block max-w-max text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-semibold text-center px-4 py-2" style="font-size: clamp(0.75rem, 2vw, 1rem);" title="En savoir plus">
                Voir le projet
              </a>
            </div>
          </div>
        `;
        container.appendChild(wrap);
      });

      // Réinitialise les icônes Feather si la librairie est présente
      if (window.feather) feather.replace();
    };

    // Chargement des données depuis le fichier JSON
    fetch('data/projects.json')
      .then(r => r.json())
      .then((projects) => {
        render(projects);
      })
      .catch((e) => {
        console.error("Erreur lors du chargement des projets :", e);
      });
  };
  
  // Lance l'initialisation quand le DOM est prêt
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
