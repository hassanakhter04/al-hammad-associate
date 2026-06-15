/* ─────────────────────────────────────────────────────────────────────────────
   Al-Hammad Associate — Home Page (index.html)
   ───────────────────────────────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  initHero();
  loadFeaturedProperties();
});

/* ── Hero Image Parallax / Load ─────────────────────────────────────────────── */
function initHero() {
  const bg = document.getElementById('heroBg');
  if (!bg) return;

  const img = new Image();
  img.src = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=80';
  img.onload = () => bg.classList.add('loaded');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    bg.style.transform = `scale(1) translateY(${scrollY * 0.25}px)`;
  }, { passive: true });
}

/* ── Featured Properties ─────────────────────────────────────────────────────── */
async function loadFeaturedProperties() {
  const grid = document.getElementById('featuredGrid');
  if (!grid) return;

  grid.innerHTML = window.AlHammad.renderSkeletonCards(3);

  try {
    const res = await fetch('/api/properties?featured=true');
    if (!res.ok) throw new Error('Failed to fetch');
    const properties = await res.json();

    if (!properties.length) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1">
          <p>No featured properties available at this time. <a href="properties.html" style="color:var(--maroon)">Browse all listings →</a></p>
        </div>`;
      return;
    }

    grid.innerHTML = properties.slice(0, 3).map(p => window.AlHammad.renderPropertyCard(p)).join('');

  } catch (err) {
    console.error('Error loading featured properties:', err);
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <p style="color:var(--text-muted)">Unable to load properties. Please ensure the server is running.<br>
        <a href="properties.html" style="color:var(--maroon)">Try browsing all listings →</a></p>
      </div>`;
  }
}
