/* modern.js — extra interactivity + professional photo. Loaded after script.js */
"use strict";
(function () {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const rm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const PHOTO = "assets/images/profile.jpg";   // <-- put your photo here (jpg/png)

  /* ---- Professional photo (modern morphing frame, 3D tilt, click to preview another) ---- */
  function buildPhoto(slot, chips) {
    let saved = ""; try { saved = localStorage.getItem("photoPreview") || ""; } catch (e) {}
    slot.innerHTML = `<div class="photo-frame" title="Click to preview a different photo"><div class="inner">
        <span class="ph">${SITE.initials}</span><img alt="Portrait of ${SITE.name}" hidden>
        <span class="hint">Click to try your photo</span></div></div>
      ${chips ? `<span class="float-chip c1">💻 Full Stack</span><span class="float-chip c2">☕ Java · Spring Boot</span><span class="float-chip c3">🎓 CSE · 2027</span>` : ""}
      <input type="file" accept="image/*" hidden>`;
    const img = $("img", slot), ph = $(".ph", slot), frame = $(".photo-frame", slot), file = $("input", slot);
    const show = src => { img.src = src; img.onload = () => { img.hidden = false; ph.hidden = true; }; };
    show(saved || PHOTO);                                  // falls back to initials if file is missing
    frame.onclick = () => file.click();
    file.onchange = () => { const f = file.files[0]; if (!f) return;
      const r = new FileReader(); r.onload = () => { show(r.result); try { localStorage.setItem("photoPreview", r.result); } catch (e) {} }; r.readAsDataURL(f); };
    if (!rm) {                                             // parallax tilt
      slot.addEventListener("pointermove", e => { const b = slot.getBoundingClientRect(), x = (e.clientX - b.left) / b.width - .5, y = (e.clientY - b.top) / b.height - .5;
        frame.style.transform = `rotateY(${x * 14}deg) rotateX(${-y * 14}deg)`; });
      slot.addEventListener("pointerleave", () => (frame.style.transform = ""));
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    $$(".photo-slot").forEach(s => buildPhoto(s, s.dataset.chips !== "off"));

    /* ---- cursor glow + spotlight on cards + magnetic buttons ---- */
    if (!rm && matchMedia("(pointer:fine)").matches) {
      const g = document.createElement("div"); g.id = "cursorGlow"; document.body.append(g);
      addEventListener("pointermove", e => { g.style.left = e.clientX + "px"; g.style.top = e.clientY + "px"; });
      document.addEventListener("pointermove", e => {
        const c = e.target.closest(".card"); if (c) { const b = c.getBoundingClientRect(); c.style.setProperty("--mx", e.clientX - b.left + "px"); c.style.setProperty("--my", e.clientY - b.top + "px"); }
        const m = e.target.closest(".btn.primary,.icon-btn,.logo"); if (m) { const b = m.getBoundingClientRect(); m.style.translate = `${(e.clientX - b.left - b.width / 2) * .2}px ${(e.clientY - b.top - b.height / 2) * .3}px`; }
      });
      document.addEventListener("pointerout", e => { const m = e.target.closest(".btn.primary,.icon-btn,.logo"); if (m) m.style.translate = ""; });
    }

    /* ---- Skills page: category tabs + live search ---- */
    const grid = $("#skillGrid");
    if (grid) {
      const bar = document.createElement("div"); bar.className = "filters";
      bar.innerHTML = `<button class="chip active" data-g="all">All</button>` + $$(".group h3", grid).map(h => `<button class="chip" data-g="${h.textContent}">${h.textContent}</button>`).join("") +
        `<input id="skillSearch" type="search" placeholder="Search a skill…" style="padding:.4rem 1rem;border-radius:999px;border:1px solid var(--border);background:var(--surface);color:var(--text);font:inherit">`;
      grid.before(bar);
      const apply = () => { const g = $(".chip.active", bar).dataset.g, q = $("#skillSearch").value.toLowerCase();
        $$(".group", grid).forEach(card => { let any = false;
          $$(".skill", card).forEach(s => { const ok = s.textContent.toLowerCase().includes(q); s.style.display = ok ? "" : "none"; any ||= ok; });
          card.style.display = (g === "all" || $("h3", card).textContent === g) && any ? "" : "none"; }); };
      bar.onclick = e => { const b = e.target.closest(".chip"); if (!b) return; $$(".chip", bar).forEach(c => c.classList.toggle("active", c === b)); apply(); };
      $("#skillSearch").oninput = apply;
    }

    /* ---- Click email to copy + toast ---- */
    const toast = t => { const d = document.createElement("div"); d.className = "toast"; d.textContent = t; document.body.append(d); setTimeout(() => d.remove(), 2200); };
    const ce = $("#contactEmail"); if (ce && SITE.email) { ce.innerHTML = `<button class="chip" id="copyMail">✉ ${SITE.email} — click to copy</button>`;
      $("#copyMail").onclick = () => navigator.clipboard.writeText(SITE.email).then(() => toast("Email copied!")); }
    $$("#heroSocials a[href^='mailto'],#site-footer a[href^='mailto']").forEach(a => a.addEventListener("click", () => toast("Opening your mail app…")));
  });
})();
