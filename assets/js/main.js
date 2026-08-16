/**
 * LinguaSphere Academy - Core JavaScript System
 * Pure Vanilla JavaScript ES6+ (No external framework dependencies)
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ==========================================================================
     1. THEME MANAGER (Dark / Light Mode)
     ========================================================================== */
  const themeToggles = document.querySelectorAll('.theme-toggle');
  const storedTheme = localStorage.getItem('linguasphere-theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Set initial theme
  const initialTheme = storedTheme || (systemPrefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', initialTheme);
  updateThemeIcons(initialTheme);

  themeToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', nextTheme);
      localStorage.setItem('linguasphere-theme', nextTheme);
      updateThemeIcons(nextTheme);
    });
  });

  function updateThemeIcons(theme) {
    themeToggles.forEach(toggle => {
      const icon = toggle.querySelector('i');
      if (icon) {
        if (theme === 'dark') {
          icon.className = 'bi bi-sun-fill';
          toggle.setAttribute('aria-label', 'Switch to Light Mode');
        } else {
          icon.className = 'bi bi-moon-stars-fill';
          toggle.setAttribute('aria-label', 'Switch to Dark Mode');
        }
      }
    });
  }

  /* ==========================================================================
     2. RTL (RIGHT-TO-LEFT) TOGGLE MANAGER
     ========================================================================== */
  const rtlToggles = document.querySelectorAll('.rtl-toggle');
  const storedRTL = localStorage.getItem('linguasphere-rtl');

  if (storedRTL === 'rtl') {
    document.documentElement.setAttribute('dir', 'rtl');
    updateRTLButtons(true);
  }

  rtlToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const isCurrentRTL = document.documentElement.getAttribute('dir') === 'rtl';
      const nextDir = isCurrentRTL ? 'ltr' : 'rtl';
      
      document.documentElement.setAttribute('dir', nextDir);
      localStorage.setItem('linguasphere-rtl', nextDir);
      updateRTLButtons(!isCurrentRTL);
    });
  });

  function updateRTLButtons(isRTL) {
    rtlToggles.forEach(btn => {
      btn.setAttribute('aria-label', isRTL ? 'Switch to Left-to-Right' : 'Switch to Right-to-Left');
      const textSpan = btn.querySelector('.rtl-text');
      if (textSpan) {
        textSpan.textContent = isRTL ? 'LTR' : 'RTL';
      }
    });
  }

  /* ==========================================================================
     3. STICKY HEADER & SCROLL BEHAVIOR
     ========================================================================== */
  const siteHeader = document.querySelector('.site-header');
  const backToTopBtn = document.querySelector('.back-to-top');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;

    // Header scroll state
    if (siteHeader) {
      if (scrollPos > 30) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }

    // Back to top button visibility
    if (backToTopBtn) {
      if (scrollPos > 400) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ==========================================================================
     4. MOBILE OFFCANVAS NAVIGATION DRAWER
     ========================================================================== */
  const hamburgerBtns = document.querySelectorAll('.hamburger-btn');
  const offcanvasDrawer = document.querySelector('.offcanvas-drawer');
  const offcanvasBackdrop = document.querySelector('.offcanvas-backdrop');
  const offcanvasCloseBtns = document.querySelectorAll('.offcanvas-close, .offcanvas-close-link');

  function openOffcanvas() {
    if (offcanvasDrawer && offcanvasBackdrop) {
      offcanvasDrawer.classList.add('show');
      offcanvasBackdrop.classList.add('show');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeOffcanvas() {
    if (offcanvasDrawer && offcanvasBackdrop) {
      offcanvasDrawer.classList.remove('show');
      offcanvasBackdrop.classList.remove('show');
      document.body.style.overflow = '';
    }
  }

  hamburgerBtns.forEach(btn => btn.addEventListener('click', openOffcanvas));
  offcanvasCloseBtns.forEach(btn => btn.addEventListener('click', closeOffcanvas));
  if (offcanvasBackdrop) {
    offcanvasBackdrop.addEventListener('click', closeOffcanvas);
  }

  // Close offcanvas on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeOffcanvas();
    }
  });

  /* ==========================================================================
     5. INTERACTIVE BATCH / PROGRAM FILTERING
     ========================================================================== */
  const filterBtns = document.querySelectorAll('[data-filter]');
  const filterItems = document.querySelectorAll('[data-category]');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetFilter = btn.getAttribute('data-filter');

      filterItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (targetFilter === 'all' || itemCategory === targetFilter || itemCategory.includes(targetFilter)) {
          item.style.display = '';
          item.style.opacity = '0';
          setTimeout(() => {
            item.style.transition = 'opacity 0.3s ease';
            item.style.opacity = '1';
          }, 20);
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  /* ==========================================================================
     6. ACCORDIONS (Course Details, FAQs)
     ========================================================================== */
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const parentItem = header.parentElement;
      const isActive = parentItem.classList.contains('active');

      // Close siblings in same accordion container
      const container = parentItem.parentElement;
      if (container) {
        container.querySelectorAll('.accordion-item').forEach(item => {
          item.classList.remove('active');
        });
      }

      if (!isActive) {
        parentItem.classList.add('active');
      }
    });
  });

  /* ==========================================================================
     7. FORM VALIDATION & ENQUIRY SUBMISSION (Client-Side)
     ========================================================================== */
  const validatedForms = document.querySelectorAll('.needs-validation');

  validatedForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Select all required inputs
      const requiredInputs = form.querySelectorAll('[required]');

      requiredInputs.forEach(input => {
        const group = input.closest('.form-group');
        let fieldValid = true;

        if (input.type === 'email') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          fieldValid = emailRegex.test(input.value.trim());
        } else if (input.type === 'tel') {
          const phoneRegex = /^[\d\s+\-()]{7,20}$/;
          fieldValid = phoneRegex.test(input.value.trim());
        } else if (input.tagName.toLowerCase() === 'select') {
          fieldValid = input.value !== '' && input.value !== 'Choose...';
        } else {
          fieldValid = input.value.trim().length > 0;
        }

        if (!fieldValid) {
          isValid = false;
          if (group) group.classList.add('has-error');
        } else {
          if (group) group.classList.remove('has-error');
        }
      });

      if (isValid) {
        // Show success notification toast
        showToast('Enquiry received! Our academic admissions advisor will contact you within 24 hours.');
        form.reset();
        // Remove error classes
        form.querySelectorAll('.form-group').forEach(g => g.classList.remove('has-error'));
      }
    });

    // Real-time input error removal on typing
    form.querySelectorAll('input, select, textarea').forEach(input => {
      input.addEventListener('input', () => {
        const group = input.closest('.form-group');
        if (group) group.classList.remove('has-error');
      });
    });
  });

  function showToast(message) {
    let toast = document.querySelector('.toast-notification');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast-notification';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="bi bi-check-circle-fill" style="color: #10b981; font-size: 1.3rem;"></i> <span>${message}</span>`;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }

  /* ==========================================================================
     8. COMING SOON COUNTDOWN TIMER
     ========================================================================== */
  const countdownContainer = document.querySelector('[data-countdown]');
  if (countdownContainer) {
    // Set target date: 45 days in future
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 45);

    function updateCountdown() {
      const now = new Date().getTime();
      const difference = targetDate.getTime() - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        const daysEl = document.getElementById('cd-days');
        const hoursEl = document.getElementById('cd-hours');
        const minutesEl = document.getElementById('cd-minutes');
        const secondsEl = document.getElementById('cd-seconds');

        if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
        if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
      }
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }
});
