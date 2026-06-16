/* ─────────────────────────────────────────────────────────────────────────────
   Al-Hammad Associate — Admin Dashboard
   ───────────────────────────────────────────────────────────────────────────── */

let adminToken = sessionStorage.getItem('alhammad_admin_token') || null;

document.addEventListener('DOMContentLoaded', () => {
  if (adminToken) {
    showDashboard();
  } else {
    showLogin();
  }
  initLogin();
  initAddForm();
});

/* ── Auth ────────────────────────────────────────────────────────────────────── */
function showLogin()     { document.getElementById('loginScreen').style.display = 'flex'; document.getElementById('adminLayout').classList.remove('is-open'); }
function showDashboard() { document.getElementById('loginScreen').style.display = 'none'; document.getElementById('adminLayout').classList.add('is-open'); loadProperties(); }

function initLogin() {
  const form = document.getElementById('loginForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const password = document.getElementById('adminPass').value;
    const errEl    = document.getElementById('loginError');
    const btn      = document.getElementById('loginBtn');
    errEl.textContent = '';

    btn.disabled  = true;
    btn.textContent = 'Signing in…';

    try {
      const res  = await fetch('/api/admin/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ password }),
      });
      const data = await res.json();

      if (res.ok && data.token) {
        adminToken = data.token;
        sessionStorage.setItem('alhammad_admin_token', adminToken);
        showDashboard();
      } else {
        errEl.textContent = data.error || 'Invalid password.';
        document.getElementById('adminPass').classList.add('error');
      }
    } catch {
      errEl.textContent = 'Server error. Is the Node.js server running?';
    } finally {
      btn.disabled    = false;
      btn.textContent = 'Sign In';
    }
  });
}

function logout() {
  sessionStorage.removeItem('alhammad_admin_token');
  adminToken = null;
  showLogin();
  document.getElementById('adminPass').value = '';
  // Reset forgot panel on logout
  const panel = document.getElementById('forgotPanel');
  if (panel) panel.style.display = 'none';
}
window.logout = logout;

/* ── Forgot Password ─────────────────────────────────────────────────────────── */
function toggleForgotPassword() {
  const panel  = document.getElementById('forgotPanel');
  const toggle = document.getElementById('forgotToggle');
  const isOpen = panel.style.display !== 'none';

  panel.style.display  = isOpen ? 'none' : 'block';
  toggle.textContent   = isOpen ? 'Forgot Password?' : 'Cancel';

  // Reset message each time it opens
  if (!isOpen) {
    const msg = document.getElementById('recoveryMsg');
    if (msg) { msg.style.display = 'none'; msg.textContent = ''; }
    const btn = document.getElementById('sendRecoveryBtn');
    if (btn) { btn.disabled = false; btn.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg> Email Me My Password`; }
  }
}
window.toggleForgotPassword = toggleForgotPassword;

async function sendPasswordRecovery() {
  const btn = document.getElementById('sendRecoveryBtn');
  const msg = document.getElementById('recoveryMsg');

  btn.disabled  = true;
  btn.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" style="animation:spin 1s linear infinite"><path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z"/></svg> Sending…`;

  try {
    const res  = await fetch('/api/admin/forgot-password', { method: 'POST' });
    const data = await res.json();

    msg.style.display = 'block';

    if (res.ok && data.success) {
      msg.innerHTML = `<span style="color:#16a34a;">✓ Recovery email sent, please check inbox.</span>`;
      btn.style.display = 'none';
    } else {
      msg.innerHTML = `<span style="color:#dc2626;">${data.error || 'Failed to send. Check that email is configured in .env'}</span>`;
      btn.disabled  = false;
      btn.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg> Email Me My Password`;
    }
  } catch {
    msg.style.display = 'block';
    msg.innerHTML = `<span style="color:#dc2626;">Server error. Is the Node.js server running?</span>`;
    btn.disabled  = false;
    btn.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg> Email Me My Password`;
  }
}
window.sendPasswordRecovery = sendPasswordRecovery;

/* ── Tab Navigation ──────────────────────────────────────────────────────────── */
function switchTab(tabId, linkEl) {
  document.querySelectorAll('.tab-panel').forEach(p  => p.classList.remove('active'));
  document.querySelectorAll('.sidebar-nav a').forEach(a => a.classList.remove('active'));
  document.getElementById(`tab-${tabId}`).classList.add('active');
  if (linkEl) linkEl.classList.add('active');

  const titles = { properties: 'Properties', add: 'Add New Property' };
  document.getElementById('panelTitle').textContent = titles[tabId] || 'Dashboard';
}
window.switchTab = switchTab;

/* ── Load Properties ─────────────────────────────────────────────────────────── */
async function loadProperties() {
  try {
    const res  = await fetch('/api/properties');
    if (!res.ok) throw new Error();
    const list = await res.json();
    propertiesCache = list;
    renderTable(list);
    updateStats(list);
  } catch {
    document.getElementById('propertiesTableBody').innerHTML = `
      <tr><td colspan="7" style="text-align:center;padding:40px;color:var(--text-muted);">
        Failed to load properties. Ensure the server is running.
      </td></tr>`;
  }
}

function updateStats(list) {
  document.getElementById('statTotal').textContent    = list.length;
  document.getElementById('statFeatured').textContent = list.filter(p => p.featured).length;
  document.getElementById('statSale').textContent     = list.filter(p => p.status === 'For Sale').length;
  document.getElementById('listingCount').textContent = `${list.length} listing${list.length !== 1 ? 's' : ''}`;
}

function renderTable(list) {
  const tbody = document.getElementById('propertiesTableBody');

  if (!list.length) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--text-muted);">No properties yet. Add your first listing →</td></tr>`;
    return;
  }

  const chipClass = { 'For Sale': 'chip-sale', 'For Rent': 'chip-rent', 'For Purchase': 'chip-purchase' };

  tbody.innerHTML = list.map(p => `
    <tr>
      <td>
        <img class="prop-img" src="${p.image}" alt="${p.title}"
             onerror="this.style.background='var(--light-gray)';this.src=''">
      </td>
      <td>
        <div class="prop-title">${p.title}</div>
        <div style="font-size:0.72rem;color:var(--text-muted);margin-top:2px;">${p.type || ''} · ${p.area || ''}</div>
      </td>
      <td>
        <span class="status-chip ${chipClass[p.status] || 'chip-sale'}">${p.status}</span>
      </td>
      <td style="font-weight:600;color:var(--maroon);font-size:0.83rem;">${p.price}</td>
      <td style="font-size:0.82rem;">${p.location}</td>
      <td>
        ${p.featured
          ? `<span class="featured-badge">
               <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
               Featured
             </span>`
          : '<span style="font-size:0.75rem;color:var(--text-muted);">—</span>'}
      </td>
      <td style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;">
        <a href="property-details.html?id=${p.id}" target="_blank" class="btn btn-outline btn-sm" style="font-size:0.72rem;padding:4px 10px;text-decoration:none;">View</a>
        <button class="btn btn-outline btn-sm" style="font-size:0.72rem;padding:4px 10px;" onclick="openEditModal('${p.id}')">Edit</button>
        <button class="delete-btn" onclick="deleteProperty('${p.id}', this)">Delete</button>
      </td>
    </tr>`).join('');
}

/* ── Delete Property ─────────────────────────────────────────────────────────── */
async function deleteProperty(id, btn) {
  if (!confirm('Are you sure you want to permanently delete this listing? This cannot be undone.')) return;

  btn.disabled    = true;
  btn.textContent = 'Deleting…';

  try {
    const res = await fetch(`/api/properties/${id}`, {
      method:  'DELETE',
      headers: { 'x-admin-token': adminToken },
    });
    const data = await res.json();

    if (res.ok && data.success) {
      window.AlHammad.showToast('Property deleted successfully.', 'success');
      loadProperties();
    } else {
      throw new Error(data.error || 'Delete failed');
    }
  } catch (err) {
    window.AlHammad.showToast(err.message || 'Failed to delete property.', 'error');
    btn.disabled    = false;
    btn.textContent = 'Delete';
  }
}
window.deleteProperty = deleteProperty;

/* ── Add Property Form ───────────────────────────────────────────────────────── */
function initAddForm() {
  const form = document.getElementById('addPropertyForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fd = new FormData(form);
    const payload = {
      title:       fd.get('title')?.trim(),
      price:       fd.get('price')?.trim(),
      status:      fd.get('status'),
      type:        fd.get('type'),
      bedrooms:    fd.get('bedrooms') || 0,
      bathrooms:   fd.get('bathrooms') || 0,
      area:        fd.get('area')?.trim(),
      location:    fd.get('location')?.trim(),
      image:       fd.get('image')?.trim(),
      description: fd.get('description')?.trim(),
      features:    fd.get('features')?.trim(),
      featured:    document.getElementById('featuredCheck').checked,
    };

    // Validation
    const required = ['title', 'price', 'status', 'image'];
    let valid = true;
    required.forEach(k => {
      if (!payload[k]) {
        valid = false;
        const inp = form.querySelector(`[name="${k}"]`);
        if (inp) inp.classList.add('error');
      }
    });

    if (!valid) {
      window.AlHammad.showToast('Please fill in all required fields.', 'error');
      return;
    }

    const btn = document.getElementById('addBtn');
    btn.disabled  = true;
    btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"
      style="animation:spin 1s linear infinite"><path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8
      0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74
      L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8
      0-1.57-.46-3.03-1.24-4.26z"/></svg> Saving…`;

    try {
      const res  = await fetch('/api/properties', {
        method:  'POST',
        headers: {
          'Content-Type':  'application/json',
          'x-admin-token': adminToken,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok && data.id) {
        window.AlHammad.showToast(`"${data.title}" added successfully!`, 'success');
        form.reset();
        document.getElementById('featuredCheck').checked = false;
        form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
        switchTab('properties', document.querySelector('.sidebar-nav a:first-child'));
        loadProperties();
      } else {
        throw new Error(data.error || 'Failed to add property');
      }
    } catch (err) {
      window.AlHammad.showToast(err.message || 'Something went wrong.', 'error');
    } finally {
      btn.disabled  = false;
      btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
        </svg> Add Property`;
    }
  });

  // Remove error highlight on input
  form.querySelectorAll('.form-control').forEach(el => {
    el.addEventListener('input', () => el.classList.remove('error'));
  });
}

/* ── Edit Property ───────────────────────────────────────────────────────────── */
let propertiesCache = [];

function openEditModal(id) {
  const p = propertiesCache.find(p => p.id === id);
  if (!p) return;

  document.getElementById('editId').value           = p.id;
  document.getElementById('editTitle').value        = p.title || '';
  document.getElementById('editPrice').value        = p.price || '';
  document.getElementById('editStatus').value       = p.status || 'For Sale';
  document.getElementById('editType').value         = p.type || 'House';
  document.getElementById('editBedrooms').value     = p.bedrooms || 0;
  document.getElementById('editBathrooms').value    = p.bathrooms || 0;
  document.getElementById('editArea').value         = p.area || '';
  document.getElementById('editLocation').value     = p.location || '';
  document.getElementById('editImage').value        = p.image || '';
  document.getElementById('editDescription').value  = p.description || '';
  document.getElementById('editFeatures').value     = Array.isArray(p.features) ? p.features.join(', ') : '';
  document.getElementById('editFeatured').checked   = !!p.featured;

  document.getElementById('editModalBackdrop').classList.add('open');
}
window.openEditModal = openEditModal;

function closeEditModal(e) {
  if (e && e.target !== document.getElementById('editModalBackdrop')) return;
  document.getElementById('editModalBackdrop').classList.remove('open');
}
window.closeEditModal = closeEditModal;

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('editPropertyForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id  = document.getElementById('editId').value;
    const btn = document.getElementById('editSaveBtn');

    btn.disabled    = true;
    btn.textContent = 'Saving…';

    const payload = {
      title:       document.getElementById('editTitle').value.trim(),
      price:       document.getElementById('editPrice').value.trim(),
      status:      document.getElementById('editStatus').value,
      type:        document.getElementById('editType').value,
      bedrooms:    document.getElementById('editBedrooms').value,
      bathrooms:   document.getElementById('editBathrooms').value,
      area:        document.getElementById('editArea').value.trim(),
      location:    document.getElementById('editLocation').value.trim(),
      image:       document.getElementById('editImage').value.trim(),
      description: document.getElementById('editDescription').value.trim(),
      features:    document.getElementById('editFeatures').value.trim(),
      featured:    document.getElementById('editFeatured').checked,
    };

    try {
      const res  = await fetch(`/api/properties/${id}`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json', 'x-admin-token': adminToken },
        body:    JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok && data.id) {
        window.AlHammad.showToast('Property updated successfully.', 'success');
        document.getElementById('editModalBackdrop').classList.remove('open');
        loadProperties();
      } else {
        throw new Error(data.error || 'Update failed');
      }
    } catch (err) {
      window.AlHammad.showToast(err.message || 'Failed to update property.', 'error');
    } finally {
      btn.disabled    = false;
      btn.textContent = 'Save Changes';
    }
  });
});
