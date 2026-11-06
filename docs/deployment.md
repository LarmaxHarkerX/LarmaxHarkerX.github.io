# Personal site deployment

The public site is https://larmaxharkerx.github.io/.
The repository is https://github.com/LarmaxHarkerX/LarmaxHarkerX.github.io.

Push source changes to `main`. `.github/workflows/deploy.yml` installs the locked
pnpm dependencies, checks Astro, TypeScript and manifests, builds the site and
search index, runs site content and accessibility tests, then deploys only `dist/`
through GitHub Pages. Pull requests run validation without deploying.

GitHub repository Settings > Pages must use **GitHub Actions** as the build source.
No personal access token or third-party API key is required: deployment uses the
temporary `GITHUB_TOKEN` and GitHub's OIDC permission.

## Files in Git

Keep source, content, original fonts, static assets, lockfiles, tests and build
scripts. `docs/theme-examples/` preserves the archived theme documentation.
The theme's `.agents/skills/` and `.vscode/schemas/` are project-maintained inputs
checked by `check:manifest`; they are not private AI session state.

Do not commit `.env`, environment-specific `.env.*` files, credentials, AI session
state, dependencies, caches, generated fonts/icons, build output, reports or local
workspace settings. `.env.example` contains only safe optional configuration.
The workflow regenerates build output, so `dist/` is not pushed to Git.

The upstream theme CI is retained for reference at
`docs/theme-examples/workflows/upstream-ci.yml`. It assumes the theme's demo
articles and fixture data; this personal site uses its own content tests instead.
The original tests are retained unchanged.

Before publishing, validate a clean export of the Git upload index, not merely
the working directory, so an ignored or unstaged required file cannot be hidden by
local caches. Run a redacted secret scan over that export as well.
