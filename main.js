/* HUMAN-UKR — site script: editable data, timeline graphic, navigation,
   news and publications. No dependencies. */
(function () {
  'use strict';

  /* ------------------------------------------------------------------
     Editable site data. Leave a string empty ("") to show a
     "to be added" note instead of a broken link.
     ------------------------------------------------------------------ */
  var SITE = {
    contacts: [
      { name: "Henrikas Bartusevicius", role: "Co-PI, PRIO", email: "henrikas@prio.org" },
      { name: "Stefan Döring", role: "Co-PI and project manager, Södertörn University", email: "stefan.doring@sh.se" }
    ],
    links: {
      osf: "",
      github: "",
      funder: "https://ostersjostiftelsen.se/",
      host: "https://www.sh.se/"
    },
    publications: [
      /* { authors: "Surname A, Surname B", year: 2028, title: "Article title", outlet: "Journal", volume: "12(3)", pages: "1–20", url: "https://doi.org/..." } */
    ],
    earlier: [
      { authors: "Laustsen L, Mazepus H, van Leeuwen F, Bartusevičius H, van Vugt M", year: 2026, title: "What traits do citizens value in leaders during war? Experimental and panel-based evidence from Ukraine in 2022", outlet: "Political Science Research and Methods", volume: "14(4)", pages: "1489–1498", url: "https://doi.org/10.1017/psrm.2025.10047" },
      { authors: "Rudolfsen I, Bartusevičius H, van Leeuwen F, Østby G", year: 2024, title: "War and food insecurity in Ukraine", outlet: "World Development", volume: "180", pages: "106647", url: "https://doi.org/10.1016/j.worlddev.2024.106647" },
      { authors: "Bartusevičius H, van Leeuwen F, Mazepus H, Laustsen L, Tollefsen AF", year: 2023, title: "Russia’s attacks on civilians strengthen Ukrainian resistance", outlet: "PNAS Nexus", volume: "2(12)", pages: "pgad386", url: "https://doi.org/10.1093/pnasnexus/pgad386" }
    ],
    news: [
      /* { date: "2026-05-01", title: "Heading", short: "Short heading for the Updates list", text: "One or two sentences.", links: [{ label: "Link text", url: "https://..." }] } */
      {
        date: "2026-09-03",
        title: "Measuring veterans’ reintegration: HUMAN-UKR at a Right to Protection panel",
        short: "Right to Protection panel on measuring veterans’ reintegration",
        text: "Júlia Palik presented the project’s approach to measuring veterans’ social reintegration at the international online discussion “Can Veterans’ Reintegration Be Measured: International Experience”, organised by the Ukrainian charitable foundation Right to Protection.",
        links: [
          { label: "Right to Protection", url: "https://r2p.org.ua/en/" },
          { label: "Organiser’s summary of the event", url: "https://r2p.org.ua/en/page/international-experience-of-veterans-reintegration-key-takeaways" }
        ]
      },
      {
        date: "2026-05-18",
        title: "HUMAN-UKR presented at the Ukraine_Futures workshop in Uppsala",
        short: "HUMAN-UKR at the Ukraine_Futures workshop in Uppsala",
        text: "Henrikas Bartusevicius and Stefan Döring presented the project at the Ukraine_Futures workshop of the Uppsala University Ukraine Hub, held at the Institute for Russian and Eurasian Studies.",
        links: [
          { label: "Uppsala University Ukraine Hub", url: "https://www.uu.se/en/department/russian-and-eurasian-studies/research/the-uppsala-university-ukraine-hub-3uhub" },
          { label: "Workshop page", url: "https://www.uu.se/en/department/russian-and-eurasian-studies/events/archive/2026-05-18-ukraine_futures-workshop" }
        ]
      }
    ]
  };

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return [].slice.call((ctx || document).querySelectorAll(sel)); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[c]; }); }

  /* ------------------------------------------------------------------
     Timeline graphic: survey waves 2027–2031 plus the Feb 2022 baseline.
     ------------------------------------------------------------------ */
  function svgWaves() {
    var x0 = 150, x1 = 615, y = 92;
    var years = ["2027", "2028", "2029", "2030", "2031"];
    var n = years.length, step = (x1 - x0) / n;
    var out = '<svg class="g-waves" viewBox="0 0 640 150" role="img" aria-label="Timeline: survey waves every three to four months between 2027 and 2031, plus a baseline from February 2022">';
    out += '<line class="axis" x1="' + x0 + '" y1="' + y + '" x2="' + x1 + '" y2="' + y + '"/>';
    for (var t = 0; t <= n; t++) {
      var xt = x0 + t * step;
      out += '<line class="axis" x1="' + xt + '" y1="' + (y - 6) + '" x2="' + xt + '" y2="' + (y + 6) + '"/>';
    }
    years.forEach(function (yr, i) {
      out += '<text class="yr" x="' + (x0 + (i + 0.5) * step) + '" y="' + (y + 28) + '" text-anchor="middle">' + yr + '</text>';
    });
    /* Waves alternate three- and four-month gaps across the five years. */
    var month = step / 12, m = 6, k = 0, first = x0 + m * month, last = first;
    while (m <= 59) {
      var xk = x0 + m * month, hgt = 22 + (k % 3) * 6;
      out += '<line class="tick" x1="' + xk.toFixed(1) + '" y1="' + (y - 4) + '" x2="' + xk.toFixed(1) + '" y2="' + (y - hgt) + '"/>';
      last = xk; m += (k % 2 === 0) ? 3 : 4; k++;
    }
    out += '<text class="cap" x="' + ((first + last) / 2).toFixed(1) + '" y="40" text-anchor="middle">Survey waves every three to four months</text>';
    out += '<line class="base" x1="' + (x0 - 40) + '" y1="' + y + '" x2="' + x0 + '" y2="' + y + '"/>';
    out += '<line class="tick2" x1="72" y1="' + (y - 4) + '" x2="72" y2="' + (y - 34) + '"/>';
    out += '<text class="yr" x="72" y="' + (y + 28) + '" text-anchor="middle">Feb 2022</text>';
    out += '<text class="cap" x="72" y="' + (y + 46) + '" text-anchor="middle">pre-war baseline</text>';
    return out + "</svg>";
  }
  $$('[data-graphic="waves"]').forEach(function (slot) { if (!slot.firstChild) slot.innerHTML = svgWaves(); });

  /* ------------------------------------------------------------------
     Navigation: mobile toggle and one scroll-spy for the top nav and
     the sidebar contents list.
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

  var spyLinks = $$('.nav a[href^="#"], .side-toc a[href^="#"]');
  var spyTargets = $$(".section[id]");
  var current = null;
  function paintSpy() {
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
  }

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
  var newsList = $("#news-list"), updates = $("#updates-list");
  var newsSorted = SITE.news.slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; });
  newsSorted.forEach(function (n, k) { n.id = "news-" + n.date + (newsSorted.some(function (m, j) { return j < k && m.date === n.date; }) ? "-" + k : ""); });
  if (SITE.news.length) {
    newsSorted.forEach(function (n) {
      var art = document.createElement("article"); art.className = "news-item"; art.id = n.id;
      var links = (n.links || []).slice();
      if (n.url) links.push({ label: "Read more", url: n.url });
      var more = links.length ? '<p class="news-links">' + links.map(function (l) { return '<a href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(l.label) + "</a>"; }).join("") + "</p>" : "";
      art.innerHTML = '<time datetime="' + esc(n.date) + '">' + esc(fmtDate(n.date)) + "</time><div><h4>" + esc(n.title) + "</h4><p>" + esc(n.text) + "</p>" + more + "</div>";
      newsList.appendChild(art);
    });
  } else { newsList.innerHTML = '<p class="pubs-note">Project news will appear here.</p>'; }
  if (updates) {
    if (newsSorted.length) {
      updates.innerHTML = newsSorted.slice(0, 3).map(function (n) {
        return '<li><time datetime="' + esc(n.date) + '">' + esc(fmtDate(n.date)) + '</time><a href="#' + esc(n.id) + '">' + esc(n.short || n.title) + "</a></li>";
      }).join("");
      if (newsSorted.length > 3) updates.insertAdjacentHTML("afterend", '<p class="updates-more"><a href="#outputs">All updates</a></p>');
    } else { updates.closest(".updates").hidden = true; }
  }

  function cite(p) {
    var title = p.url ? '<a href="' + esc(p.url) + '" target="_blank" rel="noopener">' + esc(p.title) + "</a>" : esc(p.title);
    var src = "<i>" + esc(p.outlet) + "</i>" + (p.volume ? " " + esc(p.volume) : "") + (p.pages ? ": " + esc(p.pages) : "");
    return "<li>" + esc(p.authors) + " (" + esc(p.year) + "). " + title + ". " + src + ".</li>";
  }
  var earlier = $("#earlier-list");
  if (earlier) earlier.innerHTML = (SITE.earlier || []).map(cite).join("");
  var pubs = $("#pubs");
  if (SITE.publications.length) {
    var ol = document.createElement("ol"); ol.className = "cite-list";
    ol.innerHTML = SITE.publications.map(cite).join("");
    pubs.appendChild(ol);
  } else { pubs.innerHTML = '<p class="pubs-note">Publications will be listed here as they appear.</p>'; }

  var people = $("#contact-list"), side = $("#side-contact");
  function mailto(c) { return '<a href="mailto:' + esc(c.email) + '">' + esc(c.email) + "</a>"; }
  if (people && SITE.contacts.length) {
    people.insertAdjacentHTML("afterbegin", SITE.contacts.map(function (c) {
      return "<li><div><b>" + esc(c.name) + "</b>" + esc(c.role) + "<br>" + mailto(c) + "</div></li>";
    }).join(""));
  }
  if (side && SITE.contacts.length) {
    side.innerHTML = SITE.contacts.map(function (c) { return "<b>" + esc(c.name) + "</b><br>" + mailto(c); }).join("<br>");
  }
  $$("[data-link]").forEach(function (li) {
    var url = SITE.links[li.getAttribute("data-link")], slot = $(".lnk", li);
    if (url) slot.innerHTML = '<a href="' + esc(url) + '" target="_blank" rel="noopener">' + esc(url.replace(/^https?:\/\//, "").replace(/\/$/, "")) + "</a>";
    else slot.innerHTML = '<span class="todo">Link to be added</span>';
  });
  var y = $("#year"); if (y) y.textContent = String(new Date().getFullYear());
})();
