/* ─────────────────────────────────────────────────────────────────────────────
   Al-Hammad Associate — Property Details Page
   ───────────────────────────────────────────────────────────────────────────── */

let currentProperty   = null;
let galleryImages     = [];
let currentImageIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
  const id = new URLSearchParams(window.location.search).get('id');
  if (!id) { showError(); return; }
  loadProperty(id);
  initInquiryForm();
  initGalleryGestures();
});

/* ── Gallery Gestures (swipe + keyboard) ─────────────────────────────────────── */
function initGalleryGestures() {
  const gallery = document.querySelector('.detail-gallery');
  if (!gallery) return;

  let touchStartX = 0;
  gallery.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
  gallery.addEventListener('touchend', (e) => {
    const diff = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(diff) > 50) { diff < 0 ? nextImage() : prevImage(); }
  }, { passive: true });

  document.addEventListener('keydown', (e) => {
    if (galleryImages.length < 2) return;
    if (e.key === 'ArrowLeft')  prevImage();
    if (e.key === 'ArrowRight') nextImage();
  });
}

/* ── Load Property ───────────────────────────────────────────────────────────── */
async function loadProperty(id) {
  try {
    const res = await fetch(`/api/properties/${id}`);
    if (!res.ok) throw new Error('Not found');
    currentProperty = await res.json();
    renderProperty(currentProperty);
    loadRelated(currentProperty);
  } catch {
    showError();
  }
}

/* ── Render ──────────────────────────────────────────────────────────────────── */
function renderProperty(p) {
  document.title = `${p.title} — Al-Hammad Associate`;

  // Breadcrumb & page title
  document.getElementById('breadcrumbTitle').textContent = p.title;
  document.getElementById('pageTitle').textContent       = p.title;

  // Status badge
  const statusEl = document.getElementById('detailStatus');
  statusEl.textContent  = p.status;
  statusEl.className    = `detail-status property-card__badge ${window.AlHammad.getBadgeClass(p.status)}`;

  // Text fields
  document.getElementById('detailTitle').textContent       = p.title;
  document.getElementById('detailLocation').textContent    = p.location;
  document.getElementById('detailDescription').textContent = p.description;
  document.getElementById('sidebarPrice').textContent      = p.price;

  // Gallery
  galleryImages = p.gallery && p.gallery.length ? p.gallery : [p.image];
  currentImageIndex = 0;

  const mainImg = document.getElementById('mainImage');
  mainImg.src = galleryImages[0];
  mainImg.alt = p.title;

  const thumbsEl = document.getElementById('galleryThumbs');
  if (galleryImages.length > 1) {
    thumbsEl.innerHTML = galleryImages.map((src, i) => `
      <img
        class="gallery-thumb ${i === 0 ? 'active' : ''}"
        src="${src}"
        alt="${p.title} image ${i + 1}"
        onclick="showImageAt(${i})"
        loading="lazy"
      >`).join('');
  }

  // Show/hide nav buttons & counter based on number of images
  const hasMultiple = galleryImages.length > 1;
  document.getElementById('galleryPrev').style.display    = hasMultiple ? 'flex' : 'none';
  document.getElementById('galleryNext').style.display    = hasMultiple ? 'flex' : 'none';
  document.getElementById('galleryCounter').style.display = hasMultiple ? 'block' : 'none';
  updateGalleryCounter();

  // Specs
  const specsEl = document.getElementById('detailSpecs');
  const specs = [];

  if (p.bedrooms > 0) specs.push({
    icon: `<svg viewBox="0 0 24 24"><path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z"/></svg>`,
    label: 'Bedrooms', value: p.bedrooms
  });

  if (p.bathrooms > 0) specs.push({
    icon: `<svg viewBox="0 0 24 24"><path d="M7 5.5C7 4.12 8.12 3 9.5 3S12 4.12 12 5.5V7H7V5.5zM20 8H6V7H2v13h2v-3h16v3h2V10.5C22 9.12 21.12 8 20 8z"/></svg>`,
    label: 'Bathrooms', value: p.bathrooms
  });

  if (p.area) specs.push({
    icon: `<svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>`,
    label: 'Total Area', value: p.area
  });

  if (p.type) specs.push({
    icon: `<svg viewBox="0 0 24 24"><path d="M17 11V3H7v4H3v14h8v-4h2v4h8V11h-4z"/></svg>`,
    label: 'Type', value: p.type
  });

  specsEl.innerHTML = specs.map(s => `
    <div class="detail-spec">
      <div class="detail-spec__icon">${s.icon}</div>
      <div>
        <div class="detail-spec__label">${s.label}</div>
        <div class="detail-spec__value">${s.value}</div>
      </div>
    </div>`).join('');

  // Features
  const featuresEl = document.getElementById('featuresList');
  const featuresSection = document.getElementById('featuresSection');
  if (p.features && p.features.length) {
    featuresEl.innerHTML = p.features.map(f => `
      <div class="feature-tag">
        <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
        ${f}
      </div>`).join('');
    if (featuresSection) featuresSection.style.display = '';
  } else {
    if (featuresSection) featuresSection.style.display = 'none';
  }

  // Show content
  document.getElementById('loadingState').classList.add('hidden');
  document.getElementById('propertyContent').classList.remove('hidden');
}

/* ── Gallery Navigation ──────────────────────────────────────────────────────── */
function updateGalleryCounter() {
  const counter = document.getElementById('galleryCounter');
  if (counter) counter.textContent = `${currentImageIndex + 1} / ${galleryImages.length}`;
}

function showImageAt(index) {
  if (!galleryImages.length) return;
  currentImageIndex = (index + galleryImages.length) % galleryImages.length;
  document.getElementById('mainImage').src = galleryImages[currentImageIndex];

  const thumbs = document.querySelectorAll('.gallery-thumb');
  thumbs.forEach((t, i) => t.classList.toggle('active', i === currentImageIndex));
  if (thumbs[currentImageIndex]) {
    thumbs[currentImageIndex].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }
  updateGalleryCounter();
}

function nextImage() { showImageAt(currentImageIndex + 1); }
function prevImage() { showImageAt(currentImageIndex - 1); }

window.showImageAt = showImageAt;
window.nextImage   = nextImage;
window.prevImage   = prevImage;

/* ── Error State ─────────────────────────────────────────────────────────────── */
function showError() {
  document.getElementById('loadingState').classList.add('hidden');
  document.getElementById('errorState').classList.remove('hidden');
}

/* ── Inquiry Form ────────────────────────────────────────────────────────────── */
function initInquiryForm() {
  const form = document.getElementById('inquiryForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const btn = document.getElementById('inquiryBtn');
    const name  = document.getElementById('inquiryName').value.trim();
    const phone = document.getElementById('inquiryPhone').value.trim();

    btn.disabled     = true;
    btn.innerHTML    = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="animation:spin 1s linear infinite"><path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z"/></svg> Sending…';

    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          propertyId:    currentProperty?.id || 'unknown',
          propertyTitle: currentProperty?.title || 'Unknown Property'
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        window.AlHammad.showToast(data.message || 'Inquiry sent successfully!', 'success');
        form.reset();
      } else {
        throw new Error(data.error || 'Submission failed');
      }
    } catch (err) {
      window.AlHammad.showToast(err.message || 'Something went wrong. Please call us directly.', 'error');
    } finally {
      btn.disabled  = false;
      btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg> Send Inquiry`;
    }
  });
}

function validateForm() {
  let valid = true;

  const nameEl  = document.getElementById('inquiryName');
  const phoneEl = document.getElementById('inquiryPhone');
  const nameErr = document.getElementById('nameError');
  const phoneErr= document.getElementById('phoneError');

  nameEl.classList.remove('error');
  phoneEl.classList.remove('error');
  nameErr.textContent  = '';
  phoneErr.textContent = '';

  if (!nameEl.value.trim()) {
    nameEl.classList.add('error');
    nameErr.textContent = 'Please enter your full name.';
    valid = false;
  }

  if (!phoneEl.value.trim()) {
    phoneEl.classList.add('error');
    phoneErr.textContent = 'Please enter your phone number.';
    valid = false;
  } else if (!/^[\d\s\+\-\(\)]{7,}$/.test(phoneEl.value.trim())) {
    phoneEl.classList.add('error');
    phoneErr.textContent = 'Please enter a valid phone number.';
    valid = false;
  }

  return valid;
}

/* ── Related Properties ──────────────────────────────────────────────────────── */
async function loadRelated(property) {
  try {
    const res = await fetch('/api/properties');
    if (!res.ok) return;
    const all = await res.json();
    const related = all
      .filter(p => p.id !== property.id && p.status === property.status)
      .slice(0, 3);

    if (!related.length) return;

    const section = document.getElementById('relatedSection');
    const grid    = document.getElementById('relatedGrid');
    section.style.display = 'block';
    grid.innerHTML = related.map(p => window.AlHammad.renderPropertyCard(p)).join('');
  } catch {}
}

/* ── Spin Keyframes ──────────────────────────────────────────────────────────── */
const style = document.createElement('style');
style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
document.head.appendChild(style);
