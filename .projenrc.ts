import * as path from 'node:path'
import { fileURLToPath } from 'node:url'

import { Project, TypeScriptConfig } from '@langri-sha/projen-project'

const pkg = {
  authorEmail: 'filip.dupanovic@gmail.com',
  authorName: 'Filip Dupanović',
  authorOrganization: false,
  authorUrl: 'https://langri-sha.com',
  bugsUrl: 'https://github.com/langri-sha/babel-preset/issues',
  license: 'MIT',
  licensed: true,
  peerDependencyOptions: {
    pinnedDevDependency: false,
  },
}

const project = new Project({
  name: 'babel-preset',
  package: {
    ...pkg,
    copyrightYear: '2021',
    homepage: 'https://github.com/langri-sha/babel-preset',
    minNodeVersion: '24.16.0',
    repository: 'langri-sha/babel-preset',
    type: 'module',

    devDeps: [
      '@langri-sha/eslint-config@0.10.0',
      '@langri-sha/lint-staged@0.9.11',
      '@langri-sha/prettier@0.4.11',
      '@langri-sha/projen-project@*',
      '@langri-sha/tsconfig@1.1.1',
      '@types/node@24.19.2',
      'vitest@5.0.5',
    ],
  },
  beachball: {
    config: {
      ignorePatterns: ['.gitignore', 'tsconfig.json', '**/.projen/**'],
    },
  },
  claude: {
    settings: {
      attribution: { commit: '', pr: '', sessionUrl: false },
    },
  },
  codeowners: {
    '*': '@langri-sha',
  },
  dagger: {},
  editorConfig: {},
  eslint: {},
  husky: {
    'pre-commit': 'lint-staged',
  },
  lintStaged: {},
  lintSynthesized: {},
  prettier: {},
  pnpmWorkspace: {
    packages: ['packages/*'],
    minimumReleaseAgeExclude: [
      '@langri-sha/*',
      'monorepo-resolve',
      ...Project.presetPackages,
    ],
  },
  readme: {
    filename: 'readme.md',
  },
  renovate: {
    extends: ['github>langri-sha/renovate-config'],
    packageRules: [
      {
        description:
          'Update monorepo-resolve with our own packages and install it without waiting it out',
        groupName: 'langri-sha projen toolchain',
        groupSlug: 'langri-sha-projen',
        matchPackageNames: ['monorepo-resolve'],
        minimumReleaseAge: null,
      },
    ],
  },
  typeScriptConfig: {},
  worktrunk: {},
})

project.package?.addField('private', true)
project.package?.addField('packageManager', 'pnpm@12.14.0')

const subproject = (project: Project) => {
  project.package?.addField('repository', {
    type: 'git',
    url: 'git+https://github.com/langri-sha/babel-preset.git',
    directory: path.relative(
      path.dirname(fileURLToPath(import.meta.url)),
      project.outdir,
    ),
  })
}

const test = (project: Project) => {
  project.npmIgnore?.exclude('*.test.*', '__snapshots__/')
  project.package?.addDevDeps('@langri-sha/vitest@0.2.3')
}

const publish = (project: Project) => {
  project.package?.addField('publishConfig', {
    access: 'public',
    main: 'dist/index.js',
    types: 'dist/index.d.ts',
  })

  new TypeScriptConfig(project, {
    fileName: 'tsconfig.build.json',
    config: {
      extends: '@langri-sha/tsconfig/build',
      exclude: ['**/*.test.*'],
    },
  })

  project.package?.setScript(
    'prepublishOnly',
    'rm -rf dist; tsc --project tsconfig.build.json',
  )
}

project.addSubproject(
  {
    name: '@langri-sha/babel-preset',
    outdir: path.join('packages', 'babel-preset'),
    npmIgnore: {},
    readme: {
      filename: 'readme.md',
    },
    typeScriptConfig: {},
    package: {
      ...pkg,
      copyrightYear: '2021',
      description:
        'Babel preset for modern browsers and runtimes, with support for TypeScript, Emotion and React.',
      entrypoint: 'src/index.js',
      deps: [
        '@babel/plugin-proposal-export-default-from@8.0.1',
        '@babel/preset-env@8.0.7',
        '@babel/preset-react@8.0.1',
        '@babel/preset-typescript@8.0.7',
        '@babel/register@8.0.6',
        '@emotion/babel-plugin@11.13.5',
      ],
      devDeps: [
        '@babel/core@8.0.7',
        '@langri-sha/babel-test@workspace:*',
        '@langri-sha/tsconfig@1.1.1',
        '@types/node@24.19.2',
      ],
      peerDeps: ['@babel/core@^8.0.0'],
    },
  },
  subproject,
  test,
  publish,
)

project.addSubproject(
  {
    name: '@langri-sha/babel-test',
    outdir: path.join('packages', 'babel-test'),
    readme: {
      filename: 'readme.md',
    },
    typeScriptConfig: {},
    package: {
      ...pkg,
      copyrightYear: '2024',
      type: 'module',
      deps: ['monorepo-resolve@1.0.1', 'ramda@0.32.0'],
      devDeps: [
        '@babel/core@8.0.7',
        '@langri-sha/tsconfig@1.1.1',
        '@types/node@24.19.2',
        '@types/ramda@0.32.0',
      ],
      peerDeps: ['@babel/core@^8.0.0'],
    },
  },
  subproject,
  test,
  (project) => project.package?.addField('private', true),
)

project.synth()
