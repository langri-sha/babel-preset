# Agents orientation — `langri-sha/babel-preset`

A pnpm workspace for the shared Babel preset. `packages/babel-preset` publishes
`@langri-sha/babel-preset`; `packages/babel-test` is a private package of the
helpers its tests run on.

## Who owns which file

Projen writes every `package.json` and every file listed in a
`.projen/files.json`, at the root and in each package; they are read-only.
Change them in `.projenrc.ts`, then run `pnpm exec projen`. Beachball owns
`CHANGELOG.md`, `CHANGELOG.json` and the `version` field of each package.
Everything else — `packages/*/src/`, the readmes, `.github/workflows/`, this
file — is edited by hand. Repository settings, branch protection and the Actions
secrets are managed by `langri-sha/github-repos`.

## Common tasks

```sh
pnpm install
pnpm exec projen                        # re-synthesize from .projenrc.ts
pnpm vitest                             # tests
pnpm tsc --build .                      # typecheck
pnpm eslint . && pnpm prettier --check .
pnpm change                             # write a change file
```

## Release

Beachball versions `@langri-sha/babel-preset`. Anything that reaches its tarball
or builds it — `packages/babel-preset/src/`, its readme, `package.json` and
`tsconfig.build.json` — needs a change file in the same pull request: run
`pnpm change`. Use `none` for edits that shouldn't cut a release on their own,
such as readme-only changes. babel-test and the workspace root are private, so
beachball skips them and they never need one. On Renovate pull requests that
touch babel-preset, CI writes a `patch` change file itself.

Nothing publishes on merge. Run the Release workflow (`publish.yml`) from the
Actions tab to publish the pending change files through npm trusted publishing.
It tags the version `v<version>` and creates a GitHub release with generated
notes; a tag that already has a release is skipped, so the workflow is safe to
rerun. Only babel-preset publishes, so its version alone names the tag; the
workflow skips private packages. Beachball's own `gitTags` stays off, since it
would name the tags `@langri-sha/babel-preset_v<version>`.

`main` points at `src/index.js` in the repository, and `publishConfig` swaps
`main` and `types` for `dist/`, which `prepublishOnly` builds. The tarball ships
`src/` beside `dist/`, which the declaration maps point into.

## Dependencies

`@babel/core` is a peer of both packages, so the preset runs on its consumer's
Babel. Both also take it as a devDependency at the current release, so the tests
run against newer releases as Renovate moves it. `monorepo-resolve` is ours but
unscoped, so it is named beside `@langri-sha/*` in the release-age exemptions
and the Renovate group.

## Tests

Vitest runs `packages/babel-test`'s own tests and the preset snapshot test in
`packages/babel-preset/src/index.test.ts`, which loads the preset's plugins
through `loadPresetPlugins`. Its snapshots live in
`packages/babel-preset/src/__snapshots__/`.
