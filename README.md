# jojishiotsuki.com

Source for my portfolio at [jojishiotsuki.com](https://jojishiotsuki.com). A single-page React app
with a small Cloudflare Worker in front of the chat assistant, deployed over FTP by GitHub Actions.

## Stack

| Layer | What it uses |
|---|---|
| UI | React 19, TypeScript, React Router 7 |
| Build | Vite 6 |
| Styling | `app.css` plus co-located style objects, with a light/dark theme in `theme.ts` |
| Chat proxy | Cloudflare Worker (`worker/`) that holds the API key server-side |
| Deploy | GitHub Actions to FTP (`.github/workflows/deploy.yml`) |

## Running it

```bash
npm install
npm run dev        # vite dev server
npm run build      # type-checked production build into dist/
npm run preview    # serve the built output
```

No environment variables are needed for the site itself. The chat assistant calls the
deployed Worker, so it works in dev without any local key.

## Layout

```
App.tsx              routes and page shell
constants.tsx        all site copy, projects and work history in one place
theme.ts             light and dark colour tokens
components/          one file per section (Hero, Results, ProjectsPreview, About, Contact, Footer)
components/ui/       shared primitives
hooks/               useMode, which picks the copy set for the current route
worker/              Cloudflare Worker proxying the chat assistant
```

Content lives in `constants.tsx`, not in the components. Adding a project means adding one
object to `PROJECTS`; it is sorted newest-first by its `date` field, and the homepage shows
the first two.

## Deploying

Pushing to `main` runs the workflow, which type-checks, builds, and uploads `dist/` over FTP.
The Worker deploys separately with `wrangler`.
