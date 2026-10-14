# @langri-sha/babel-test

Provides convenience helpers for inspecting and testing your [Babel] preset.

## Features

- load Babel presets with options, and produce a serializable, cross-platform
  output of all the loaded plugins and their settings

## Usage

It is private to this workspace, where `@langri-sha/babel-preset` takes it as
`workspace:*`.

Given a preset that configures a single plugin:

```js
// babel-preset-test.js
export default (api, options) => ({
  plugins: [['./babel-plugin-test.js', { foobar: 'quuxnorf', ...options }]],
})
```

Load its plugins:

```js
// Load preset plugins.
await loadPresetPlugins(
  // Set Babel API environment.
  'development',
  [
    // Preset to load.
    './babel-preset-test.js',
    // Configure related preset options.
    { test: 'TEST_OPTIONS' },
  ],
)

/*
[
  [
    "<WORKSPACE>/babel-plugin-test.js",
    {
      "foobar": "quuxnorf",
      "test": "TEST_OPTIONS",
    },
  ],
]
*/
```

[babel]: https://babeljs.io/docs/config-files
