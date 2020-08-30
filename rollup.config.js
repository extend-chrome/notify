/* eslint-env node */

export default [
  {
    input: 'src/index.js',
    output: [
      {
        file: 'lib/index-esm.js',
        format: 'esm',
        sourcemap: 'inline',
      },
      {
        file: 'lib/index-cjs.js',
        format: 'cjs',
        sourcemap: 'inline',
      },
    ],
    external: [
      'chrome-promise',
      '@extend-chrome/events-rxjs',
      'rxjs/operators',
    ],
  },
]
