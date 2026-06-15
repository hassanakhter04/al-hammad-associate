/* ─────────────────────────────────────────────────────────────────────────────
   Al-Hammad Associate — Properties Page
   ───────────────────────────────────────────────────────────────────────────── */

let allProperties = [];
let activeFilter  = 'All';

document.addEventListener('DOMContentLoaded', () => {
  readURLFilter();
  loadProperties();
  initFilters();
});

function readURLFilter() {
  const params = new URLSearchParams(window.location.search);
  const status = params.get('status');
  if (status) activeFilter = status;
}

async function loadProperties() {
  const grid = document.getElementById('propertiesGrid');
  const meta = document.getElementById('resultsMeta');
  if (!grid) return;

  grid.innerHTML = window.AlHammad.renderSkeletonCards(6);
  if (meta) meta.textContent = 'Loading properties…';

  try {
    const res = await fetch('/api/properties');
    if (!res.ok) throw new Error('Failed to fetch');
    allProperties = await res.json();
    renderFiltered();
  } catch (err) {
    console.error(err);
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <p style="color:var(--text-muted)">
          Unable to load listings. Please make sure the Node.js server is running.<br>
          <a href="index.html" style="color:var(--maroon)">Return Home →</a>
        </p>
      </div>`;
    if (meta) meta.textContent = '';
  }
}

function renderFiltered() {
  const grid = document.getElementById('propertiesGrid');
  const meta = document.getElementById('resultsMeta');

  const filtered = activeFilter === 'All'
    ? allProperties
    : allProperties.filter(p => p.status === activeFilter);

  if (meta) {
    const label = activeFilter === 'All' ? 'All Properties' : activeFilter;
    meta.innerHTML = `Showing <strong>${filtered.length}</strong> ${filtered.length === 1 ? 'property' : 'properties'}${activeFilter !== 'All' ? ` <span style="color:var(--maroon)">${label}</span>` : ''}`;
  }

  if (!filtered.length) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
        <p>No properties found for "<strong>${activeFilter}</strong>".</p>
        <button class="btn btn-outline" style="margin-top:16px;" onclick="setFilter('All')">Show All Properties</button>
      </div>`;
    return;
  }

  grid.innerHTML = filtered.map(p => window.AlHammad.renderPropertyCard(p)).join('');
}

function initFilters() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    const f = btn.dataset.filter;
    if (f === activeFilter) btn.classList.add('active');
    else btn.classList.remove('active');

    btn.addEventListener('click', () => setFilter(f));
  });
}

function setFilter(filter) {
  activeFilter = filter;
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === filter);
  });
  renderFiltered();
}

window.setFilter = setFilter;
