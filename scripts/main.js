(function() {
  'use strict';

  function initScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (!scrollIndicator) return;

    scrollIndicator.addEventListener('click', function() {
      const hero = document.querySelector('.hero, .page-header');
      if (hero) {
        const nextSection = hero.nextElementSibling;
        if (nextSection) {
          nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
    const hero = document.querySelector('.hero, .page-header');
    if (!hero) return;
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

  function initReadingTime() {
    const mainContent = document.querySelector('main');
    if (!mainContent) return;

    const text = mainContent.textContent || '';
    const wordCount = text.trim().split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);

    if (readingTime < 2) return;

    const readingIndicator = document.createElement('div');
    readingIndicator.className = 'reading-time';
    readingIndicator.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
        <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
      <span>${readingTime} min read</span>
    `;

    const pageHeader = document.querySelector('.page-header .container');
    if (pageHeader) {
      pageHeader.appendChild(readingIndicator);
    }
  }

  function initPageTransitions() {
    document.body.classList.add('page-loaded');

    const internalLinks = document.querySelectorAll('a[href$=".html"]:not([target="_blank"])');

    internalLinks.forEach(function(link) {
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (e.ctrlKey || e.metaKey || e.shiftKey) return;

        e.preventDefault();
        document.body.classList.add('page-transitioning');

        setTimeout(function() {
          window.location.href = href;
        }, 300);
      });
    });
  }

  function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');

    tooltipElements.forEach(function(el) {
      const tooltipText = el.getAttribute('data-tooltip');

      const tooltip = document.createElement('span');
      tooltip.className = 'tooltip';
      tooltip.textContent = tooltipText;
      tooltip.setAttribute('role', 'tooltip');
      el.style.position = 'relative';
      el.appendChild(tooltip);

      el.addEventListener('mouseenter', function() {
        tooltip.classList.add('visible');
      });

      el.addEventListener('mouseleave', function() {
        tooltip.classList.remove('visible');
      });

      el.addEventListener('focus', function() {
        tooltip.classList.add('visible');
      });

      el.addEventListener('blur', function() {
        tooltip.classList.remove('visible');
      });
    });
  }

  function initSectionHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');

    if (sections.length === 0 || navLinks.length === 0) return;

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(function(link) {
            link.classList.remove('section-active');
            if (link.getAttribute('href') === '#' + id) {
              link.classList.add('section-active');
            }
          });
        }
      });
    }, { threshold: 0.3, rootMargin: '-100px 0px -50% 0px' });

    sections.forEach(function(section) {
      observer.observe(section);
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

  function initLazyLoad() {
    const lazyImages = document.querySelectorAll('img[data-src]');

    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.add('loaded');
            imageObserver.unobserve(img);
          }
        });
      }, { rootMargin: '50px 0px' });

      lazyImages.forEach(function(img) {
        imageObserver.observe(img);
      });
    } else {
      lazyImages.forEach(function(img) {
        img.src = img.dataset.src;
      });
    }
  }

  function initKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'h' && !e.ctrlKey && !e.metaKey) {
        window.location.href = 'index.html';
      }

      if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
        const searchInput = document.querySelector('input[type="search"], input[name="search"]');
        if (searchInput) {
          e.preventDefault();
          searchInput.focus();
        }
      }

      if (e.key === 't' && !e.ctrlKey && !e.metaKey) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  function initCopyToClipboard() {
    const copyTargets = document.querySelectorAll('[data-copy]');

    copyTargets.forEach(function(el) {
      el.style.cursor = 'pointer';
      el.setAttribute('title', 'Click to copy');

      el.addEventListener('click', function() {
        const textToCopy = this.getAttribute('data-copy') || this.textContent;

        navigator.clipboard.writeText(textToCopy).then(function() {
          el.classList.add('copied');
          showToast('Copied to clipboard!');

          setTimeout(function() {
            el.classList.remove('copied');
          }, 2000);
        });
      });
    });
  }

  function showToast(message, type) {
    type = type || 'success';
    const toast = document.createElement('div');
    toast.className = 'toast toast-' + type;
    toast.textContent = message;
    toast.setAttribute('role', 'alert');

    document.body.appendChild(toast);

    setTimeout(function() {
      toast.classList.add('visible');
    }, 10);

    setTimeout(function() {
      toast.classList.remove('visible');
      setTimeout(function() {
        toast.remove();
      }, 300);
    }, 3000);
  }

  function initPrintFriendly() {
    window.addEventListener('beforeprint', function() {
      document.body.classList.add('printing');
    });

    window.addEventListener('afterprint', function() {
      document.body.classList.remove('printing');
    });
  }

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
    initProgressIndicator();
    initReadingTime();
    initPageTransitions();
    initTooltips();
    initSectionHighlight();
    initCardActions();
    initLazyLoad();
    initKeyboardShortcuts();
    initCopyToClipboard();
    initPrintFriendly();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
