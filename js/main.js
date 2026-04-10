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
    const email   = form.querySelector('#email')?.value.trim() || '-';
    const telepon = form.querySelector('#telepon')?.value.trim() || '-';
    const subjek  = form.querySelector('#subjek')?.value || '-';
    const pesan   = form.querySelector('#pesan')?.value.trim() || '-';

    const escapeMd = s => s.replace(/[_*[\]()~`>#+\-=|{}.!\\]/g, '\\$&');
    const text =
      `📩 *Pesan Baru dari Website Warung Kustini*\n\n` +
      `👤 *Nama:* ${escapeMd(name)}\n` +
      `📧 *Email:* ${escapeMd(email)}\n` +
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
    if (progress < 1) requestAnimationFrame(step);
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
