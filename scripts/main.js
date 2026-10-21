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
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (galleryItems.length === 0) return;

    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
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

    let currentIndex = 0;
    const images = [];

    galleryItems.forEach((item, index) => {
      const style = item.getAttribute('style');
      const urlMatch = style.match(/url\(['"]?([^'"]+)['"]?\)/);
      const caption = item.querySelector('.gallery-caption')?.textContent || '';

      if (urlMatch) {
        images.push({ src: urlMatch[1], caption: caption });
      }

      item.addEventListener('click', function() {
        currentIndex = index;
        openLightbox();
      });

      item.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          currentIndex = index;
          openLightbox();
        }
      });
    });

    function openLightbox() {
      updateLightboxImage();
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
      galleryItems[currentIndex].focus();
    }

    function updateLightboxImage() {
      if (images[currentIndex]) {
        lightboxImage.src = images[currentIndex].src;
        lightboxImage.alt = images[currentIndex].caption;
        lightboxCaption.textContent = images[currentIndex].caption;
      }
    }

    function nextImage() {
      currentIndex = (currentIndex + 1) % images.length;
      updateLightboxImage();
    }

    function prevImage() {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      updateLightboxImage();
    }

    closeBtn.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', nextImage);
    prevBtn.addEventListener('click', prevImage);

    lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', function(e) {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
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

    const animateElements = document.querySelectorAll('.card, .testimonial, .achievement, .feature, .timeline-item, .gallery-item, .faq-item');
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

          if (currentScroll > lastScroll && currentScroll > 200) {
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
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const navLinks = document.querySelectorAll('nav a');

    if (!mobileToggle) return;

    navLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        mobileToggle.checked = false;
      });
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && mobileToggle.checked) {
        mobileToggle.checked = false;
      }
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

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
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

      form.addEventListener('submit', function(e) {
        let isValid = true;

        inputs.forEach(function(input) {
          if (!validateField(input)) {
            isValid = false;
          }
        });

        if (!isValid) {
          e.preventDefault();
          const firstInvalid = form.querySelector('.invalid');
          if (firstInvalid) firstInvalid.focus();
        }
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
    progressBar.setAttribute('role', 'progressbar');
    progressBar.setAttribute('aria-label', 'Page scroll progress');
    progressBar.setAttribute('aria-valuemin', '0');
    progressBar.setAttribute('aria-valuemax', '100');
    document.body.appendChild(progressBar);

    let ticking = false;

    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          const scrollTop = window.scrollY;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          const progress = (scrollTop / docHeight) * 100;
          progressBar.style.width = progress + '%';
          progressBar.setAttribute('aria-valuenow', Math.round(progress));
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
    initMarqueeToggle();
    initCounterAnimation();
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
