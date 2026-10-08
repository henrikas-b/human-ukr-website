/* HUMAN-UKR — site script: editable data, concept switching, graphics,
   questions presenter, navigation, counters, story steps. No dependencies. */
(function () {
  'use strict';

  /* ------------------------------------------------------------------
     Editable site data. Leave a string empty ("") to show a
     "to be added" note instead of a broken link.
     ------------------------------------------------------------------ */
  var SITE = {
    contactEmail: "",
    links: {
      osf: "",
      linkedin: "",
      funder: "https://ostersjostiftelsen.se/",
      host: "https://www.sh.se/"
    },
    publications: [
      /* { title: "Article title", authors: "Surname A, Surname B", outlet: "Journal", year: 2028, url: "https://doi.org/..." } */
    ],
    news: [
      /* { date: "2026-05-01", title: "Heading", text: "One or two sentences.", url: "" } */
    ]
  };

  var CONCEPTS = {
    feature:     { mode: "list" },
    observatory: { mode: "tabs" },
    poster:      { mode: "accordion" },
    story:       { mode: "chapters" },
    brief:       { mode: "table" }
  };

  var root = document.documentElement;
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return [].slice.call((ctx || document).querySelectorAll(sel)); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[c]; }); }

  /* ------------------------------------------------------------------
     Graphics: rendered once into every slot, themes only toggle them.
     ------------------------------------------------------------------ */
  function svgDots() {
    var cols = 10, rows = 10, cell = 32, pad = 8, r = 9;
    var w = cols * cell + pad * 2, h = rows * cell + pad * 2;
    var out = '<svg class="g-dots" viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="Grid of 100 dots, one per district, each standing for about 50 people">';
    var i = 0;
    for (var y = 0; y < rows; y++) {
      for (var x = 0; x < cols; x++) {
        var cx = pad + x * cell + cell / 2, cy = pad + y * cell + cell / 2;
        var hl = (i === 23 || i === 57 || i === 74) ? " hl" : "";
        out += '<circle class="dot' + hl + '" style="--i:' + i + '" cx="' + cx + '" cy="' + cy + '" r="' + r + '"/>';
        i++;
      }
    }
    return out + "</svg>";
  }

  function svgWaves() {
    var x0 = 150, x1 = 615, y = 92;
    var years = ["2027", "2028", "2029", "2030", "2031"];
    var n = years.length, step = (x1 - x0) / n;
    var out = '<svg class="g-waves" viewBox="0 0 640 150" role="img" aria-label="Timeline: 18 survey waves between 2027 and 2031, plus a baseline from February 2022">';
    out += '<line class="axis" x1="' + x0 + '" y1="' + y + '" x2="' + x1 + '" y2="' + y + '"/>';
    for (var t = 0; t <= n; t++) {
      var xt = x0 + t * step;
      out += '<line class="axis" x1="' + xt + '" y1="' + (y - 6) + '" x2="' + xt + '" y2="' + (y + 6) + '"/>';
    }
    years.forEach(function (yr, i) {
      out += '<text class="yr" x="' + (x0 + (i + 0.5) * step) + '" y="' + (y + 28) + '" text-anchor="middle">' + yr + '</text>';
    });
    var start = x0 + 0.5 * step, end = x0 + 4.92 * step, waves = 18, gap = (end - start) / (waves - 1);
    for (var k = 0; k < waves; k++) {
      var xk = start + k * gap, hgt = 22 + (k % 3) * 6;
      out += '<line class="tick" x1="' + xk.toFixed(1) + '" y1="' + (y - 4) + '" x2="' + xk.toFixed(1) + '" y2="' + (y - hgt) + '"/>';
    }
    out += '<text class="cap" x="' + ((start + end) / 2).toFixed(1) + '" y="40" text-anchor="middle">18 survey waves, one every three months</text>';
    out += '<line class="base" x1="' + (x0 - 40) + '" y1="' + y + '" x2="' + x0 + '" y2="' + y + '"/>';
    out += '<line class="tick2" x1="72" y1="' + (y - 4) + '" x2="72" y2="' + (y - 34) + '"/>';
    out += '<text class="yr" x="72" y="' + (y + 28) + '" text-anchor="middle">Feb 2022</text>';
    out += '<text class="cap" x="72" y="' + (y + 46) + '" text-anchor="middle">pre-war baseline</text>';
    return out + "</svg>";
  }

  function svgLenses() {
    var nodes = [
      { x: 110, label: "Self-reports", icon: '<circle cx="0" cy="-3" r="5"/><path d="M-9 10a9 9 0 0 1 18 0"/>' },
      { x: 320, label: "Geocoded event data", icon: '<path d="M-9 9V-6l5 3 8-6 5 3v15z"/><path d="M-4 -3v12M4 -9v12"/>' },
      { x: 530, label: "Explosion data", icon: '<path d="M-12 2h4l3-8 4 16 3-12 3 8h7"/>' }
    ];
    var out = '<svg class="g-lenses" viewBox="0 0 640 230" role="img" aria-label="Diagram: self-reports, geocoded event data and explosion data are linked to measure exposure to violence">';
    nodes.forEach(function (n) {
      out += '<line class="link" x1="' + n.x + '" y1="96" x2="320" y2="172"/>';
    });
    nodes.forEach(function (n) {
      out += '<circle class="node" cx="' + n.x + '" cy="62" r="34"/>';
      out += '<g class="ic" transform="translate(' + n.x + ' 62)">' + n.icon + '</g>';
      out += '<text class="lbl" x="' + n.x + '" y="120" text-anchor="middle">' + n.label + '</text>';
    });
    out += '<rect class="core" x="220" y="152" width="200" height="40" rx="20"/>';
    out += '<text class="core-t" x="320" y="177" text-anchor="middle">Exposure to violence</text>';
    out += '<text class="cap" x="320" y="216" text-anchor="middle">Three independent measures, linked to each respondent’s location</text>';
    return out + "</svg>";
  }

  function renderGraphics() {
    var makers = { dots: svgDots, waves: svgWaves, lenses: svgLenses };
    $$("[data-graphic]").forEach(function (slot) {
      var maker = makers[slot.getAttribute("data-graphic")];
      if (maker && !slot.firstChild) slot.innerHTML = maker();
    });
  }

  /* ------------------------------------------------------------------
     Questions presenter: one markup, five modes.
     ------------------------------------------------------------------ */
  var explorer = $("#q-explorer");
  var items = $$(".q", explorer).map(function (q) {
    return { root: q, btn: $(".q-btn", q), panel: $(".q-panel", q) };
  });
  var presenter = { mode: null };

  function unmountQuestions() {
    explorer.removeAttribute("role");
    items.forEach(function (it) {
      ["role", "aria-selected", "aria-controls", "aria-expanded", "tabindex", "disabled"].forEach(function (a) { it.btn.removeAttribute(a); });
      ["role", "aria-labelledby", "tabindex"].forEach(function (a) { it.panel.removeAttribute(a); });
      it.panel.hidden = false;
    });
  }

  function openItem(it, open) {
    it.btn.setAttribute("aria-expanded", open ? "true" : "false");
    it.panel.hidden = !open;
  }

  function selectTab(idx, focus) {
    items.forEach(function (it, i) {
      var on = i === idx;
      it.btn.setAttribute("aria-selected", on ? "true" : "false");
      it.btn.setAttribute("tabindex", on ? "0" : "-1");
      it.panel.hidden = !on;
    });
    if (focus) items[idx].btn.focus();
  }

  function mountQuestions(mode) {
    unmountQuestions();
    presenter.mode = mode;
    explorer.setAttribute("data-mode", mode);
    if (mode === "tabs") {
      explorer.setAttribute("role", "tablist");
      explorer.setAttribute("aria-label", "Seven questions");
      items.forEach(function (it) {
        it.btn.setAttribute("role", "tab");
        it.btn.setAttribute("aria-controls", it.panel.id);
        it.panel.setAttribute("role", "tabpanel");
        it.panel.setAttribute("aria-labelledby", it.btn.id);
        it.panel.setAttribute("tabindex", "0");
      });
      selectTab(0, false);
    } else if (mode === "list" || mode === "accordion") {
      items.forEach(function (it, i) {
        it.btn.setAttribute("aria-controls", it.panel.id);
        openItem(it, i === 0);
      });
    } else {
      items.forEach(function (it) { it.btn.setAttribute("disabled", ""); it.panel.hidden = false; });
    }
  }

  items.forEach(function (it, i) {
    it.btn.addEventListener("click", function () {
      if (presenter.mode === "tabs") { selectTab(i, false); return; }
      if (presenter.mode === "list") { openItem(it, it.panel.hidden); return; }
      if (presenter.mode === "accordion") {
        var willOpen = it.panel.hidden;
        items.forEach(function (o) { openItem(o, false); });
        if (willOpen) openItem(it, true);
      }
    });
    it.btn.addEventListener("keydown", function (e) {
      if (presenter.mode !== "tabs") return;
      var n = null;
      if (e.key === "ArrowDown" || e.key === "ArrowRight") n = (i + 1) % items.length;
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") n = (i - 1 + items.length) % items.length;
      if (e.key === "Home") n = 0;
      if (e.key === "End") n = items.length - 1;
      if (n !== null) { e.preventDefault(); selectTab(n, true); }
    });
  });

  /* ------------------------------------------------------------------
     Navigation: mobile toggle and one scroll-spy for nav, rail, dots.
     ------------------------------------------------------------------ */
  var header = $("#site-header");
  var toggle = $(".nav-toggle");
  var navLinks = $$(".nav a");
  function closeNav() { header.classList.remove("nav-open"); toggle.setAttribute("aria-expanded", "false"); }
  toggle.addEventListener("click", function () {
    var open = header.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  navLinks.forEach(function (a) { a.addEventListener("click", closeNav); });
  document.addEventListener("click", function (e) { if (header.classList.contains("nav-open") && !e.target.closest("#site-header")) closeNav(); });

  var spyLinks = $$('.nav a[href^="#"], .rail a[href^="#"], .dots a[href^="#"], .side-toc a[href^="#"]');
  var spyTargets = $$(".section[id]");
  var current = null, footerIn = false;
  var rail = $(".rail");
  function paintSpy() {
    if (rail) rail.classList.toggle("is-off", !current || footerIn);
    spyLinks.forEach(function (a) {
      var on = current && a.getAttribute("href") === "#" + current;
      a.classList.toggle("active", !!on);
      if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
    });
  }
  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) current = en.target.id;
        else if (current === en.target.id) current = null;
      });
      paintSpy();
    }, { rootMargin: "-35% 0px -55% 0px", threshold: 0 });
    spyTargets.forEach(function (s) { spy.observe(s); });
    var footer = $(".site-footer");
    if (footer) {
      new IntersectionObserver(function (entries) {
        footerIn = entries[0].isIntersecting;
        paintSpy();
      }, { threshold: 0 }).observe(footer);
    }
  }

  /* ------------------------------------------------------------------
     Counters on the facts strip (play once).
     ------------------------------------------------------------------ */
  function formatNum(n) { return Math.round(n).toLocaleString("en-US"); }
  function countUp(el) {
    if (el.dataset.played) return;
    el.dataset.played = "1";
    var target = parseFloat(el.getAttribute("data-count")), prefix = el.getAttribute("data-prefix") || "";
    if (reduceMotion || !isFinite(target)) { el.textContent = prefix + formatNum(target); return; }
    var t0 = null, dur = 1200;
    function frame(ts) {
      if (!t0) t0 = ts;
      var p = Math.min(1, (ts - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + formatNum(target * e);
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  var counters = $$(".fact .n[data-count]");
  if ("IntersectionObserver" in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { countUp(en.target); cio.unobserve(en.target); } });
    }, { threshold: 0.4 });
    counters.forEach(function (c) { cio.observe(c); });
  } else { counters.forEach(countUp); }

  /* ------------------------------------------------------------------
     Story steps: active step drives the sticky figure's layer.
     ------------------------------------------------------------------ */
  var figure = $("#how-figure");
  var steps = $$(".step[data-layer]");
  if ("IntersectionObserver" in window && figure) {
    var sio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          steps.forEach(function (s) { s.classList.toggle("is-active", s === en.target); });
          figure.setAttribute("data-active", en.target.getAttribute("data-layer"));
        }
      });
    }, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });
    steps.forEach(function (s) { sio.observe(s); });
  }
  if (steps.length) steps[0].classList.add("is-active");

  /* ------------------------------------------------------------------
     Reveal on scroll.
     ------------------------------------------------------------------ */
  var revealEls = $$(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var rio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); rio.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    revealEls.forEach(function (el) { rio.observe(el); });
  } else { revealEls.forEach(function (el) { el.classList.add("in"); }); }

  /* ------------------------------------------------------------------
     Concept (theme) switcher.
     ------------------------------------------------------------------ */
  var fab = $("#theme-btn"), menu = $("#theme-menu"), opts = $$(".theme-opt", menu);
  var metaTheme = $('meta[name="theme-color"]');

  function setTheme(name, save) {
    if (!CONCEPTS[name]) name = "feature";
    root.setAttribute("data-theme", name);
    $$("[data-show]").forEach(function (el) { el.hidden = el.getAttribute("data-show").split(/\s+/).indexOf(name) < 0; });
    opts.forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-concept") === name ? "true" : "false"); });
    mountQuestions(CONCEPTS[name].mode);
    closeNav();
    paintSpy();
    if (metaTheme) { var c = getComputedStyle(root).getPropertyValue("--ac").trim(); if (c) metaTheme.setAttribute("content", c); }
    if (save) { try { localStorage.setItem("humanukr-theme", name); } catch (e) {} }
  }
  function openMenu(open) {
    menu.hidden = !open;
    fab.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) { (menu.querySelector('[aria-pressed="true"]') || opts[0]).focus(); }
  }
  fab.addEventListener("click", function () { openMenu(menu.hidden); });
  opts.forEach(function (b) {
    b.addEventListener("click", function () { setTheme(b.getAttribute("data-concept"), true); openMenu(false); fab.focus(); });
  });
  document.addEventListener("keydown", function (e) {
    if (menu.hidden) return;
    if (e.key === "Escape") { openMenu(false); fab.focus(); return; }
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      var i = opts.indexOf(document.activeElement);
      opts[e.key === "ArrowDown" ? (i + 1) % opts.length : (i - 1 + opts.length) % opts.length].focus();
    }
  });
  document.addEventListener("click", function (e) { if (!menu.hidden && !e.target.closest("#theme-switch")) openMenu(false); });

  /* ------------------------------------------------------------------
     Data-driven bits: news, publications, contact, links, year.
     ------------------------------------------------------------------ */
  function monthName(m) { return ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][m - 1] || ""; }
  function fmtDate(d) {
    var p = String(d).split("-");
    if (p.length >= 3) return parseInt(p[2], 10) + " " + monthName(parseInt(p[1], 10)) + " " + p[0];
    if (p.length === 2) return monthName(parseInt(p[1], 10)) + " " + p[0];
    return d;
  }
  var newsList = $("#news-list");
  if (SITE.news.length) {
    SITE.news.slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; }).forEach(function (n) {
      var art = document.createElement("article"); art.className = "news-item";
      var more = n.url ? ' <a href="' + esc(n.url) + '" target="_blank" rel="noopener">Read more</a>' : "";
      art.innerHTML = '<time datetime="' + esc(n.date) + '">' + esc(fmtDate(n.date)) + "</time><div><h4>" + esc(n.title) + "</h4><p>" + esc(n.text) + more + "</p></div>";
      newsList.appendChild(art);
    });
  } else { newsList.innerHTML = '<p class="pubs-note">Project news will appear here.</p>'; }

  var pubs = $("#pubs");
  if (SITE.publications.length) {
    var ul = document.createElement("ul"); ul.className = "pub-list";
    SITE.publications.forEach(function (p) {
      var li = document.createElement("li");
      var title = p.url ? '<a href="' + esc(p.url) + '" target="_blank" rel="noopener">' + esc(p.title) + "</a>" : esc(p.title);
      li.innerHTML = "<b>" + title + '</b><span class="m">' + esc([p.authors, p.outlet, p.year].filter(Boolean).join(" · ")) + "</span>";
      ul.appendChild(li);
    });
    pubs.appendChild(ul);
  } else { pubs.innerHTML = '<p class="pubs-note">Publications will be listed here as they appear.</p>'; }

  var em = $("#contact-email"), side = $("#side-contact");
  if (SITE.contactEmail) {
    em.innerHTML = '<a href="mailto:' + esc(SITE.contactEmail) + '">' + esc(SITE.contactEmail) + "</a>";
    if (side) side.innerHTML = '<a href="mailto:' + esc(SITE.contactEmail) + '">' + esc(SITE.contactEmail) + "</a><br>Södertörn University, Department of Sociology, Sweden.";
  } else {
    em.innerHTML = '<span class="todo">Contact email to be announced. Until then, please reach the project via Södertörn University.</span>';
  }
  $$("[data-link]").forEach(function (li) {
    var url = SITE.links[li.getAttribute("data-link")], slot = $(".lnk", li);
    if (url) slot.innerHTML = '<a href="' + esc(url) + '" target="_blank" rel="noopener">' + esc(url.replace(/^https?:\/\//, "").replace(/\/$/, "")) + "</a>";
    else slot.innerHTML = '<span class="todo">Link to be added</span>';
  });
  var y = $("#year"); if (y) y.textContent = String(new Date().getFullYear());

  /* ------------------------------------------------------------------
     Boot.
     ------------------------------------------------------------------ */
  renderGraphics();
  setTheme(root.getAttribute("data-theme") || "feature", false);
  window.__setTheme = function (n) { setTheme(n, false); };
})();
