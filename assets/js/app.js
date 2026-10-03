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
  initCurriculumAccordion();
  initCourseTabs();
  initFestivalCountdown();
  initVideoModal();
  initCatalogFilters();
  initInstructorsCatalog();
  initInstructorSingleProfile();
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
        if (typeof Swal !== 'undefined') {
          Swal.fire({
            icon: 'warning',
            title: 'شماره تماس الزامی است',
            text: 'لطفاً شماره تلفن همراه خود را جهت برقراری تماس وارد نمایید.',
            confirmButtonText: 'تایید',
            confirmButtonColor: '#554596'
          });
        } else {
          alert('لطفاً شماره تماس خود را وارد نمایید.');
        }
        return;
      }

      const userName = nameInput && nameInput.value.trim() ? nameInput.value.trim() : 'کارآموز گرامی';

      // SweetAlert2 notification
      if (typeof Swal !== 'undefined') {
        Swal.fire({
          icon: 'success',
          title: 'درخواست مشاوره ثبت شد!',
          text: `با تشکر از شما ${userName} عزیز! کارشناسان آموزشگاه ماهریار به زودی با شما تماس خواهند گرفت.`,
          confirmButtonText: 'سپاس، متوجه شدم',
          confirmButtonColor: '#554596',
          timer: 4500,
          timerProgressBar: true
        });
      }

      // Toastify notification
      if (typeof Toastify !== 'undefined') {
        Toastify({
          text: `درخواست مشاوره برای ${userName} ثبت گردید`,
          duration: 4000,
          gravity: 'top',
          position: 'left',
          style: {
            background: 'linear-gradient(135deg, #10b981, #059669)',
            borderRadius: '12px',
            fontFamily: 'IRANSansX',
            fontSize: '0.9rem',
            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.35)'
          }
        }).showToast();
      }

      // In-page fallback feedback
      if (feedback) {
        feedback.textContent = `با تشکر از شما ${userName}! درخواست مشاوره شما با موفقیت ثبت گردید.`;
        feedback.className = 'form-feedback success';
      }

      form.reset();

      // If in dialog, close dialog
      if (dialog && form.id === 'modalConsultationForm') {
        setTimeout(() => {
          dialog.close();
          if (feedback) feedback.className = 'form-feedback';
        }, 1200);
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

/**
 * Curriculum / Syllabus Accordion on Course Single Page
 */
function initCurriculumAccordion() {
  const modules = document.querySelectorAll('.curriculum-module');
  if (!modules.length) return;

  modules.forEach((mod, idx) => {
    const header = mod.querySelector('.module-header');
    const body = mod.querySelector('.module-body');
    const icon = mod.querySelector('.module-meta i');

    if (!header || !body) return;

    // Open first module by default, collapse others
    if (idx !== 0) {
      body.style.display = 'none';
    } else {
      if (icon) icon.style.transform = 'rotate(180deg)';
    }

    header.addEventListener('click', () => {
      const isHidden = body.style.display === 'none';
      if (isHidden) {
        body.style.display = 'block';
        if (icon) icon.style.transform = 'rotate(180deg)';
      } else {
        body.style.display = 'none';
        if (icon) icon.style.transform = 'rotate(0deg)';
      }
    });
  });
}

/**
 * Course Details Navigation Tabs Active State & Smooth Scroll
 */
function initCourseTabs() {
  const tabs = document.querySelectorAll('.course-nav-tab');
  if (!tabs.length) return;

  const sections = Array.from(tabs)
    .map((tab) => {
      const targetId = tab.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        return document.querySelector(targetId);
      }
      return null;
    })
    .filter(Boolean);

  const handleScroll = () => {
    const scrollPos = window.scrollY + 120;
    sections.forEach((sec, idx) => {
      if (sec) {
        const top = sec.offsetTop;
        const height = sec.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          tabs.forEach((t) => t.classList.remove('active'));
          if (tabs[idx]) tabs[idx].classList.add('active');
        }
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
}

/**
 * Festival Countdown Timer
 */
function initFestivalCountdown() {
  const daysEl = document.getElementById('countDays');
  const hoursEl = document.getElementById('countHours');
  const minutesEl = document.getElementById('countMinutes');
  const secondsEl = document.getElementById('countSeconds');

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  // Set target date (e.g., 6 days from now)
  let targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 6);
  targetDate.setHours(23, 59, 59, 0);

  const updateCountdown = () => {
    const now = new Date().getTime();
    const distance = targetDate.getTime() - now;

    if (distance < 0) {
      daysEl.textContent = '۰۰';
      hoursEl.textContent = '۰۰';
      minutesEl.textContent = '۰۰';
      secondsEl.textContent = '۰۰';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const pad = (n) => String(n).padStart(2, '0');

    daysEl.textContent = pad(days);
    hoursEl.textContent = pad(hours);
    minutesEl.textContent = pad(minutes);
    secondsEl.textContent = pad(seconds);
  };

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

/**
 * Video Modal / Player
 */
function initVideoModal() {
  const playBtns = document.querySelectorAll('.btn-play-video, .video-poster-wrapper, .video-story-thumb');
  if (!playBtns.length) return;

  playBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const videoTitle = btn.getAttribute('data-video-title') || 'معرفی کارگاه‌ها و آموزشگاه فنی و حرفه‌ای ماهریار';

      if (typeof Swal !== 'undefined') {
        Swal.fire({
          title: videoTitle,
          html: `
            <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;margin-top:10px;">
              <div style="position:absolute;top:0;left:0;width:100%;height:100%;background:linear-gradient(135deg, #1e1b38, #3c306d);display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;padding:20px;text-align:center;">
                <i class="fa-solid fa-play-circle" style="font-size:3.5rem;color:#fbbf24;margin-bottom:12px;"></i>
                <h4 style="font-size:1.1rem;font-weight:800;margin-bottom:6px;">آموزشگاه فنی و حرفه‌ای آزاد ماهریار (تأسیس ۱۴۰۱)</h4>
                <p style="font-size:0.85rem;color:#cfcce3;">ویدئوی تور مجازی کارگاه‌های مجهز شعب ۱ و ۲ تهران و مصاحبه با مربیان رسمی</p>
                <div style="margin-top:15px;display:flex;gap:10px;">
                  <span class="badge badge-primary">شعبه مرتضوی (منطقه ۱۰)</span>
                  <span class="badge badge-secondary">شعبه اسکندری (منطقه ۱۱)</span>
                </div>
              </div>
            </div>
          `,
          width: '720px',
          showCloseButton: true,
          showConfirmButton: false,
          background: '#ffffff',
          customClass: {
            popup: 'video-swal-modal'
          }
        });
      }
    });
  });
}

/**
 * Course Catalog & Store-Style Filtering
 */
function initCatalogFilters() {
  const catalogGrid = document.getElementById('catalogCoursesGrid');
  if (!catalogGrid) return;

  const courseCards = Array.from(catalogGrid.querySelectorAll('.catalog-course-item'));
  const searchInput = document.getElementById('catalogSearchInput');
  const sortSelect = document.getElementById('catalogSortSelect');
  const emptyState = document.getElementById('catalogEmptyState');
  const counterEl = document.getElementById('catalogTotalCount');
  const activeFiltersContainer = document.getElementById('activeFiltersPills');
  const resetBtns = document.querySelectorAll('.btn-reset-filters');
  const btnEmptyReset = document.getElementById('btnEmptyReset');

  // View switchers (Grid vs List)
  const btnGridView = document.getElementById('btnGridView');
  const btnListView = document.getElementById('btnListView');

  if (btnGridView && btnListView) {
    btnGridView.addEventListener('click', () => {
      btnGridView.classList.add('active');
      btnListView.classList.remove('active');
      catalogGrid.classList.remove('list-view');
    });

    btnListView.addEventListener('click', () => {
      btnListView.classList.add('active');
      btnGridView.classList.remove('active');
      catalogGrid.classList.add('list-view');
    });
  }

  // Mobile Filter Drawer
  const btnOpenMobileFilters = document.getElementById('btnOpenMobileFilters');
  const btnCloseMobileFilters = document.getElementById('btnCloseMobileFilters');
  const mobileFilterDrawer = document.getElementById('mobileFilterDrawer');
  const mobileFilterOverlay = document.getElementById('mobileFilterOverlay');
  const btnApplyMobileFilters = document.getElementById('btnApplyMobileFilters');

  const openMobileFilter = () => {
    if (mobileFilterDrawer && mobileFilterOverlay) {
      mobileFilterDrawer.classList.add('active');
      mobileFilterOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeMobileFilter = () => {
    if (mobileFilterDrawer && mobileFilterOverlay) {
      mobileFilterDrawer.classList.remove('active');
      mobileFilterOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  if (btnOpenMobileFilters) btnOpenMobileFilters.addEventListener('click', openMobileFilter);
  if (btnCloseMobileFilters) btnCloseMobileFilters.addEventListener('click', closeMobileFilter);
  if (mobileFilterOverlay) mobileFilterOverlay.addEventListener('click', closeMobileFilter);
  if (btnApplyMobileFilters) btnApplyMobileFilters.addEventListener('click', closeMobileFilter);

  // Main Filter Handler
  const applyFilters = () => {
    // 1. Get search query
    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';

    // 2. Get selected categories
    const selectedCats = Array.from(document.querySelectorAll('input[name="categoryFilter"]:checked')).map(cb => cb.value);

    // 3. Get selected learning mode
    const selectedMode = document.querySelector('input[name="modeFilter"]:checked')?.value || 'all';

    // 4. Get selected branch
    const selectedBranch = document.querySelector('input[name="branchFilter"]:checked')?.value || 'all';

    // 5. Toggles
    const installmentOnly = document.getElementById('filterInstallmentOnly')?.checked || false;
    const certOnly = document.getElementById('filterCertOnly')?.checked || false;

    let visibleCount = 0;

    courseCards.forEach(card => {
      const title = card.getAttribute('data-title')?.toLowerCase() || '';
      const cat = card.getAttribute('data-category') || '';
      const mode = card.getAttribute('data-mode') || ''; // 'onsite', 'online', 'both'
      const branch = card.getAttribute('data-branch') || ''; // 'branch1', 'branch2', 'both'
      const hasInstallment = card.getAttribute('data-installment') === 'true';
      const hasCert = card.getAttribute('data-cert') === 'true';

      // Matching conditions
      const matchQuery = !query || title.includes(query);
      const matchCat = !selectedCats.length || selectedCats.includes('all') || selectedCats.includes(cat);
      const matchMode = selectedMode === 'all' || mode === selectedMode || mode === 'both';
      const matchBranch = selectedBranch === 'all' || branch === selectedBranch || branch === 'both';
      const matchInstallment = !installmentOnly || hasInstallment;
      const matchCert = !certOnly || hasCert;

      if (matchQuery && matchCat && matchMode && matchBranch && matchInstallment && matchCert) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    // Sort visible cards
    sortCards();

    // Update Counter
    if (counterEl) {
      counterEl.textContent = `${visibleCount} دوره آموزشی`;
    }

    // Toggle Empty State
    if (emptyState) {
      if (visibleCount === 0) {
        emptyState.style.display = 'flex';
      } else {
        emptyState.style.display = 'none';
      }
    }

    // Render active filter pills
    renderActiveFilterPills(selectedCats, selectedMode, selectedBranch, installmentOnly, certOnly, query);
  };

  // Sort Handler
  const sortCards = () => {
    const sortBy = sortSelect ? sortSelect.value : 'default';
    const sorted = [...courseCards].sort((a, b) => {
      if (sortBy === 'hours-desc') {
        return (parseInt(b.getAttribute('data-hours')) || 0) - (parseInt(a.getAttribute('data-hours')) || 0);
      }
      if (sortBy === 'hours-asc') {
        return (parseInt(a.getAttribute('data-hours')) || 0) - (parseInt(b.getAttribute('data-hours')) || 0);
      }
      if (sortBy === 'rating') {
        return (parseFloat(b.getAttribute('data-rating')) || 0) - (parseFloat(a.getAttribute('data-rating')) || 0);
      }
      if (sortBy === 'popular') {
        return (parseInt(b.getAttribute('data-students')) || 0) - (parseInt(a.getAttribute('data-students')) || 0);
      }
      return 0;
    });

    sorted.forEach(card => catalogGrid.appendChild(card));
  };

  // Render Active Pills
  const renderActiveFilterPills = (cats, mode, branch, installment, cert, query) => {
    if (!activeFiltersContainer) return;
    activeFiltersContainer.innerHTML = '';

    if (query) {
      addPill(`جستجو: "${query}"`, () => {
        if (searchInput) searchInput.value = '';
        applyFilters();
      });
    }

    cats.forEach(c => {
      if (c !== 'all') {
        const label = document.querySelector(`input[name="categoryFilter"][value="${c}"]`)?.closest('.filter-check-item')?.querySelector('.filter-text')?.textContent || c;
        addPill(label, () => {
          const cb = document.querySelector(`input[name="categoryFilter"][value="${c}"]`);
          if (cb) cb.checked = false;
          applyFilters();
        });
      }
    });

    if (mode !== 'all') {
      const modeLabel = mode === 'onsite' ? 'حضوری در شعب' : 'مجازی / آنلاین';
      addPill(modeLabel, () => {
        const radio = document.querySelector('input[name="modeFilter"][value="all"]');
        if (radio) radio.checked = true;
        applyFilters();
      });
    }

    if (branch !== 'all') {
      const branchLabel = branch === 'branch1' ? 'شعبه ۱ (مرتضوی)' : 'شعبه ۲ (اسکندری)';
      addPill(branchLabel, () => {
        const radio = document.querySelector('input[name="branchFilter"][value="all"]');
        if (radio) radio.checked = true;
        applyFilters();
      });
    }

    if (installment) {
      addPill('پرداخت اقساطی', () => {
        const toggle = document.getElementById('filterInstallmentOnly');
        if (toggle) toggle.checked = false;
        applyFilters();
      });
    }

    if (cert) {
      addPill('مدرک بین‌المللی ISCO', () => {
        const toggle = document.getElementById('filterCertOnly');
        if (toggle) toggle.checked = false;
        applyFilters();
      });
    }
  };

  const addPill = (text, onRemove) => {
    const pill = document.createElement('span');
    pill.className = 'active-filter-pill';
    pill.innerHTML = `<span>${text}</span> <button type="button" aria-label="حذف"><i class="fa-solid fa-xmark"></i></button>`;
    pill.querySelector('button').addEventListener('click', onRemove);
    activeFiltersContainer.appendChild(pill);
  };

  // Reset Filters
  const resetAll = () => {
    if (searchInput) searchInput.value = '';
    document.querySelectorAll('input[name="categoryFilter"]').forEach(cb => cb.checked = false);
    const catAll = document.querySelector('input[name="categoryFilter"][value="all"]');
    if (catAll) catAll.checked = true;

    const modeAll = document.querySelector('input[name="modeFilter"][value="all"]');
    if (modeAll) modeAll.checked = true;

    const branchAll = document.querySelector('input[name="branchFilter"][value="all"]');
    if (branchAll) branchAll.checked = true;

    const toggleInstallment = document.getElementById('filterInstallmentOnly');
    if (toggleInstallment) toggleInstallment.checked = false;

    const toggleCert = document.getElementById('filterCertOnly');
    if (toggleCert) toggleCert.checked = false;

    if (sortSelect) sortSelect.value = 'default';

    applyFilters();
  };

  resetBtns.forEach(btn => btn.addEventListener('click', resetAll));
  if (btnEmptyReset) btnEmptyReset.addEventListener('click', resetAll);

  // Event Listeners
  if (searchInput) searchInput.addEventListener('input', applyFilters);
  document.querySelectorAll('input[name="categoryFilter"], input[name="modeFilter"], input[name="branchFilter"]').forEach(input => {
    input.addEventListener('change', applyFilters);
  });
  const toggleInstallment = document.getElementById('filterInstallmentOnly');
  const toggleCert = document.getElementById('filterCertOnly');
  if (toggleInstallment) toggleInstallment.addEventListener('change', applyFilters);
  if (toggleCert) toggleCert.addEventListener('change', applyFilters);
  if (sortSelect) sortSelect.addEventListener('change', applyFilters);

  // Initial Run
  applyFilters();
}

/**
 * ==========================================================================
 * Instructors Catalog Filter & Search (instructors.html)
 * ==========================================================================
 */
function initInstructorsCatalog() {
  const cards = document.querySelectorAll('.instructor-pro-card');
  if (!cards.length) return;

  const deptPills = document.querySelectorAll('.dept-pill-btn');
  const searchInput = document.getElementById('instructorSearchInput');
  const campusFilter = document.getElementById('instructorCampusFilter');
  const visibleCountBadge = document.getElementById('instructorVisibleCount');
  const emptyState = document.getElementById('noInstructorsFound');

  let activeDept = 'all';

  const filterCards = () => {
    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const selectedCampus = campusFilter ? campusFilter.value : 'all';
    let visibleCount = 0;

    cards.forEach((card) => {
      const cardDept = card.getAttribute('data-dept') || '';
      const cardCampuses = card.getAttribute('data-campuses') || '';
      const cardText = card.textContent.toLowerCase();

      const matchDept = (activeDept === 'all' || cardDept === activeDept);
      const matchCampus = (selectedCampus === 'all' || cardCampuses.includes(selectedCampus));
      const matchQuery = (!query || cardText.includes(query));

      if (matchDept && matchCampus && matchQuery) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (visibleCountBadge) {
      visibleCountBadge.textContent = `نمایش ${toPersianDigits(visibleCount)} مربی رسمی`;
    }

    if (emptyState) {
      emptyState.style.display = (visibleCount === 0) ? 'block' : 'none';
    }
  };

  deptPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      deptPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeDept = pill.getAttribute('data-dept') || 'all';
      filterCards();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', filterCards);
  }

  if (campusFilter) {
    campusFilter.addEventListener('change', filterCards);
  }

  // Initial calculation
  filterCards();
}

/**
 * ==========================================================================
 * Single Instructor Profile Logic & Dynamic Data Loader (instructor-single.html)
 * ==========================================================================
 */
const INSTRUCTORS_DATA = {
  shayanfar: {
    id: 'shayanfar',
    name: 'مهندس روزبه شایان‌فر',
    title: 'مدیر دپارتمان فناوری اطلاعات و مدرس ارشد هوش مصنوعی و برنامه‌نویسی',
    academic: 'کارشناس ارشد مهندسی نرم‌افزار',
    license: 'کد مربیگری رسمی فنی‌حرفه‌ای: ۹۸/۴۱/۲۳۱۷',
    image: 'assets/img/instructors/shayanfar.jpg',
    dept: 'فناوری اطلاعات و هوش مصنوعی',
    deptKey: 'it',
    phone: '09351794610',
    phoneDisplay: '۰۹۳۵۱۷۹۴۶۱۰ (دپارتمان IT)',
    expYears: '۱۲+ سال',
    students: '۱,۸۵۰+',
    satisfaction: '۴.۹۵',
    passingRate: '۹۹.۲٪',
    bio: [
      'مهندس روزبه شایان‌فر دارای بیش از ۱۲ سال سابقه تدریس تخصصی در حوزه‌های برنامه‌نویسی پایتون، مهارت‌های هفتگانه ICDL، پایگاه‌داده و توسعه نرم‌افزار است. ایشان با کسب کارت رسمی مربیگری از سازمان آموزش فنی و حرفه‌ای کشور و گواهینامه بین‌المللی فنون تدریس (پداگوژی)، صدها کارآموز را آماده ورود مستقیم به بازار کار داخلی و بین‌المللی نموده‌اند.',
      'رویکرد آموزشی ایشان مبتنی بر پروژه‌محوری، حل چالش‌های روز دنیای تکنولوژی و یادگیری عمیق مفاهیم بنیادین است. کلاس‌های ایشان هم به صورت حضوری در کارگاه‌های مجهز شعب ۱ و ۲ ماهریار و هم به صورت تعاملی آنلاین با پشتیبانی کدنویسی زنده برگزار می‌گردد.'
    ],
    education: [
      { year: '۱۳۹۵', title: 'کارشناسی ارشد مهندسی کامپیوتر - گرایش نرم‌افزار', desc: 'دانشگاه دولتی با تمرکز بر سیستم‌های هوشمند و تحلیل داده‌ها' },
      { year: '۱۳۹۱', title: 'کارشناسی مهندسی فناوری اطلاعات (IT)', desc: 'فارغ‌التحصیل ممتاز با رتبه برتر دانشگاهی' }
    ],
    certs: [
      { title: 'کارت مربیگری رسمی سازمان آموزش فنی و حرفه‌ای', desc: 'تایید صلاحیت علمی و عملی در خوشه فناوری اطلاعات' },
      { title: 'گواهینامه بین‌المللی پداگوژی عمومی (روش‌ها و فنون تدریس)', desc: 'استاندارد بین‌المللی آموزش مهارت‌محور بزرگسالان' },
      { title: 'مدرک تخصصی توسعه پایتون و هوش مصنوعی', desc: 'دارای سرتیفیکیت معتبر پیاده‌سازی مدل‌های یادگیری ماشین' }
    ],
    courses: [
      {
        title: 'مهارت‌های هفتگانه رایانه (ICDL جامع بین‌المللی)',
        hours: '۱۳۰ ساعت کارگاهی',
        campus: 'شعبه ۱ مرتضوی + آنلاین',
        fee: '۴,۸۰۰,۰۰۰ تومان',
        installment: 'امکان پرداخت در ۳ قسط',
        link: 'course-single.html'
      },
      {
        title: 'برنامه‌نویسی پایتون (Python) از پایه تا هوش مصنوعی',
        hours: '۱۱۰ ساعت پروژه محور',
        campus: 'شعبه ۲ اسکندری + آنلاین',
        fee: '۶,۵۰۰,۰۰۰ تومان',
        installment: 'پرداخت در ۴ قسط بدون کارمزد',
        link: 'course-single.html'
      },
      {
        title: 'طراحی وب کاربردی و سئو مدرن با HTML5, CSS3 و JS',
        hours: '۹۰ ساعت عملی',
        campus: 'کلاس مجازی تعاملی کشوری',
        fee: '۵,۲۰۰,۰۰۰ تومان',
        installment: 'پرداخت اقساطی ماهانه',
        link: 'course-single.html'
      }
    ],
    schedule: [
      { day: 'شنبه و چهارشنبه', hours: '۱۶:۰۰ الی ۲۰:۰۰', location: 'شعبه ۱: مرتضوی (سایت ۱ کامپیوتر)', type: 'کلاس‌های حضوری ICDL و پایتون' },
      { day: 'یکشنبه و سه‌شنبه', hours: '۱۶:۰۰ الی ۲۰:۰۰', location: 'شعبه ۲: اسکندری (سایت تخصصی نرم‌افزار)', type: 'کلاس‌های حضوری هوش مصنوعی و وب' },
      { day: 'پنج‌شنبه‌ها', hours: '۰۹:۰۰ الی ۱۳:۰۰', location: 'استودیو مجازی ماهریار', type: 'کلاس‌های تعاملی آنلاین کشوری' }
    ]
  },
  kazemi: {
    id: 'kazemi',
    name: 'استاد مریم کاظمی',
    title: 'سرپرست دپارتمان صنایع پوشاک و طراحی دوخت آموزشگاه ماهریار',
    academic: 'کارشناس ارشد طراحی پارچه و لباس',
    license: 'کد مربیگری رسمی فنی‌حرفه‌ای: ۹۷/۱۵/۴۱۸۲',
    image: 'assets/img/instructors/kazemi.jpg',
    dept: 'صنایع پوشاک و طراحی دوخت',
    deptKey: 'fashion',
    phone: '09030411617',
    phoneDisplay: '۰۹۰۳۰۴۱۱۶۱۷ (دفتر آموزشگاه)',
    expYears: '۱۵+ سال',
    students: '۲,۱۰۰+',
    satisfaction: '۴.۹۸',
    passingRate: '۱۰۰٪',
    bio: [
      'استاد مریم کاظمی از پیشکسوتان و نخبگان طراحی دوخت و صنایع پوشاک کشور، دارنده مدال طلای المپیاد ملی مهارت و عضو کارگروه تدوین استانداردهای سازمان فنی و حرفه‌ای هستند. ایشان بیش از ۱۵ سال به آموزش تخصصی الگو، برش، دوخت‌های پیشرفته و راه‌اندازی مزون‌های صنعتی پرداخته‌اند.',
      'کارآموزان استاد کاظمی بالاترین نرخ قبولی در آزمون‌های بین‌المللی و جذب در بازار کار طراحی لباس و تولید پوشاک را ثبت کرده‌اند.'
    ],
    education: [
      { year: '۱۳۹۲', title: 'کارشناسی ارشد طراحی پارچه و لباس', desc: 'دانشگاه هنر تهران با پایان‌نامه برگزیده در مد پایدار' },
      { year: '۱۳۸۸', title: 'کارشناسی تکنولوژی طراحی دوخت و پوشاک', desc: 'فارغ‌التحصیل رتبه اول دانشگاه' }
    ],
    certs: [
      { title: 'کارت مربیگری رسمی صنایع پوشاک سازمان آموزش فنی و حرفه‌ای', desc: 'سطح پیشرفته استانداردهای مولر و متریک' },
      { title: 'مدال طلای المپیاد ملی مهارت در رشته فناوری مد و خیاطی', desc: 'کسب عنوان مربی برگزیده استانی و کشوری' },
      { title: 'گواهینامه بین‌المللی طراحی لباس شب و عروس از آکادمی اروپایی', desc: 'تخصص در تکنیک‌های گن‌دوزی و باکس‌دوزی پیشرفته' }
    ],
    courses: [
      {
        title: 'خیاطی نازک‌دوزی زنانه (متد مولر آلمان با مدرک بین‌المللی)',
        hours: '۲۸۰ ساعت جامع کارگاهی',
        campus: 'شعبه ۱ مرتضوی و شعبه ۲ اسکندری',
        fee: '۷,۹۰۰,۰۰۰ تومان',
        installment: 'پرداخت در ۴ قسط منعطف',
        link: 'course-single.html'
      },
      {
        title: 'دوره تخصصی الگو و دوخت لباس شب، عروس و باکس‌دوزی',
        hours: '۱۴۰ ساعت پیشرفته',
        campus: 'کارگاه مجهز شعبه ۲ اسکندری',
        fee: '۸,۵۰۰,۰۰۰ تومان',
        installment: 'پرداخت اقساطی بدون بهره',
        link: 'course-single.html'
      }
    ],
    schedule: [
      { day: 'شنبه و دوشنبه', hours: '۰۹:۰۰ الی ۱۳:۰۰', location: 'شعبه ۱: مرتضوی (کارگاه مجهز دوخت)', type: 'دوره جامع نازک‌دوزی زنانه' },
      { day: 'یکشنبه و سه‌شنبه', hours: '۰۹:۰۰ الی ۱۳:۰۰', location: 'شعبه ۲: اسکندری (کارگاه تخصصی مزون)', type: 'دوره لباس شب و مجلسی' },
      { day: 'چهارشنبه‌ها', hours: '۱۴:۰۰ الی ۱۸:۰۰', location: 'کارگاه‌های تک‌جلسه‌ای الگو', type: 'ورکشاپ‌های رفع اشکال و مزون‌داری' }
    ]
  },
  kamali: {
    id: 'kamali',
    name: 'استاد حمیدرضا کمالی',
    title: 'مدیر دپارتمان امور مالی، بازرگانی و حسابداری آموزشگاه ماهریار',
    academic: 'کارشناس ارشد حسابداری و مدیریت مالی',
    license: 'کد مربیگری رسمی فنی‌حرفه‌ای: ۹۹/۶۳/۱۰۴۴',
    image: 'assets/img/instructors/kamali.jpg',
    dept: 'امور مالی و بازرگانی',
    deptKey: 'finance',
    phone: '09030411617',
    phoneDisplay: '۰۹۰۳۰۴۱۱۶۱۷ (دفتر آموزشگاه)',
    expYears: '۱۱+ سال',
    students: '۱,۴۰۰+',
    satisfaction: '۴.۹۲',
    passingRate: '۹۸.۸٪',
    bio: [
      'استاد حمیدرضا کمالی، حسابدار رسمی، مدیر مالی شرکت‌های تولیدی و بازرگانی معتبر و مشاور مالیاتی سازمان‌ها می‌باشند. ایشان با تسلط کامل بر قوانین کار و تامین اجتماعی، سامانه مودیان و نرم‌افزارهای یکپارچه مالی (سپیدار، هلو و اکسل مالیاتی)، دانش و فنون عملی را به کارآموزان منتقل می‌نمایند.'
    ],
    education: [
      { year: '۱۳۹۴', title: 'کارشناسی ارشد حسابداری و مدیریت مالی', desc: 'دانشگاه شهید بهشتی با پژوهش در حوزه مدیریت هزینه' },
      { year: '۱۳۹۰', title: 'کارشناسی حسابداری مالی', desc: 'دانشگاه تهران' }
    ],
    certs: [
      { title: 'کارت مربیگری رسمی امور مالی و بازرگانی سازمان فنی و حرفه‌ای', desc: 'تدریس استانداردهای حسابداری عمومی و پیشرفته' },
      { title: 'مدرک رسمی مدرسی و کاربری پیشرفته نرم‌افزار همکاران سیستم و سپیدار', desc: 'مدرس تایید صلاحیت شده سیستم‌های مالی' },
      { title: 'گواهی صلاحیت مشاوره مالیاتی و سامانه مودیان مالیاتی', desc: 'تخصص در تنظیم اظهارنامه‌های فصلی و ارزش افزوده' }
    ],
    courses: [
      {
        title: 'حسابداری ویژه بازار کار + نرم‌افزار سپیدار سیستم و اکسل مالیاتی',
        hours: '۱۲۰ ساعت کارگاهی',
        campus: 'شعبه ۱ مرتضوی + آنلاین',
        fee: '۵,۴۰۰,۰۰۰ تومان',
        installment: 'پرداخت در ۳ قسط شهریه',
        link: 'course-single.html'
      }
    ],
    schedule: [
      { day: 'شنبه و چهارشنبه', hours: '۱۷:۰۰ الی ۲۰:۳۰', location: 'شعبه ۱: مرتضوی (سایت مالی)', type: 'حسابداری بازار کار و سپیدار' },
      { day: 'پنج‌شنبه‌ها', hours: '۱۴:۰۰ الی ۱۸:۰۰', location: 'آنلاین و تعاملی کشوری', type: 'کارگاه تخصصی سامانه مودیان و مالیات' }
    ]
  },
  rezvani: {
    id: 'rezvani',
    name: 'مهندس نیلوفر رضوانی',
    title: 'مدرس ارشد طراحی گرافیک، UI/UX، فتوشاپ و تدوین ویدیو',
    academic: 'کارشناس ارشد ارتباط تصویری (گرافیک)',
    license: 'کد مربیگری رسمی فنی‌حرفه‌ای: ۰۱/۲۴/۵۵۳۹',
    image: 'assets/img/instructors/rezvani.jpg',
    dept: 'فناوری اطلاعات و گرافیک',
    deptKey: 'it',
    phone: '09351794610',
    phoneDisplay: '۰۹۳۵۱۷۹۴۶۱۰ (دپارتمان فناوری)',
    expYears: '۹+ سال',
    students: '۱,۲۵۰+',
    satisfaction: '۴.۹۴',
    passingRate: '۹۹.۰٪',
    bio: [
      'مهندس نیلوفر رضوانی، آرت‌دایرکتور و مدرس رسمی دوره‌های تخصصی ادوبی فتوشاپ (Adobe Photoshop)، ایلاستریتور (Illustrator)، پریمیر و فیگما (Figma) می‌باشند. آموزش‌های ایشان به طور مستقیم برای ورود به بازار تبلیغات، شبکه‌های اجتماعی و فریلنسری طراحی شده است.'
    ],
    education: [
      { year: '۱۳۹۷', title: 'کارشناسی ارشد ارتباط تصویری و گرافیک دیجیتال', desc: 'دانشگاه هنر با گرایش هویت بصری برند' },
      { year: '۱۳۹۳', title: 'کارشناسی گرافیک رایانه‌ای', desc: 'فارغ‌التحصیل ممتاز دانشگاهی' }
    ],
    certs: [
      { title: 'کارت مربیگری رسمی گرافیک رایانه‌ای از سازمان فنی و حرفه‌ای', desc: 'تایید مهارت تدریس نرم‌افزارهای تجسمی ادوبی' },
      { title: 'مدرک بین‌المللی تدوین دیجیتال و موشن‌گرافیک', desc: 'استاندارد رسمی ادیت ویدیویی و پادکست تصویری' }
    ],
    courses: [
      {
        title: 'دوره جامع ادوبی فتوشاپ (Adobe Photoshop) ویژه تبلیغات و بازار کار',
        hours: '۸۰ ساعت فشرده پروژه محور',
        campus: 'شعبه ۲ اسکندری + آنلاین',
        fee: '۴,۲۰۰,۰۰۰ تومان',
        installment: 'پرداخت در ۲ الی ۳ قسط',
        link: 'course-single.html'
      }
    ],
    schedule: [
      { day: 'یکشنبه و سه‌شنبه', hours: '۱۶:۰۰ الی ۱۹:۳۰', location: 'شعبه ۲: اسکندری (سایت گرافیک)', type: 'فتوشاپ جامع و طراحی سوشال‌مدیا' },
      { day: 'جمعه‌ها', hours: '۱۰:۰۰ الی ۱۴:۰۰', location: 'آنلاین استودیو ماهریار', type: 'کلاس‌های ایلاستریتور و رابط کاربری' }
    ]
  },
  moradi: {
    id: 'moradi',
    name: 'مهندس علیرضا مرادی',
    title: 'مدرس ارشد نرم‌افزارهای مهندسی عمران، معماری و مدل‌سازی BIM',
    academic: 'کارشناس ارشد مهندسی عمران-سازه',
    license: 'کد مربیگری رسمی فنی‌حرفه‌ای: ۹۶/۸۸/۳۷۲۱',
    image: 'assets/img/instructors/moradi.jpg',
    dept: 'نرم‌افزارهای مهندسی عمران و معماری',
    deptKey: 'engineering',
    phone: '09030411617',
    phoneDisplay: '۰۹۰۳۰۴۱۱۶۱۷ (دفتر آموزشگاه)',
    expYears: '۱۴+ سال',
    students: '۱,۶۰۰+',
    satisfaction: '۴.۹۱',
    passingRate: '۹۸.۵٪',
    bio: [
      'مهندس علیرضا مرادی، دارای پروانه اشتغال به کار نظام مهندسی، مجری و طراح پروژه‌های بزرگ ساختمانی و مدرس نرم‌افزارهای اتوکد (AutoCAD 2D/3D)، رویت (Revit BIM)، تری‌دی مکس (3ds Max) و سپ و ایتیبس هستند.'
    ],
    education: [
      { year: '۱۳۹۳', title: 'کارشناسی ارشد مهندسی عمران - سازه', desc: 'دانشگاه صنعتی با پژوهش در شبیه‌سازی عددی سازه‌ها' },
      { year: '۱۳۸۹', title: 'کارشناسی مهندسی عمران', desc: 'دانشگاه سراسری' }
    ],
    certs: [
      { title: 'کارت مربیگری رسمی نقشه‌کشی و نرم‌افزارهای ساختمانی فنی‌حرفه‌ای', desc: 'دارای مجوز تدریس دوره‌های کد و مدل‌سازی اطلاعات ساختمان' },
      { title: 'پروانه اشتغال به کار مهندسی پایه یک نظارت و محاسبات', desc: 'سازمان نظام مهندسی ساختمان استان تهران' }
    ],
    courses: [
      {
        title: 'نقشه‌کشی و مدل‌سازی ساختمانی با اتوکد (AutoCAD 2D & 3D)',
        hours: '۸۵ ساعت عملی کارگاهی',
        campus: 'شعبه ۱ مرتضوی + آنلاین',
        fee: '۴,۶۰۰,۰۰۰ تومان',
        installment: 'پرداخت در ۳ قسط',
        link: 'course-single.html'
      }
    ],
    schedule: [
      { day: 'شنبه و دوشنبه', hours: '۱۷:۰۰ الی ۲۰:۰۰', location: 'شعبه ۱: مرتضوی (سایت مهندسی)', type: 'اتوکد تخصصی و رویت معماری' }
    ]
  },
  rezazadeh: {
    id: 'rezazadeh',
    name: 'استاد فاطمه رضازاده',
    title: 'مدیر دپارتمان صنایع دستی، قالی‌بافی و تابلوفرش سنتی و کامپیوتری',
    academic: 'استادکار پیشکسوت و کارشناس فرش دستباف',
    license: 'کد مربیگری رسمی فنی‌حرفه‌ای: ۹۳/۰۹/۱۲۶۰',
    image: 'assets/img/instructors/rezazadeh.jpg',
    dept: 'صنایع دستی و بافت',
    deptKey: 'handicrafts',
    phone: '09030411617',
    phoneDisplay: '۰۹۰۳۰۴۱۱۶۱۷ (دفتر آموزشگاه)',
    expYears: '۱۸+ سال',
    students: '۲,۷۰۰+',
    satisfaction: '۴.۹۹',
    passingRate: '۱۰۰٪',
    bio: [
      'استاد فاطمه رضازاده با بیش از ۱۸ سال سابقه درخشان در آموزش صنایع دستی اصیل ایرانی، داور مسابقات ملی مهارت و کارآفرین نمونه در حوزه مشاغل خانگی و خوداشتغالی بانوان هستند. کلاس‌های ایشان همراه با اعطای وام خوداشتغالی و تضمین خرید یا فروش آثار هنرجویان برگزار می‌شود.'
    ],
    education: [
      { year: '۱۳۸۵', title: 'کارشناسی صنایع دستی و گرایش بافت فرش', desc: 'دانشگاه هنر با لوح افتخار در احیای طرح‌های اصیل ایرانی' }
    ],
    certs: [
      { title: 'کارت مربیگری عالی صنایع دستی و قالی‌بافی از سازمان فنی و حرفه‌ای', desc: 'مربی رسمی با بالاترین امتیاز ارزشیابی آموزشی' },
      { title: 'عنوان کارآفرین نمونه کشوری در توسعه مشاغل خانگی', desc: 'تقدیرنامه رسمی از وزارت تعاون، کار و رفاه اجتماعی' }
    ],
    courses: [
      {
        title: 'آموزش حرفه‌ای بافت تابلوفرش و قالی‌بافی سنتی و کامپیوتری',
        hours: '۷۰ ساعت کارگاهی عملی',
        campus: 'شعب ۱ و ۲ ماهریار',
        fee: '۳,۲۰۰,۰۰۰ تومان',
        installment: 'امکان پرداخت اقساطی + تامین دار و ابزار',
        link: 'course-single.html'
      }
    ],
    schedule: [
      { day: 'یکشنبه و سه‌شنبه', hours: '۱۰:۰۰ الی ۱۳:۰۰', location: 'شعبه ۱: مرتضوی (کارگاه هنر)', type: 'چله‌کشی و بافت تابلوفرش' },
      { day: 'چهارشنبه‌ها', hours: '۱۰:۰۰ الی ۱۳:۰۰', location: 'شعبه ۲: اسکندری (کارگاه صنایع دستی)', type: 'گلیم‌بافی و رفوگری' }
    ]
  },
  salehi: {
    id: 'salehi',
    name: 'دکتر زهره صالحی',
    title: 'مدرس ارشد دپارتمان خدمات آموزشی و پداگوژی عمومی (کارت مربیگری)',
    academic: 'دکتری علوم تربیتی و مدیریت آموزشی',
    license: 'کد مربیگری رسمی فنی‌حرفه‌ای: ۹۵/۳۳/۴۱۷۷',
    image: 'assets/img/instructors/salehi.jpg',
    dept: 'خدمات آموزشی و پداگوژی',
    deptKey: 'pedagogy',
    phone: '09030411617',
    phoneDisplay: '۰۹۰۳۰۴۱۱۶۱۷ (دفتر آموزشگاه)',
    expYears: '۱۶+ سال',
    students: '۹۵۰+ مربی',
    satisfaction: '۴.۹۶',
    passingRate: '۹۹.۵٪',
    bio: [
      'دکتر زهره صالحی از اساتید برجسته علوم تربیتی، مدرس دوره‌های ارتقای صلاحیت حرفه‌ای مربیان سازمان فنی و حرفه‌ای و متخصص طراحی سیستم‌های آموزشی هستند. ایشان دوره پداگوژی عمومی را جهت دریافت کارت مربیگری رسمی و مجوز تاسیس آموزشگاه تدریس می‌نمایند.'
    ],
    education: [
      { year: '۱۳۹۵', title: 'دکتری علوم تربیتی - برنامه‌ریزی درسی و آموزشی', desc: 'دانشگاه علامه طباطبائی' },
      { year: '۱۳۹۰', title: 'کارشناسی ارشد مدیریت آموزشی', desc: 'دانشگاه تهران' }
    ],
    certs: [
      { title: 'کارت مربیگری رسمی خدمات آموزشی از سازمان فنی و حرفه‌ای', desc: 'مدرس رسمی دوره‌های پداگوژی و فنون تدریس' },
      { title: 'عضو انجمن مطالعات برنامه درسی ایران', desc: 'مؤلف مقالات پژوهشی بین‌المللی در حوزه یادگیری تجربی' }
    ],
    courses: [
      {
        title: 'پداگوژی عمومی (روش‌ها و فنون نوین تدریس فنی و حرفه‌ای)',
        hours: '۶۰ ساعت استاندارد مربیگری',
        campus: 'شعبه ۲ اسکندری + آنلاین کشوری',
        fee: '۳,۸۰۰,۰۰۰ تومان',
        installment: 'پرداخت در ۲ قسط',
        link: 'course-single.html'
      }
    ],
    schedule: [
      { day: 'پنج‌شنبه‌ها', hours: '۰۹:۰۰ الی ۱۶:۰۰', location: 'شعبه ۲: اسکندری و آنلاین', type: 'دوره فشرده پداگوژی ویژه شاغلین و مربیان' }
    ]
  }
};

function initInstructorSingleProfile() {
  const profileContainer = document.querySelector('.instructor-single-layout');
  if (!profileContainer) return;

  // 1. Tab switching
  const tabs = document.querySelectorAll('.instructor-tab-link');
  const panes = document.querySelectorAll('.instructor-tab-pane');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-tab');
      tabs.forEach(t => t.classList.remove('active'));
      panes.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPane = document.getElementById(targetId);
      if (targetPane) targetPane.classList.add('active');
    });
  });

  // 2. Check URL Parameter ?id=...
  const urlParams = new URLSearchParams(window.location.search);
  const instructorId = urlParams.get('id');

  if (instructorId && INSTRUCTORS_DATA[instructorId]) {
    const data = INSTRUCTORS_DATA[instructorId];
    renderInstructorData(data);
  }

  // 3. Handle Sidebar Consultation Form Submission
  const sidebarForm = document.getElementById('instructorSidebarForm');
  if (sidebarForm) {
    sidebarForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const phoneInput = sidebarForm.querySelector('input[type="tel"]');
      const nameInput = sidebarForm.querySelector('input[name="fullname"]');

      if (!phoneInput || !phoneInput.value.trim()) {
        if (typeof Swal !== 'undefined') {
          Swal.fire({
            icon: 'warning',
            title: 'شماره تماس الزامی است',
            text: 'لطفاً شماره تلفن همراه خود را وارد فرمایید.',
            confirmButtonText: 'تایید',
            confirmButtonColor: '#554596'
          });
        } else {
          alert('لطفاً شماره تماس را وارد نمایید.');
        }
        return;
      }

      const userName = nameInput && nameInput.value.trim() ? nameInput.value.trim() : 'کارآموز گرامی';

      if (typeof Swal !== 'undefined') {
        Swal.fire({
          icon: 'success',
          title: 'درخواست مشاوره ثبت شد!',
          text: `با تشکر از شما ${userName} عزیز! درخواست مشاوره تخصصی شما ثبت گردید و کارشناس دپارتمان به زودی با شما تماس خواهد گرفت.`,
          confirmButtonText: 'سپاس',
          confirmButtonColor: '#554596'
        });
      }

      if (typeof Toastify !== 'undefined') {
        Toastify({
          text: `درخواست مشاوره برای ${userName} ثبت گردید`,
          duration: 4000,
          gravity: 'top',
          position: 'left',
          style: {
            background: 'linear-gradient(135deg, #10b981, #059669)',
            borderRadius: '12px',
            fontFamily: 'IRANSansX'
          }
        }).showToast();
      }

      sidebarForm.reset();
    });
  }
}

function renderInstructorData(data) {
  // Update document title & SEO
  document.title = `${data.name} | رزومه، مدارک رسمی و دوره‌های مربیگری در آموزشگاه ماهریار`;

  // Update Breadcrumb
  const breadcrumbCurrent = document.getElementById('instBreadcrumbCurrent');
  if (breadcrumbCurrent) breadcrumbCurrent.textContent = data.name;

  // Header Details
  const nameEl = document.getElementById('instHeaderName');
  if (nameEl) nameEl.textContent = data.name;

  const headlineEl = document.getElementById('instHeaderHeadline');
  if (headlineEl) headlineEl.textContent = data.title;

  const avatarEl = document.getElementById('instHeaderAvatar');
  if (avatarEl) {
    avatarEl.src = data.image;
    avatarEl.alt = data.name;
  }

  const deptBadge = document.getElementById('instHeaderDeptBadge');
  if (deptBadge) deptBadge.textContent = data.dept;

  const licenseEl = document.getElementById('instHeaderLicense');
  if (licenseEl) licenseEl.textContent = data.license;

  // KPIs
  const expVal = document.getElementById('instKpiExp');
  if (expVal) expVal.textContent = data.expYears;

  const stuVal = document.getElementById('instKpiStudents');
  if (stuVal) stuVal.textContent = data.students;

  const satVal = document.getElementById('instKpiSatisfaction');
  if (satVal) satVal.textContent = `${data.satisfaction} / ۵`;

  const passVal = document.getElementById('instKpiPassing');
  if (passVal) passVal.textContent = data.passingRate;

  // Bio Paragraphs
  const bioContainer = document.getElementById('instBioContainer');
  if (bioContainer && data.bio) {
    bioContainer.innerHTML = data.bio.map(p => `<p>${p}</p>`).join('');
  }

  // Education Timeline
  const eduContainer = document.getElementById('instEduContainer');
  if (eduContainer && data.education) {
    eduContainer.innerHTML = data.education.map(item => `
      <div class="timeline-item">
        <div class="timeline-year">${item.year}</div>
        <h4 class="timeline-title">${item.title}</h4>
        <p class="timeline-desc">${item.desc}</p>
      </div>
    `).join('');
  }

  // Certifications
  const certContainer = document.getElementById('instCertContainer');
  if (certContainer && data.certs) {
    certContainer.innerHTML = data.certs.map(cert => `
      <div class="cert-card-item">
        <div class="cert-icon"><i class="fa-solid fa-award"></i></div>
        <div class="cert-info">
          <h5>${cert.title}</h5>
          <p>${cert.desc}</p>
        </div>
      </div>
    `).join('');
  }

  // Courses List
  const coursesContainer = document.getElementById('instCoursesContainer');
  if (coursesContainer && data.courses) {
    coursesContainer.innerHTML = data.courses.map(c => `
      <div class="inst-course-card">
        <div class="inst-course-meta">
          <h4 class="inst-course-title">${c.title}</h4>
          <div class="inst-course-details-row">
            <span><i class="fa-solid fa-clock"></i> ${c.hours}</span>
            <span><i class="fa-solid fa-location-dot"></i> ${c.campus}</span>
            <span class="badge badge-success"><i class="fa-solid fa-check"></i> ${c.installment}</span>
          </div>
        </div>
        <div class="inst-course-price-wrap">
          <span class="inst-course-fee">${c.fee}</span>
          <a href="${c.link}" class="btn btn-primary btn-sm">مشاهده سرفصل‌ها و ثبت‌نام</a>
        </div>
      </div>
    `).join('');
  }

  // Schedule Table
  const scheduleContainer = document.getElementById('instScheduleTbody');
  if (scheduleContainer && data.schedule) {
    scheduleContainer.innerHTML = data.schedule.map(s => `
      <tr>
        <td><strong>${s.day}</strong></td>
        <td>${s.hours}</td>
        <td>${s.location}</td>
        <td><span class="badge badge-primary">${s.type}</span></td>
      </tr>
    `).join('');
  }

  // Sidebar prefilled instructor name
  const hiddenInstInput = document.getElementById('sidebarInstructorNameInput');
  if (hiddenInstInput) hiddenInstInput.value = data.name;

  const sidebarPhoneLink = document.getElementById('instSidebarPhoneLink');
  if (sidebarPhoneLink) {
    sidebarPhoneLink.href = `tel:${data.phone}`;
    sidebarPhoneLink.innerHTML = `<i class="fa-solid fa-phone"></i> <span>${data.phoneDisplay}</span>`;
  }
}




