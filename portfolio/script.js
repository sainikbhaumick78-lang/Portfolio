// script.js
// Vanilla JS: sticky nav, mobile menu, smooth scroll, project modals, contact form basic validation

document.addEventListener('DOMContentLoaded', function () {
  // year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Mobile menu toggle
  const menuBtn = document.getElementById('menuBtn');
  const nav = document.getElementById('nav');
  menuBtn.addEventListener('click', () => {
    const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('open');
  });

  // Smooth scroll for nav links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = a.getAttribute('href');
      if (target && target.startsWith('#')) {
        e.preventDefault();
        const el = document.querySelector(target);
        if (el) el.scrollIntoView({behavior:'smooth', block:'start'});
        // close mobile nav
        if (nav.classList.contains('open')) {
          nav.classList.remove('open');
          menuBtn.setAttribute('aria-expanded','false');
        }
      }
    });
  });

  // Project modals
  const modal = document.getElementById('modal');
  const modalContent = document.getElementById('modalContent');
  const modalClose = document.getElementById('modalClose');

  function openModal(html) {
    modalContent.innerHTML = html;
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
    modalContent.innerHTML = '';
    document.body.style.overflow = '';
  }
  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  document.querySelectorAll('.project-card .btn').forEach(button => {
    button.addEventListener('click', (e) => {
      const id = button.getAttribute('data-proj');
      if (id === 'proj1') {
        openModal(`
          <h2 id="modalTitle">Amrapali CHP — Civil Construction & Site Execution</h2>
          <p><strong>Role:</strong> Assistant Engineer Trainee</p>
          <p><strong>Tools:</strong> AutoCAD, Revit, Excel</p>
          <p><strong>Summary:</strong> Supported site supervision, quality control, material planning and BIM-based coordination at Amrapali CHP. Assisted in translating structural drawings to practical execution and reduced clarity-related RFIs.</p>
          <p><strong>Artifacts:</strong> <a href="assets/project1.pdf" target="_blank" rel="noopener">Project PDF (if provided)</a></p>
        `);
      } else if (id === 'proj2') {
        openModal(`
          <h2 id="modalTitle">AutoCAD Internship — Civil Layouts & Detailing</h2>
          <p><strong>Role:</strong> CAD Intern</p>
          <p><strong>Tools:</strong> AutoCAD</p>
          <p><strong>Summary:</strong> Produced layout plans, sections and structural detailing aligned with drafting standards to prepare construction-ready drawings.</p>
          <p><strong>Artifacts:</strong> <a href="assets/project2.pdf" target="_blank" rel="noopener">Internship work </a></p>
        `);
      }
      else if (id === 'proj3') {
        openModal(`
          <h2 id="modalTitle">BIM(BUILDING INFORMATION MODELLING)</h2>
          <p><strong>Tools:</strong> REVIT </p>
          <p><strong>Summary:</strong> Produced accurate layout plans and sectional drawings to meet construction detailing requirements.</p>
          <p><strong>Artifacts:</strong> <a href="assets/project3.pdf" target="_blank" rel="noopener"> Report </a></p>
        `);
      }
    });
  });

  // Basic contact form handling (no backend)
  // Robust contact form handler: Web Share API -> mailto -> clipboard fallback
const contactForm = document.getElementById('contactForm');
const formMsg = document.getElementById('formMsg');

function setFormMessage(text, type) {
  if (!formMsg) return;
  formMsg.textContent = text;
  formMsg.className = 'form-msg ' + (type === 'success' ? 'success' : (type === 'error' ? 'error' : ''));
}

contactForm.addEventListener('submit', async function (e) {
  e.preventDefault();
  const name = contactForm.name.value.trim();
  const email = contactForm.email.value.trim();
  const message = contactForm.message.value.trim();

  if (!name || !email || !message) {
    setFormMessage('Please fill all fields before sending.', 'error');
    return;
  }

  const subject = `Portfolio inquiry from ${name}`;
  const body = `${message}\n\n---\nContact: ${name}\nEmail: ${email}`;

  // 1) Preferred: Web Share API (mobile-friendly, modern browsers)
  if (navigator.share) {
    try {
      await navigator.share({
        title: subject,
        text: body
      });
      setFormMessage('Shared via your device apps. Thank you — message sent.', 'success');
      contactForm.reset();
      return;
    } catch (err) {
      // user cancelled or share failed — fall through to mailto fallback
      console.warn('Web Share failed or cancelled:', err);
    }
  }

  // 2) Mailto fallback
  try {
    const mailto = `mailto:sainikbhaumick78@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    // open mail client in new window/tab to avoid navigation issues
    const win = window.open(mailto, '_blank');
    if (win) {
      // Some browsers open mail client; give user a success hint
      setFormMessage('Mail client opened. Complete and send the email in your mail app.', 'success');
      contactForm.reset();
      return;
    }
    // if window.open returned null (blocked), fall through
  } catch (err) {
    console.warn('Mailto fallback failed:', err);
  }

  // 3) Clipboard fallback (guaranteed UX): copy prefilled message and instruct user
  const fallbackText = `To: sainikbhaumick78@gmail.com\nSubject: ${subject}\n\n${body}`;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(fallbackText);
      setFormMessage('Could not open an email app — message copied to clipboard. Paste into your mail app and send.', 'success');
      contactForm.reset();
      return;
    } catch (err) {
      console.warn('Clipboard write failed:', err);
    }
  }

  // 4) final fallback: show message to user with copy instructions
  setFormMessage('Unable to launch email client automatically. Please copy the message manually and send to sainikbhaumick78@gmail.com', 'error');

});


  // Accessibility: close modal with Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
      closeModal();
    }
  });
});
// THEME TOGGLE: toggles .dark on <body> and persists preference in localStorage
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

function applyTheme(isDark){
  document.body.classList.toggle('dark', !!isDark);
  themeIcon.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('prefersDark', isDark ? '1' : '0');
}

// init from saved preference or system preference
const saved = localStorage.getItem('prefersDark');
const prefersDark = saved !== null ? saved === '1' : window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
applyTheme(prefersDark);

themeToggle.addEventListener('click', () => {
  const isDark = !document.body.classList.contains('dark');
  applyTheme(isDark);
});

// profile image fallback: if image fails to load, replace with initials canvas (graceful)
const profileImg = document.getElementById('profileImg');
if (profileImg) {
  profileImg.addEventListener('error', () => {
    profileImg.style.display = 'none';
    const parent = profileImg.parentElement;
    const initials = document.createElement('div');
    initials.textContent = 'SB';
    initials.style.fontSize = '56px';
    initials.style.fontWeight = '800';
    initials.style.color = 'var(--muted)';
    parent.appendChild(initials);
    });
  }
