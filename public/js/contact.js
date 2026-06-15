/* ─────────────────────────────────────────────────────────────────────────────
   Al-Hammad Associate — Contact Page
   ───────────────────────────────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const btn = document.getElementById('contactBtn');
    btn.disabled  = true;
    btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"
      style="animation:spin 1s linear infinite">
      <path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8
      c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8
      0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z"/>
      </svg> Sending…`;

    const payload = {
      name:    document.getElementById('contactName').value.trim(),
      email:   document.getElementById('contactEmail').value.trim(),
      phone:   document.getElementById('contactPhone').value.trim(),
      message: document.getElementById('contactMessage').value.trim(),
    };

    try {
      const res  = await fetch('/api/contact', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        window.AlHammad.showToast(data.message || 'Message sent! We will contact you soon.', 'success');
        form.reset();
      } else {
        throw new Error(data.error || 'Submission failed');
      }
    } catch (err) {
      window.AlHammad.showToast(err.message || 'Failed to send. Please call us directly.', 'error');
    } finally {
      btn.disabled  = false;
      btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg> Send Message`;
    }
  });
});

function validate() {
  let valid = true;

  const nameEl  = document.getElementById('contactName');
  const phoneEl = document.getElementById('contactPhone');
  const nameErr = document.getElementById('cNameError');
  const phoneErr= document.getElementById('cPhoneError');

  [nameEl, phoneEl].forEach(el => el.classList.remove('error'));
  [nameErr, phoneErr].forEach(el => el.textContent = '');

  if (!nameEl.value.trim()) {
    nameEl.classList.add('error');
    nameErr.textContent = 'Please enter your name.';
    valid = false;
  }

  if (!phoneEl.value.trim()) {
    phoneEl.classList.add('error');
    phoneErr.textContent = 'Please enter your phone number.';
    valid = false;
  }

  return valid;
}

const s = document.createElement('style');
s.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
document.head.appendChild(s);
