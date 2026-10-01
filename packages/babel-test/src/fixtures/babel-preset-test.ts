import { fileURLToPath } from 'node:url'

import type { ConfigAPI } from '@babel/core'

const config = (
  _api: ConfigAPI,
  options: { foobar?: string },
): { plugins: Array<Array<unknown>> } => ({
  plugins: [
    [
      fileURLToPath(new URL('./babel-plugin-test.ts', import.meta.url)),
      { foobar: 'quuxnorf', ...options },
    ],
  ],
})

export default config
