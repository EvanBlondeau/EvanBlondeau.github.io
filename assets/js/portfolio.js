(() => {
  const init = () => {
    const container = document.querySelector('.portfolio-container');
    if (!container) {
      console.log('Portfolio container not found, retrying...');
      setTimeout(init, 100);
      return;
    }

    const render = (items) => {
      container.innerHTML = '';
      items.forEach((p) => {
        const wrap = document.createElement('div');
        wrap.className = 'portfolio-item group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg rounded-3xl';

        wrap.innerHTML = `
          <div class="portfolio-wrap relative overflow-hidden rounded-3xl shadow-md group">
            <img src="${p.image}" class="img-fluid w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110 rounded-3xl" alt="${p.title}">
            <div class="portfolio-links absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-300 flex flex-col items-center justify-center rounded-3xl">
              <h3 class="text-white text-sm sm:text-base md:text-lg font-semibold mb-2 sm:mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center px-2 sm:px-4">${p.title}</h3>
              <a href="${p.path}" class="inline-block max-w-max text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-semibold text-center px-4 py-2" style="font-size: clamp(0.75rem, 2vw, 1rem);" title="En savoir plus">
                Voir le projet
              </a>
            </div>
          </div>
        `;
        container.appendChild(wrap);
      });
      if (window.feather) feather.replace();
    };

    fetch('data/projects.json')
      .then(r => r.json())
      .then((projects) => {
        render(projects);
      })
      .catch((e) => {
        console.log("Error loading projects:", e);
      });
  };
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

