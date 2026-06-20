(function() {
  'use strict';

  const LABELS = {
    frontend: 'Frontend',
    backend: 'Backend',
    mobile: 'Mobile'
  };

  const ACCENT_HEX = {
    'item-violet': '#8b5cf6',
    'item-cyan': '#0dcaf0',
    'item-emerald': '#10b981',
    'item-orange': '#f59e0b',
    'item-pink': '#ec4899',
    'item-blue': '#3b82f6'
  };

  let tricksData = [];
  let cards = [];
  let visibleIdx = [];
  let current = 0;
  let hasEnteredOnce = false;
  const particleSystems = new Map();

  const track = document.getElementById('track');
  const dotsWrap = document.getElementById('dots');
  const viewport = document.querySelector('.carousel-viewport');

  if (!track || !dotsWrap || !viewport) return;

  /* ── Particle System ── */
  function initParticles(cardEl, accentHex) {
    const canvas = cardEl.querySelector('.particle-canvas');
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    function resize() {
      const r = cardEl.getBoundingClientRect();
      canvas.width = Math.ceil(r.width * dpr);
      canvas.height = Math.ceil(r.height * dpr);
      canvas.style.width = r.width + 'px';
      canvas.style.height = r.height + 'px';
    }

    resize();
    const N = 22;
    const particles = Array.from({ length: N }, function() {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: (Math.random() * 1.3 + 0.5) * dpr,
        baseAlpha: Math.random() * 0.5 + 0.15,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.4 + 0.15,
        vy: -(Math.random() * 0.12 + 0.03) * dpr,
        vx: (Math.random() - 0.5) * 0.05 * dpr
      };
    });

    function hexToRgb(hex) {
      var v = hex.replace('#', '');
      return [parseInt(v.slice(0, 2), 16), parseInt(v.slice(2, 4), 16), parseInt(v.slice(4, 6), 16)];
    }

    var rgb = hexToRgb(accentHex);
    var raf = null;
    var alive = false;
    var t = 0;

    function tick() {
      if (!alive) return;
      t += 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (var p = 0; p < particles.length; p++) {
        var pt = particles[p];
        pt.y += pt.vy;
        pt.x += pt.vx;
        if (pt.y < -4 * dpr) pt.y = canvas.height + 4 * dpr;
        if (pt.x < 0) pt.x = canvas.width;
        if (pt.x > canvas.width) pt.x = 0;
        var tw = (Math.sin(t * 0.02 * pt.speed + pt.phase) + 1) / 2;
        var alpha = pt.baseAlpha * (0.35 + 0.65 * tw);
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + alpha.toFixed(3) + ')';
        ctx.shadowColor = 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + (alpha * 0.8).toFixed(3) + ')';
        ctx.shadowBlur = 3 * dpr;
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    }

    return {
      start: function() {
        if (alive) return;
        alive = true;
        resize();
        tick();
      },
      stop: function() {
        alive = false;
        if (raf) cancelAnimationFrame(raf);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      },
      resize: resize
    };
  }

  /* ── Card HTML Builder ── */
  function cardHTML(d) {
    var codeBlock = d.code
      ? '<div class="trick-code b-item" data-step="2">' +
          '<div class="trick-code-head">' +
            '<span class="trick-code-lang">' + d.code.lang + '</span>' +
            '<button class="copy-btn" onclick="event.stopPropagation();window.copyTrickCode(this)">' +
              '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3">' +
                '<rect x="5" y="5" width="8" height="9" rx="1"/>' +
                '<path d="M3 11V3a1 1 0 011-1h6"/>' +
              '</svg>Copy' +
            '</button>' +
          '</div>' +
          '<pre>' + d.code.html + '</pre>' +
        '</div>'
      : '';
    var descStep = d.code ? 3 : 2;
    var tagsStep = d.code ? 4 : 3;
    var tagsHtml = '';
    for (var i = 0; i < d.tags.length; i++) {
      tagsHtml += '<span class="trick-tag">' + d.tags[i] + '</span>';
    }

    return '<div class="trick-card ' + d.color + '">' +
      '<canvas class="particle-canvas"></canvas>' +
      '<div class="trick-card-inner">' +
        '<span class="trick-badge b-item" data-step="0"><span class="dot"></span>' + LABELS[d.cat] + '</span>' +
        '<h3 class="trick-title b-item" data-step="1">' + d.title + '</h3>' +
        codeBlock +
        '<p class="trick-desc b-item" data-step="' + descStep + '">' + d.desc + '</p>' +
        '<div class="trick-tags b-item" data-step="' + tagsStep + '">' + tagsHtml + '</div>' +
      '</div>' +
    '</div>';
  }

  /* ── Build Cards ── */
  function buildCards() {
    track.innerHTML = '';
    cards = [];
    particleSystems.clear();

    for (var i = 0; i < tricksData.length; i++) {
      var d = tricksData[i];
      var el = document.createElement('div');
      el.className = 'carousel-card';
      el.dataset.cat = d.cat;
      el.innerHTML = cardHTML(d);
      track.appendChild(el);
      cards.push(el);

      var sys = initParticles(el, ACCENT_HEX[d.color] || '#8b5cf6');
      if (sys) particleSystems.set(el, sys);
    }

    for (var j = 0; j < cards.length; j++) {
      (function(idx) {
        cards[idx].addEventListener('click', function() {
          var vi = visibleIdx.indexOf(idx);
          if (vi > -1) goToVisible(vi);
        });
      })(j);
    }
  }

  /* ── Layout ── */
  function layout() {
    var M = visibleIdx.length;
    for (var i = 0; i < cards.length; i++) {
      var vi = visibleIdx.indexOf(i);
      var sys = particleSystems.get(cards[i]);

      if (vi === -1) {
        cards[i].style.opacity = 0;
        cards[i].style.pointerEvents = 'none';
        cards[i].style.transform = 'translateX(0) scale(0.4)';
        cards[i].style.zIndex = 0;
        cards[i].classList.remove('is-active');
        if (sys) sys.stop();
        continue;
      }

      var offset = vi - current;
      if (offset > M / 2) offset -= M;
      if (offset < -M / 2) offset += M;

      cards[i].classList.remove('is-active');
      var tx = 0, scale = 1, z = 10, ry = 0, blur = 0;
      var chromeFade = 1, txtFade = 1, opacity = 1, glow = 0;

      if (offset === 0) {
        tx = 0; scale = 1; z = 30; ry = 0; blur = 0;
        chromeFade = 1; txtFade = 1; opacity = 1; glow = 0.55;
        cards[i].classList.add('is-active');
        if (sys) { sys.resize(); sys.start(); }
      } else if (offset === 1) {
        tx = 305; scale = 0.80; z = 20; ry = -7; blur = 0.5;
        chromeFade = 0.85; txtFade = 0.50; opacity = 1;
        if (sys) sys.stop();
      } else if (offset === -1) {
        tx = -305; scale = 0.80; z = 20; ry = 7; blur = 0.5;
        chromeFade = 0.85; txtFade = 0.50; opacity = 1;
        if (sys) sys.stop();
      } else if (offset === 2) {
        tx = 545; scale = 0.64; z = 5; ry = -12; blur = 1.2;
        chromeFade = 0.5; txtFade = 0.20; opacity = 1;
        if (sys) sys.stop();
      } else if (offset === -2) {
        tx = -545; scale = 0.64; z = 5; ry = 12; blur = 1.2;
        chromeFade = 0.5; txtFade = 0.20; opacity = 1;
        if (sys) sys.stop();
      } else {
        tx = offset > 0 ? 760 : -760; scale = 0.5; z = 1; ry = 0; blur = 2;
        chromeFade = 0; txtFade = 0; opacity = 0;
        if (sys) sys.stop();
      }

      cards[i].style.zIndex = z;
      cards[i].style.transform = 'translateX(' + tx + 'px) scale(' + scale + ') rotateY(' + ry + 'deg)';
      cards[i].style.filter = 'blur(' + blur + 'px)';
      cards[i].style.opacity = opacity;
      cards[i].style.setProperty('--chrome-fade', chromeFade);
      cards[i].style.setProperty('--txt-fade', txtFade);
      cards[i].style.setProperty('--glow-strength', glow);
      cards[i].style.pointerEvents = Math.abs(offset) <= 1 ? 'auto' : 'none';
      if (offset !== 0 && hasEnteredOnce) cards[i].classList.add('is-settled');
    }

    var dots = document.querySelectorAll('.car-dot');
    for (var d = 0; d < dots.length; d++) {
      dots[d].classList.toggle('active', d === current);
    }
  }

  /* ── Navigation ── */
  function goToVisible(vi) {
    var M = visibleIdx.length;
    current = ((vi % M) + M) % M;
    layout();
  }

  /* ── Filter ── */
  function applyFilter(filter) {
    visibleIdx = [];
    for (var i = 0; i < tricksData.length; i++) {
      if (filter === 'all' || tricksData[i].cat === filter) {
        visibleIdx.push(i);
      }
    }

    dotsWrap.innerHTML = '';
    for (var j = 0; j < visibleIdx.length; j++) {
      (function(vi) {
        var dot = document.createElement('button');
        dot.className = 'car-dot';
        dot.addEventListener('click', function() { goToVisible(vi); });
        dotsWrap.appendChild(dot);
      })(j);
    }

    current = 0;
    hasEnteredOnce = false;
    layout();

    setTimeout(function() {
      cards[visibleIdx[0]].classList.add('is-active');
      hasEnteredOnce = true;
      layout();
    }, 80);
  }

  /* ── Copy Code ── */
  window.copyTrickCode = function(btn) {
    var code = btn.closest('.trick-code').querySelector('pre').textContent;
    navigator.clipboard.writeText(code).catch(function() {});
    var orig = btn.innerHTML;
    btn.classList.add('copied');
    btn.innerHTML = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">' +
      '<path d="M3 8l4 4 6-8"/></svg> Copied';
    setTimeout(function() {
      btn.classList.remove('copied');
      btn.innerHTML = orig;
    }, 1500);
  };

  /* ── Controls ── */
  document.getElementById('prevBtn').addEventListener('click', function() { goToVisible(current - 1); });
  document.getElementById('nextBtn').addEventListener('click', function() { goToVisible(current + 1); });

  /* ── Drag / Swipe ── */
  var startX = 0, dragging = false;
  viewport.addEventListener('pointerdown', function(e) { dragging = true; startX = e.clientX; });
  viewport.addEventListener('pointerup', function(e) {
    if (!dragging) return;
    dragging = false;
    var dx = e.clientX - startX;
    if (dx > 50) goToVisible(current - 1);
    else if (dx < -50) goToVisible(current + 1);
  });
  viewport.addEventListener('pointerleave', function() { dragging = false; });

  /* ── Filter Buttons ── */
  var filterBtns = document.querySelectorAll('.filter-btn');
  for (var f = 0; f < filterBtns.length; f++) {
    (function(btn) {
      btn.addEventListener('click', function() {
        for (var b = 0; b < filterBtns.length; b++) {
          filterBtns[b].classList.remove('active');
        }
        btn.classList.add('active');
        applyFilter(btn.dataset.filter);
      });
    })(filterBtns[f]);
  }

  /* ── Scroll Reveal (IntersectionObserver) ── */
  var revealBlock = document.getElementById('revealBlock');
  if (revealBlock) {
    var obs = new IntersectionObserver(function(entries) {
      entries.forEach(function(en) {
        if (en.isIntersecting) {
          revealBlock.classList.add('visible');
          obs.disconnect();
        }
      });
    }, { threshold: 0.25 });
    obs.observe(revealBlock);
  }

  /* ── Window Resize ── */
  window.addEventListener('resize', function() {
    particleSystems.forEach(function(sys) { sys.resize(); });
  });

  /* ── Init ── */
  function init() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'data/tricks.json', true);
    xhr.onload = function() {
      if (xhr.status === 200) {
        var json = JSON.parse(xhr.responseText);
        tricksData = json.tricks || [];
        if (tricksData.length) {
          buildCards();
          applyFilter('all');
        }
      }
    };
    xhr.send();
  }

  init();
})();
