import pkg from './package.json';
import babel from 'rollup-plugin-babel';

export default [
  {
    input: 'src/reduxThunkErrorHandler.js',
    external: ['redux-thunk-recursion-detect'],
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
