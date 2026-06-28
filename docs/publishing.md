# Publishing

The package publishes to npm as `@deva-me/login-with-deva` via a tag-triggered GitHub Actions workflow. No manual `npm publish` is needed after npm trusted publishing is configured for this repository.

## Authentication

Publishing uses **OIDC (OpenID Connect) trusted publishing** — the npm registry trusts the GitHub Actions workflow identity directly. There is no `NPM_TOKEN` secret configured. The workflow has `id-token: write` permission to enable this.

Before the first real publish under the new package name, configure npm trusted publishing for:

- Package: `@deva-me/login-with-deva`
- Repository: `Deva-me-AI/login-with-deva`
- Workflow: `.github/workflows/publish.yml`

## Release Workflow

### 1. Ensure clean state

```bash
pnpm run typecheck
pnpm run test
pnpm run build
git status  # must be clean
```

### 2. Dry-run first

Always preview the version bump before committing to it:

```bash
./scripts/tag-release patch --dry-run
```

Example output:
```
Current version: 0.9.1
New version: 0.9.2
[DRY RUN] Would update package.json to version 0.9.2
[DRY RUN] Would commit: chore(package): bump version to 0.9.2
[DRY RUN] Would create tag v0.9.2
[DRY RUN] Would push tag v0.9.2 to remote
```

Version types:
- `patch` — bug fixes, small changes (`0.9.1` → `0.9.2`)
- `minor` — new exports, new components, non-breaking additions (`0.9.1` → `0.10.0`)
- `major` — breaking API changes (`0.9.1` → `1.0.0`)

### 3. Release

```bash
./scripts/tag-release patch
```

This does everything in one step:
1. Updates `package.json` version field
2. `git add package.json && git commit -m "chore(package): bump version to 0.9.2"`
3. `git push` — pushes the commit to main
4. `git tag v0.9.2`
5. `git push origin v0.9.2` — triggers the publish workflow

### 4. What the workflow does

`.github/workflows/publish.yml` runs on tag push `v*`:

1. **CI** — typecheck, tests, build (publish is blocked if any fail)
2. **Publish** — `pnpm publish --access public`

The workflow is at `.github/workflows/publish.yml`. CI is at `.github/workflows/ci.yml`.

### 5. Verify

```bash
# Allow 2–3 minutes for npm CDN propagation
npm info @deva-me/login-with-deva version
```

## Manual Trigger (Dry-Run Preview)

To validate what would be published without actually publishing:

1. Go to **GitHub → Actions → Publish to NPM → Run workflow**
2. Leave `dry-run` checked (default is `true`)
3. This runs the full CI + build and calls `pnpm publish --dry-run`

To do a real manual publish (e.g., to republish a failed tag), uncheck `dry-run`.

## Package Contents

The `files` field in `package.json` controls what's included:

```
dist/index.es.js       dist/index.d.ts
dist/components.es.js  dist/components.d.ts
dist/assets/login-with-deva.css
README.md
```

Source files, tests, the example app, and dev config are excluded.

## Common Issues

| Problem | Fix |
|---------|-----|
| `tag-release` warns about uncommitted changes | `git stash` or commit before running |
| Tag already exists | Delete locally: `git tag -d v0.9.2`; delete remotely: `git push origin :v0.9.2` |
| npm publish 404 in workflow | Verify workflow uses `node-version: 24` (npm 11 required for OIDC) |
| New version not visible on npm | Wait 2–3 min for CDN; run `npm info @deva-me/login-with-deva` |
