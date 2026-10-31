# AI Engineer OS

A free, personalised roadmap to becoming an AI engineer: what to learn, what to build, and which courses are not worth your time. Static site built with Vite + React. No accounts, no server, no analytics. Everything a visitor does is saved in their own browser (`localStorage`).

## Run

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # outputs to dist/
npm run preview   # serves the production build at http://localhost:4173
```

## Structure

```
index.html          meta, Open Graph / Twitter tags, fonts
public/favicon.svg
src/App.jsx         state, hash routing, settings, effects
src/views/          one file per view (home, assess/result, roadmap, learn, build, progress, about)
src/data/           STAGES, RESOURCES, PROJECTS, VERDICTS, FEATURED, helpers (unchanged from the design)
src/lib/fx.js       scroll and enter animations (Motion + anime.js)
src/aios3d.js       Three.js scene
source/             the original single-file design export, kept for reference
```

Routing is hash based (`#/roadmap`, `#/learn/fastapi`, `#/build/doc-qa` ...), so no rewrite rules are needed on any static host.

localStorage keys: `ai-engineer-os-assessment`, `ai-engineer-os-progress`, `ai-engineer-os-settings`.

## Deploy to GitHub + Vercel

1. Create an empty public repo named `ai-engineer-os` on GitHub, then:
   ```bash
   git remote add origin git@github.com:<your-username>/ai-engineer-os.git
   git push -u origin main
   ```
2. On Vercel: **Add New → Project → import the repo**.
3. Framework Preset **Vite**, Build Command `npm run build`, Output Directory `dist`. Click **Deploy**.

Every push to `main` deploys to production, and every pull request gets a preview URL.
