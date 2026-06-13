/**
 * CV Details Effects - Particles, Cursor, Scroll Reveals, Sliding Skills & 3D Project Tilts
 * Extracted and optimized from assem-cv-3d.html
 */
(function () {
  'use strict';

  var Effects = {
    registry: [],
    skillsObserver: null,
    skillsFired: false,

    init: function () {
      var self = this;
      self._initCursor();
      self._initParticles();
      self._initScrollProgress();
      self._initNavDots();
      self._initScrollReveal();
      self._initSkillsSlide();
      self._initProjectsTilt();
    },

    /* ── 1. Custom Cursor lerp loop ── */
    _initCursor: function () {
      var cursor = document.getElementById('cursor');
      var ring = document.getElementById('cursorRing');
      if (!cursor || !ring) return;

      var mouseX = window.innerWidth / 2;
      var mouseY = window.innerHeight / 2;
      var currX = mouseX, currY = mouseY;
      var ringX = mouseX, ringY = mouseY;

      document.addEventListener('mousemove', function (e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
      });

      function loop() {
        currX += (mouseX - currX) * 0.25;
        currY += (mouseY - currY) * 0.25;
        ringX += (mouseX - ringX) * 0.12;
        ringY += (mouseY - ringY) * 0.12;

        cursor.style.left = currX + 'px';
        cursor.style.top = currY + 'px';
        ring.style.left = ringX + 'px';
        ring.style.top = ringY + 'px';

        requestAnimationFrame(loop);
      }
      loop();
    },

    /* ── 2. Particles Background Canvas ── */
    _initParticles: function () {
      var canvas = document.getElementById('particles');
      if (!canvas) return;

      var ctx = canvas.getContext('2d');
      var parts = [];
      var N = 80;

      function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
      resize();
      window.addEventListener('resize', resize);

      for (var i = 0; i < N; i++) {
        parts.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          r: Math.random() * 1.5 + 1
        });
      }

      function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var w = canvas.width;
        var h = canvas.height;

        for (var i = 0; i < N; i++) {
          var p1 = parts[i];
          p1.x += p1.vx;
          p1.y += p1.vy;

          if (p1.x < 0) p1.x = w;
          if (p1.x > w) p1.x = 0;
          if (p1.y < 0) p1.y = h;
          if (p1.y > h) p1.y = 0;

          // Connect nearby particles
          for (var j = i + 1; j < N; j++) {
            var p2 = parts[j];
            var dx = p1.x - p2.x;
            var dy = p1.y - p2.y;
            var dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 100) {
              ctx.beginPath();
              ctx.strokeStyle = 'rgba(5, 99, 187, ' + (1 - dist / 100) * 0.14 + ')';
              ctx.lineWidth = 0.5;
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }

          ctx.beginPath();
          ctx.arc(p1.x, p1.y, p1.r, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(5, 99, 187, 0.25)';
          ctx.fill();
        }
        requestAnimationFrame(draw);
      }
      draw();
    },

    /* ── 3. Scroll Progress ── */
    _initScrollProgress: function () {
      var progress = document.getElementById('scrollProgress');
      if (!progress) return;

      window.addEventListener('scroll', function () {
        var s = document.documentElement.scrollTop || document.body.scrollTop;
        var h = document.documentElement.scrollHeight - window.innerHeight;
        var pct = h > 0 ? (s / h * 100) : 0;
        progress.style.width = pct + '%';
      }, { passive: true });
    },

    /* ── 4. Nav Dots Navigation ── */
    _initNavDots: function () {
      var dotsContainer = document.getElementById('navDots');
      if (!dotsContainer) return;

      var dots = dotsContainer.querySelectorAll('.nav-dot');

      dots.forEach(function (dot) {
        dot.addEventListener('click', function (e) {
          e.preventDefault();
          var targetId = dot.getAttribute('data-target');
          var targetEl = document.getElementById(targetId);
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth' });
          }
        });
      });

      function highlight() {
        var vh = window.innerHeight;
        dots.forEach(function (dot) {
          var targetId = dot.getAttribute('data-target');
          var el = document.getElementById(targetId);
          if (!el) return;

          var r = el.getBoundingClientRect();
          if (r.top <= vh * 0.5 && r.bottom > vh * 0.2) {
            dots.forEach(function (d) { d.classList.remove('active'); });
            dot.classList.add('active');
          }
        });
      }

      window.addEventListener('scroll', highlight, { passive: true });
      highlight();
    },

    /* ── 5. Bi-directional Scroll Reveal System ── */
    _initScrollReveal: function () {
      var self = this;

      var animDefs = {
        'fade-up': {
          hidden:  { opacity: '0', transform: 'translateY(32px)' },
          visible: { opacity: '1', transform: 'translateY(0)', transition: 'opacity .75s ease, transform .75s ease' },
          out:     { opacity: '0', transform: 'translateY(-20px)', transition: 'opacity .4s ease, transform .4s ease' }
        },
        'fade-right': {
          hidden:  { opacity: '0', transform: 'translateX(-32px)' },
          visible: { opacity: '1', transform: 'translateX(0)', transition: 'opacity .75s ease, transform .75s ease' },
          out:     { opacity: '0', transform: 'translateX(20px)', transition: 'opacity .4s ease, transform .4s ease' }
        },
        'fade-left': {
          hidden:  { opacity: '0', transform: 'translateX(32px)' },
          visible: { opacity: '1', transform: 'translateX(0)', transition: 'opacity .75s ease, transform .75s ease' },
          out:     { opacity: '0', transform: 'translateX(-20px)', transition: 'opacity .4s ease, transform .4s ease' }
        },
        'scale-up': {
          hidden:  { opacity: '0', transform: 'scale(0.95)' },
          visible: { opacity: '1', transform: 'scale(1)', transition: 'opacity .75s ease, transform .75s ease' },
          out:     { opacity: '0', transform: 'scale(0.97)', transition: 'opacity .4s ease, transform .4s ease' }
        }
      };

      // 1. Gather all reveal elements and mark them hidden
      var sections = document.querySelectorAll('.cv3d-sec');
      sections.forEach(function (sec) {
        // Section tag and title
        var tag = sec.querySelector('.cv3d-sec-tag');
        if (tag) addRegistry(tag, 'fade-right');
        
        var title = sec.querySelector('.cv3d-sec-title');
        if (title) addRegistry(title, 'fade-up');

        // Main content blocks inside sections
        var summary = sec.querySelector('.cv3d-summary');
        if (summary) addRegistry(summary, 'fade-up');

        var timelineItems = sec.querySelectorAll('.cv3d-tl-item');
        timelineItems.forEach(function (item) {
          addRegistry(item, 'fade-left');
        });

        var eduCards = sec.querySelectorAll('.cv3d-edu-card');
        eduCards.forEach(function (card) {
          addRegistry(card, 'scale-up');
        });

        var langItems = sec.querySelectorAll('.cv3d-lang-item');
        langItems.forEach(function (item) {
          addRegistry(item, 'fade-up');
        });

        var downloadBtns = sec.querySelectorAll('.cv3d-dl-btn');
        downloadBtns.forEach(function (btn) {
          addRegistry(btn, 'scale-up');
        });
      });

      function addRegistry(el, type) {
        el.classList.add('reveal-el');
        var def = animDefs[type] || animDefs['fade-up'];
        
        // Apply initial hidden styles
        Object.keys(def.hidden).forEach(function (prop) {
          el.style[prop] = def.hidden[prop];
        });

        self.registry.push({
          el: el,
          def: def,
          state: 'hidden'
        });
      }

      function applyStyles(el, styles) {
        Object.keys(styles).forEach(function (prop) {
          el.style[prop] = styles[prop];
        });
      }

      function enterEl(entry) {
        entry.state = 'visible';
        applyStyles(entry.el, entry.def.visible);
        
        // If it's a language item, animate the inner fill width
        var fill = entry.el.querySelector('.cv3d-lang-fill');
        if (fill && fill.style.width === '0px') {
          var targetWidth = fill.getAttribute('data-target-width') || '0%';
          setTimeout(function () {
            fill.style.width = targetWidth;
          }, 100);
        }
      }

      function exitEl(entry, dir) {
        if (dir === 'up') {
          entry.state = 'out';
          applyStyles(entry.el, entry.def.out);
        } else {
          entry.state = 'hidden';
          applyStyles(entry.el, entry.def.hidden);
          
          // Reset language fill width for scroll re-entry
          var fill = entry.el.querySelector('.cv3d-lang-fill');
          if (fill) {
            fill.style.width = '0px';
          }
        }
      }

      // ── Scan Loop ──
      var ENTER_THRESHOLD = 0.88;
      var BUFFER = 60;

      function scanElements() {
        var vh = window.innerHeight;
        self.registry.forEach(function (entry) {
          var r = entry.el.getBoundingClientRect();
          var inView = r.top < vh * ENTER_THRESHOLD && r.bottom > 0;
          var aboveVP = r.bottom < -BUFFER;
          var belowVP = r.top > vh + BUFFER;

          if (inView && entry.state === 'hidden') enterEl(entry);
          if (aboveVP && entry.state === 'visible') exitEl(entry, 'up');
          if (belowVP && entry.state === 'visible') exitEl(entry, 'down');
        });
      }

      window.addEventListener('scroll', scanElements, { passive: true });
      setTimeout(scanElements, 400);
    },

    /* ── 6. Skills Slide-in & Hover Tilt ── */
    _initSkillsSlide: function () {
      var self = this;
      var grid = document.getElementById('cvSkillsGrid');
      if (!grid) return;

      var cards = Array.from(grid.querySelectorAll('.cv3d-skill-card'));
      if (cards.length === 0) return;

      function getDirection(card) {
        var gridCX = grid.getBoundingClientRect().left + grid.offsetWidth / 2;
        var cardCX = card.getBoundingClientRect().left + card.offsetWidth / 2;
        return cardCX <= gridCX ? 'left' : 'right';
      }

      function hideCards() {
        cards.forEach(function (card) {
          card.classList.remove('card-visible');
          card.style.transition = 'none';
          card.style.opacity = '0';
          card.style.transform = 'translateX(0px)';
        });
      }

      function slideIn() {
        if (self.skillsFired) return;
        self.skillsFired = true;

        cards.forEach(function (card, idx) {
          var dir = getDirection(card);
          var offset = dir === 'left' ? '-110vw' : '110vw';
          var delay = idx * 75;

          card.style.transition = 'none';
          card.style.opacity = '1';
          card.style.transform = 'translateX(' + offset + ')';

          void card.offsetWidth; // force reflow

          card.style.transition = 'transform 0.75s ' + delay + 'ms cubic-bezier(.22,1,.36,1), opacity 0.4s ' + delay + 'ms ease';
          card.style.transform = 'translateX(0)';

          setTimeout(function () {
            card.classList.add('card-visible');
            card.style.transition = '';
            card.style.transform = '';
            attachTilt(card);
          }, delay + 780);
        });
      }

      function slideOut() {
        if (!self.skillsFired) return;
        self.skillsFired = false;

        cards.forEach(function (card, idx) {
          // Clone to remove active event listeners
          var clone = card.cloneNode(true);
          if (card.parentNode) card.parentNode.replaceChild(clone, card);
          cards[idx] = clone;

          var dir = getDirection(clone);
          var offset = dir === 'left' ? '-110vw' : '110vw';
          var delay = (cards.length - 1 - idx) * 50;

          clone.classList.remove('card-visible');
          clone.style.transition = 'transform 0.5s ' + delay + 'ms cubic-bezier(.55,0,1,.45), opacity 0.4s ' + delay + 'ms ease';
          clone.style.opacity = '0';
          clone.style.transform = 'translateX(' + offset + ')';
        });
      }

      function attachTilt(card) {
        card.addEventListener('mousemove', function (e) {
          if (!card.classList.contains('card-visible')) return;
          var r = card.getBoundingClientRect();
          var x = (e.clientX - r.left) / r.width - 0.5;
          var y = (e.clientY - r.top) / r.height - 0.5;
          card.style.transition = 'box-shadow 0.15s, border-color 0.2s';
          card.style.transform = 'translateY(-7px) rotateX(' + (-y * 14) + 'deg) rotateY(' + (x * 14) + 'deg)';
          card.style.boxShadow = (-x * 22) + 'px ' + (-y * 22) + 'px 40px rgba(0,0,0,0.35), 0 0 0 1px rgba(5,99,187,0.3)';
        });

        card.addEventListener('mouseleave', function () {
          if (!card.classList.contains('card-visible')) return;
          card.style.transition = 'transform 0.45s cubic-bezier(.22,1,.36,1), box-shadow 0.35s';
          card.style.transform = '';
          card.style.boxShadow = '';
        });
      }

      self.skillsObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.1 && !self.skillsFired) {
            slideIn();
          } else if (!entry.isIntersecting && self.skillsFired) {
            slideOut();
          }
        });
      }, { threshold: [0, 0.1, 0.5] });

      self.skillsObserver.observe(grid);
      hideCards();
    },

    /* ── 7. 3D Tilt on Projects Card hover ── */
    _initProjectsTilt: function () {
      var scenes = document.querySelectorAll('.proj-scene');
      scenes.forEach(function (scene) {
        var card = scene.querySelector('.proj-card');
        if (!card) return;

        scene.addEventListener('mousemove', function (e) {
          if (card.matches(':hover')) {
            if (card.style.transform) card.style.transform = '';
            return;
          }
          var r = scene.getBoundingClientRect();
          var x = (e.clientX - r.left) / r.width - 0.5;
          var y = (e.clientY - r.top) / r.height - 0.5;
          card.style.transition = 'none';
          card.style.transform = 'rotateX(' + (-y * 8) + 'deg) rotateY(' + (x * 8) + 'deg)';
        });

        scene.addEventListener('mouseleave', function () {
          card.style.transition = 'transform 0.45s cubic-bezier(.22,1,.36,1)';
          card.style.transform = '';
        });

        card.addEventListener('mouseenter', function () {
          card.style.transition = '';
          card.style.transform = '';
        });
      });
    }
  };

  window.CVDetailsEffects = Effects;
})();
