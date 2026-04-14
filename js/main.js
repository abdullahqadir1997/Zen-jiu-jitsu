/* =====================================================
   ZEN BRAZILIAN JIU-JITSU — Main JS
   ===================================================== */

(function () {
  'use strict';

  /* ─── NAV SCROLL ─── */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    });
  }

  /* ─── HAMBURGER MENU ─── */
  const hamburger = document.getElementById('hamburger');
  const drawer    = document.getElementById('navDrawer');
  const overlay   = document.getElementById('drawerOverlay');

  function openDrawer() {
    hamburger?.classList.add('open');
    drawer?.classList.add('open');
    overlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
    hamburger?.setAttribute('aria-expanded', 'true');
  }
  function closeDrawer() {
    hamburger?.classList.remove('open');
    drawer?.classList.remove('open');
    overlay?.classList.remove('active');
    document.body.style.overflow = '';
    hamburger?.setAttribute('aria-expanded', 'false');
  }

  hamburger?.addEventListener('click', () => {
    drawer?.classList.contains('open') ? closeDrawer() : openDrawer();
  });
  overlay?.addEventListener('click', closeDrawer);
  document.querySelectorAll('.nav-drawer a').forEach(a => a.addEventListener('click', closeDrawer));

  /* ─── ACTIVE NAV LINK ─── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-drawer a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ─── MODAL POP-UP ─── */
  const modalOverlay = document.getElementById('modalOverlay');
  const modalClose   = document.getElementById('modalClose');
  const modalCard    = modalOverlay?.querySelector('.modal-card');

  // Map page filenames → select option values
  const pagePrograms = {
    'adult-bjj.html': 'adult-bjj',
    'kids-bjj.html':  'kids-bjj',
    'judo.html':      'judo'
  };
  // Map legacy data-program values → select option values
  const programMap = {
    'Adult Jiu-Jitsu':   'adult-bjj',
    'Kids Jiu-Jitsu':    'kids-bjj',
    'Judo':              'judo',
    'Adult BJJ Program': 'adult-bjj',
    'Kids BJJ Program':  'kids-bjj',
    'Judo BJJ Program':  'judo'
  };
  const pageProgram = pagePrograms[currentPage] || '';

  function openModal(program) {
    if (!modalOverlay) return;
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Suppress cursor glow while modal is open
    const glowEl = document.getElementById('cursor-glow');
    if (glowEl) glowEl.style.opacity = '0';

    // Pre-select program in dropdown
    const programSelect = modalOverlay.querySelector('#modalProgram');
    const target = programMap[program] || pageProgram;
    if (target && programSelect) programSelect.value = target;

    modalOverlay.setAttribute('aria-hidden', 'false');
    const firstInput = modalOverlay.querySelector('input');
    setTimeout(() => firstInput?.focus(), 100);
  }

  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
    modalOverlay.setAttribute('aria-hidden', 'true');

    // Restore cursor glow
    const glowEl = document.getElementById('cursor-glow');
    if (glowEl) glowEl.style.opacity = '1';
  }

  // Suppress glow while cursor is inside the modal card
  if (modalCard) {
    modalCard.addEventListener('mouseenter', () => {
      const glowEl = document.getElementById('cursor-glow');
      if (glowEl) glowEl.style.opacity = '0';
    });
    modalCard.addEventListener('mouseleave', () => {
      if (modalOverlay?.classList.contains('active')) {
        const glowEl = document.getElementById('cursor-glow');
        if (glowEl) glowEl.style.opacity = '0'; // keep suppressed while modal is still open
      }
    });
  }

  // Close triggers
  modalClose?.addEventListener('click', closeModal);
  modalOverlay?.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  // Open triggers: all CTA buttons
  document.querySelectorAll('[data-modal], .btn-red[data-program], .nav-cta, .drawer-cta').forEach(btn => {
    btn.addEventListener('click', (e) => {
      // only if it's a modal trigger, not a link to another page
      if (btn.tagName === 'A' && btn.getAttribute('href') && btn.getAttribute('href') !== '#') return;
      const prog = btn.dataset.program || '';
      openModal(prog);
    });
  });

  /* ─── MODAL FORM SUBMIT ─── */
  const modalForm = document.getElementById('modalForm');
  modalForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = modalForm.querySelector('.btn-red');
    btn.textContent = 'Submitted!';
    btn.style.background = '#22c55e';
    const program = modalForm.querySelector('#modalProgram')?.value || 'adult-bjj';
    setTimeout(() => {
      window.location.href = 'book-a-class.html?program=' + encodeURIComponent(program);
    }, 1000);
  });

  /* ─── CONTACT FORM SUBMIT ─── */
  const contactForm = document.getElementById('contactForm');
  const formSuccess  = document.getElementById('formSuccess');
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('.btn-red');
    btn.textContent = 'Sending...';
    setTimeout(() => {
      contactForm.style.display = 'none';
      if (formSuccess) {
        formSuccess.style.display = 'block';
      }
    }, 1000);
  });

  /* ─── FAQ ACCORDION ─── */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      // Toggle clicked
      if (!isOpen) item.classList.add('open');
      btn.setAttribute('aria-expanded', !isOpen);
    });
  });

  /* ─── SCHEDULE TABS ─── */
  document.querySelectorAll('.schedule-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const day = tab.dataset.day;
      document.querySelectorAll('.schedule-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.schedule-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('schedule-' + day)?.classList.add('active');
    });
  });

  /* ─── GALLERY FILTER ─── */
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      document.querySelectorAll('.gallery-item').forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  /* ─── LIGHTBOX ─── */
  const lightbox     = document.getElementById('lightbox');
  const lightboxImg  = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const src = item.querySelector('img')?.src;
      const alt = item.querySelector('img')?.alt;
      if (lightboxImg && src) {
        lightboxImg.src = src;
        lightboxImg.alt = alt || '';
      }
      lightbox?.classList.add('active');
    });
  });

  lightboxClose?.addEventListener('click', () => lightbox?.classList.remove('active'));
  lightbox?.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.classList.remove('active'); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') lightbox?.classList.remove('active'); });

  /* ─── SCROLL REVEAL (Intersection Observer) ─── */
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    reveals.forEach(el => io.observe(el));
  }

  /* ─── MOBILE BAR CTA ─── */
  const mobileFreeCta = document.getElementById('mobileFreeCta');
  mobileFreeCta?.addEventListener('click', () => openModal(''));

})();

/* ─── REVIEWS CAROUSEL ─── */
(function () {
  'use strict';

  const wrapper  = document.getElementById('reviewsCarouselWrapper');
  const carousel = document.getElementById('reviewsCarousel');
  const track    = document.getElementById('reviewsTrack');
  const dotsEl   = document.getElementById('carouselDots');
  const prevBtn  = document.getElementById('carouselPrev');
  const nextBtn  = document.getElementById('carouselNext');

  if (!track || !carousel) return;

  const GAP          = 24;   // px gap between cards (matches CSS)
  const AUTO_DELAY   = 4000; // ms between auto-advances
  const TRANS_DUR    = 650;  // ms slide transition

  // Snapshot the original cards before any cloning
  const origCards = [...track.children];
  const TOTAL     = origCards.length;

  let visCount     = calcVisible();
  let curIdx       = 0;      // index in the extended track (includes leading clones)
  let isMoving     = false;
  let autoTimer    = null;

  // ── Helpers ──────────────────────────────────────────
  function calcVisible() {
    if (window.innerWidth <  768) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  }

  function cardWidth() {
    return (carousel.offsetWidth - GAP * (visCount - 1)) / visCount;
  }

  // ── Init: build clones for seamless loop ─────────────
  function init() {
    // Remove existing clones from previous init
    [...track.querySelectorAll('.rc-clone')].forEach(c => c.remove());

    visCount = calcVisible();
    const cw = cardWidth();

    // Prepend clones of last `visCount` originals → enables prev-wrapping
    for (let i = TOTAL - 1; i >= TOTAL - visCount; i--) {
      const cl = origCards[i].cloneNode(true);
      cl.classList.add('rc-clone');
      track.insertBefore(cl, track.firstChild);
    }
    // Append clones of first `visCount` originals → enables next-wrapping
    for (let i = 0; i < visCount; i++) {
      const cl = origCards[i].cloneNode(true);
      cl.classList.add('rc-clone');
      track.appendChild(cl);
    }

    // Set card dimensions
    sizecards(cw);

    // Land on first real card (offset by leading clone count)
    curIdx = visCount;
    goTo(curIdx, false);

    buildDots();
  }

  function sizecards(cw) {
    [...track.children].forEach(card => {
      card.style.flex     = `0 0 ${cw}px`;
      card.style.minWidth = `${cw}px`;
    });
  }

  // ── Position ─────────────────────────────────────────
  function goTo(idx, animate) {
    const cw     = cardWidth();
    const offset = idx * (cw + GAP);
    track.style.transition = animate
      ? `transform ${TRANS_DUR}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`
      : 'none';
    track.style.transform  = `translateX(-${offset}px)`;
    updateDots();
  }

  // ── After slide: seamless jump if we hit a clone ─────
  track.addEventListener('transitionend', (e) => {
    if (e.propertyName !== 'transform') return;
    isMoving = false;

    if (curIdx >= visCount + TOTAL) {
      // Slid past end clones → silently jump to real start
      curIdx = visCount;
      goTo(curIdx, false);
    } else if (curIdx < visCount) {
      // Slid past leading clones → silently jump to real end
      curIdx = visCount + TOTAL - 1;
      goTo(curIdx, false);
    }

    // Re-enable smooth transition (double rAF ensures 'none' was painted)
    requestAnimationFrame(() => requestAnimationFrame(() => {
      track.style.transition = `transform ${TRANS_DUR}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
    }));
  });

  // ── Navigation ───────────────────────────────────────
  function next() {
    if (isMoving) return;
    isMoving = true;
    curIdx++;
    goTo(curIdx, true);
  }

  function prev() {
    if (isMoving) return;
    isMoving = true;
    curIdx--;
    goTo(curIdx, true);
  }

  // ── Dots ─────────────────────────────────────────────
  function buildDots() {
    if (!dotsEl) return;
    dotsEl.innerHTML = '';
    const groupCount = Math.ceil(TOTAL / visCount);
    for (let i = 0; i < groupCount; i++) {
      const btn = document.createElement('button');
      btn.className = 'carousel-dot';
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-label', `Review group ${i + 1} of ${groupCount}`);
      btn.addEventListener('click', () => {
        if (isMoving) return;
        const target = visCount + i * visCount;
        curIdx = Math.min(target, visCount + TOTAL - 1);
        goTo(curIdx, true);
        resetAuto();
      });
      dotsEl.appendChild(btn);
    }
    updateDots();
  }

  function updateDots() {
    if (!dotsEl) return;
    const dots     = dotsEl.querySelectorAll('.carousel-dot');
    if (!dots.length) return;
    const realFirst = ((curIdx - visCount) % TOTAL + TOTAL) % TOTAL;
    const groupIdx  = Math.floor(realFirst / visCount) % dots.length;
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === groupIdx);
      d.setAttribute('aria-selected', i === groupIdx ? 'true' : 'false');
    });
  }

  // ── Auto-play ────────────────────────────────────────
  function startAuto() { stopAuto(); autoTimer = setInterval(next, AUTO_DELAY); }
  function stopAuto()  { clearInterval(autoTimer); }
  function resetAuto() { stopAuto(); startAuto(); }

  // ── Arrow buttons ────────────────────────────────────
  nextBtn?.addEventListener('click', () => { next(); resetAuto(); });
  prevBtn?.addEventListener('click', () => { prev(); resetAuto(); });

  // ── Hover pause ──────────────────────────────────────
  wrapper?.addEventListener('mouseenter', stopAuto);
  wrapper?.addEventListener('mouseleave', startAuto);

  // ── Touch / swipe ────────────────────────────────────
  let touchStartX = 0;
  carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    stopAuto();
  }, { passive: true });
  carousel.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { diff > 0 ? next() : prev(); }
    startAuto();
  }, { passive: true });

  // ── Resize ───────────────────────────────────────────
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const newVis = calcVisible();
      if (newVis !== visCount) {
        init();         // full reinit on breakpoint crossing
        startAuto();
      } else {
        sizecards(cardWidth());
        goTo(curIdx, false);
      }
    }, 200);
  });

  // ── Boot ─────────────────────────────────────────────
  init();
  startAuto();

}());

/* =====================================================
   PROGRAMS DROPDOWN — mobile accordion & active state
   ===================================================== */
(function () {
  // Mobile accordion toggle
  document.querySelectorAll('.drawer-programs-toggle').forEach(function (toggle) {
    toggle.addEventListener('click', function () {
      var parent = toggle.closest('.drawer-programs');
      var sub    = parent.querySelector('.drawer-programs-sub');
      var isOpen = parent.classList.contains('open');
      parent.classList.toggle('open', !isOpen);
      toggle.setAttribute('aria-expanded', String(!isOpen));
      if (isOpen) { sub.setAttribute('hidden', ''); } else { sub.removeAttribute('hidden'); }
    });
  });

  // Mark Programs toggle active when on a sub-page
  var page = window.location.pathname.split('/').pop() || 'index.html';
  if (['adult-bjj.html', 'kids-bjj.html', 'judo.html'].indexOf(page) !== -1) {
    document.querySelectorAll('.nav-dropdown-toggle, .drawer-programs-toggle').forEach(function (el) {
      el.classList.add('active');
    });
    document.querySelectorAll('.nav-dropdown-menu a, .drawer-programs-sub a').forEach(function (a) {
      if (a.getAttribute('href') === page) { a.classList.add('active'); }
    });
  }
}());

/* =====================================================
   MAP FACADE — lazy-load Google Maps on click or scroll
   ===================================================== */
(function () {
  document.querySelectorAll('.map-facade').forEach(function (facade) {
    var src   = facade.dataset.mapSrc;
    var title = facade.dataset.mapTitle || 'ZEN Brazilian Jiu-Jitsu location map';
    var loaded = false;

    function loadMap() {
      if (loaded) return;
      loaded = true;
      var iframe = document.createElement('iframe');
      iframe.src = src;
      iframe.width = '100%';
      iframe.height = '100%';
      iframe.style.border = '0';
      iframe.setAttribute('allowfullscreen', '');
      iframe.setAttribute('loading', 'lazy');
      iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
      iframe.title = title;
      facade.innerHTML = '';
      facade.appendChild(iframe);
    }

    facade.addEventListener('click', loadMap);
  });
}());

