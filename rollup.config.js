/* eslint-env node */
import typescript from '@rollup/plugin-typescript'
console.log('🚀: typescript', typescript)

export default [
  {
    input: 'src/index.ts',
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
    plugins: [typescript()],
  },
]
