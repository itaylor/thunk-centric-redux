import babel from 'rollup-plugin-babel';
import pkg from './package.json';

export default [
  {
    input: 'src/reduxActionRouter.js',
    external: ['url-mapper', 'querystring'],
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
