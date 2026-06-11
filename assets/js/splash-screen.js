/* ── Splash Screen: Terminal Compile + Shatter Reveal ── */
window.SplashScreen = (function() {

  var DEFAULTS = {
    name: 'Assem Adel Habib',
    pageSelector: '.main, .page',
    onComplete: function() {}
  };

  var STEPS = [
    { pct: 8,  label: 'Loading assets...',        log: '✓ fonts loaded',         cls: 'ok'  },
    { pct: 22, label: 'Building CSS 3D engine...', log: '✓ transform-style: preserve-3d', cls: 'ok' },
    { pct: 38, label: 'Compiling animations...',   log: '✓ 6 rAF loops initialized', cls: 'ok' },
    { pct: 54, label: 'Initializing particles...', log: '✓ 80 particles spawned',  cls: 'ok'  },
    { pct: 67, label: 'Building 3D cuboid...',     log: '✓ 6 faces aligned',        cls: 'ok'  },
    { pct: 79, label: 'Attaching event handlers...', log: '✓ drag system ready',   cls: 'ok'  },
    { pct: 91, label: 'Running final checks...',   log: '⚠ manifest.json: 403',    cls: 'err' },
    { pct: 96, label: 'Patching...',               log: '✓ fallback applied',       cls: 'inf' },
    { pct:100, label: 'Ready.',                    log: '✓ portfolio compiled successfully', cls: 'ok' },
  ];

  function init(options) {
    options = options || {};
    var name = options.name || DEFAULTS.name;
    var pageSelector = options.pageSelector || DEFAULTS.pageSelector;
    var onComplete = options.onComplete || DEFAULTS.onComplete;

    var splash   = document.getElementById('splash');
    var typed    = document.getElementById('splash-typed');
    var compile  = document.getElementById('splash-compile');
    var barFill  = document.getElementById('splash-bar-fill');
    var barGlow  = document.getElementById('splash-bar-glow');
    var stepEl   = document.getElementById('splash-compile-step');
    var pctEl    = document.getElementById('splash-compile-pct');
    var logsEl   = document.getElementById('splash-logs');
    var shardsEl = document.getElementById('splash-shards');

    if (!splash) return;

    /* ── 1. Type name ── */
    function typeName() {
      return new Promise(function(resolve) {
        var i = 0;
        var iv = setInterval(function() {
          typed.textContent = name.slice(0, ++i);
          if (i === name.length) {
            clearInterval(iv);
            setTimeout(resolve, 500);
          }
        }, 70);
      });
    }

    /* ── 2. Compile progress ── */
    var currentPct = 0;

    function addLog(text, cls) {
      var el = document.createElement('div');
      el.className = 'sp-log ' + cls;
      el.textContent = text;
      logsEl.appendChild(el);
      while (logsEl.children.length > 4) logsEl.removeChild(logsEl.firstChild);
    }

    function runCompile() {
      return new Promise(function(resolve) {
        compile.classList.add('show');
        var stepIdx = 0;

        function nextStep() {
          if (stepIdx >= STEPS.length) { resolve(); return; }
          var s = STEPS[stepIdx++];
          var target = s.pct;
          var startPct = currentPct;
          var duration = 320 + Math.random() * 200;
          var startTime = performance.now();

          function animBar(now) {
            var t = Math.min(1, (now - startTime) / duration);
            var ease = 1 - Math.pow(1 - t, 3);
            currentPct = startPct + (target - startPct) * ease;
            barFill.style.width = currentPct + '%';
            barFill.classList.add('active');
            pctEl.textContent = Math.round(currentPct) + '%';

            if (t < 1) {
              requestAnimationFrame(animBar);
            } else {
              currentPct = target;
              stepEl.textContent = s.label;
              addLog(s.log, s.cls);
              var pause = 180 + Math.random() * 220;
              setTimeout(nextStep, pause);
            }
          }
          requestAnimationFrame(animBar);
        }

        nextStep();
      });
    }

    /* ── 3. Shatter effect ── */
    function buildShards() {
      var W = window.innerWidth;
      var H = window.innerHeight;
      var COLS = 9, ROWS = 11;
      var cw = W / COLS, ch = H / ROWS;
      var frags = [];
      var cx0 = W / 2, cy0 = H / 2;

      for (var r = 0; r < ROWS; r++) {
        for (var c = 0; c < COLS; c++) {
          var x = c * cw, y = r * ch;
          var distC = Math.sqrt((x+cw/2-cx0)*(x+cw/2-cx0) + (y+ch/2-cy0)*(y+ch/2-cy0));
          var jAmt  = 14 + (1 - distC / Math.sqrt(cx0*cx0+cy0*cy0)) * 12;
          var jitter = function() { return (Math.random() - .5) * jAmt; };

          var pts = [
            [x + jitter(),      y + jitter()     ],
            [x + cw + jitter(), y + jitter()     ],
            [x + cw + jitter(), y + ch + jitter()],
            [x + jitter(),      y + ch + jitter()],
          ];

          var scx = x + cw / 2, scy = y + ch / 2;
          var dx  = scx - cx0,  dy  = scy - cy0;
          var dist = Math.sqrt(dx*dx + dy*dy) || 1;
          var baseSpeed = 3.5 + Math.random() * 2.8;
          var vx = (dx / dist) * baseSpeed + (Math.random()-.5) * 1.2;
          var vy = (dy / dist) * baseSpeed + (Math.random()-.5) * 1.2;

          frags.push({
            el: null, pts: pts, x: x, y: y, cw: cw, ch: ch, scx: scx, scy: scy,
            px: 0, py: 0,
            vx: vx, vy: vy,
            gravity: 0.18 + Math.random() * 0.14,
            spin: (Math.random() - .5) * 5.5,
            angle: 0,
            scaleV: -0.004 - Math.random() * 0.006,
            scale: 1,
            opacity: 1,
            opacityV: -(0.012 + Math.random() * 0.016),
            delay: (1 - distC / Math.sqrt(cx0*cx0+cy0*cy0)) * 120 + Math.random() * 60,
            started: false,
            done: false,
          });
        }
      }
      return frags;
    }

    function shatter() {
      return new Promise(function(resolve) {
        splash.classList.add('revealing');
        var frags = buildShards();
        var allDone = false;
        var startTime = performance.now();

        frags.forEach(function(f) {
          var el = document.createElement('div');
          el.className = 'shard';
          var clipPts = f.pts.map(function(p) {
            return ((p[0] - f.x).toFixed(1)) + 'px ' + ((p[1] - f.y).toFixed(1)) + 'px';
          }).join(', ');
          el.style.cssText =
            'left:' + f.x + 'px;top:' + f.y + 'px;' +
            'width:' + (f.cw+24) + 'px;height:' + (f.ch+24) + 'px;' +
            'clip-path:polygon(' + clipPts + ');';
          shardsEl.appendChild(el);
          f.el = el;
        });

        function physicsLoop(now) {
          if (allDone) return;
          var elapsed = now - startTime;
          var remaining = 0;

          frags.forEach(function(f) {
            if (f.done) return;
            if (elapsed < f.delay) { remaining++; return; }

            f.started = true;
            f.vy    += f.gravity;
            f.px    += f.vx;
            f.py    += f.vy;
            f.angle += f.spin;
            f.scale += f.scaleV;
            f.scale  = Math.max(0.01, f.scale);
            f.opacity += f.opacityV;

            f.vx *= 0.97;
            f.vy *= 0.97;
            f.spin *= 0.985;

            f.el.style.transform =
              'translate(' + f.px.toFixed(2) + 'px, ' + f.py.toFixed(2) + 'px) ' +
              'rotate(' + f.angle.toFixed(2) + 'deg) ' +
              'scale(' + f.scale.toFixed(4) + ')';
            f.el.style.opacity = Math.max(0, f.opacity).toFixed(3);

            if (f.opacity <= 0 || f.scale <= 0.01) {
              f.done = true;
              f.el.style.display = 'none';
            } else {
              remaining++;
            }
          });

          if (remaining === 0) {
            allDone = true;
            resolve();
          } else {
            requestAnimationFrame(physicsLoop);
          }
        }

        requestAnimationFrame(physicsLoop);
      });
    }

    /* ── 4. Run sequence ── */
    async function run() {
      document.body.style.overflow = 'hidden';

      await typeName();
      await runCompile();

      await new Promise(function(r) { setTimeout(r, 350); });

      var accentColor = (getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim() || '#0563bb');
      var flash = document.createElement('div');
      flash.style.cssText =
        'position:absolute;inset:0;background:' + accentColor + ';' +
        'opacity:0;pointer-events:none;transition:opacity .12s ease;z-index:2;';
      splash.appendChild(flash);
      requestAnimationFrame(function() {
        flash.style.opacity = '0.18';
        setTimeout(function() { flash.style.opacity = '0'; }, 120);
      });

      await new Promise(function(r) { setTimeout(r, 180); });

      await shatter();

      splash.style.transition = 'opacity .25s ease';
      splash.style.opacity = '0';
      await new Promise(function(r) { setTimeout(r, 260); });

      splash.classList.add('hidden');
      document.body.style.overflow = '';

      var pageEl = document.querySelector(pageSelector);
      if (pageEl) pageEl.classList.add('page-reveal');

      onComplete();
    }

    run();
  }

  return { init: init };
})();
