/* ─────────────────────────────────────────────────────────────────────────────
   Al-Hammad Associate — Shared Components (Announcement Bar + Navbar + Footer)
   ───────────────────────────────────────────────────────────────────────────── */

(function () {
  /* ── SVG Icon Library ───────────────────────────────────────────────────── */
  const icons = {
    location: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`,
    phone:    `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>`,
    clock:    `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/></svg>`,
    facebook: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`,
    home:     `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>`,
    building: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17 11V3H7v4H3v14h8v-4h2v4h8V11h-4zM7 19H5v-2h2v2zm0-4H5v-2h2v2zm0-4H5v-2h2v2zm4 4H9v-2h2v2zm0-4H9v-2h2v2zm0-4H9V7h2v2zm4 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2zm4 8h-2v-2h2v2zm0-4h-2v-2h2v2z"/></svg>`,
    mail:     `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>`,
    arrow:    `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>`,
    logout:   `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/></svg>`,
    check:    `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>`,
  };

  /* ── Current Page Detection ─────────────────────────────────────────────── */
  const path = window.location.pathname.split('/').pop() || 'index.html';

  function isActive(page) {
    if (page === 'index.html' && (path === '' || path === 'index.html')) return true;
    return path === page;
  }

  /* ── Announcement Bar ───────────────────────────────────────────────────── */
  const announcementBar = `
<div class="announcement-bar">
  <div class="container">
    <div class="ann-left">
      <span class="ann-item">
        ${icons.location}
        C 177, Block I North Nazimabad, Karachi
      </span>
      <span class="ann-sep">|</span>
      <span class="ann-item">
        ${icons.clock}
        Opens at 1:00 PM
      </span>
    </div>
    <div class="ann-right">
      <a href="tel:+923102206228" class="ann-item">
        ${icons.phone}
        +92 310 2206228
      </a>
      <span class="ann-sep">|</span>
      <a href="https://facebook.com" target="_blank" rel="noopener" class="ann-item">
        ${icons.facebook}
        Facebook
      </a>
    </div>
  </div>
</div>`;

  /* ── Navbar ─────────────────────────────────────────────────────────────── */
  const navbar = `
<nav class="navbar" id="navbar">
  <div class="container">
    <a href="index.html" class="nav-brand">
      <div class="brand-logo-mark"><span>AH</span></div>
      <div class="brand-text">
        <span class="brand-name">Al-Hammad Associate</span>
        <span class="brand-tagline">Premium Real Estate</span>
      </div>
    </a>
    <div class="nav-links">
      <a href="index.html"           ${isActive('index.html')      ? 'class="active"' : ''}>Home</a>
      <a href="about.html"           ${isActive('about.html')      ? 'class="active"' : ''}>About Us</a>
      <a href="properties.html"      ${isActive('properties.html') ? 'class="active"' : ''}>Properties</a>
      <a href="contact.html"         ${isActive('contact.html')    ? 'class="active"' : ''}>Contact</a>
    </div>
    <button class="hamburger" id="hamburger" aria-label="Toggle menu">
      <span></span><span></span><span></span>
    </button>
  </div>
</nav>
<div class="nav-mobile" id="navMobile">
  <a href="index.html"      ${isActive('index.html')      ? 'class="active"' : ''}>Home</a>
  <a href="about.html"      ${isActive('about.html')      ? 'class="active"' : ''}>About Us</a>
  <a href="properties.html" ${isActive('properties.html') ? 'class="active"' : ''}>Properties</a>
  <a href="contact.html"    ${isActive('contact.html')    ? 'class="active"' : ''}>Contact</a>
</div>`;

  /* ── Footer ─────────────────────────────────────────────────────────────── */
  const footer = `
<footer class="footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <a href="index.html" class="nav-brand" style="margin-bottom:0">
          <div class="brand-logo-mark"><span>AH</span></div>
          <div class="brand-text">
            <span class="brand-name">Al-Hammad Associate</span>
            <span class="brand-tagline">Premium Real Estate</span>
          </div>
        </a>
        <p>Karachi's trusted real estate partner since decades. We specialize in connecting buyers, sellers, and tenants with premium residential and commercial properties across the city.</p>
      </div>
      <div>
        <div class="footer-heading">Quick Links</div>
        <div class="footer-links">
          <a href="index.html">${icons.arrow} Home</a>
          <a href="about.html">${icons.arrow} About Us</a>
          <a href="properties.html">${icons.arrow} Properties</a>
          <a href="contact.html">${icons.arrow} Contact</a>
        </div>
      </div>
      <div>
        <div class="footer-heading">Properties</div>
        <div class="footer-links">
          <a href="properties.html?status=For Sale">${icons.arrow} For Sale</a>
          <a href="properties.html?status=For Rent">${icons.arrow} For Rent</a>
          <a href="properties.html?status=For Purchase">${icons.arrow} For Purchase</a>
        </div>
      </div>
      <div>
        <div class="footer-heading">Contact Us</div>
        <div class="footer-contact-item">
          ${icons.location}
          <span>C 177, Block I North Nazimabad Town, Karachi, Pakistan</span>
        </div>
        <div class="footer-contact-item">
          ${icons.phone}
          <a href="tel:+923102206228">+92 310 2206228</a>
        </div>
        <div class="footer-contact-item">
          ${icons.clock}
          <span>Opens at 1:00 PM</span>
        </div>
        <div class="footer-contact-item">
          ${icons.facebook}
          <a href="https://facebook.com" target="_blank" rel="noopener">Follow on Facebook</a>
        </div>
      </div>
    </div>
  </div>
  <div style="border-top:1px solid #2a2a2a;">
    <div class="container">
      <div class="footer-bottom">
        <span>© ${new Date().getFullYear()} Al-Hammad Associate. All rights reserved.</span>
        <span>Developed with care for <a href="contact.html">Al-Hammad Associate</a></span>
      </div>
    </div>
  </div>
</footer>`;

  /* ── Inject into DOM ────────────────────────────────────────────────────── */
  function inject() {
    const headerEl = document.getElementById('site-header');
    const footerEl = document.getElementById('site-footer');
    if (headerEl) headerEl.innerHTML = announcementBar + navbar;
    if (footerEl) footerEl.innerHTML = footer;
    initNavbar();
  }

  /* ── Navbar Behavior ────────────────────────────────────────────────────── */
  function initNavbar() {
    const navbar    = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMobile = document.getElementById('navMobile');

    if (!navbar || !hamburger || !navMobile) return;

    // Sticky shadow on scroll
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    });

    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      navMobile.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    // Close menu when link clicked
    navMobile.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navMobile.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !navMobile.contains(e.target)) {
        hamburger.classList.remove('open');
        navMobile.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  /* ── Global Utilities ───────────────────────────────────────────────────── */
  window.AlHammad = {
    icons,
    showToast(message, type = 'success', duration = 4000) {
      const existing = document.querySelector('.toast');
      if (existing) existing.remove();

      const icon = type === 'success'
        ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="#22c55e"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>`
        : `<svg width="16" height="16" viewBox="0 0 24 24" fill="#ef4444"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>`;

      const toast = document.createElement('div');
      toast.className = `toast ${type}`;
      toast.innerHTML = `${icon}<span>${message}</span>`;
      document.body.appendChild(toast);
      requestAnimationFrame(() => toast.classList.add('show'));
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
      }, duration);
    },

    getBadgeClass(status) {
      if (status === 'For Sale')     return 'badge-sale';
      if (status === 'For Rent')     return 'badge-rent';
      if (status === 'For Purchase') return 'badge-purchase';
      return 'badge-sale';
    },

    formatStatus(status) {
      return status || 'N/A';
    },

    renderPropertyCard(property) {
      const badgeClass = window.AlHammad.getBadgeClass(property.status);
      const beds = property.bedrooms > 0 ? `
        <span class="spec-item">
          <svg viewBox="0 0 24 24"><path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z"/></svg>
          ${property.bedrooms} Bed${property.bedrooms > 1 ? 's' : ''}
        </span>` : '';
      const baths = property.bathrooms > 0 ? `
        <span class="spec-item">
          <svg viewBox="0 0 24 24"><path d="M7 5.5C7 4.12 8.12 3 9.5 3S12 4.12 12 5.5V7H7V5.5zM20 8H6V7H2v13h2v-3h16v3h2V10.5C22 9.12 21.12 8 20 8z"/></svg>
          ${property.bathrooms} Bath${property.bathrooms > 1 ? 's' : ''}
        </span>` : '';

      return `
        <div class="property-card" onclick="window.location.href='property-details.html?id=${property.id}'">
          <div class="property-card__img-wrap">
            <img src="${property.image}" alt="${property.title}" loading="lazy">
            <span class="property-card__badge ${badgeClass}">${property.status}</span>
          </div>
          <div class="property-card__body">
            <div class="property-card__location">
              <svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
              ${property.location}
            </div>
            <div class="property-card__title">${property.title}</div>
            <div class="property-card__specs">
              ${beds}
              ${baths}
              <span class="spec-item">
                <svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
                ${property.area}
              </span>
            </div>
            <div class="property-card__footer">
              <span class="property-card__price">${property.price}</span>
              <span class="card-view-btn">
                View Details
                <svg viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>
              </span>
            </div>
          </div>
        </div>`;
    },

    renderSkeletonCards(count = 3) {
      return Array.from({ length: count }, () => `
        <div class="skeleton-card">
          <div class="skeleton skeleton-img"></div>
          <div class="skeleton-body">
            <div class="skeleton skeleton-line" style="width:50%;height:10px"></div>
            <div class="skeleton skeleton-line" style="width:80%"></div>
            <div class="skeleton skeleton-line" style="width:65%;height:10px"></div>
            <div class="skeleton skeleton-line" style="width:40%;height:12px;margin-top:8px"></div>
          </div>
        </div>`).join('');
    }
  };

  /* ── Run on DOM Ready ───────────────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
