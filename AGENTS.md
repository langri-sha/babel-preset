# Agents orientation — `langri-sha/babel-preset`

A pnpm workspace for the shared Babel preset. `packages/babel-preset` publishes
`@langri-sha/babel-preset`; `packages/babel-test` is a private package of the
helpers its tests run on.

## Who owns which file

| Owner                                   | Files                                                                                                                                                                                                                                           |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Projen (`.projenrc.ts` → `pnpm projen`) | every `package.json`, `.projen/`, `tsconfig*.json`, `pnpm-workspace.yaml`, `renovate.json5`, `beachball.config.cjs`, the ESLint, Prettier and lint-staged configs, `.husky/`, the ignore and attribute files, `CODEOWNERS`, the `license` files |
| Beachball                               | `CHANGELOG.md`, `CHANGELOG.json` and the `version` field of each package                                                                                                                                                                        |
| You                                     | `packages/*/src/**`, the readmes, `.github/workflows/`, this file                                                                                                                                                                               |

Synthesized files are read-only; change them in `.projenrc.ts`. Repository
settings, branch protection and the Actions secrets are managed by
`langri-sha/github-repos`.

## Common tasks

```sh
pnpm install
pnpm projen                             # re-synthesize from .projenrc.ts
pnpm vitest                             # tests
pnpm tsc --build .                      # typecheck
pnpm eslint . && pnpm prettier --check .
pnpm change                             # write a change file
```

## Release

Beachball versions `@langri-sha/babel-preset` and the Release workflow publishes
it through npm trusted publishing. Anything that reaches its tarball or builds
it — `packages/babel-preset/src/`, its readme, `package.json` and
`tsconfig.build.json` — needs a change file in the same pull request. babel-test
is private, so beachball skips it and it never needs one.

The Release workflow calls the shared Packages workflow with
`tag-template: v{version}`, which tags each published version, e.g. `v0.6.8`,
and `github-releases: true`, which creates a GitHub release with generated notes
for it. Only babel-preset publishes, so its version alone names the tag; the
workflow skips private packages. Beachball's own `gitTags` stays off, since it
would name the tags `@langri-sha/babel-preset_v0.6.8`.

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
