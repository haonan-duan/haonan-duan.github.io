/* Interaction layer: command palette, scroll reveal, scrollspy,
   back-to-top progress ring, visitor counter. Vanilla JS, no deps. */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- toast ---------- */
  function toast(msg) {
    var t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(function () { t.classList.add('is-visible'); });
    setTimeout(function () {
      t.classList.remove('is-visible');
      setTimeout(function () { t.remove(); }, 320);
    }, 1500);
  }

  /* ---------- command palette (⌘K / Ctrl-K / "/") ---------- */
  function buildPalette() {
    var entries = [];

    // sections, read from the DOM so adding a card needs no JS change
    document.querySelectorAll('section.card[id]').forEach(function (s) {
      var title = s.querySelector('.card__title');
      var chip = s.querySelector('.card__chip');
      var label = title ? title.textContent.trim()
                        : (chip ? chip.textContent.replace(/[^\x20-\x7E]/g, '').trim() : s.id);
      entries.push({ label: label, hint: 'section', kind: 'section', target: s });
    });

    // social links, also read from the DOM (single source of truth: _config.yml)
    document.querySelectorAll('.profile__links a').forEach(function (a) {
      var label = a.getAttribute('aria-label') || a.href;
      if (a.href.indexOf('mailto:') === 0) {
        entries.push({ label: 'copy email', hint: 'clipboard', kind: 'email',
                       value: document.body.getAttribute('data-author-email') || '' });
      } else {
        entries.push({ label: label, hint: 'opens new tab', kind: 'link', value: a.href });
      }
    });

    var overlay = document.createElement('div');
    overlay.className = 'palette';
    overlay.innerHTML =
      '<div class="palette__box" role="dialog" aria-modal="true" aria-label="command palette">' +
      '<input type="text" class="palette__input" placeholder="jump to a section, copy email…" aria-label="command input">' +
      '<ul class="palette__list" role="listbox"></ul>' +
      '<div class="palette__hint">↑↓ navigate · ↵ select · esc close</div>' +
      '</div>';
    document.body.appendChild(overlay);

    var input = overlay.querySelector('.palette__input');
    var list = overlay.querySelector('.palette__list');
    var items = [];
    var active = 0;
    var lastFocus = null;

    function render(filter) {
      list.innerHTML = '';
      items = [];
      var q = (filter || '').toLowerCase().trim();
      entries.forEach(function (e) {
        if (q && e.label.toLowerCase().indexOf(q) === -1) return;
        var li = document.createElement('li');
        li.className = 'palette__item';
        li.setAttribute('role', 'option');
        li.innerHTML = '<span></span><em></em>';
        li.firstChild.textContent = e.label;
        li.lastChild.textContent = e.hint;
        li.addEventListener('click', function () { run(e); });
        list.appendChild(li);
        items.push({ el: li, data: e });
      });
      active = 0;
      highlight();
    }

    function highlight() {
      items.forEach(function (x, i) {
        var on = i === active;
        x.el.classList.toggle('is-active', on);
        x.el.setAttribute('aria-selected', on ? 'true' : 'false');
        if (on) x.el.scrollIntoView({ block: 'nearest' });
      });
    }

    function run(e) {
      close();
      if (e.kind === 'section' && e.target) {
        e.target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
      } else if (e.kind === 'email' && e.value) {
        if (navigator.clipboard) {
          navigator.clipboard.writeText(e.value).then(function () { toast('email copied'); },
                                                      function () { window.prompt('copy email:', e.value); });
        } else {
          window.prompt('copy email:', e.value);
        }
      } else if (e.kind === 'link' && e.value) {
        window.open(e.value, '_blank', 'noopener');
      }
    }

    function open() {
      lastFocus = document.activeElement;
      overlay.classList.add('is-open');
      input.value = '';
      render('');
      setTimeout(function () { input.focus(); }, 10);
    }

    function close() {
      overlay.classList.remove('is-open');
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    input.addEventListener('input', function () { render(input.value); });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); active = Math.min(items.length - 1, active + 1); highlight(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); active = Math.max(0, active - 1); highlight(); }
      else if (e.key === 'Enter') { e.preventDefault(); if (items[active]) run(items[active].data); }
      else if (e.key === 'Escape') { e.preventDefault(); close(); }
    });
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });

    document.addEventListener('keydown', function (e) {
      var typing = /input|textarea|select/i.test((e.target.tagName || '')) || e.target.isContentEditable;
      var isK = (e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey);
      var isSlash = e.key === '/' && !typing;
      if (isK || isSlash) {
        e.preventDefault();
        if (overlay.classList.contains('is-open')) close(); else open();
      }
    });

    // show the right modifier key for the platform
    var kbd = document.querySelector('.profile__hint kbd');
    if (kbd && !/Mac|iPhone|iPad/.test(navigator.platform)) kbd.textContent = 'Ctrl K';
  }

  /* ---------- reveal cards as they enter the viewport ---------- */
  function buildReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window) || reduced) {
      els.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- back-to-top ring + scrollspy ---------- */
  function buildScroll() {
    var R = 20, C = 2 * Math.PI * R;
    var btn = document.createElement('a');
    btn.className = 'totop';
    btn.href = '#about';
    btn.setAttribute('aria-label', 'scroll progress — back to top');
    btn.innerHTML =
      '<svg viewBox="0 0 46 46" width="46" height="46" aria-hidden="true">' +
      '<defs><linearGradient id="totop-grad" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0%" stop-color="#ee5d33"/><stop offset="50%" stop-color="#ec5fa8"/>' +
      '<stop offset="100%" stop-color="#7b4ae2"/></linearGradient></defs>' +
      '<circle class="totop__track" cx="23" cy="23" r="' + R + '"/>' +
      '<circle class="totop__bar" cx="23" cy="23" r="' + R + '" ' +
      'stroke-dasharray="' + C.toFixed(2) + '" stroke-dashoffset="' + C.toFixed(2) + '"/>' +
      '</svg><span class="totop__arrow">↑</span>';
    document.body.appendChild(btn);

    var bar = btn.querySelector('.totop__bar');
    var navLinks = Array.prototype.slice.call(document.querySelectorAll('.profile__nav a'));
    var sections = navLinks.map(function (a) { return document.querySelector(a.getAttribute('href')); });
    var ticking = false;

    function update() {
      var h = document.documentElement;
      var max = (h.scrollHeight - h.clientHeight) || 1;
      var p = Math.min(1, Math.max(0, h.scrollTop / max));
      bar.setAttribute('stroke-dashoffset', (C * (1 - p)).toFixed(2));
      btn.classList.toggle('is-visible', h.scrollTop > 160);

      // scrollspy: last section whose top is above the 1/3 mark
      var mark = h.clientHeight * 0.34, current = 0;
      sections.forEach(function (s, i) {
        if (s && s.getBoundingClientRect().top <= mark) current = i;
      });
      navLinks.forEach(function (a, i) { a.classList.toggle('is-current', i === current); });
      ticking = false;
    }

    document.addEventListener('scroll', function () {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
  }

  /* ---------- visitor counter (Abacus) ---------- */
  function buildCounter() {
    var el = document.getElementById('visitor-count');
    if (!el) return;
    fetch('https://abacus.jasoncameron.dev/hit/haonan-duan-github-io/homepage')
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) { if (d && typeof d.value === 'number') el.textContent = d.value.toLocaleString(); })
      .catch(function () { /* silent — leave the placeholder */ });
  }

  function init() {
    buildPalette();
    buildReveal();
    buildScroll();
    buildCounter();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
