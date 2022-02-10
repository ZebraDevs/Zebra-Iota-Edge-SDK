# Zebra IOTA Edge SDK Common Library

A base for building shareable Svelte components. Clone it with [degit](https://github.com/Rich-Harris/degit):

## Consuming components

`package.json` has a `"svelte"` field pointing to `src/index.ts`, which allows Svelte apps to import the source code directly, if they are using a bundler plugin like [rollup-plugin-svelte](https://github.com/sveltejs/rollup-plugin-svelte) or [svelte-loader](https://github.com/sveltejs/svelte-loader) (where [`resolve.mainFields`](https://webpack.js.org/configuration/resolve/#resolve-mainfields) in your webpack config includes `"svelte"`). **This is recommended.**

`npm run build` will bundle the source code into a plain JavaScript module (`dist/index.mjs`) and a UMD script (`dist/index.js`). This will happen automatically when you publish your component to npm, courtesy of the `prepublishOnly` hook in package.json.
