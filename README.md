# Portfolio — PRAWINKUMAR S N 

Multi-page site in plain HTML, CSS and JavaScript. No frameworks, no build step.

## Run it
1. Open the `portfolio` folder in VS Code.
2. Install the **Live Server** extension.
3. Right-click `index.html` → **Open with Live Server**.

## Edit it
- **All personal data** (links, availability badge, stats, roles, projects): `config.js`.
- **Colours**: the `:root` block at the top of `style.css`.
- **Navigation / footer**: written once in `script.js`, shown on every page.
- **Resume**: copy your real PDF into this folder as `resume.pdf`.
- Leave a link as `""` in `config.js` and it is hidden. Never add fake URLs.

## Pages (delivered one by one)
- [x] index.html (home)
- [x] about, skills, projects, experience, education, contact

## Contact form
It validates in the browser, then: (1) posts to `formEndpoint` in `config.js` if set (create a free form at Formspree or Web3Forms and paste its URL), otherwise (2) opens a `mailto:` using your `email`. Nothing is sent until you configure one.

## Fill in later
Experience dates, technologies and responsibilities (Ematix, Novitech, Ediglobe) are `null` in `config.js` until you add real details. Education is in `education.html`.

## Deploy
**GitHub Pages:** push the folder to a repo → Settings → Pages → Deploy from branch `main` / root.
**Vercel:** import the repo, framework preset "Other", no build command, deploy.

## Why page changes are fast
CSS/JS are shared and cached, links are prefetched on hover, the theme is applied before paint, and Chrome/Edge get a smooth cross-page fade (`@view-transition`).

## Home-page features
Typing role text · cursor spotlight · 3D tilt cards · animated counters · skills marquee · scroll progress bar · `Ctrl+K` quick-jump palette · light/dark theme.
