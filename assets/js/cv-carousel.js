(function () {
  'use strict';

  /* ── SVG Icons per type ── */
  var ICONS = {
    mobile:
      '<svg viewBox="0 0 16 16" fill="none" stroke="#10b981" stroke-width="1.4"><rect x="4" y="1.5" width="8" height="13" rx="1.5"/><path d="M7 12.5h2"/></svg>',
    backend:
      '<svg viewBox="0 0 16 16" fill="none" stroke="#3b82f6" stroke-width="1.4"><ellipse cx="8" cy="4" rx="6" ry="2"/><path d="M2 4v8c0 1.1 2.7 2 6 2s6-.9 6-2V4"/><path d="M2 8c0 1.1 2.7 2 6 2s6-.9 6-2"/></svg>',
    fullstack:
      '<svg viewBox="0 0 16 16" fill="none" stroke="#7c6cf0" stroke-width="1.4"><rect x="2" y="2" width="12" height="9" rx="1.5"/><path d="M2 6h12"/><path d="M6 11v2.5M10 11v2.5"/></svg>'
  };

  /* ── Canvas background drawing ── */
  function drawBackground(canvas, type, accentRgb) {
    var ctx = canvas.getContext('2d');
    var W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // base dark gradient
    var base = ctx.createLinearGradient(0, 0, 0, H);
    base.addColorStop(0, '#1c1c26');
    base.addColorStop(1, '#0e0e14');
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, W, H);

    if (type === 'fullstack') {
      // code editor lines
      var rowH = 14, startY = 40, leftX = 24;
      var palette = [
        'rgba(124,108,240,0.55)',
        'rgba(13,202,240,0.45)',
        'rgba(245,158,11,0.40)',
        'rgba(255,255,255,0.18)'
      ];
      for (var i = 0; i < 14; i++) {
        var y = startY + i * rowH;
        if (y > H - 30) break;
        var segs = 2 + Math.floor(Math.random() * 3);
        var x = leftX + (i % 4) * 8;
        for (var s = 0; s < segs; s++) {
          var w = 14 + Math.random() * 46;
          ctx.fillStyle = palette[Math.floor(Math.random() * palette.length)];
          ctx.fillRect(x, y, w, 4);
          x += w + 8;
          if (x > W - 24) break;
        }
      }
      // glow blob bottom
      var g = ctx.createRadialGradient(W / 2, H * 0.92, 10, W / 2, H * 0.92, W * 0.55);
      g.addColorStop(0, 'rgba(' + accentRgb + ',0.30)');
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
      // scanline grid
      ctx.strokeStyle = 'rgba(255,255,255,0.04)';
      for (var gy = 0; gy < H; gy += 18) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(W, gy);
        ctx.stroke();
      }

    } else if (type === 'mobile') {
      // phone silhouette
      var pw = 86, ph = 160, px = W / 2 - pw / 2, py = 20;
      ctx.fillStyle = 'rgba(255,255,255,0.04)';
      roundRect(ctx, px, py, pw, ph, 18);
      ctx.fill();
      ctx.strokeStyle = 'rgba(' + accentRgb + ',0.45)';
      ctx.lineWidth = 1.5;
      roundRect(ctx, px, py, pw, ph, 18);
      ctx.stroke();
      // notch
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      roundRect(ctx, px + pw / 2 - 14, py + 6, 28, 5, 3);
      ctx.fill();
      // app UI mockup
      ctx.fillStyle = 'rgba(' + accentRgb + ',0.30)';
      roundRect(ctx, px + 10, py + 24, pw - 20, 10, 4);
      ctx.fill();
      for (var ci = 0; ci < 3; ci++) {
        ctx.fillStyle = 'rgba(' + accentRgb + ',' + (0.18 - ci * 0.04) + ')';
        roundRect(ctx, px + 10, py + 44 + ci * 32, pw - 20, 24, 6);
        ctx.fill();
      }
      var gm = ctx.createRadialGradient(W / 2, py + ph * 0.5, 10, W / 2, py + ph * 0.5, W * 0.6);
      gm.addColorStop(0, 'rgba(' + accentRgb + ',0.22)');
      gm.addColorStop(1, 'transparent');
      ctx.fillStyle = gm;
      ctx.fillRect(0, 0, W, H);

    } else if (type === 'backend') {
      // server rack
      var rackX = W / 2 - 70, rackW = 140, unitH = 20, gap = 8, startY2 = 30;
      for (var ri = 0; ri < 5; ri++) {
        var ry = startY2 + ri * (unitH + gap);
        if (ry > H - 40) break;
        ctx.fillStyle = 'rgba(255,255,255,0.04)';
        roundRect(ctx, rackX, ry, rackW, unitH, 4);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.07)';
        ctx.lineWidth = 1;
        roundRect(ctx, rackX, ry, rackW, unitH, 4);
        ctx.stroke();
        // status LED
        ctx.beginPath();
        ctx.arc(rackX + 12, ry + unitH / 2, 2.6, 0, Math.PI * 2);
        ctx.fillStyle = Math.random() > 0.3
          ? 'rgba(' + accentRgb + ',0.9)'
          : 'rgba(255,255,255,0.15)';
        ctx.fill();
        // vent lines
        ctx.strokeStyle = 'rgba(255,255,255,0.10)';
        for (var v = 0; v < 5; v++) {
          ctx.beginPath();
          ctx.moveTo(rackX + 30 + v * 16, ry + 5);
          ctx.lineTo(rackX + 30 + v * 16, ry + unitH - 5);
          ctx.stroke();
        }
      }
      var gb = ctx.createRadialGradient(W / 2, H * 0.85, 10, W / 2, H * 0.85, W * 0.6);
      gb.addColorStop(0, 'rgba(' + accentRgb + ',0.25)');
      gb.addColorStop(1, 'transparent');
      ctx.fillStyle = gb;
      ctx.fillRect(0, 0, W, H);
    }

    // vignette
    var vg = ctx.createRadialGradient(W / 2, H / 2, W * 0.2, W / 2, H / 2, W * 0.85);
    vg.addColorStop(0, 'transparent');
    vg.addColorStop(1, 'rgba(0,0,0,0.35)');
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, W, H);
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  /* ── Card HTML builder ── */
  function cardHTML(d) {
    var pdfBtn = d.pdf
      ? '<a href="' + d.pdf + '" download class="cv-btn">' +
        '<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M2 2h7l3 3v7H2V2z"/><path d="M9 2v3h3"/></svg>PDF</a>'
      : '';
    var wordBtn = d.docx
      ? '<a href="' + d.docx + '" download class="cv-btn">' +
        '<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M2 2h10v10H2V2z"/><path d="M5 7h4M5 5h4M5 9h2"/></svg>Word</a>'
      : '';
    var detailsHref = 'cv-details.html?id=' + d.id;

    return '<div class="cv-card-face" style="--hover-accent:rgba(' + d.accentRgb + ',0.40);--hover-glow:rgba(' + d.accentRgb + ',0.28);--hover-accent2:' + d.accent + ';--hover-btn-bg:rgba(' + d.accentRgb + ',0.24)">' +
      '<canvas class="cv-bg-canvas" width="288" height="288"></canvas>' +
      '<div class="scan-line"></div>' +
      '<div class="spec-overlay"></div>' +
      '<div class="cv-content">' +
        '<div class="cv-top-row">' +
          '<span class="cv-index">' + d.idx + '</span>' +
          '<div class="cv-icon-badge">' + ICONS[d.type] + '</div>' +
        '</div>' +
        '<div class="cv-text">' +
          '<div class="cv-card-title">' + d.title + '</div>' +
          '<div class="cv-subtitle" style="color:' + d.accent + '">' + d.sub + '</div>' +
        '</div>' +
        '<div class="cv-actions">' + pdfBtn + wordBtn + '</div>' +
        '<a href="' + detailsHref + '" class="cv-view">' +
          '<span class="cv-view-icon"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M2 8s2-4 6-4 6 4 6 4-2 4-6 4-6-4-6-4z"/><circle cx="8" cy="8" r="1.5"/></svg></span>' +
          'View Details' +
        '</a>' +
      '</div>' +
    '</div>';
  }

  /* ── MAIN ── */
  var track = document.getElementById('cv-track');
  var dotsWrap = document.getElementById('cv-dots');
  var viewport = document.querySelector('.cv-carousel-viewport');
  if (!track) return;

  var cards = [];
  var current = 0;
  var N = 0;

  function init(data) {
    N = data.length;
    data.forEach(function (d, i) {
      var el = document.createElement('div');
      el.className = 'cv-card';
      el.innerHTML = cardHTML(d);
      el.addEventListener('click', function () { goTo(i); });
      track.appendChild(el);
      cards.push(el);

      var canvas = el.querySelector('.cv-bg-canvas');
      if (canvas) drawBackground(canvas, d.type, d.accentRgb);

      var dot = document.createElement('button');
      dot.className = 'cv-dot';
      dot.addEventListener('click', function () { goTo(i); });
      if (dotsWrap) dotsWrap.appendChild(dot);
    });
    layout();
  }

  function layout() {
    cards.forEach(function (c, i) {
      var offset = i - current;
      if (offset > N / 2) offset -= N;
      if (offset < -N / 2) offset += N;

      var tx = 0, scale = 1, z = 10, ry = 0;

      if (offset === 0) {
        tx = 0; scale = 1; z = 30; ry = 0;
        c.classList.add('is-center');
      } else {
        c.classList.remove('is-center');
      }

      if (offset === 1) { tx = 235; scale = 0.72; z = 20; ry = -9; }
      else if (offset === -1) { tx = -235; scale = 0.72; z = 20; ry = 9; }
      else if (offset === 2) { tx = 400; scale = 0.54; z = 5; ry = -15; }
      else if (offset === -2) { tx = -400; scale = 0.54; z = 5; ry = 15; }
      else if (offset !== 0) { tx = offset > 0 ? 560 : -560; scale = 0.42; z = 1; }

      c.style.zIndex = z;
      c.style.transform = 'translateX(' + tx + 'px) scale(' + scale + ') rotateY(' + ry + 'deg)';
      c.style.opacity = Math.abs(offset) <= 2 ? 1 : 0;
      c.style.pointerEvents = Math.abs(offset) <= 1 ? 'auto' : 'none';
    });

    var dots = document.querySelectorAll('.cv-dot');
    dots.forEach(function (d, i) { d.classList.toggle('active', i === current); });
  }

  function goTo(i) {
    current = ((i % N) + N) % N;
    layout();
  }

  /* ── Controls ── */
  var prevBtn = document.getElementById('cv-prev');
  var nextBtn = document.getElementById('cv-next');
  if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); });
  if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); });

  /* ── Swipe ── */
  var startX = 0, dragging = false;
  if (viewport) {
    viewport.addEventListener('pointerdown', function (e) { dragging = true; startX = e.clientX; });
    viewport.addEventListener('pointerup', function (e) {
      if (!dragging) return;
      dragging = false;
      var dx = e.clientX - startX;
      if (dx > 40) goTo(current - 1);
      else if (dx < -40) goTo(current + 1);
    });
    viewport.addEventListener('pointerleave', function () { dragging = false; });
  }

  /* ── Keyboard ── */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') goTo(current - 1);
    if (e.key === 'ArrowRight') goTo(current + 1);
  });

  /* ── Load data from JSON ── */
  fetch('data/cvs.json')
    .then(function (r) { return r.json(); })
    .then(function (json) {
      var mapped = json.cvs.map(function (cv, i) {
        return {
          id: cv.id,
          idx: (i + 1).toString().padStart(2, '0'),
          type: cv.type || 'fullstack',
          accent: cv.accent || '#7c6cf0',
          accentRgb: cv.accentRgb || '124,108,240',
          title: cv.title,
          sub: cv.specialization,
          pdf: cv.files ? cv.files.pdf : null,
          docx: cv.files ? cv.files.docx : null
        };
      });
      init(mapped);
    })
    .catch(function (err) { console.error('CV carousel: failed to load data', err); });
})();
