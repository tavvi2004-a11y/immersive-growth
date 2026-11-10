# Immersive Growth

A personal university for building companies, operating them, and backing them.

- **Learn**: one button decides what is best right now: due reviews, the lesson in progress, or the next lesson in the graph.
- **Theo**: a tutor inspired by Richard Feynman. Hints, never answers.
- **Almanac**: a reflection advisor inspired by the published ideas of Naval Ravikant.

## How it is built

| Path | What it is |
|---|---|
| `content/curriculum.yaml` | The learning graph: curriculums → courses → chapters → lessons, with `requires` and `builds_on` links |
| `content/lessons/*.md` | One file per lesson: puzzle, theory, explain it back, practice, reflection, review cards |
| `site/` | The app (plain HTML, CSS and JavaScript modules, no framework) |
| `site/js/viz/` | Every interactive visual, hand built |
| `scripts/build.mjs` | Builds `dist/` and validates the graph. The build fails if a lesson is disconnected, missing practice, or links to something that doesn't exist |
| `.github/workflows/deploy.yml` | Builds on every push to `main` and deploys to GitHub Pages |

## Privacy

Personal data is encrypted in the browser with a key derived from a 10 word passphrase (PBKDF2, 600,000 rounds, AES-GCM 256). The encrypted vault and progress live on the `vault` branch, so saving never triggers a rebuild. The passphrase is never stored or sent anywhere.

## Run locally

```
npm install
npm run serve
```
