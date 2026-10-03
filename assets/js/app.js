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



