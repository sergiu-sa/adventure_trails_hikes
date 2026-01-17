/**
 * Adventure Trails Hikes - Main JavaScript
 * Handles interactivity, animations, and enhanced user experience
 */

(function() {
  'use strict';

  // ===================================
  // SMOOTH SCROLL FOR SCROLL INDICATOR
  // ===================================
  function initScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (!scrollIndicator) return;

    scrollIndicator.addEventListener('click', function() {
      const hero = document.querySelector('.hero, .page-header');
      if (hero) {
        const nextSection = hero.nextElementSibling;
        if (nextSection) {
          nextSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });

    // Keyboard accessibility
    scrollIndicator.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  }

  // ===================================
  // BACK TO TOP BUTTON
  // ===================================
  function initBackToTop() {
    // Create the button
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.setAttribute('aria-label', 'Back to top');
    backToTopBtn.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M18 15L12 9L6 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
    document.body.appendChild(backToTopBtn);

    // Show/hide based on scroll position
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

    // Scroll to top on click
    backToTopBtn.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ===================================
  // GALLERY LIGHTBOX
  // ===================================
  function initLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (galleryItems.length === 0) return;

    // Create lightbox elements
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

    // Collect all gallery images
    galleryItems.forEach((item, index) => {
      const style = item.getAttribute('style');
      const urlMatch = style.match(/url\(['"]?([^'"]+)['"]?\)/);
      const caption = item.querySelector('.gallery-caption')?.textContent || '';

      if (urlMatch) {
        images.push({
          src: urlMatch[1],
          caption: caption
        });
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

    // Event listeners
    closeBtn.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', nextImage);
    prevBtn.addEventListener('click', prevImage);

    lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', function(e) {
      if (!lightbox.classList.contains('active')) return;

      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    });
  }

  // ===================================
  // INTERSECTION OBSERVER FOR ANIMATIONS
  // ===================================
  function initScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe elements that should animate on scroll
    const animateElements = document.querySelectorAll('.card, .testimonial, .achievement, .feature, .timeline-item, .gallery-item, .faq-item');
    animateElements.forEach(function(el) {
      el.classList.add('animate-on-scroll');
      observer.observe(el);
    });
  }

  // ===================================
  // HEADER SCROLL EFFECT
  // ===================================
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

          // Hide header on scroll down, show on scroll up
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

  // ===================================
  // MOBILE MENU - Close on link click
  // ===================================
  function initMobileMenu() {
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const navLinks = document.querySelectorAll('nav a');

    if (!mobileToggle) return;

    navLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        mobileToggle.checked = false;
      });
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && mobileToggle.checked) {
        mobileToggle.checked = false;
      }
    });
  }

  // ===================================
  // COUNTER ANIMATION FOR STATS
  // ===================================
  function initCounterAnimation() {
    const stats = document.querySelectorAll('.hero-stat-number, .achievement-number');

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    stats.forEach(function(stat) {
      observer.observe(stat);
    });
  }

  function animateCounter(element) {
    const text = element.textContent;
    const hasPlus = text.includes('+');
    const hasDollar = text.includes('$');
    const hasM = text.includes('M');
    const hasPercent = text.includes('%');

    // Extract numeric value
    let value = parseFloat(text.replace(/[^0-9.]/g, ''));
    if (isNaN(value)) return;

    const duration = 2000;
    const start = 0;
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
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

  // ===================================
  // FORM VALIDATION ENHANCEMENT
  // ===================================
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
          // Focus first invalid field
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

    // Check if empty
    if (field.required && !field.value.trim()) {
      isValid = false;
      errorMessage = 'This field is required';
    }

    // Check email format
    if (field.type === 'email' && field.value.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(field.value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
      }
    }

    // Update UI
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

  // ===================================
  // PARALLAX EFFECT FOR HERO
  // ===================================
  function initParallax() {
    const hero = document.querySelector('.hero, .page-header');
    if (!hero) return;

    // Only apply parallax on larger screens
    if (window.innerWidth < 768) return;

    let ticking = false;

    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          const scrolled = window.scrollY;
          const rate = scrolled * 0.3;
          hero.style.backgroundPositionY = `calc(50% + ${rate}px)`;
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // ===================================
  // INITIALIZATION
  // ===================================
  function init() {
    initScrollIndicator();
    initBackToTop();
    initLightbox();
    initScrollAnimations();
    initHeaderScroll();
    initMobileMenu();
    initCounterAnimation();
    initFormValidation();
    initParallax();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
