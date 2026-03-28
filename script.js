/* =============================================
   PACK 5K CURSOS — Scripts
   Timer | Counters | Particles | FAQ | Toast | Exit-intent
   ============================================= */

(function () {
  'use strict';

  // ===== SCROLL REVEAL ANIMATIONS =====
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ===== ANIMATED COUNTERS =====
  const counterElements = document.querySelectorAll('[data-count]');
  const countersAnimated = new Set();

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersAnimated.has(entry.target)) {
        countersAnimated.add(entry.target);
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counterElements.forEach(el => counterObserver.observe(el));

  function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000;
    const start = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);

      if (target >= 1000) {
        element.textContent = '+' + current.toLocaleString('pt-BR');
      } else if (target === 97) {
        element.textContent = current + '%';
      } else {
        element.textContent = '+' + current;
      }

      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  // ===== COUNTDOWN TIMER (synced hero + section) =====
  function initCountdown() {
    const storageKey = 'pack5k_timer_end_v2';
    let endTime = localStorage.getItem(storageKey);

    if (!endTime || parseInt(endTime) < Date.now()) {
      endTime = Date.now() + (2 * 60 * 60 * 1000) + (47 * 60 * 1000) + (33 * 1000);
      localStorage.setItem(storageKey, endTime.toString());
    } else {
      endTime = parseInt(endTime);
    }

    const els = {
      heroH: document.getElementById('hero-hours'),
      heroM: document.getElementById('hero-minutes'),
      heroS: document.getElementById('hero-seconds'),
      mainH: document.getElementById('timer-hours'),
      mainM: document.getElementById('timer-minutes'),
      mainS: document.getElementById('timer-seconds'),
    };

    function updateTimer() {
      const diff = Math.max(0, endTime - Date.now());
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      const hStr = String(h).padStart(2, '0');
      const mStr = String(m).padStart(2, '0');
      const sStr = String(s).padStart(2, '0');

      if (els.heroH) els.heroH.textContent = hStr;
      if (els.heroM) els.heroM.textContent = mStr;
      if (els.heroS) els.heroS.textContent = sStr;
      if (els.mainH) els.mainH.textContent = hStr;
      if (els.mainM) els.mainM.textContent = mStr;
      if (els.mainS) els.mainS.textContent = sStr;

      if (diff > 0) setTimeout(updateTimer, 1000);
    }

    updateTimer();
  }

  initCountdown();

  // ===== LIVE VISITOR COUNT =====
  const liveCount = document.getElementById('live-count');
  if (liveCount) {
    let count = 847;
    setInterval(() => {
      const delta = Math.floor(Math.random() * 5) - 2;
      count = Math.max(600, Math.min(1200, count + delta));
      liveCount.textContent = count.toLocaleString('pt-BR');
    }, 4000);
  }

  // ===== VACANCY COUNTER =====
  const vacancyEls = document.querySelectorAll('#topbar-vacancies, #vacancies-count, #vacancies-display');
  const vacancyFill = document.getElementById('vacancy-fill');
  let currentVacancies = 127;
  const maxVacancies = 400;

  function updateVacancyUI() {
    vacancyEls.forEach(el => { el.textContent = currentVacancies; });
    if (vacancyFill) {
      const pct = (currentVacancies / maxVacancies) * 100;
      vacancyFill.style.width = pct + '%';
    }
  }

  updateVacancyUI();

  setInterval(() => {
    if (currentVacancies <= 50) return;
    if (Math.random() < 0.35) {
      currentVacancies -= 1;
      updateVacancyUI();
    }
  }, 45000);

  // ===== PARTICLES CANVAS =====
  function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 50 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.5,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.5 + 0.1,
      color: Math.random() > 0.5 ? '255, 107, 0' : '255, 215, 0',
    }));

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
        ctx.fill();

        p.x += p.dx;
        p.y += p.dy;

        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      requestAnimationFrame(draw);
    }

    draw();
  }

  initParticles();

  // ===== FAQ ACCORDION =====
  document.querySelectorAll('.faq__item').forEach(item => {
    item.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq__item').forEach(i => i.classList.remove('open'));
      // Toggle current
      if (!isOpen) item.classList.add('open');
    });
  });

  // ===== MOBILE STICKY CTA =====
  const stickyCta = document.getElementById('sticky-cta');
  if (stickyCta) {
    const heroSection = document.getElementById('hero');

    const stickyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        stickyCta.classList.toggle('visible', !entry.isIntersecting);
      });
    }, { threshold: 0 });

    if (heroSection) stickyObserver.observe(heroSection);
  }

  // ===== EXIT INTENT POPUP =====
  const exitPopup = document.getElementById('exit-popup');
  const popupClose = document.getElementById('popup-close');
  let exitPopupShown = false;

  document.addEventListener('mouseout', function (e) {
    if (exitPopupShown || e.clientY > 0 || e.relatedTarget !== null) return;
    showExitPopup();
  });

  // Mobile: scroll-up trigger after 30s
  setTimeout(function () {
    let lastScrollY = window.scrollY;
    let upCount = 0;

    window.addEventListener('scroll', function onScroll() {
      if (exitPopupShown) { window.removeEventListener('scroll', onScroll); return; }
      if (window.scrollY < lastScrollY - 100 && window.scrollY < 200) {
        upCount++;
        if (upCount >= 2) { showExitPopup(); window.removeEventListener('scroll', onScroll); }
      }
      lastScrollY = window.scrollY;
    });
  }, 30000);

  function showExitPopup() {
    if (exitPopupShown || !exitPopup) return;
    exitPopupShown = true;
    exitPopup.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeExitPopup() {
    if (!exitPopup) return;
    exitPopup.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (popupClose) popupClose.addEventListener('click', closeExitPopup);
  if (exitPopup) exitPopup.addEventListener('click', e => { if (e.target === exitPopup) closeExitPopup(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeExitPopup(); });

  // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // ===== SOCIAL PROOF TOAST NOTIFICATIONS =====
  const buyers = [
    { initials: 'RM', name: 'Rafael M.', city: 'SP', course: 'tráfego pago' },
    { initials: 'JS', name: 'Juliana S.', city: 'RJ', course: 'marketing digital' },
    { initials: 'PA', name: 'Pedro A.', city: 'MG', course: 'design' },
    { initials: 'MC', name: 'Mariana C.', city: 'RS', course: 'confeitaria' },
    { initials: 'LF', name: 'Lucas F.', city: 'PR', course: 'programação' },
    { initials: 'AF', name: 'Ana F.', city: 'BA', course: 'copywriting' },
    { initials: 'TL', name: 'Thiago L.', city: 'CE', course: 'vendas' },
    { initials: 'CR', name: 'Clara R.', city: 'GO', course: 'idiomas' },
    { initials: 'BD', name: 'Bruno D.', city: 'SC', course: 'IA aplicada' },
    { initials: 'FM', name: 'Fernanda M.', city: 'ES', course: 'gestão financeira' },
  ];

  function getTimeAgo() {
    const mins = Math.floor(Math.random() * 59) + 1;
    return mins === 1 ? 'há 1 minuto' : `há ${mins} minutos`;
  }

  function showToast(buyer) {
    const container = document.getElementById('notification-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'notification-toast';
    toast.innerHTML = `
      <div class="notification-toast__avatar">${buyer.initials}</div>
      <div class="notification-toast__text">
        <strong>${buyer.name}</strong> (${buyer.city}) acabou de comprar e vai estudar ${buyer.course}
        <div class="time">${getTimeAgo()}</div>
      </div>
      <div class="notification-toast__badge"></div>
    `;

    container.appendChild(toast);
    setTimeout(() => toast.classList.add('visible'), 50);

    setTimeout(() => {
      toast.classList.add('hiding');
      setTimeout(() => toast.remove(), 500);
    }, 5000);
  }

  // Start toasts after 3s, then every 12-20s
  let buyerIdx = 0;
  setTimeout(() => {
    showToast(buyers[buyerIdx++ % buyers.length]);
    setInterval(() => {
      showToast(buyers[buyerIdx++ % buyers.length]);
    }, 12000 + Math.random() * 8000);
  }, 3000);

})();
