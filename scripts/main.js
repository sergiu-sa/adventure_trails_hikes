(function() {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function scrollBehavior() {
    return reduceMotion.matches ? 'auto' : 'smooth';
  }

  // Runs callback as the first-visit intro curtain starts to lift (at once if there is none)
  function whenIntroLifts(callback) {
    const loader = document.querySelector('.page-loader');
    const intro = loader && loader.getAnimations
      ? loader.getAnimations().find(function(a) { return a.animationName === 'loader-out'; })
      : null;
    // progress stays null until the fade's start delay has passed
    if (!intro || intro.effect.getComputedTiming().progress !== null) {
      callback();
      return;
    }
    loader.addEventListener('animationstart', function onStart(e) {
      if (e.target !== loader) return;
      loader.removeEventListener('animationstart', onStart);
      callback();
    });
  }

  function initScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (!scrollIndicator) return;

    scrollIndicator.addEventListener('click', function() {
      const hero = document.querySelector('.hero, .page-header');
      if (hero) {
        const nextSection = hero.nextElementSibling;
        if (nextSection) {
          nextSection.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
        }
      }
    });

    scrollIndicator.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  }

  function initBackToTop() {
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.setAttribute('aria-label', 'Back to top');
    backToTopBtn.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M18 15L12 9L6 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
    document.body.appendChild(backToTopBtn);

    let ticking = false;
    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
          } else {
            backToTopBtn.classList.remove('visible');
          }
          ticking = false;
        });
        ticking = true;
      }
    });

    backToTopBtn.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: scrollBehavior() });
    });
  }

  function initLightbox() {
    const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
    if (galleryItems.length === 0) return;

    // showModal() moves focus in, keeps it there, makes the page inert and closes on Escape
    const lightbox = document.createElement('dialog');
    lightbox.className = 'lightbox';
    lightbox.setAttribute('aria-label', 'Image lightbox');
    lightbox.innerHTML = `
      <button class="lightbox-close" aria-label="Close lightbox">&times;</button>
      <button class="lightbox-prev" aria-label="Previous image">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <div class="lightbox-content">
        <img src="" alt="" class="lightbox-image" />
        <div class="lightbox-caption"></div>
      </div>
      <button class="lightbox-next" aria-label="Next image">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    `;
    document.body.appendChild(lightbox);

    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');

    let current = galleryItems[0];

    function show(item) {
      const photo = item.querySelector('img');
      current = item;
      lightboxImage.src = photo.src;
      lightboxImage.alt = photo.alt;
      lightboxCaption.innerHTML = item.querySelector('.gallery-caption').innerHTML;
    }

    // Steps through the tiles the category filter left visible, not all 18
    function step(by) {
      // getClientRects, not checkVisibility(), which Safari only has from 17.4
      const visible = galleryItems.filter(function(item) { return item.getClientRects().length > 0; });
      const index = visible.indexOf(current);
      show(visible[(index + by + visible.length) % visible.length]);
    }

    // On the whole tile, not just its button, so a click on the caption opens it too
    galleryItems.forEach(function(item) {
      item.addEventListener('click', function() {
        show(item);
        lightbox.showModal();
      });
    });

    closeBtn.addEventListener('click', function() { lightbox.close(); });
    nextBtn.addEventListener('click', function() { step(1); });
    prevBtn.addEventListener('click', function() { step(-1); });

    lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox) lightbox.close();
    });

    lightbox.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    });

    // Fires for Escape too. Lands on the photo last shown, which may not be the one opened
    lightbox.addEventListener('close', function() {
      current.querySelector('.gallery-open').focus();
    });
  }

  function initScrollAnimations() {
    if (reduceMotion.matches) return;

    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.card, .testimonial, .achievement, .gallery-item, .faq-item');
    animateElements.forEach(function(el) {
      el.classList.add('animate-on-scroll');
      observer.observe(el);
    });
  }

  function initHeaderScroll() {
    const header = document.querySelector('header');
    if (!header) return;

    let lastScroll = 0;
    let ticking = false;

    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          const currentScroll = window.scrollY;

          if (currentScroll > 100) {
            header.classList.add('scrolled');
          } else {
            header.classList.remove('scrolled');
          }

          // The open mobile menu hangs off the header, so hiding it would carry the menu away too
          const menuOpen = header.querySelector('.mobile-menu-btn[aria-expanded="true"]');
          if (currentScroll > lastScroll && currentScroll > 200 && !menuOpen) {
            header.classList.add('header-hidden');
          } else {
            header.classList.remove('header-hidden');
          }

          lastScroll = currentScroll;
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  function initMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-btn');
    const nav = toggle && document.getElementById(toggle.getAttribute('aria-controls'));
    if (!nav) return;

    function isOpen() {
      return toggle.getAttribute('aria-expanded') === 'true';
    }

    function setOpen(open) {
      toggle.setAttribute('aria-expanded', String(open));
    }

    toggle.addEventListener('click', function() {
      setOpen(!isOpen());
    });

    nav.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        setOpen(false);
      });
    });

    // Tabbing past the last link would otherwise put focus on content hidden under the open menu
    toggle.closest('header').addEventListener('focusout', function(e) {
      if (isOpen() && !e.currentTarget.contains(e.relatedTarget)) setOpen(false);
    });

    // Above the utilities.css breakpoint the button is hidden; a menu left open there (Safari
    // never focuses a tapped button, so focusout can't catch it) would pin the header in initHeaderScroll
    window.matchMedia('(max-width: 768px)').addEventListener('change', function() {
      setOpen(false);
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && isOpen()) {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  // Pairs with .pointer-nav in base.css
  function initPointerNav() {
    const root = document.documentElement;
    document.addEventListener('pointerdown', function() {
      root.classList.add('pointer-nav');
    }, true);
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Tab') root.classList.remove('pointer-nav');
    }, true);
  }

  function initYear() {
    document.querySelectorAll('[data-year]').forEach(function(el) {
      el.textContent = new Date().getFullYear();
    });
  }

  function initMarqueeToggle() {
    const marquee = document.querySelector('.marquee');
    const toggle = marquee && marquee.querySelector('.marquee-toggle');
    if (!toggle) return;

    toggle.addEventListener('click', function() {
      const paused = marquee.classList.toggle('is-paused');
      toggle.querySelector('.marquee-toggle-label').textContent = paused ? 'Play' : 'Pause';
    });
  }

  function initCounterAnimation() {
    if (reduceMotion.matches) return;

    const stats = document.querySelectorAll('.hero-stat-number, .achievement-number');

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    // Count up where the visitor can see it, not under the intro curtain
    whenIntroLifts(function() {
      stats.forEach(function(stat) {
        observer.observe(stat);
      });
    });
  }

  function animateCounter(element) {
    const text = element.textContent;
    const hasPlus = text.includes('+');
    const hasDollar = text.includes('$');
    const hasM = text.includes('M');
    const hasPercent = text.includes('%');

    let value = parseFloat(text.replace(/[^0-9.]/g, ''));
    if (isNaN(value)) return;

    const duration = 2000;
    const start = 0;
    const startTime = performance.now();

    // performance.now(), not the rAF timestamp: that one can predate startTime and go negative
    function updateCounter() {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = start + (value - start) * easeOutQuart;

      let displayValue;
      if (hasM) {
        displayValue = current.toFixed(1);
      } else if (value >= 1000) {
        displayValue = Math.floor(current).toLocaleString();
      } else {
        displayValue = Math.floor(current);
      }

      element.textContent =
        (hasDollar ? '$' : '') +
        displayValue +
        (hasM ? 'M' : '') +
        (hasPercent ? '%' : '') +
        (hasPlus ? '+' : '');

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    }

    requestAnimationFrame(updateCounter);
  }

  // Hero coordinates tick up from zero like a GPS fix settling. Zero-padded to
  // the final length so the line never changes width while it counts
  function initReadout() {
    const values = document.querySelectorAll('.hero-readout data');
    if (values.length === 0 || reduceMotion.matches) return;

    whenIntroLifts(function() {
      const start = performance.now();
      requestAnimationFrame(function tick() {
        const progress = Math.min((performance.now() - start) / 1500, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        values.forEach(function(el) {
          el.textContent = (el.value * eased).toFixed(4).padStart(el.value.length, '0');
        });
        if (progress < 1) requestAnimationFrame(tick);
      });
    });
  }

  function initFormValidation() {
    const forms = document.querySelectorAll('form');

    forms.forEach(function(form) {
      const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');

      inputs.forEach(function(input) {
        input.addEventListener('blur', function() {
          validateField(this);
        });

        input.addEventListener('input', function() {
          if (this.classList.contains('invalid')) {
            validateField(this);
          }
        });
      });

      // Every form on the site is a demo, so nothing is ever posted
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        let isValid = true;

        inputs.forEach(function(input) {
          if (!validateField(input)) {
            isValid = false;
          }
        });

        if (!isValid) {
          const firstInvalid = form.querySelector('.invalid');
          if (firstInvalid) firstInvalid.focus();
          return;
        }

        // Fields stay filled: clearing them would read as "sent". The wording alternates so
        // every submit changes the text, which role="status" needs to announce it again
        const note = form.parentElement.querySelector('.form-note');
        if (!note) return;
        note.classList.add('is-sent');
        note.textContent = note.textContent.startsWith('Not sent')
          ? 'Still not sent · this form is a demo'
          : 'Not sent · this form is a demo';
      });
    });
  }

  function validateField(field) {
    const errorElement = document.getElementById(field.id + '-error');
    let isValid = true;
    let errorMessage = '';

    if (field.required && !field.value.trim()) {
      isValid = false;
      errorMessage = 'This field is required';
    }

    if (field.type === 'email' && field.value.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(field.value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
      }
    }

    if (!isValid) {
      field.classList.add('invalid');
      field.setAttribute('aria-invalid', 'true');
      if (errorElement) {
        errorElement.textContent = errorMessage;
        errorElement.style.display = 'block';
      }
    } else {
      field.classList.remove('invalid');
      field.setAttribute('aria-invalid', 'false');
      if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
      }
    }

    return isValid;
  }

  function initParallax() {
    const photo = document.querySelector('.hero-photo');
    if (!photo) return;
    if (window.innerWidth < 768 || reduceMotion.matches) return;

    let ticking = false;

    // layout.css turns this into the capped 0.3x drift
    function update() {
      photo.style.setProperty('--scroll', window.scrollY);
      ticking = false;
    }
    update();

    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    });
  }

  function initProgressIndicator() {
    const progressBar = document.createElement('div');
    progressBar.className = 'page-progress';
    // Decorative: screen readers already report scroll position
    progressBar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(progressBar);

    let ticking = false;

    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          const scrollTop = window.scrollY;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          const progress = (scrollTop / docHeight) * 100;
          progressBar.style.width = progress + '%';
          ticking = false;
        });
        ticking = true;
      }
    });
  }



  function initCardActions() {
    const cards = document.querySelectorAll('.card');

    cards.forEach(function(card) {
      const hasLink = card.querySelector('a');
      if (hasLink) {
        card.style.cursor = 'pointer';
        card.addEventListener('click', function(e) {
          if (e.target.tagName !== 'A' && e.target.tagName !== 'BUTTON') {
            hasLink.click();
          }
        });
      }
    });
  }

  // Hikes rows only show their photo on hover/focus, so it isn't fetched until then
  function initHikePhotos() {
    document.querySelectorAll('.hike-row-bg[data-photo]').forEach(function(bg) {
      const row = bg.closest('.hike-row');
      function load() {
        bg.style.backgroundImage = `url('${bg.dataset.photo}')`;
      }
      row.addEventListener('pointerenter', load, { once: true });
      row.addEventListener('focusin', load, { once: true });
    });
  }


  function init() {
    initScrollIndicator();
    initBackToTop();
    initLightbox();
    initScrollAnimations();
    initHeaderScroll();
    initMobileMenu();
    initPointerNav();
    initYear();
    initMarqueeToggle();
    initCounterAnimation();
    initReadout();
    initFormValidation();
    initParallax();
    initProgressIndicator();
    initCardActions();
    initHikePhotos();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
