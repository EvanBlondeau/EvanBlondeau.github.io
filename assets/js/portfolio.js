(() => {
  const container = document.querySelector('.portfolio-container');
  const filtersUl = document.getElementById('portfolio-flters');
  if (!container || !filtersUl) return;

  const render = (items) => {
    container.innerHTML = '';
    items.forEach((p) => {
      const wrap = document.createElement('div');
      const classes = ['portfolio-item'];
      if (p.year === 2020) classes.push('filter-2020');
      else if (p.year === 2019) classes.push('filter-2019');
      else classes.push('filter-other');
      wrap.className = classes.join(' ');

      wrap.innerHTML = `
        <div class="portfolio-wrap">
          <img src="${p.image}" class="img-fluid" alt="${p.title}">
          <div class="portfolio-links">
            <a href="${p.path}" title="En savoir plus"><i data-feather="info"></i></a>
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
      // wire filters
      filtersUl.querySelectorAll('li').forEach(li => {
        li.addEventListener('click', () => {
          filtersUl.querySelectorAll('li').forEach(x => x.classList.remove('filter-active'));
          li.classList.add('filter-active');
          const f = li.getAttribute('data-filter');
          const filtered = projects.filter(p => {
            if (f === '*') return true;
            if (f === '.filter-2020') return p.year === 2020;
            if (f === '.filter-2019') return p.year === 2019;
            if (f === '.filter-other') return p.year < 2019;
            return true;
          });
          render(filtered);
        });
      });
    })
    .catch((e) => {
      // silent fail, keep whatever static markup exists
      console.log("error found", e)
    });
})();

