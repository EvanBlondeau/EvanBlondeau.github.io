(() => {
  // Simple typed-like effect (no dependency)
  const typedEl = document.querySelector('.typed');
  if (typedEl) {
    const itemsAttr = typedEl.getAttribute('data-typed-items');
    const strings = itemsAttr ? itemsAttr.split(',').map(s => s.trim()) : [];
    if (strings.length > 0) {
      let strIdx = 0;
      let charIdx = 0;
      let deleting = false;
      const typeSpeed = 100;
      const backSpeed = 50;
      const backDelay = 1500;
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

  // Smooth scroll
  const enableSmoothScroll = (selector) => {
    document.addEventListener('click', (e) => {
      const target = e.target.closest(selector);
      if (!target) return;
      const href = target.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      const el = document.querySelector(href);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      const li = target.closest('li');
      if (li && li.parentElement) {
        li.parentElement.querySelectorAll('li').forEach(l => l.classList.remove('active'));
        li.classList.add('active');
      }
      if (document.body.classList.contains('mobile-nav-active')) {
        document.body.classList.remove('mobile-nav-active');
        const icon = document.querySelector('.mobile-nav-toggle i');
        if (icon) icon.classList.toggle('icofont-close');
        if (icon) icon.classList.toggle('icofont-navigation-menu');
      }
    });
  };
  enableSmoothScroll('.nav-menu a');
  enableSmoothScroll('.scrollto');
  enableSmoothScroll('.p-presentation a');

  // Hash scroll on load
  window.addEventListener('DOMContentLoaded', () => {
    if (window.location.hash) {
      const el = document.querySelector(window.location.hash);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  // Mobile nav toggle
  const toggleBtns = Array.from(document.querySelectorAll('.mobile-nav-toggle'));
  if (toggleBtns.length) {
    const updateToggleIcons = (isActive) => {
      toggleBtns.forEach(btn => {
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

    const handleToggle = (e) => {
      e.preventDefault();
      const isActive = document.body.classList.toggle('mobile-nav-active');
      updateToggleIcons(isActive);
    };

    toggleBtns.forEach(btn => btn.addEventListener('click', handleToggle));

    document.addEventListener('click', (e) => {
      if (toggleBtns.some(btn => btn.contains(e.target))) return;
      if (!document.body.classList.contains('mobile-nav-active')) return;
      document.body.classList.remove('mobile-nav-active');
      updateToggleIcons(false);
    });
  }

  // Nav active on scroll
  const sections = Array.from(document.querySelectorAll('section[id]'));
  const navMenus = document.querySelectorAll('.nav-menu');
  const setActive = () => {
    const curPos = window.scrollY + 200;
    sections.forEach((section) => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      if (curPos >= top && curPos <= bottom) {
        navMenus.forEach(nav => {
          nav.querySelectorAll('li').forEach(li => li.classList.remove('active'));
          const a = nav.querySelector(`a[href="#${section.id}"]`);
          if (a) a.parentElement.classList.add('active');
        });
      }
    });
    if (curPos < 300) {
      navMenus.forEach(nav => {
        const first = nav.querySelector('ul li');
        if (first) first.classList.add('active');
      });
    }
  };
  window.addEventListener('scroll', setActive);

  // Back to top
  const backToTop = document.querySelector('.back-to-top');
  const backToTopToggle = () => {
    if (!backToTop) return;
    backToTop.style.display = window.scrollY > 100 ? 'block' : 'none';
  };
  window.addEventListener('scroll', backToTopToggle);
  if (backToTop) {
    backToTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // CounterUp replacement (IntersectionObserver)
  const counters = document.querySelectorAll('[data-toggle="counter-up"]');
  if (counters.length) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.textContent || '0', 10);
        const duration = 1000;
        const start = performance.now();
        const from = 0;
        const step = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          el.textContent = Math.floor(from + (target - from) * progress).toString();
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        obs.unobserve(el);
      });
    }, { threshold: 0.6 });
    counters.forEach(el => obs.observe(el));
  }

  // Skills progress bars
  const skillsContent = document.querySelector('.skills-content');
  if (skillsContent) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const bars = skillsContent.querySelectorAll('.progress .progress-bar');
        bars.forEach(bar => {
          const val = bar.getAttribute('aria-valuenow') || '0';
          bar.style.width = `${val}%`;
        });
        obs.disconnect();
      });
    }, { threshold: 0.3 });
    obs.observe(skillsContent);
  }

  // Portfolio filter (vanilla)
  window.addEventListener('load', () => {
    const container = document.querySelector('.portfolio-container');
    const filters = document.querySelectorAll('#portfolio-flters li');
    if (container && filters.length) {
      filters.forEach(btn => {
        btn.addEventListener('click', () => {
          filters.forEach(b => b.classList.remove('filter-active'));
          btn.classList.add('filter-active');
          const filter = btn.getAttribute('data-filter');
          const items = container.querySelectorAll('.portfolio-item');
          items.forEach(item => {
            if (filter === '*' || item.matches(filter)) {
              item.style.display = '';
            } else {
              item.style.display = 'none';
            }
          });
          // no-op: AOS removed
        });
      });
    }
  });

  // Simple carousel for portfolio details
  const initSimpleCarousel = () => {
    const carousels = document.querySelectorAll('.portfolio-details-carousel');
    carousels.forEach(carousel => {
      if (carousel.dataset.carouselInit === 'true') return;

      let track = carousel.querySelector('.carousel-track');
      let slides = track ? Array.from(track.querySelectorAll('img')) : Array.from(carousel.querySelectorAll('img'));

      if (!track) {
        track = document.createElement('div');
        track.className = 'carousel-track';
        slides.forEach(img => track.appendChild(img));
        carousel.insertBefore(track, carousel.firstChild);
      }

      slides = Array.from(track.querySelectorAll('img'));

      if (slides.length <= 1) {
        slides.forEach(img => { img.style.display = 'block'; });
        return;
      }

      carousel.dataset.carouselInit = 'true';

      let index = 0;
      let autoPlayId = null;
      let dots;

      const show = (i) => {
        slides.forEach((s, idx) => {
          s.style.display = idx === i ? 'block' : 'none';
        });
      };

      const updateDots = () => {
        if (!dots) return;
        Array.from(dots.children).forEach((dot, di) => {
          dot.classList.toggle('active', di === index);
        });
      };

      const goTo = (i) => {
        index = (i + slides.length) % slides.length;
        show(index);
        updateDots();
      };

      const stopAutoPlay = () => {
        if (autoPlayId !== null) {
          clearInterval(autoPlayId);
          autoPlayId = null;
        }
      };

      const startAutoPlay = () => {
        stopAutoPlay();
        autoPlayId = window.setInterval(() => {
          goTo(index + 1);
        }, 7000);
      };

      const restartAutoPlay = () => {
        stopAutoPlay();
        startAutoPlay();
      };

      show(index);

      dots = carousel.querySelector('.carousel-dots');
      if (!dots) {
        dots = document.createElement('div');
        dots.className = 'carousel-dots';
        carousel.appendChild(dots);
      }

      Array.from(dots.children).forEach((dot, i) => {
        dot.classList.toggle('active', i === 0);
        dot.addEventListener('click', () => {
          goTo(i);
          restartAutoPlay();
        });
      });

      if (!dots.children.length) {
        slides.forEach((_, i) => {
          const dot = document.createElement('button');
          dot.type = 'button';
          dot.className = 'carousel-dot';
          if (i === 0) dot.classList.add('active');
          dot.addEventListener('click', () => {
            goTo(i);
            restartAutoPlay();
          });
          dots.appendChild(dot);
        });
      }

      const createNavButton = (direction) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `carousel-nav carousel-${direction}`;
        const icon = direction === 'next' ? 'chevron-right' : 'chevron-left';
        btn.innerHTML = `<i data-feather="${icon}"></i>`;
        btn.addEventListener('click', () => {
          goTo(index + (direction === 'next' ? 1 : -1));
          restartAutoPlay();
        });
        return btn;
      };

      const attachNavHandler = (btn, direction) => {
        if (!btn) return;
        btn.addEventListener('click', () => {
          goTo(index + (direction === 'next' ? 1 : -1));
          restartAutoPlay();
        });
      };

      let prevBtn = carousel.querySelector('.carousel-nav.carousel-prev');
      let nextBtn = carousel.querySelector('.carousel-nav.carousel-next');
      if (!prevBtn) {
        prevBtn = createNavButton('prev');
        carousel.insertBefore(prevBtn, track);
      }
      if (!nextBtn) {
        nextBtn = createNavButton('next');
        carousel.appendChild(nextBtn);
      }

      attachNavHandler(prevBtn, 'prev');
      attachNavHandler(nextBtn, 'next');

      const syncIcons = () => {
        if (window.feather && typeof window.feather.replace === 'function') {
          window.feather.replace();
        }
      };

      syncIcons();
      startAutoPlay();

      carousel.addEventListener('mouseenter', stopAutoPlay);
      carousel.addEventListener('mouseleave', startAutoPlay);
    });
  };
  window.addEventListener('load', initSimpleCarousel);

  // Reveal on scroll (replacement for AOS)
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  window.addEventListener('load', () => {
    document.querySelectorAll('[data-aos]').forEach(el => revealObserver.observe(el));
  });
  // Feather icons replace
  window.addEventListener('load', () => {
    if (window.feather && typeof window.feather.replace === 'function') {
      window.feather.replace();
    }
  });

  // Resume: view selector (Vertical/Horizontal) and horizontal timeline behavior
  const initResumeSection = () => {
    const resume = document.querySelector('#resume');
    if (!resume) return;

    const vertical = resume.querySelector('#vertical');
    const horizontal = resume.querySelector('#horizontal');
    const selector = resume.querySelector('.view-selector');
    const selectorButtons = selector ? Array.from(selector.querySelectorAll('button[data-view]')) : [];

    // Update selected tab styles and toggle sections visibility
    const setView = (view) => {
      selectorButtons.forEach((btn) => {
        const isActive = btn.getAttribute('data-view') === view;
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
        btn.classList.toggle('bg-white', isActive);
        btn.classList.toggle('shadow', isActive);
        btn.classList.toggle('hover:text-gray-900', !isActive);
      });
      if (view === 'horizontal') {
        if (vertical) vertical.classList.add('hidden');
        if (horizontal) horizontal.classList.remove('hidden');
        // Sélectionner par défaut l'élément le plus récent
        showLatestDefault();
      } else {
        if (horizontal) horizontal.classList.add('hidden');
        if (vertical) vertical.classList.remove('hidden');
      }
    };

    // Bind click handlers for selector
    selectorButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const view = btn.getAttribute('data-view') || 'vertical';
        setView(view);
      });
    });

    // Default view is vertical
    setView('vertical');

    // Timeline logic (horizontal)
    const logosRow = resume.querySelector('#horizontal-logos');
    const logoButtons = logosRow ? Array.from(logosRow.querySelectorAll('.timeline-logo')) : [];
    const detailsContainer = resume.querySelector('#horizontal-details');
    const detailBlocks = detailsContainer ? Array.from(detailsContainer.querySelectorAll('[data-content]')) : [];

    const hideAllDetails = () => {
      detailBlocks.forEach((el) => {
        el.classList.add('opacity-0', '-translate-y-1');
        el.classList.remove('opacity-100', 'translate-y-0');
        el.classList.add('hidden');
        el.style.removeProperty('max-height');
      });
    };

    const showDetail = (key) => {
      hideAllDetails();
      const target = detailBlocks.find((el) => el.getAttribute('data-content') === key);
      if (!target) return;
      // Prépare l'animation d'opacité/translation uniquement (pas de hauteur)
      target.classList.remove('hidden');
      target.classList.add('opacity-0', '-translate-y-1');
      target.classList.remove('opacity-100', 'translate-y-0');
      // Forcer un reflow avant de lancer l'anim
      void target.getBoundingClientRect().height;
      target.classList.remove('opacity-0', '-translate-y-1');
      target.classList.add('opacity-100', 'translate-y-0');
    };

    const setActiveLogo = (activeBtn) => {
      logoButtons.forEach((btn) => {
        const isActive = btn === activeBtn;
        btn.setAttribute('aria-expanded', isActive ? 'true' : 'false');
        const mediaEl = btn.querySelector('.timeline-logo__media');
        const entry = btn.closest('.timeline-horizontal__item');
        const date = entry ? entry.querySelector('.timeline-horizontal__date') : null;
        if (!mediaEl) return;
        if (isActive) {
          mediaEl.classList.remove('grayscale');
          mediaEl.classList.add('timeline-logo__media--active');
          if (entry) entry.classList.add('timeline-horizontal__item--active');
          if (date) date.classList.add('timeline-horizontal__date--active');
        } else {
          mediaEl.classList.add('grayscale');
          mediaEl.classList.remove('timeline-logo__media--active');
          if (entry) entry.classList.remove('timeline-horizontal__item--active');
          if (date) date.classList.remove('timeline-horizontal__date--active');
        }
      });
    };

    const resetTimeline = () => {
      logoButtons.forEach((btn) => {
        const mediaEl = btn.querySelector('.timeline-logo__media');
        const entry = btn.closest('.timeline-horizontal__item');
        const date = entry ? entry.querySelector('.timeline-horizontal__date') : null;
        if (mediaEl) {
          mediaEl.classList.add('grayscale');
          mediaEl.classList.remove('timeline-logo__media--active');
        }
        btn.setAttribute('aria-expanded', 'false');
        if (entry) entry.classList.remove('timeline-horizontal__item--active');
        if (date) date.classList.remove('timeline-horizontal__date--active');
      });
      hideAllDetails();
    };

    const centerLogo = (btn) => {
      if (!logosRow || !btn) return;
      const entry = btn.closest('.timeline-horizontal__item');
      const target = entry || btn;
      const offset = target.offsetLeft - (logosRow.clientWidth - target.clientWidth) / 2;
      logosRow.scrollTo({ left: Math.max(0, offset), behavior: 'smooth' });
    };

    const showLatestDefault = () => {
      if (!logosRow || !logoButtons.length) return;
      resetTimeline();
      const latestBtn = logosRow.querySelector('[data-latest="true"]') || logoButtons[logoButtons.length - 1];
      if (!latestBtn) return;
      const key = latestBtn.getAttribute('data-key');
      if (!key) return;
      setActiveLogo(latestBtn);
      showDetail(key);
      centerLogo(latestBtn);
    };

    if (logosRow && logoButtons.length && detailBlocks.length) {
      logosRow.addEventListener('click', (e) => {
        const btn = e.target && e.target.closest('.timeline-logo');
        if (!btn) return;
        const key = btn.getAttribute('data-key');
        if (!key) return;
        setActiveLogo(btn);
        showDetail(key);
      });
    }
  };

  window.addEventListener('load', initResumeSection);
})();