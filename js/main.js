// =====================================================
// KUSTINI STORE — Main JavaScript
// =====================================================

// =====================================================
// Telegram Bot Configuration
// Ganti nilai berikut dengan token bot dan chat ID owner
// JANGAN commit token asli ke repositori publik
// =====================================================
const TELEGRAM_BOT_TOKEN = '8526195679:AAH--icxmjSatH2vj3AIbUDC-5mw6bwH6i0';
const TELEGRAM_OWNER_CHAT_ID = '358455215';

// ---------- Cart State ----------
let cartCount = 0;

// ---------- DOM Ready ----------
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initAddToCart();
  initStickyNav();
  initActiveLink();
  initFilterCheckboxes();
  initContactForm();
  initScrollReveal();
  initScrollProgress();
  initBackToTop();
  initCounterAnimation();
  initRippleEffect();
  initFloatingEmojis();
  initCursorSparkle();
  initWAConfetti();
  initParticleBackground();
  initLiveClock();
  initCartModal();
  initDotsMenu();
  initSumenepModal();
});

// =====================================================
// Mobile Menu Toggle
// =====================================================
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
  });

  // Close when a mobile link is clicked
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
    });
  });
}

// =====================================================
// Sticky Navbar Shadow
// =====================================================
function initStickyNav() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    navbar.style.boxShadow = window.scrollY > 10
      ? '0 4px 20px rgba(0,0,0,.14)'
      : '0 2px 12px rgba(0,0,0,.08)';
  });
}

// =====================================================
// Active Navigation Link
// =====================================================
function initActiveLink() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// =====================================================
// Add to Cart
// =====================================================
function initAddToCart() {
  document.querySelectorAll('.add-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = e.target.closest('.product-card');
      const name = card ? card.querySelector('h3')?.textContent : 'Produk';
      addToCart(name);
    });
  });
}

function addToCart(productName) {
  cartCount++;
  updateCartBadge();
  showToast(`✅ "${productName}" ditambahkan ke keranjang!`, 'success');
}

function updateCartBadge() {
  document.querySelectorAll('.cart-badge').forEach(badge => {
    badge.textContent = cartCount;
    badge.style.display = cartCount > 0 ? 'flex' : 'none';
  });
}

// =====================================================
// Toast Notification
// =====================================================
function showToast(message, type = '') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(110%)';
    toast.style.transition = '.4s ease';
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

// =====================================================
// Filter Checkboxes (products page)
// =====================================================
function initFilterCheckboxes() {
  const checkboxes = document.querySelectorAll('.filter-option input[type="checkbox"]');
  if (!checkboxes.length) return;

  checkboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      applyFilters();
    });
  });
}

function applyFilters() {
  const checkedCategories = [...document.querySelectorAll('[data-filter-cat]:checked')].map(cb => cb.value);
  const cards = document.querySelectorAll('.product-card[data-category]');

  cards.forEach(card => {
    const cat = card.dataset.category;
    if (!checkedCategories.length || checkedCategories.includes(cat)) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
}

// =====================================================
// Contact Form Submission
// =====================================================
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name    = form.querySelector('#nama')?.value.trim() || '-';
    const telepon = form.querySelector('#telepon')?.value.trim() || '-';
    const subjek  = form.querySelector('#subjek')?.value || '-';
    const pesan   = form.querySelector('#pesan')?.value.trim() || '-';

    const escapeMd = s => s.replace(/[_*[\]()~`>#+\-=|{}.!\\]/g, '\\$&');
    const text =
      `📩 *Pesan Baru dari Website Warung Kustini*\n\n` +
      `👤 *Nama:* ${escapeMd(name)}\n` +
      `📞 *Telepon:* ${escapeMd(telepon)}\n` +
      `📌 *Subjek:* ${escapeMd(subjek)}\n` +
      `💬 *Pesan:*\n${escapeMd(pesan)}`;

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    try {
      const res = await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: TELEGRAM_OWNER_CHAT_ID,
            text,
            parse_mode: 'Markdown',
          }),
        }
      );

      if (res.ok) {
        showToast(`Terima kasih ${name}! Pesan Anda telah dikirim. 🎉`, 'success');
        form.reset();
      } else {
        showToast('Gagal mengirim pesan. Silakan coba lagi.', 'error');
      }
    } catch {
      showToast('Gagal mengirim pesan. Periksa koneksi internet Anda.', 'error');
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}

// =====================================================
// Smooth scroll for anchor links
// =====================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// =====================================================
// Scroll-Reveal (IntersectionObserver)
// =====================================================
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Staggered delay for sibling items
        const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, idx * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  elements.forEach(el => observer.observe(el));
}

// =====================================================
// Scroll Progress Bar
// =====================================================
function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = pct + '%';
  });
}

// =====================================================
// Back To Top Button
// =====================================================
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// =====================================================
// Animated Number Counter for Stats
// =====================================================
function initCounterAnimation() {
  const statNums = document.querySelectorAll('.stat-num');
  if (!statNums.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => observer.observe(el));
}

function animateCounter(el) {
  const raw = el.textContent.trim();
  const numMatch = raw.match(/[\d.]+/);
  if (!numMatch) return;

  const target = parseFloat(numMatch[0]);
  const suffix = raw.replace(numMatch[0], '');
  const duration = 1400;
  const start = performance.now();

  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(ease * target);
    el.textContent = current + suffix;
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      // Pop the parent stat box when done
      const stat = el.closest('.stat');
      if (stat) {
        stat.classList.add('counted');
        setTimeout(() => stat.classList.remove('counted'), 500);
      }
    }
  }

  requestAnimationFrame(step);
}

// =====================================================
// Ripple Effect on Buttons
// =====================================================
function initRippleEffect() {
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px`;
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });
}

// =====================================================
// Floating Food Emojis in Hero
// =====================================================
function initFloatingEmojis() {
  const container = document.getElementById('floatingContainer');
  if (!container) return;

  const emojis = ['🌭','🥛','🍡','⭐','✨','🎉','🍬','🎈','💫','🌟','🍭','❤️'];
  const count = 14;

  for (let i = 0; i < count; i++) {
    spawnEmoji(container, emojis);
  }

  // Keep spawning every 2.5 s so the stream never stops
  setInterval(() => spawnEmoji(container, emojis), 2500);
}

function spawnEmoji(container, emojis) {
  const el = document.createElement('span');
  el.className = 'floating-emoji';
  el.textContent = emojis[Math.floor(Math.random() * emojis.length)];

  const size = 1.2 + Math.random() * 1.2;
  const left = Math.random() * 95;
  const dur  = 6 + Math.random() * 8;
  const delay = Math.random() * 4;

  el.style.cssText = `left:${left}%;bottom:-60px;font-size:${size}rem;animation-duration:${dur}s;animation-delay:${delay}s;`;
  container.appendChild(el);
  setTimeout(() => el.remove(), (dur + delay + 0.5) * 1000);
}

// =====================================================
// Cursor Sparkle Trail
// =====================================================
function initCursorSparkle() {
  const colors = ['#e8451e','#f9a825','#27ae60','#3498db','#9b59b6','#ff6b35'];
  let lastX = 0, lastY = 0;
  let throttle = false;

  document.addEventListener('mousemove', (e) => {
    if (throttle) return;
    throttle = true;
    setTimeout(() => { throttle = false; }, 60);

    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    if (Math.abs(dx) < 5 && Math.abs(dy) < 5) return;
    lastX = e.clientX;
    lastY = e.clientY;

    for (let i = 0; i < 3; i++) {
      const dot = document.createElement('div');
      dot.className = 'sparkle-dot';
      const size = 6 + Math.random() * 8;
      const angle = Math.random() * Math.PI * 2;
      const dist  = 20 + Math.random() * 30;
      dot.style.cssText = [
        `width:${size}px`, `height:${size}px`,
        `left:${e.clientX - size / 2}px`, `top:${e.clientY - size / 2}px`,
        `background:${colors[Math.floor(Math.random() * colors.length)]}`,
        `--dx:${Math.cos(angle) * dist}px`, `--dy:${Math.sin(angle) * dist}px`,
        `animation-duration:${0.4 + Math.random() * 0.4}s`,
      ].join(';');
      document.body.appendChild(dot);
      setTimeout(() => dot.remove(), 900);
    }
  });
}

// =====================================================
// Confetti Burst on WhatsApp Button Click
// =====================================================
function initWAConfetti() {
  document.querySelectorAll('.add-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      burstConfetti(e.clientX, e.clientY);
    });
  });
}

function burstConfetti(cx, cy) {
  const colors = ['#e8451e','#f9a825','#27ae60','#3498db','#9b59b6','#ff6b35','#ffffff'];
  for (let i = 0; i < 28; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    const angle = (Math.PI * 2 * i) / 28 + (Math.random() - .5) * .5;
    const dist  = 60 + Math.random() * 80;
    const dur   = 0.8 + Math.random() * 0.7;
    const rot   = (Math.random() - .5) * 720 + 'deg';
    el.style.cssText = [
      `left:${cx}px`, `top:${cy}px`,
      `background:${colors[Math.floor(Math.random() * colors.length)]}`,
      `--tx:${Math.cos(angle) * dist}px`, `--ty:${Math.sin(angle) * dist}px`,
      `--rot:${rot}`, `--dur:${dur}s`,
      `width:${6 + Math.random() * 6}px`, `height:${6 + Math.random() * 6}px`,
    ].join(';');
    document.body.appendChild(el);
    setTimeout(() => el.remove(), (dur + 0.1) * 1000);
  }
}

// =====================================================
// Canvas Particle Network Background in Hero
// =====================================================
function initParticleBackground() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'hero-particles';
  hero.insertBefore(canvas, hero.firstChild);

  const ctx = canvas.getContext('2d');
  const pts = [];
  const COUNT = 60;
  const MAX_DIST = 130;

  function resize() {
    canvas.width  = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
    pts.forEach(p => {
      p.x = Math.min(p.x, canvas.width);
      p.y = Math.min(p.y, canvas.height);
    });
  }
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < COUNT; i++) {
    pts.push({
      x:  Math.random() * canvas.width,
      y:  Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.55,
      vy: (Math.random() - 0.5) * 0.55,
      r:  1.2 + Math.random() * 2.2,
    });
  }

  function frame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const W = canvas.width, H = canvas.height;

    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x;
        const dy = pts[i].y - pts[j].y;
        const d  = Math.hypot(dx, dy);
        if (d < MAX_DIST) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255,255,255,${0.18 * (1 - d / MAX_DIST)})`;
          ctx.lineWidth = 0.8;
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.stroke();
        }
      }
    }

    pts.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.55)';
      ctx.fill();
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) { p.x = 0; p.vx *= -1; }
      if (p.x > W) { p.x = W; p.vx *= -1; }
      if (p.y < 0) { p.y = 0; p.vy *= -1; }
      if (p.y > H) { p.y = H; p.vy *= -1; }
    });

    requestAnimationFrame(frame);
  }

  frame();
}

// =====================================================
// Live Clock Widget (WIB — UTC+7)
// =====================================================
function initLiveClock() {
  const display = document.getElementById('clockTime');
  if (!display) return;

  const clockIcon = document.querySelector('.live-clock-icon');
  const clockIcons = ['🕛','🕐','🕑','🕒','🕓','🕔','🕕','🕖','🕗','🕘','🕙','🕚'];
  const fmt = new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Jakarta',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const clockIntervalId = setInterval(() => {
    const parts = {};
    fmt.formatToParts(new Date()).forEach(({ type, value }) => { parts[type] = value; });
    display.textContent = `${parts.hour}:${parts.minute}:${parts.second}`;
    if (clockIcon) {
      const h = parseInt(parts.hour, 10) % 12;
      clockIcon.textContent = clockIcons[h];
    }
  }, 1000);

  // Run immediately so the clock shows at once
  const parts = {};
  fmt.formatToParts(new Date()).forEach(({ type, value }) => { parts[type] = value; });
  display.textContent = `${parts.hour}:${parts.minute}:${parts.second}`;
  if (clockIcon) {
    const h = parseInt(parts.hour, 10) % 12;
    clockIcon.textContent = clockIcons[h];
  }

  return clockIntervalId;
}

// =====================================================
// Info Sumenep — Mobile Nav & Clock
// =====================================================
function initDotsMenu() {
  // Mobile nav button
  const mobileInfoBtn = document.getElementById('mobileInfoSumenep');
  if (mobileInfoBtn) {
    mobileInfoBtn.addEventListener('click', () => {
      // close mobile nav
      document.querySelector('.hamburger')?.classList.remove('open');
      document.querySelector('.mobile-nav')?.classList.remove('open');
      openSumenepModal();
    });
  }

  // Clock widget click
  const clockWidget = document.getElementById('liveClock');
  if (clockWidget) {
    clockWidget.addEventListener('click', openSumenepModal);
  }

  // Dots menu (⋮) toggle
  const dotsBtn = document.getElementById('dotsMenuBtn');
  const dotsDropdown = document.getElementById('dotsDropdown');
  if (dotsBtn && dotsDropdown) {
    dotsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dotsDropdown.classList.toggle('open');
    });
    document.addEventListener('click', () => {
      dotsDropdown.classList.remove('open');
    });
  }

  // Dots menu → Cek Info Sumenep
  const dotsInfoSumenep = document.getElementById('dotsInfoSumenep');
  if (dotsInfoSumenep) {
    dotsInfoSumenep.addEventListener('click', () => {
      dotsDropdown?.classList.remove('open');
      openSumenepModal();
    });
  }
}

// =====================================================
// Sumenep Info Modal — Jam & Cuaca (Premium)
// =====================================================
let _sumenepInterval = null;
let _sumenepParticleRAF = null;

function openSumenepModal() {
  const overlay = document.getElementById('sumenepModalOverlay');
  if (!overlay) return;

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  _updateSumenepTime();
  if (!_sumenepInterval) {
    _sumenepInterval = setInterval(_updateSumenepTime, 1000);
  }
  _startSumenepParticles();
  _loadSumenepWeather();
}

function closeSumenepModal() {
  const overlay = document.getElementById('sumenepModalOverlay');
  if (!overlay) return;
  overlay.classList.remove('open');
  document.body.style.overflow = '';
  if (_sumenepInterval) {
    clearInterval(_sumenepInterval);
    _sumenepInterval = null;
  }
  _stopSumenepParticles();
}

function _updateSumenepTime() {
  const timeEl = document.getElementById('sumenepTimeDisplay');
  const dateEl = document.getElementById('sumenepDateDisplay');
  if (!timeEl) return;

  const now = new Date();
  const timeFmt = new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Jakarta',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  });
  const dateFmt = new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Jakarta',
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  const parts = {};
  timeFmt.formatToParts(now).forEach(({ type, value }) => { parts[type] = value; });

  // Render with animated colon spans
  timeEl.innerHTML =
    `${parts.hour}<span class="sm-colon">:</span>${parts.minute}<span class="sm-colon">:</span>${parts.second}`;

  if (dateEl) dateEl.textContent = dateFmt.format(now);
}

// ---------- Particle canvas ----------
function _startSumenepParticles() {
  const canvas = document.getElementById('sumenepParticles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const header = canvas.parentElement;
  canvas.width  = header.offsetWidth;
  canvas.height = header.offsetHeight;

  const PARTICLE_COUNT = 42;
  const dots = Array.from({ length: PARTICLE_COUNT }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.6 + .4,
    dx: (Math.random() - .5) * .5,
    dy: (Math.random() - .5) * .5,
    alpha: Math.random() * .5 + .1,
  }));

  function drawFrame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dots.forEach(d => {
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(144,224,239,${d.alpha})`;
      ctx.fill();
      d.x += d.dx; d.y += d.dy;
      if (d.x < 0) d.x = canvas.width;
      if (d.x > canvas.width) d.x = 0;
      if (d.y < 0) d.y = canvas.height;
      if (d.y > canvas.height) d.y = 0;
    });
    _sumenepParticleRAF = requestAnimationFrame(drawFrame);
  }
  _stopSumenepParticles();
  drawFrame();
}

function _stopSumenepParticles() {
  if (_sumenepParticleRAF) {
    cancelAnimationFrame(_sumenepParticleRAF);
    _sumenepParticleRAF = null;
  }
}

function _loadSumenepWeather() {
  const content = document.getElementById('sumenepWeatherContent');
  const btn = document.getElementById('sumenepCekCuacaBtn');
  if (!content) return;

  content.textContent = '';
  const loadEl = document.createElement('span');
  loadEl.className = 'weather-loading';
  loadEl.textContent = '⏳ Memuat data cuaca…';
  content.appendChild(loadEl);
  if (btn) btn.classList.add('loading');

  fetch('https://api.nexray.web.id/information/cuaca?kota=Sumenep')
    .then(res => {
      if (!res.ok) throw new Error('Network error');
      return res.json();
    })
    .then(json => {
      if (!json.status || !json.result) throw new Error('Invalid data');
      const forecasts = json.result.forecasts;
      if (!forecasts || forecasts.length === 0) throw new Error('No forecast');

      const parser = new DOMParser();
      const decode = str => {
        const doc = parser.parseFromString(str || '', 'text/html');
        return doc.body.textContent || '';
      };

      content.textContent = '';

      if (json.timestamp) {
        const ts = new Date(json.timestamp);
        const upEl = document.createElement('p');
        upEl.className = 'sumenep-weather-update';
        upEl.textContent = '🕐 Update: ' + ts.toLocaleString('id-ID', {
          timeZone: 'Asia/Jakarta',
          weekday: 'long', day: 'numeric', month: 'long',
          hour: '2-digit', minute: '2-digit',
        }) + ' WIB';
        content.appendChild(upEl);
      }

      forecasts.forEach(f => {
        const cuaca     = decode(f.cuaca);
        const suhu      = decode(f.suhu);
        const waktu     = decode(f.waktu);
        const kelembaban = decode(f.kelembaban);
        const kecepatan = decode(f.kecepatan_angin);
        const arah      = decode(f.arah_angin);
        const vis       = decode(f.visibilitas);

        const card = document.createElement('div');
        card.className = 'sumenep-forecast-card';

        // Weather image
        const imgWrap = document.createElement('div');
        if (f.image_url) {
          const img = document.createElement('img');
          img.className = 'sumenep-forecast-img';
          img.src = f.image_url;
          img.alt = cuaca;
          img.loading = 'lazy';
          img.addEventListener('error', () => {
            const placeholder = document.createElement('div');
            placeholder.className = 'sumenep-forecast-img-placeholder';
            placeholder.textContent = '🌤️';
            imgWrap.replaceWith(placeholder);
          });
          imgWrap.appendChild(img);
        } else {
          imgWrap.className = 'sumenep-forecast-img-placeholder';
          imgWrap.textContent = '🌤️';
        }
        card.appendChild(imgWrap);

        // Info block
        const info = document.createElement('div');
        info.className = 'sumenep-forecast-info';

        const timeEl2 = document.createElement('div');
        timeEl2.className = 'sumenep-forecast-time';
        timeEl2.textContent = '⏰ ' + waktu;
        info.appendChild(timeEl2);

        const suhuEl = document.createElement('div');
        suhuEl.className = 'sumenep-forecast-suhu';
        suhuEl.textContent = suhu;
        info.appendChild(suhuEl);

        const kondEl = document.createElement('div');
        kondEl.className = 'sumenep-forecast-kondisi';
        kondEl.textContent = cuaca;
        info.appendChild(kondEl);

        const detailsEl = document.createElement('div');
        detailsEl.className = 'sumenep-forecast-details';
        [
          { icon: '💧', val: kelembaban, title: 'Kelembaban' },
          { icon: '💨', val: `${kecepatan} ${arah}`, title: 'Angin' },
          { icon: '👁️', val: vis, title: 'Visibilitas' },
        ].forEach(d => {
          if (!d.val.trim()) return;
          const det = document.createElement('span');
          det.className = 'sumenep-forecast-detail';
          det.title = d.title;
          det.textContent = `${d.icon} ${d.val}`;
          detailsEl.appendChild(det);
        });
        info.appendChild(detailsEl);

        card.appendChild(info);
        content.appendChild(card);
      });
    })
    .catch(err => {
      console.error('[Sumenep] Gagal memuat cuaca:', err);
      content.textContent = '';
      const errEl = document.createElement('p');
      errEl.className = 'weather-error';
      errEl.textContent = '⚠️ Info cuaca tidak tersedia saat ini.';
      content.appendChild(errEl);
    })
    .finally(() => {
      if (btn) btn.classList.remove('loading');
    });
}

function initSumenepModal() {
  const overlay  = document.getElementById('sumenepModalOverlay');
  const closeBtn = document.getElementById('sumenepModalClose');
  if (!overlay) return;

  if (closeBtn) closeBtn.addEventListener('click', closeSumenepModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeSumenepModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSumenepModal();
  });

  const cekCuacaBtn = document.getElementById('sumenepCekCuacaBtn');
  if (cekCuacaBtn) {
    cekCuacaBtn.addEventListener('click', _loadSumenepWeather);
  }
}

// =====================================================
// Cart Quantity Modal (Sosis Mix)
// =====================================================
function initCartModal() {
  const overlay   = document.getElementById('cartModalOverlay');
  const closeBtn  = document.getElementById('cartModalClose');
  const cancelBtn = document.getElementById('cartModalCancel');
  const minusBtn  = document.getElementById('cartQtyMinus');
  const plusBtn   = document.getElementById('cartQtyPlus');
  const qtyDisplay   = document.getElementById('cartQtyDisplay');
  const totalDisplay = document.getElementById('cartTotalDisplay');
  const buyLink      = document.getElementById('cartModalBuy');

  if (!overlay) return;

  let currentProduct = 'Sosis Mix';
  let pricePerItem   = 1000;
  let quantity       = 1;

  function formatRupiah(num) {
    return 'Rp ' + num.toLocaleString('id-ID');
  }

  function buildWAText(product, qty, total) {
    const totalFormatted = total.toLocaleString('id-ID');
    return (
      'Bu Kus, mau beli ' + product.toLowerCase() + ' nya ' +
      qty + ' item, total Rp ' + totalFormatted + ' ya Bu Kus 😊'
    );
  }

  function bump(el) {
    el.classList.remove('bump');
    el.offsetWidth; // force reflow
    el.classList.add('bump');
    el.addEventListener('transitionend', () => el.classList.remove('bump'), { once: true });
  }

  function updateModal() {
    const total = pricePerItem * quantity;
    qtyDisplay.textContent   = quantity;
    totalDisplay.textContent = formatRupiah(total);
    bump(qtyDisplay);
    bump(totalDisplay);
    const text = buildWAText(currentProduct, quantity, total);
    buyLink.href = 'https://wa.me/6281807159805?text=' + encodeURIComponent(text);
  }

  function openModal(productName, price) {
    currentProduct = productName;
    pricePerItem   = price;
    quantity       = 1;
    document.getElementById('cartModalTitle').textContent = productName;
    document.querySelector('.cart-modal-price-per strong').textContent =
      formatRupiah(pricePerItem);
    updateModal();
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Open modal when clicking "Beli Sekarang" on Sosis Mix
  document.querySelectorAll('.btn-open-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const product = btn.dataset.product || 'Sosis Mix';
      const price   = parseInt(btn.dataset.price, 10) || 1000;
      openModal(product, price);
      burstConfetti(e.clientX, e.clientY);
    });
  });

  // Quantity controls
  minusBtn.addEventListener('click', () => {
    if (quantity > 1) { quantity--; updateModal(); }
  });
  plusBtn.addEventListener('click', () => {
    quantity++;
    updateModal();
  });

  // Close actions
  closeBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // Track cart count when buy is clicked
  buyLink.addEventListener('click', () => {
    addToCart(currentProduct);
    closeModal();
  });
}

