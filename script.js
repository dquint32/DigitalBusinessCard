document.getElementById('year').textContent = new Date().getFullYear();

// ── Dark Mode Toggle ────────────────────────────────────────
function toggleDark() {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  localStorage.setItem('sq_theme', isDark ? 'dark' : 'light');
}

(function () {
  const saved = localStorage.getItem('sq_theme');
  if (saved === 'light') {
    document.body.classList.remove('dark-mode');
  } else {
    document.body.classList.add('dark-mode'); 
  }
})();

// ── Language Toggle ─────────────────────────────────────────
function toggleLang() {
  const html  = document.documentElement;
  const body  = document.body;
  const btn   = document.getElementById('langToggle');
  const isEN  = body.getAttribute('data-lang') === 'en';
  const newLang = isEN ? 'es' : 'en';

  body.setAttribute('data-lang', newLang);
  html.setAttribute('lang', newLang);
  if(btn) btn.querySelector('.lang-label').textContent = isEN ? 'EN' : 'ES';
  localStorage.setItem('sq_lang', newLang);
  applyLang(newLang);
}

function applyLang(lang) {
  document.querySelectorAll('[data-en]').forEach(el => {
    const txt = el.getAttribute(`data-${lang}`);
    if (txt !== null) el.textContent = txt;
  });
}

(function () {
  const saved = localStorage.getItem('sq_lang') || 'en';
  document.body.setAttribute('data-lang', saved);
  document.documentElement.setAttribute('lang', saved);
  const btn = document.getElementById('langToggle');
  if(btn) btn.querySelector('.lang-label').textContent = saved === 'en' ? 'ES' : 'EN';
  if (saved !== 'en') applyLang(saved);
})();

// ── Service Modal Data ───────────────────────────────────────
const modalData = {
  notary: {
    en: {
      title: 'Notary & Signing',
      body:  'We provide certified mobile notary services across the Denver Metro area. Our services include acknowledgments, jurats, oaths, affirmations, power of attorney, real estate documents, loan signings, affidavits, and more. We bring the notary to you.'
    },
    es: {
      title: 'Notaría y Firma',
      body:  'Ofrecemos servicios de notaría móvil certificada en el área metropolitana de Denver. Nuestros servicios incluyen reconocimientos, juramentos, poderes notariales, documentos de bienes raíces, firmas de préstamos y más. Llevamos el notario a su ubicación.'
    },
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>`
  },
  dmv: {
    en: {
      title: 'DMV Assistance',
      body:  'Navigating the DMV can be confusing. We assist with vehicle title transfers, new registrations, plate renewals, bill of sale preparation, and general DMV guidance. We speak Spanish and English — no confusion, no stress.'
    },
    es: {
      title: 'Asistencia en DMV',
      body:  'Tramitar en el DMV puede ser complicado. Te ayudamos con transferencias de título, nuevas registraciones, renovación de placas, preparación de contratos de venta y orientación general. Hablamos español e inglés — sin confusiones, sin estrés.'
    },
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`
  },
  translation: {
    en: {
      title: 'Certified Translations',
      body:  'We provide accurate certified Spanish ↔ English translations for birth certificates, marriage certificates, diplomas, transcripts, immigration documents, contracts, and business documents. All translations come with a signed certificate of accuracy.'
    },
    es: {
      title: 'Traducciones Certificadas',
      body:  'Ofrecemos traducciones certificadas precisas español ↔ inglés para actas de nacimiento, actas de matrimonio, diplomas, expedientes académicos, documentos de inmigración y contratos. Todas incluyen un certificado firmado de precisión.'
    },
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8l6 6"/><path d="M4 14l6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="M22 22l-5-10-5 10"/><path d="M14 18h6"/></svg>`
  }
};

// ── Modal Open/Close ─────────────────────────────────────────
function openModal(key) {
  const lang    = document.body.getAttribute('data-lang') || 'en';
  const data    = modalData[key];
  if (!data) return;

  const localized = data[lang] || data.en;
  document.getElementById('modalTitle').textContent  = localized.title;
  document.getElementById('modalBody').textContent   = localized.body;
  document.getElementById('modalIcon').innerHTML     = data.icon;

  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

// ── Zelle Phone Copy ─────────────────────────────────────────
function copyZelle() {
  const phone = '303-500-4122';
  navigator.clipboard.writeText(phone).then(() => {
    showToast();
  }).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = phone;
    ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0;';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast();
  });
}

function showToast() {
  const toast = document.getElementById('toastMessage');
  const lang  = document.body.getAttribute('data-lang') || 'en';
  toast.textContent = lang === 'es' ? '✓ ¡Número copiado!' : '✓ Number copied!';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}

// ── Web Share API ────────────────────────────────────────────
function sharePage() {
  const lang     = document.body.getAttribute('data-lang') || 'en';
  const shareData = {
    title: 'Servicios Quintana LLC',
    text:  lang === 'es'
      ? 'Notaría, DMV, Traducciones y más — Denver Metro, CO'
      : 'Notary, DMV, Translations & more — Denver Metro, CO',
    url:   window.location.href
  };

  if (navigator.share) {
    navigator.share(shareData).catch(console.error);
  } else {
    navigator.clipboard.writeText(window.location.href).then(() => {
      alert(lang === 'es' ? '✓ Enlace copiado' : '✓ Link copied');
    });
  }
}

// ── Scroll to Top Visibility ─────────────────────────────────
const backToTopBtn = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    backToTopBtn.classList.add('show');
  } else {
    backToTopBtn.classList.remove('show');
  }
});