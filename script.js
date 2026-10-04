/* Servicios Quintana LLC — digital business card
   Language switch, dark/light mode, Zelle copy, share, back to top. No dependencies. */
(function () {
  'use strict';

  var root = document.documentElement;
  var toastEl = document.getElementById('toast');
  var toastTimer;

  var STRINGS = {
    en: {
      title: 'David Quintana — Servicios Quintana LLC',
      copied: 'Zelle number copied: 303-500-4122',
      copyFailed: 'Zelle number: 303-500-4122',
      linkCopied: 'Link copied',
      shareText: 'Notary services, DMV help, certified translations and web development in Denver, CO'
    },
    es: {
      title: 'David Quintana — Servicios Quintana LLC',
      copied: 'Número de Zelle copiado: 303-500-4122',
      copyFailed: 'Número de Zelle: 303-500-4122',
      linkCopied: 'Enlace copiado',
      shareText: 'Servicios de Notaría, ayuda con el DMV, traducciones certificadas y desarrollo web en Denver, CO'
    }
  };

  function currentLang() { return root.lang === 'es' ? 'es' : 'en'; }

  /* ---------- Language ---------- */
  function applyLang(lang) {
    root.lang = lang;
    document.title = STRINGS[lang].title;

    document.querySelectorAll('[data-en]').forEach(function (el) {
      el.textContent = el.getAttribute('data-' + lang);
    });
    document.querySelectorAll('[data-href-en]').forEach(function (el) {
      el.href = el.getAttribute('data-href-' + lang);
    });
    document.querySelectorAll('[data-label-en]').forEach(function (el) {
      el.setAttribute('aria-label', el.getAttribute('data-label-' + lang));
    });
    document.querySelectorAll('.lang button').forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(btn.dataset.lang === lang));
    });
  }

  function setLang(lang, animate) {
    try { localStorage.setItem('sq_lang', lang); } catch (e) { /* private mode */ }
    if (!animate || lang === currentLang()) { applyLang(lang); return; }
    root.classList.add('is-swapping');
    setTimeout(function () {
      applyLang(lang);
      root.classList.remove('is-swapping');
    }, 160);
  }

  var saved = null;
  try { saved = localStorage.getItem('sq_lang'); } catch (e) { /* private mode */ }
  var initial = saved || ((navigator.language || 'en').toLowerCase().indexOf('es') === 0 ? 'es' : 'en');
  applyLang(initial);

  document.querySelectorAll('.lang button').forEach(function (btn) {
    btn.addEventListener('click', function () { setLang(btn.dataset.lang, true); });
  });

  /* ---------- Toast ---------- */
  function toast(message) {
    toastEl.textContent = message;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 3000);
  }

  function copy(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;';
      document.body.appendChild(ta);
      ta.select();
      var ok = document.execCommand('copy');
      document.body.removeChild(ta);
      ok ? resolve() : reject();
    });
  }

  /* ---------- Zelle: copy the number ---------- */
  document.getElementById('zelle').addEventListener('click', function () {
    var s = STRINGS[currentLang()];
    copy('303-500-4122').then(
      function () { toast(s.copied); },
      function () { toast(s.copyFailed); }
    );
  });

  /* ---------- Share ---------- */
  document.getElementById('share').addEventListener('click', function () {
    var s = STRINGS[currentLang()];
    var url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: 'Servicios Quintana LLC', text: s.shareText, url: url }).catch(function () {});
    } else {
      copy(url).then(function () { toast(s.linkCopied); }, function () { toast(url); });
    }
  });

  /* ---------- Dark / light mode ---------- */
  var themeMeta = document.querySelector('meta[name="theme-color"]');
  function paintThemeColor() {
    themeMeta.setAttribute('content', root.getAttribute('data-theme') === 'light' ? '#EDF2FF' : '#071029');
  }
  paintThemeColor();
  document.getElementById('theme').addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    if (next === 'light') { root.setAttribute('data-theme', 'light'); } else { root.removeAttribute('data-theme'); }
    try { localStorage.setItem('sq_theme', next); } catch (e) { /* private mode */ }
    paintThemeColor();
  });

  /* ---------- Back to top ---------- */
  var toTop = document.getElementById('toTop');
  function onScroll() { toTop.classList.toggle('show', window.scrollY > 500); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  toTop.addEventListener('click', function () {
    var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: calm ? 'auto' : 'smooth' });
  });

  document.getElementById('year').textContent = new Date().getFullYear();
})();
