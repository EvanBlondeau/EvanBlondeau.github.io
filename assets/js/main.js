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
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('mobile-nav-active');
      const icon = toggleBtn.querySelector('i');
      if (icon) {
        icon.classList.toggle('icofont-navigation-menu');
        icon.classList.toggle('icofont-close');
      }
    });

    document.addEventListener('click', (e) => {
      if (!toggleBtn.contains(e.target)) {
        if (document.body.classList.contains('mobile-nav-active')) {
          document.body.classList.remove('mobile-nav-active');
          const icon = toggleBtn.querySelector('i');
          if (icon) {
            icon.classList.add('icofont-navigation-menu');
            icon.classList.remove('icofont-close');
          }
        }
      }
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
      const slides = Array.from(carousel.querySelectorAll('img'));
      if (slides.length <= 1) return;
      let index = 0;
      const show = (i) => {
        slides.forEach((s, idx) => {
          s.style.display = idx === i ? 'block' : 'none';
        });
      };
      show(index);
      // Dots
      const dots = document.createElement('div');
      dots.style.textAlign = 'left';
      slides.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.style.display = 'inline-block';
        dot.style.margin = '0 10px 0 0';
        dot.style.width = '12px';
        dot.style.height = '12px';
        dot.style.borderRadius = '50%';
        dot.style.backgroundColor = i === 0 ? '#149ddd' : '#ddd';
        dot.addEventListener('click', () => {
          index = i;
          show(index);
          Array.from(dots.children).forEach((d, di) => d.style.backgroundColor = di === index ? '#149ddd' : '#ddd');
        });
        dots.appendChild(dot);
      });
      carousel.appendChild(dots);
      // Auto-play
      setInterval(() => {
        index = (index + 1) % slides.length;
        show(index);
        Array.from(dots.children).forEach((d, di) => d.style.backgroundColor = di === index ? '#149ddd' : '#ddd');
      }, 4000);
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
})();