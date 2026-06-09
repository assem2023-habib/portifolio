/**
 * CV 3D Cuboid — mouse tilt, drag-to-rotate, flip, scroll-responsive
 * Extracted from assem-cv-details-Cs.html
 */
(function () {
  'use strict';

  var CV3D = {
    box: null,
    isFlipped: false,
    interpX: 0,
    interpY: 0,
    targetTiltX: 0,
    targetTiltY: 0,
    mouseX: 0,
    mouseY: 0,
    jsActive: false,

    /* ── Drag state ── */
    dragRotX: 0,
    dragRotY: 0,
    dragging: false,
    dragStartX: 0,
    dragStartY: 0,
    dragLastX: 0,
    dragLastY: 0,
    velX: 0,
    velY: 0,
    dragMode: false,
    dragDecay: false,
    DRAG_SENS: 0.45,
    INERTIA: 0.92,
    SNAP_SPEED: 0.04,
    dragScene: null,

    init: function (containerId) {
      var self = this;
      var container = document.getElementById(containerId);
      if (!container) return;

      self.box = container.querySelector('.cv3d-box');
      if (!self.box) return;

      self.dragScene = container.querySelector('.cv3d-scene');

      self.mouseX = window.innerWidth / 2;
      self.mouseY = window.innerHeight / 2;

      self._trackMouse();
      self._initTilt();
      self._initDrag();
      self._initFlip();
      self._initScrollResize();
    },

    /* ── Global mouse tracking ── */
    _trackMouse: function () {
      var self = this;
      document.addEventListener('mousemove', function (e) {
        self.mouseX = e.clientX;
        self.mouseY = e.clientY;
      });
    },

    /* ── Tilt rAF loop ── */
    _initTilt: function () {
      var self = this;
      var running = false;

      function loop() {
        if (!self.box) return;
        if (!self.isFlipped) {
          if (!self.jsActive) {
            self.jsActive = true;
            self.box.setAttribute('data-js-active', '1');
          }

          var rect = self.box.getBoundingClientRect();
          var cardCX = rect.left + rect.width / 2;
          var cardCY = rect.top + rect.height / 2;

          var dx = (self.mouseX - cardCX) / window.innerWidth;
          var dy = (self.mouseY - cardCY) / window.innerHeight;
          var dist = Math.sqrt(dx * dx + dy * dy);
          var sharp = 1.8 / (1 + dist * 2.2);
          var minAmp = 0.35;
          var amp = minAmp + sharp * (1 - minAmp);

          self.targetTiltY = dx * 38 * amp;
          self.targetTiltX = -dy * 28 * amp;

          self.interpX += (self.targetTiltX - self.interpX) * 0.09;
          self.interpY += (self.targetTiltY - self.interpY) * 0.09;

          var scrollY = window.scrollY;
          var hero = document.getElementById(self.box.getAttribute('data-hero-id') || 'cv3dHero');
          var heroH = hero ? hero.offsetHeight : window.innerHeight;
          var scrollRatio = Math.min(1, scrollY / heroH);
          var diveX = scrollRatio * 18;
          var diveY = scrollRatio * 8;
          var sinkY = -scrollRatio * 40;
          var shrink = 1 - scrollRatio * 0.06;

          self.box.style.animation = 'none';

          if (!self.box.classList.contains('cv3d-box-transition')) {
            var totalX = (self.dragMode ? self.dragRotX : 0) + self.interpX + diveX;
            var totalY = (self.dragMode ? self.dragRotY : 0) + self.interpY + diveY;
            self.box.style.transform =
              'perspective(1100px) rotateX(' + totalX + 'deg) rotateY(' + totalY + 'deg) translateY(' + sinkY + 'px) scale(' + shrink + ')';

            var glow = self.box.querySelector('.cv3d-glow');
            if (glow) {
              var intensity = Math.min(1, dist * 2);
              glow.style.opacity = (1 - scrollRatio) * (0.7 + intensity * 0.3);
              glow.style.transform = 'translate(' + (-self.interpY * 0.5) + 'px, ' + (-self.interpX * 0.3) + 'px)';
            }
          }
        }
        requestAnimationFrame(loop);
      }

      loop();
    },

    /* ── Drag-to-rotate ── */
    _initDrag: function () {
      var self = this;
      if (!self.dragScene) return;

      self.dragScene.style.cursor = 'grab';

      function onDown(e) {
        if (self.isFlipped) return;
        self.dragging = true;
        self.dragMode = true;
        self.dragDecay = false;
        self.velX = 0;
        self.velY = 0;
        self.dragStartX = self.dragLastX = (e.type === 'touchstart' ? e.touches[0].clientX : e.clientX);
        self.dragStartY = self.dragLastY = (e.type === 'touchstart' ? e.touches[0].clientY : e.clientY);
        self.dragScene.style.cursor = 'grabbing';
        if (self.box) self.box.style.transition = 'none';
        e.preventDefault();
      }

      function onMove(e) {
        if (!self.dragging) return;
        var cx = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        var cy = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
        var dx = cx - self.dragLastX;
        var dy = cy - self.dragLastY;
        self.velY = dx * self.DRAG_SENS;
        self.velX = -dy * self.DRAG_SENS;
        self.dragRotY += dx * self.DRAG_SENS;
        self.dragRotX -= dy * self.DRAG_SENS;
        self.dragRotX = Math.max(-75, Math.min(75, self.dragRotX));
        self.dragLastX = cx;
        self.dragLastY = cy;
        e.preventDefault();
      }

      function onUp() {
        if (!self.dragging) return;
        self.dragging = false;
        self.dragDecay = true;
        if (self.dragScene) self.dragScene.style.cursor = 'grab';
      }

      self.dragScene.addEventListener('mousedown', onDown, { passive: false });
      self.dragScene.addEventListener('touchstart', onDown, { passive: false });
      document.addEventListener('mousemove', onMove, { passive: false });
      document.addEventListener('touchmove', onMove, { passive: false });
      document.addEventListener('mouseup', onUp);
      document.addEventListener('touchend', onUp);

      /* ── Drag rAF loop ── */
      (function dragLoop() {
        if (!self.isFlipped && self.box) {
          if (self.dragMode) {
            if (!self.dragging && self.dragDecay) {
              self.velX *= self.INERTIA;
              self.velY *= self.INERTIA;
              self.dragRotX += self.velX;
              self.dragRotY += self.velY;
              self.dragRotX = Math.max(-75, Math.min(75, self.dragRotX));
              if (Math.abs(self.velX) + Math.abs(self.velY) < 0.08) {
                self.dragDecay = false;
              }
            }
            if (!self.dragging && !self.dragDecay) {
              self.dragRotX *= (1 - self.SNAP_SPEED);
              self.dragRotY *= (1 - self.SNAP_SPEED);
              if (Math.abs(self.dragRotX) < 0.3 && Math.abs(self.dragRotY) < 0.3) {
                self.dragRotX = 0;
                self.dragRotY = 0;
                self.dragMode = false;
              }
            }
          }
        }
        requestAnimationFrame(dragLoop);
      })();

      /* ── Drag hint ── */
      var hint = document.createElement('div');
      hint.className = 'cv3d-drag-hint';
      hint.innerHTML = '<span style="font-size:.8rem">⠿</span> Drag to rotate';
      self.dragScene.appendChild(hint);
      setTimeout(function () {
        hint.style.transition = 'opacity 1s';
        hint.style.opacity = '0';
      }, 4000);
    },

    /* ── Flip button ── */
    _initFlip: function () {
      var self = this;
      if (!self.box) return;

      var btns = self.box.querySelectorAll('.cv3d-flip-btn, .cv3d-back-btn');
      btns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          self.box.classList.add('cv3d-box-transition');
          self.isFlipped = !self.box.classList.contains('flipped');
          self.box.classList.toggle('flipped');
          setTimeout(function () {
            self.box.classList.remove('cv3d-box-transition');
            if (!self.isFlipped) {
              self.targetTiltX = 0;
              self.targetTiltY = 0;
              self.interpX = 0;
              self.interpY = 0;
            }
          }, 950);
        });
      });
    },

    /* ── Scroll + Resize ── */
    _initScrollResize: function () {
      var self = this;
      window.addEventListener('scroll', function () {
        /* Tilt rAF handles scroll-responsive transforms */
      }, { passive: true });
    }
  };

  /* ── Expose globally ── */
  window.CV3DCard = CV3D;
})();
