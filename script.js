/* ==========================================================
   script.js — shared by every page.
   Sections: 1 helpers · 2 theme · 3 header/footer · 4 palette
   5 reveal · 6 prefetch · 7 home features
   ========================================================== */
"use strict";
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- 2. Theme (saved in localStorage) ---------- */
function applyTheme(t) {
  document.documentElement.dataset.theme = t;
  try { localStorage.setItem("theme", t); } catch (e) {}
}
function toggleTheme() {
  applyTheme(document.documentElement.dataset.theme === "light" ? "dark" : "light");
}

/* ---------- 3. Header + footer (written once, shown on all pages) ---------- */
const icons = {
  github: '<i class="fa-brands fa-github"></i>',
  linkedin: '<i class="fa-brands fa-linkedin-in"></i>',
  mail: '<i class="fa-solid fa-envelope"></i>'
}; // simple text icons — swap for SVGs in assets/icons if you like
function socialLinks() {
  const items = [["github", SITE.github, "GitHub"], ["linkedin", SITE.linkedin, "LinkedIn"],
                 ["mail", SITE.email && "mailto:" + SITE.email, "Email"]];
  return items.filter(i => i[1]).map(([k, url, label]) =>
    `<a class="icon-btn" href="${url}" aria-label="${label}" ${k !== "mail" ? 'target="_blank" rel="noopener noreferrer"' : ""}>
       <span class="social-icon" aria-hidden="true">${icons[k]}</span></a>`).join("");
}
function renderHeader() {
  const here = location.pathname.split("/").pop() || "index.html";
  const links = SITE.pages.map(p =>
    `<a href="${p.href}" ${p.href === here ? 'aria-current="page"' : ""}>${p.label}</a>`).join("");
  $("#site-header").innerHTML = `
    <div class="progress" id="progress"></div>
    <nav class="nav container" aria-label="Main">
      <a class="logo" href="index.html" aria-label="${SITE.name} home">${SITE.initials}</a>
      <div class="nav-links" id="navLinks">${links}</div>
      <div class="nav-tools">
        <button class="icon-btn kbd-btn" id="openPalette" aria-label="Open quick search">Search</button>
        <button class="icon-btn" id="themeBtn" aria-label="Toggle light and dark theme">◐</button>
        <button class="icon-btn burger" id="burger" aria-label="Open menu" aria-expanded="false" aria-controls="navLinks">☰</button>
      </div>
    </nav>`;
  $("#themeBtn").onclick = toggleTheme;
  const burger = $("#burger"), menu = $("#navLinks");
  burger.onclick = () => burger.setAttribute("aria-expanded", menu.classList.toggle("open"));
  menu.onclick = e => { if (e.target.tagName === "A") { menu.classList.remove("open"); burger.setAttribute("aria-expanded", false); } };
  // thin scroll-progress bar
  addEventListener("scroll", () => {
    const h = document.documentElement;
    $("#progress").style.transform = `scaleX(${h.scrollTop / (h.scrollHeight - h.clientHeight || 1)})`;
  }, { passive: true });
}
function renderFooter() {
  $("#site-footer").innerHTML = `
    <div class="container foot">
      <p>© ${new Date().getFullYear()} ${SITE.name}</p>
      <div class="socials">${socialLinks()}</div>
      <button class="btn ghost" id="toTop">Back to top</button>
    </div>`;
  $("#toTop").onclick = () => scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
}

/* ---------- 4. Command palette (Ctrl/Cmd + K) ---------- */
function setupPalette() {
  const dlg = document.createElement("dialog");
  dlg.className = "palette";
  dlg.innerHTML = `<input id="pq" type="search" placeholder="Jump to a page…" aria-label="Search pages" autocomplete="off"><ul id="pl"></ul>`;
  document.body.append(dlg);
  const input = $("#pq", dlg), list = $("#pl", dlg);
  const acts = [...SITE.pages.map(p => ({ t: "Go to " + p.label, run: () => (location.href = p.href) })),
                { t: "Toggle theme", run: toggleTheme }];
  let sel = 0, shown = acts;
  const draw = () => { list.innerHTML = shown.map((a, i) => `<li role="option" class="${i === sel ? "sel" : ""}" data-i="${i}">${a.t}</li>`).join(""); };
  const open = () => { dlg.showModal(); input.value = ""; shown = acts; sel = 0; draw(); input.focus(); };
  const go = i => { dlg.close(); shown[i] && shown[i].run(); };
  input.oninput = () => { shown = acts.filter(a => a.t.toLowerCase().includes(input.value.toLowerCase())); sel = 0; draw(); };
  input.onkeydown = e => {
    if (e.key === "ArrowDown") sel = Math.min(sel + 1, shown.length - 1);
    else if (e.key === "ArrowUp") sel = Math.max(sel - 1, 0);
    else if (e.key === "Enter") return go(sel);
    else return;
    e.preventDefault(); draw();
  };
  list.onclick = e => e.target.dataset.i && go(+e.target.dataset.i);
  dlg.onclick = e => { if (e.target === dlg) dlg.close(); };       // click backdrop to close
  $("#openPalette").onclick = open;
  addEventListener("keydown", e => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); open(); } });
}

/* ---------- 5. Reveal on scroll ---------- */
function setupReveal() {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { threshold: 0.15 });
  $$(".reveal").forEach(el => io.observe(el));
}

/* ---------- 6. Fast navigation: prefetch a page when hovered/touched ---------- */
function setupPrefetch() {
  const done = new Set();
  const pre = e => {
    const a = e.target.closest("a[href$='.html']");
    if (!a || done.has(a.href)) return;
    done.add(a.href);
    const l = document.createElement("link"); l.rel = "prefetch"; l.href = a.href; document.head.append(l);
  };
  document.addEventListener("mouseover", pre); document.addEventListener("touchstart", pre, { passive: true });
}

/* ---------- 7. Home-page features ---------- */
function typeRoles(el) {                       // typing / deleting loop
  let r = 0, c = 0, del = false;
  if (reduceMotion) { el.textContent = SITE.roles[0]; return; }
  (function tick() {
    const word = SITE.roles[r];
    c += del ? -1 : 1;
    el.textContent = word.slice(0, c);
    let wait = del ? 40 : 85;
    if (!del && c === word.length) { del = true; wait = 1400; }
    else if (del && c === 0) { del = false; r = (r + 1) % SITE.roles.length; wait = 300; }
    setTimeout(tick, wait);
  })();
}
function countUp(el) {                         // animated counters
  const end = +el.dataset.to, t0 = performance.now(), dur = 1200;
  const step = t => { const p = Math.min((t - t0) / dur, 1); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); };
  reduceMotion ? (el.textContent = end) : requestAnimationFrame(step);
}
function tilt(card) {                          // 3D tilt following the mouse
  if (reduceMotion) return;
  card.addEventListener("pointermove", e => {
    const b = card.getBoundingClientRect(), x = (e.clientX - b.left) / b.width - .5, y = (e.clientY - b.top) / b.height - .5;
    card.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
  });
  card.addEventListener("pointerleave", () => (card.style.transform = ""));
}
function initHome() {
  typeRoles($("#roleText"));
  // availability badge, social links, resume link
  $("#availability").hidden = !SITE.available; $("#availText").textContent = SITE.availabilityText;
  $("#heroSocials").innerHTML = socialLinks() || '<span class="muted">Add your links in config.js</span>';
  $("#resumeBtn").href = SITE.resume;
  // stats
  $("#stats").innerHTML = SITE.stats.map(s => `<div class="stat"><strong data-to="${s.value}">0</strong><span>${s.label}</span></div>`).join("");
  new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting) { $$("strong", e.target).forEach(countUp); o.disconnect(); } })).observe($("#stats"));
  // skills marquee (list repeated twice for a seamless loop)
  const chips = SITE.marquee.map(m => `<span class="chip">${m}</span>`).join("");
  $("#marquee").innerHTML = `<div class="track">${chips}${chips}</div>`;
  // featured projects
  $("#featured").innerHTML = SITE.projects.map(p => `
    <article class="card reveal tilt">
      <h3>${p.title}</h3><p>${p.summary}</p>
      <div class="tags">${p.tech.slice(0, 4).map(t => `<span class="chip sm">${t}</span>`).join("")}</div>
      <a class="link" href="projects.html">View details</a>
    </article>`).join("");
  $$(".tilt").forEach(tilt);
  // cursor spotlight behind the hero
  const hero = $(".hero");
  if (!reduceMotion) hero.addEventListener("pointermove", e => {
    const b = hero.getBoundingClientRect();
    hero.style.setProperty("--mx", e.clientX - b.left + "px"); hero.style.setProperty("--my", e.clientY - b.top + "px");
  });
  // code card: parallax tilt
  const code = $("#codeCard"); if (code) tilt(code);
}

/* ---------- Boot ---------- */
document.addEventListener("DOMContentLoaded", () => {
  renderHeader(); renderFooter(); setupPalette(); setupPrefetch();
  if ($("#roleText")) initHome();
  setupReveal();
});

/* ==========================================================
   8. Inner pages — chosen by <body data-page="...">
   ========================================================== */
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const todo = (v, hint) => v ? esc(v) : `<span class="todo">Add ${hint} in config.js</span>`;

const pages = {
  about() { // reuse the stats renderer
    $("#stats").innerHTML = SITE.stats.map(s => `<div class="stat"><strong>${s.value}</strong><span>${esc(s.label)}</span></div>`).join("");
  },
  skills() {
    $("#skillGrid").innerHTML = Object.entries(SITE.skills).map(([g, list]) => `
      <article class="card group reveal"><h3>${g}</h3><div class="skill-row">
        ${list.map(n => `<span class="skill"><span class="ico">${esc(n.slice(0, 2))}</span>${esc(n)}</span>`).join("")}
      </div></article>`).join("");
  },
  projects() {
    const grid = $("#projectGrid"), modal = $("#modal");
    const draw = f => {
      const list = SITE.projects.filter(p => f === "all" || p.category === f);
      $("#emptyMsg").hidden = list.length > 0;
      grid.innerHTML = list.map(p => `
        <article class="card tilt">
          <h3>${esc(p.title)}</h3><p>${esc(p.summary)}</p>
          <div class="tags">${p.tech.map(t => `<span class="chip sm">${esc(t)}</span>`).join("")}</div>
          <button class="btn" data-open="${SITE.projects.indexOf(p)}">View details</button>
        </article>`).join("");
      $$(".tilt", grid).forEach(tilt);
    };
    draw("all");
    $("#filters").onclick = e => {
      const b = e.target.closest("[data-f]"); if (!b) return;
      $$("#filters .chip").forEach(c => c.classList.toggle("active", c === b)); draw(b.dataset.f);
    };
    let opener = null;                                   // remember focus so we can restore it
    grid.onclick = e => {
      const b = e.target.closest("[data-open]"); if (!b) return;
      const p = SITE.projects[+b.dataset.open]; opener = b;
      $("#mTitle").textContent = p.title; $("#mOverview").textContent = p.summary;
      $("#mFeatures").innerHTML = (p.features || []).map(f => `<li>${esc(f)}</li>`).join("");
      $("#mTech").innerHTML = p.tech.map(t => `<span class="chip sm">${esc(t)}</span>`).join("");
      $("#mLinks").innerHTML = (p.github ? `<a class="btn" href="${p.github}" target="_blank" rel="noopener noreferrer">GitHub</a>` : "")
        + (p.demo ? `<a class="btn primary" href="${p.demo}" target="_blank" rel="noopener noreferrer">Live Demo</a>` : "")
        || '<span class="muted">Add GitHub / demo links in config.js when ready.</span>';
      modal.showModal();                                 // <dialog> gives focus trap + Esc for free
    };
    $("#mClose").onclick = () => modal.close();
    modal.onclick = e => { if (e.target === modal) modal.close(); };
    modal.onclose = () => opener && opener.focus();
  },
  experience() {
    $("#timeline").innerHTML = SITE.experience.map(x => `
      <li class="reveal"><article class="card static">
        <h3>${todo(x.role, "position")}</h3><p><strong>${esc(x.company)}</strong> · ${todo(x.duration, "duration")}</p>
        ${x.points ? `<ul>${x.points.map(p => `<li>${esc(p)}</li>`).join("")}</ul>` : ""}
      </article></li>`).join("");
  },
  contact() {
    $("#contactSocials").innerHTML = socialLinks() || '<span class="muted">Add your links in config.js</span>';
    $("#resumeBtn").href = SITE.resume;
    const form = $("#contactForm"), status = $("#formStatus");
    const rules = [["#cName", "#eName", v => v.trim().length >= 2 || "Enter your name."],
                   ["#cEmail", "#eEmail", v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Enter a valid email address."],
                   ["#cPhoneNo", "#ePhoneNo", v => /^\+?\d{7,15}$/.test(v) || "Enter a valid phone number."],
                   ["#cMsg", "#eMsg", v => v.trim().length >= 10 || "Write at least 10 characters."]];
    const check = () => rules.map(([i, e, fn]) => { // show an error under each invalid field
      const input = $(i), r = fn(input.value);
      $(e).textContent = r === true ? "" : r; input.setAttribute("aria-invalid", r !== true); return r === true;
    }).every(Boolean);
    form.onsubmit = async ev => {
      ev.preventDefault(); status.textContent = "";
      if (!check()) return;
      const data = { name: $("#cName").value, email: $("#cEmail").value, message: $("#cMsg").value };
      if (SITE.formEndpoint) {                           // real delivery through a form service
        try {
          const r = await fetch(SITE.formEndpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(data) });
          if (!r.ok) throw 0; form.reset(); status.textContent = "Message sent. Thank you!";
        } catch { status.textContent = "Could not send. Please email me directly instead."; }
      } else if (SITE.email) {                           // mailto fallback
        location.href = `mailto:${SITE.email}?subject=${encodeURIComponent("Portfolio message from " + data.name)}&body=${encodeURIComponent(data.message + "\n\n" + data.email)}`;
        status.textContent = "Opening your email app…";
      } else status.textContent = "Add your email or a form endpoint in config.js to enable sending.";
    };
    form.oninput = () => $$(".err", form).forEach(e => e.textContent && check());
  }
};
document.addEventListener("DOMContentLoaded", () => {
  const p = pages[document.body.dataset.page]; if (p) p();
  $$(".reveal").forEach(el => el.classList.add("in")); // inner-page content is rendered after the first observer, so reveal now
  $$(".tilt").forEach(tilt);
});
