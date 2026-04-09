// =====================================================
// KUSTINI STORE — Main JavaScript
// =====================================================

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

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.querySelector('#nama')?.value.trim();

    // Placeholder: ganti blok ini dengan logika pengiriman formulir yang
    // sesungguhnya (misalnya fetch/POST ke server atau layanan email pihak
    // ketiga seperti Formspree, EmailJS, dsb.) sebelum dipublikasikan.
    showToast(`Terima kasih ${name || 'kamu'}! Pesan Anda telah dikirim. 🎉`, 'success');
    form.reset();
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
