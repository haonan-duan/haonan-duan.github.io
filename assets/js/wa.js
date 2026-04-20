/* 和モダン interaction layer: command palette, scroll gear, bio typewriter.
   Pure vanilla JS, no dependencies. Loaded deferred from scripts.html. */
(function () {
  'use strict';

  /* ---------- command palette (⌘K / Ctrl-K / `/`) ---------- */
  function buildPalette() {
    var sections = [];
    document.querySelectorAll('.page__content h1').forEach(function (h) {
      var label = (h.textContent || '').trim();
      if (!label) return;
      sections.push({ label: label, target: h });
    });

    var email = document.body.getAttribute('data-author-email') || '';
    var actions = [
      { label: 'copy email', kind: 'email', value: email },
      { label: 'google scholar', kind: 'link', value: 'https://scholar.google.com/citations?user=4zO4UlcAAAAJ' },
      { label: 'github', kind: 'link', value: 'https://github.com/haonan-duan' },
      { label: 'nvidia gear', kind: 'link', value: 'https://research.nvidia.com/labs/gear/' }
    ];

    var overlay = document.createElement('div');
    overlay.className = 'wa-palette';
    overlay.innerHTML =
      '<div class="wa-palette__box" role="dialog" aria-label="command palette">' +
      '  <input type="text" class="wa-palette__input" placeholder="jump to section, copy email…" aria-label="command input">' +
      '  <ul class="wa-palette__list" role="listbox"></ul>' +
      '  <div class="wa-palette__hint">↑↓ navigate · ↵ select · esc close</div>' +
      '</div>';
    document.body.appendChild(overlay);

    var input = overlay.querySelector('.wa-palette__input');
    var list = overlay.querySelector('.wa-palette__list');
    var items = [];
    var active = 0;

    function allItems() {
      var out = [];
      sections.forEach(function (s) { out.push({ label: s.label, kind: 'section', target: s.target }); });
      actions.forEach(function (a) { out.push(a); });
      return out;
    }

    function render(filter) {
      list.innerHTML = '';
      items = [];
      var q = (filter || '').toLowerCase().trim();
      var all = allItems();
      all.forEach(function (it) {
        if (q && it.label.toLowerCase().indexOf(q) === -1) return;
        var li = document.createElement('li');
        li.className = 'wa-palette__item';
        li.setAttribute('role', 'option');
        li.textContent = it.label;
        li.addEventListener('click', function () { run(it); });
        list.appendChild(li);
        items.push({ el: li, data: it });
      });
      active = 0;
      highlight();
    }

    function highlight() {
      items.forEach(function (x, i) {
        x.el.classList.toggle('is-active', i === active);
        if (i === active) x.el.scrollIntoView({ block: 'nearest' });
      });
    }

    function run(it) {
      if (it.kind === 'section' && it.target) {
        it.target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (it.kind === 'email' && it.value) {
        try {
          navigator.clipboard.writeText(it.value);
          toast('email copied');
        } catch (e) {
          window.prompt('copy email:', it.value);
        }
      } else if (it.kind === 'link' && it.value) {
        window.open(it.value, '_blank', 'noopener');
      }
      close();
    }

    function open() {
      overlay.classList.add('is-open');
      input.value = '';
      render('');
      setTimeout(function () { input.focus(); }, 10);
    }
    function close() { overlay.classList.remove('is-open'); }

    input.addEventListener('input', function () { render(input.value); });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); active = Math.min(items.length - 1, active + 1); highlight(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); active = Math.max(0, active - 1); highlight(); }
      else if (e.key === 'Enter') { e.preventDefault(); if (items[active]) run(items[active].data); }
      else if (e.key === 'Escape') { e.preventDefault(); close(); }
    });
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });

    document.addEventListener('keydown', function (e) {
      var isK = (e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey);
      var isSlash = e.key === '/' && !/input|textarea/i.test((e.target.tagName || ''));
      if (isK || isSlash) {
        e.preventDefault();
        if (overlay.classList.contains('is-open')) close(); else open();
      }
    });
  }

  function toast(msg) {
    var t = document.createElement('div');
    t.className = 'wa-toast';
    t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(function () { t.classList.add('is-visible'); });
    setTimeout(function () { t.classList.remove('is-visible'); setTimeout(function () { t.remove(); }, 300); }, 1400);
  }

  /* ---------- scroll gear (rotates with scroll progress) ---------- */
  function buildGear() {
    var gear = document.createElement('a');
    gear.className = 'wa-gear';
    gear.href = '#about-me';
    gear.title = 'back to top';
    gear.setAttribute('aria-label', 'scroll progress — click to return to top');
    gear.innerHTML =
      '<svg viewBox="0 0 40 40" width="28" height="28" aria-hidden="true">' +
      '  <g fill="none" stroke="currentColor" stroke-width="1.4">' +
      '    <circle cx="20" cy="20" r="7"/>' +
      '    <g stroke-linecap="round">' +
      '      <line x1="20" y1="4"  x2="20" y2="9"/>' +
      '      <line x1="20" y1="31" x2="20" y2="36"/>' +
      '      <line x1="4"  y1="20" x2="9"  y2="20"/>' +
      '      <line x1="31" y1="20" x2="36" y2="20"/>' +
      '      <line x1="8.7"  y1="8.7"  x2="12.2" y2="12.2"/>' +
      '      <line x1="27.8" y1="27.8" x2="31.3" y2="31.3"/>' +
      '      <line x1="8.7"  y1="31.3" x2="12.2" y2="27.8"/>' +
      '      <line x1="27.8" y1="12.2" x2="31.3" y2="8.7"/>' +
      '    </g>' +
      '  </g>' +
      '</svg>';
    document.body.appendChild(gear);

    var svg = gear.querySelector('svg');
    var ticking = false;
    function update() {
      var h = document.documentElement;
      var max = (h.scrollHeight - h.clientHeight) || 1;
      var p = Math.min(1, Math.max(0, h.scrollTop / max));
      svg.style.transform = 'rotate(' + (p * 360).toFixed(1) + 'deg)';
      gear.classList.toggle('is-visible', h.scrollTop > 120);
      ticking = false;
    }
    document.addEventListener('scroll', function () {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  /* ---------- bio typewriter (first line only, first visit only) ---------- */
  function buildTypewriter() {
    try {
      if (sessionStorage.getItem('wa-typed')) return;
    } catch (e) { /* no sessionStorage — just run it once per load */ }

    var content = document.querySelector('.page__content');
    if (!content) return;
    // First <p> after the about-me anchor is the bio intro.
    var anchor = content.querySelector('#about-me');
    if (!anchor) return;
    var p = anchor.nextElementSibling;
    while (p && p.tagName !== 'P') p = p.nextElementSibling;
    if (!p) return;

    var original = p.innerHTML;
    // Only apply on viewports wide enough — avoid jank on mobile.
    if (window.innerWidth < 700) return;

    var plain = p.textContent || '';
    if (plain.length > 400) return; // safety: skip if too long

    p.innerHTML = '<span class="wa-caret">▍</span>';
    var caret = p.firstChild;
    var i = 0;
    var speed = 14; // ms per char

    function step() {
      i += 1;
      if (i > plain.length) {
        p.innerHTML = original; // restore with links etc.
        try { sessionStorage.setItem('wa-typed', '1'); } catch (e) {}
        return;
      }
      caret.insertAdjacentText('beforebegin', plain.charAt(i - 1));
      setTimeout(step, speed);
    }
    setTimeout(step, 200);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  function init() {
    buildPalette();
    buildGear();
    buildTypewriter();
  }
})();
