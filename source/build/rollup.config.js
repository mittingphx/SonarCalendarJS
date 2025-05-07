import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';

// Common plugins for both builds
const commonPlugins = [
  resolve(),
  commonjs(),
  postcss({
    extract: true,
    minimize: false, // Will be overridden for minified builds
    sourceMap: true,
    plugins: [
      require('autoprefixer')()
    ]
  })
];

// Configuration for non-minified builds
const nonMinifiedConfig = {
  input: '../src/index.js',
  output: [
    {
      file: '../dist/full/sonar-calendar.js',
      format: 'umd',
      name: 'SonarCalendar',
      sourcemap: true
    },
    {
      file: '../dist/full/sonar-calendar.esm.js',
      format: 'esm',
      sourcemap: true
    }
  ],
  plugins: [...commonPlugins]
};

// Configuration for minified builds
const minifiedConfig = {
  ...nonMinifiedConfig,
  output: [
    {
      ...nonMinifiedConfig.output[0],
      file: '../dist/minified/sonar-calendar.min.js',
      sourcemap: true
    },
    {
      ...nonMinifiedConfig.output[1],
      file: '../dist/minified/sonar-calendar.esm.min.js',
      sourcemap: true
    }
  ],
  plugins: [
    ...commonPlugins,
    terser({
      format: {
        comments: false
      }
    })
  ]
};

export default [nonMinifiedConfig, minifiedConfig];
