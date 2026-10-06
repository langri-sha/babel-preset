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
`src/` beside `dist/`, as every release from `langri-sha/projen` did.

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

## Provenance

Extracted from `langri-sha/projen` at `6417104d` on 2026-10-01 with
`git filter-repo --path packages/babel-preset/ --path packages/babel-test/ --path packages/babel-helpers/`,
keeping the `packages/` layout. All 192 commits that touched them keep their
trees, authorship, dates and messages. babel-preset's history reaches back to
2021-07-13. babel-test started on 2024-04-14 as `packages/babel-helpers` and was
renamed two days later; `git log --follow` wanders off across that rename, so
ask for the old path by name: `git log -- packages/babel-helpers`. Both started
in `langri-sha/langri-sha.com`, which handed them to projen in August 2026.
Issue and pull request numbers in older messages refer to the two source
repositories.

Up to 0.7.6, babel-test was published as `@langri-sha/babel-test`, which is
deprecated.
