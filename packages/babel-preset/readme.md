# @langri-sha/babel-preset

This is a Babel preset suitable for targeting modern browsers and runtimes, with
support for [TypeScript], [Emotion] and [React].

## Usage

Install the preset and its related dependencies:

```sh
npm install -D @babel/core @langri-sha/babel-preset
```

Add a root Babel configuration:

```js
// babel.config.js
module.exports = {
  presets: ['@langri-sha/babel-preset'],
}
```

For usage with [Webpack] and [`babel-loader`]:

```js
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(c|m)?(t|j)sx?$/,
        loader: 'babel-loader',
      },
    ],
  },
}
```

## See

- [Using Babel]

## Contributing

See [CONTRIBUTING.md] in `langri-sha/github`.

[`babel-loader`]: https://www.npmjs.com/package/babel-loader
[contributing.md]:
  https://github.com/langri-sha/github/blob/main/CONTRIBUTING.md
[emotion]: https://emotion.sh/docs/babel
[react]: https://react.dev/learn
[typescript]:
  https://www.typescriptlang.org/docs/handbook/babel-with-typescript.html
[using babel]: https://babeljs.io/setup
[webpack]: https://webpack.js.org/loaders/babel-loader/
