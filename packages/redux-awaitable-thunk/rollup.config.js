import babel from 'rollup-plugin-babel';
import pkg from './package.json';

export default [
  {
    input: 'src/awaitableThunkMiddleware.js',
    plugins: [
      babel({
        exclude: 'node_modules/**',
      }),
    ],
    output: [
      { file: pkg.main, format: 'cjs', exports: 'named' },
      { file: pkg.module, format: 'es' },
    ],
  },
];
