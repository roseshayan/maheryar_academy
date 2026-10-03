/**
 * آموزشگاه فنی و حرفه‌ای آزاد ماهریار (Maheryar Academy)
 * Core Application JavaScript (Modular, Vanilla ES6, PWA Ready)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
  }

  initHeader();
  initMobileDrawer();
  initCourseFiltering();
  initHeroFinder();
  initFaqAccordion();
  initConsultationModal();
  initPwaSupport();
});

/**
 * Header Scroll & Sticky Behavior
 */
function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/**
 * Mobile Drawer (Off-Canvas Navigation)
 */
function initMobileDrawer() {
  const openBtn = document.getElementById('btnOpenMobileMenu');
  const closeBtn = document.getElementById('btnCloseMobileMenu');
  const drawer = document.getElementById('mobileDrawer');
  const overlay = document.getElementById('mobileDrawerOverlay');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  if (!drawer || !overlay) return;

  const openDrawer = () => {
    drawer.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (openBtn) openBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);

  drawerLinks.forEach((link) => {
    link.addEventListener('click', closeDrawer);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('active')) {
      closeDrawer();
    }
  });
}

/**
 * Course Category Filtering
 */
function initCourseFiltering() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const courseCards = document.querySelectorAll('.course-card');

  if (!filterBtns.length || !courseCards.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      courseCards.forEach((card) => {
        const cardCategory = card.getAttribute('data-category');
        if (filterVal === 'all' || cardCategory === filterVal) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.transition = 'opacity 0.3s ease';
            card.style.opacity = '1';
          }, 30);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/**
 * Hero Search & Category Finder
 */
function initHeroFinder() {
  const finderForm = document.getElementById('heroFinderForm');
  if (!finderForm) return;

  finderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchInput = document.getElementById('heroSearchInput');
    const categorySelect = document.getElementById('heroCategorySelect');

    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const selectedCategory = categorySelect ? categorySelect.value : 'all';

    // Switch category filter button if matching
    const matchingBtn = document.querySelector(`.filter-btn[data-filter="${selectedCategory}"]`);
    if (matchingBtn) {
      matchingBtn.click();
    }

    // Filter courses based on query
    const courseCards = document.querySelectorAll('.course-card');
    if (query) {
      courseCards.forEach((card) => {
        const title = card.querySelector('.course-title')?.textContent.toLowerCase() || '';
        const desc = card.querySelector('.course-features-summary')?.textContent.toLowerCase() || '';
        const cat = card.getAttribute('data-category') || '';

        const matchesCat = selectedCategory === 'all' || cat === selectedCategory;
        const matchesQuery = title.includes(query) || desc.includes(query);

        if (matchesCat && matchesQuery) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    }

    // Scroll smoothly to courses section
    const coursesSection = document.getElementById('courses');
    if (coursesSection) {
      coursesSection.scrollIntoView({ behavior: 'smooth' });
    }
  });
}

/**
 * FAQ Accordion with Accessibility
 */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (!questionBtn || !answer) return;

    questionBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close all other items
      faqItems.forEach((other) => {
        if (other !== item) {
          other.classList.remove('active');
          const otherBtn = other.querySelector('.faq-question');
          const otherAns = other.querySelector('.faq-answer');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          if (otherAns) otherAns.style.maxHeight = null;
        }
      });

      // Toggle current item
      if (isOpen) {
        item.classList.remove('active');
        questionBtn.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = null;
      } else {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

/**
 * Consultation Modal (<dialog>) & Fast Consultation Form
 */
function initConsultationModal() {
  const dialog = document.getElementById('consultationModal');
  const openBtns = document.querySelectorAll('.btn-open-consultation');
  const closeBtn = document.getElementById('btnCloseConsultation');

  if (dialog) {
    openBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const courseTitle = btn.getAttribute('data-course-name');
        if (courseTitle) {
          const selectField = dialog.querySelector('#modalCourseSelect');
          if (selectField) {
            for (let opt of selectField.options) {
              if (opt.text.includes(courseTitle)) {
                opt.selected = true;
                break;
              }
            }
          }
        }
        dialog.showModal();
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        dialog.close();
      });
    }

    dialog.addEventListener('click', (e) => {
      const rect = dialog.getBoundingClientRect();
      const isInDialog = (
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width
      );
      if (!isInDialog) {
        dialog.close();
      }
    });
  }

  // Handle Form Submissions (Both Modal and On-Page CTA Form)
  const forms = [
    document.getElementById('modalConsultationForm'),
    document.getElementById('ctaConsultationForm')
  ];

  forms.forEach((form) => {
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const phoneInput = form.querySelector('input[type="tel"]');
      const nameInput = form.querySelector('input[name="fullname"]');
      const feedback = form.querySelector('.form-feedback');

      if (!phoneInput || !phoneInput.value.trim()) {
        alert('لطفاً شماره تماس خود را وارد نمایید.');
        return;
      }

      // Show success feedback
      if (feedback) {
        feedback.textContent = `با تشکر از شما ${nameInput ? nameInput.value : ''}! درخواست مشاوره شما با موفقیت ثبت گردید. کارشناسان ماهریار ظرف چند ساعت کاری آینده با شما تماس خواهند گرفت.`;
        feedback.className = 'form-feedback success';
      }

      form.reset();

      // If in dialog, close after 2.5s
      if (dialog && form.id === 'modalConsultationForm') {
        setTimeout(() => {
          dialog.close();
          if (feedback) feedback.className = 'form-feedback';
        }, 3000);
      }
    });
  });
}

/**
 * PWA Service Worker Registration & Installation Prompt
 */
function initPwaSupport() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('./sw.js')
        .then((reg) => {
          console.log('Maheryar PWA Service Worker Registered! Scope:', reg.scope);
        })
        .catch((err) => {
          console.warn('PWA Service Worker Registration failed:', err);
        });
    });
  }

  let deferredPrompt;
  const pwaToast = document.getElementById('pwaInstallToast');
  const btnInstallPwa = document.getElementById('btnInstallPwa');
  const btnDismissPwa = document.getElementById('btnDismissPwa');

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (pwaToast) {
      pwaToast.style.display = 'flex';
    }
  });

  if (btnInstallPwa) {
    btnInstallPwa.addEventListener('click', async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to install prompt: ${outcome}`);
      deferredPrompt = null;
      if (pwaToast) pwaToast.style.display = 'none';
    });
  }

  if (btnDismissPwa) {
    btnDismissPwa.addEventListener('click', () => {
      if (pwaToast) pwaToast.style.display = 'none';
    });
  }
}
