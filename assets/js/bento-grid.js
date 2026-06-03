(function () {
  'use strict';

  var colorMap = {
    web:      { key: 'blue',  icon: 'bi-globe',                   label: 'Web App' },
    mobile:   { key: 'green', icon: 'bi-phone',                   label: 'Mobile' },
    backend:  { key: 'amber', icon: 'bi-server',                  label: 'Back-End' },
    desktop:  { key: 'red',   icon: 'bi-laptop',                  label: 'Desktop' },
    frontend: { key: 'teal',  icon: 'bi-layout-text-window-reverse', label: 'Front-End' }
  };

  var techData = [];
  var selectedTechs = [];
  var currentCategory = 'all';

  function getCardSize(priority) {
    if (priority === 1) return { s: 's7', r: 'r2' };
    if (priority <= 3)  return { s: 's5', r: 'r2' };
    if (priority <= 5)  return { s: 's4', r: '' };
    return { s: 's3', r: '' };
  }

  function truncate(str, len) {
    if (!str) return '';
    return str.length > len ? str.slice(0, len) + '…' : str;
  }

  function matchesTech(project, filter) {
    var techs = project.technologies || [];
    for (var i = 0; i < techs.length; i++) {
      for (var j = 0; j < filter.match.length; j++) {
        if (techs[i].toLowerCase().indexOf(filter.match[j].toLowerCase()) !== -1) {
          return true;
        }
      }
    }
    return false;
  }

  function matchesAllTechs(project) {
    if (!selectedTechs.length) return true;
    for (var i = 0; i < selectedTechs.length; i++) {
      var filter = selectedTechs[i];
      if (!matchesTech(project, filter)) return false;
    }
    return true;
  }

  function buildCard(project) {
    var cat       = project.category || 'web';
    var c         = colorMap[cat] || colorMap.web;
    var size      = getCardSize(project.priority || 99);
    var rowCls    = size.r ? ' ' + size.r : '';
    var colorCls  = 'g-' + c.key;
    var cls       = 'card ' + size.s + rowCls + ' ' + colorCls;
    var lang      = localStorage.getItem('portfolio_language') || 'en';
    var title     = lang === 'ar' ? (project.titleAr || project.title) : project.title;
    var desc      = lang === 'ar' ? (project.descriptionAr || project.description) : project.description;
    var techs     = project.technologies || [];
    var features  = lang === 'ar' ? (project.featuresAr || project.features || []) : (project.features || []);
    var techStr   = techs.slice(0, 3).join(' · ');
    var link      = 'project.html?project=' + project.id;
    var label     = c.label;
    var techLabel = lang === 'ar' ? 'التقنيات' : 'Technologies';
    var featLabel = lang === 'ar' ? 'المزايا' : 'Features';
    var viewText  = lang === 'ar' ? 'عرض التفاصيل ←' : 'View Details →';

    var tagsHtml = '';
    techs.slice(0, 8).forEach(function (t) {
      tagsHtml += '<span class="ot ' + c.key + '">' + t + '</span>';
    });

    var featuresHtml = '';
    features.slice(0, 4).forEach(function (f) {
      featuresHtml += '<div class="ov-f">' + f + '</div>';
    });

    return ''
      + '<div class="' + cls + '" data-c="' + cat + '">'
      + '  <div class="card-glow"></div>'
      + '  <div class="card-icon-wrap ' + c.key + '"><i class="bi ' + c.icon + '"></i></div>'
      + '  <div class="card-type">' + label + '</div>'
      + '  <div class="card-body">'
      + '    <div class="card-title">' + title + '</div>'
      + '    <div class="card-meta">' + techStr + '</div>'
      + '  </div>'
      + '  <div class="card-overlay">'
      + '    <div class="ov-title">' + title + '</div>'
      + '    <div class="ov-desc">' + truncate(desc, 300) + '</div>'
      + '    <div class="ov-label">' + techLabel + '</div>'
      + '    <div class="ov-tags">' + tagsHtml + '</div>'
      + (featuresHtml ? '<div class="ov-label">' + featLabel + '</div><div class="ov-f-list">' + featuresHtml + '</div>' : '')
      + '    <a href="' + link + '" class="ov-link">' + viewText + '</a>'
      + '  </div>'
      + '  <div class="card-bar bar-' + c.key + '"></div>'
      + '</div>';
  }

  function renderAll(category) {
    currentCategory = category;
    var grid  = document.getElementById('bento');
    if (!grid) return;

    var projects = window.DataLoader ? DataLoader.getAllProjects() : [];
    if (!projects.length) return;

    var filtered = category === 'all' ? projects : projects.filter(function (p) {
      if (p.category === category) return true;
      if (p.categories && p.categories.indexOf(category) !== -1) return true;
      return false;
    });

    if (selectedTechs.length) {
      filtered = filtered.filter(matchesAllTechs);
    }

    var html = '';
    filtered.forEach(function (p) { html += buildCard(p); });
    grid.innerHTML = html;

    var countEl = document.getElementById('visible-count');
    if (countEl) countEl.textContent = filtered.length;

    animateCards();
  }

  function animateCards() {
    var cards = document.querySelectorAll('.bento-grid .card');
    cards.forEach(function (c, i) {
      c.style.animation = 'none';
      c.offsetHeight;
      c.style.animation = 'cardFadeIn 0.4s ease forwards';
      c.style.animationDelay = (i * 0.04) + 's';
    });
  }

  function renderTechFilters() {
    var container = document.getElementById('techFilters');
    var wrap = document.getElementById('techFiltersWrap');
    if (!container || !techData.length) return;

    var lang = localStorage.getItem('portfolio_language') || 'en';
    var label = lang === 'ar' ? 'التقنيات' : 'Technology';

    var html = '<span class="tf-label">' + label + '</span>';
    techData.forEach(function (t) {
      var active = selectedTechs.indexOf(t) !== -1;
      html += '<button class="tf-btn' + (active ? ' selected' : '') + '" data-tf="' + t.id + '">'
            + '<span class="tf-flag">' + t.flag + '</span> '
            + (lang === 'ar' ? (t.nameAr || t.name) : t.name)
            + '</button>';
    });

    container.innerHTML = html;
    wrap.style.display = '';

    container.querySelectorAll('.tf-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-tf');
        var idx = -1;
        for (var i = 0; i < selectedTechs.length; i++) {
          if (selectedTechs[i].id === id) { idx = i; break; }
        }

        if (idx === -1) {
          var filter = null;
          for (var i = 0; i < techData.length; i++) {
            if (techData[i].id === id) { filter = techData[i]; break; }
          }
          if (filter) selectedTechs.push(filter);
          btn.classList.add('selected');
          animateBtn(btn);
        } else {
          selectedTechs.splice(idx, 1);
          btn.classList.remove('selected');
        }

        renderAll(currentCategory);
      });
    });
  }

  function animateBtn(btn) {
    btn.style.animation = 'none';
    btn.offsetHeight;
    btn.style.animation = 'techPop 0.35s ease forwards';
  }

  function setupFilters() {
    var btns = document.querySelectorAll('.bento-portfolio .fb');
    if (!btns.length) return;

    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        btns.forEach(function (b) { b.classList.remove('on'); });
        btn.classList.add('on');
        renderAll(btn.getAttribute('data-f'));
      });
    });
  }

  document.addEventListener('DOMContentLoaded', async function () {
    if (window.DataLoader) {
      await DataLoader.loadProjectsData();
    }

    try {
      var resp = await fetch('data/tech-filters.json');
      var data = await resp.json();
      techData = data.techFilters || [];
    } catch (e) {
      console.warn('Failed to load tech-filters.json:', e);
    }

    renderAll('all');
    if (techData.length) renderTechFilters();
    setupFilters();
  });

})();
