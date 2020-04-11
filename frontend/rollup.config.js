import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy';
import livereload from 'rollup-plugin-livereload';
import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace'
import * as react from 'react'

const production = !process.env.ROLLUP_WATCH;

export default {
  input: 'src/index.js',
  output: {
    dir: 'dist/',
    // file: 'dist/index.html',
    format: 'iife', // immediately-invoked function expression — suitable for <script> tags
    sourcemap: true
  },
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify( production ? 'production' : 'development' )
    }),
    resolve({
      jsnext: true,
      main: true,
      browser: true
    }),
    commonjs({
      include: /node_modules/,
      namedExports: {
        'node_modules/react/index.js': Object.keys(react),
        'node_modules/debounce/index.js': ['debounce'],
        'node_modules/react-dom/index.js': ['render', 'hydrate'],
        'node_modules/react-is/index.js': [
          'isElement',
          'isValidElementType',
          'ForwardRef',
          'Memo'
        ],
        'node_modules/scheduler/index.js': ['unstable_runWithPriority', 'unstable_IdlePriority', 'unstable_now'],
        'node_modules/prop-types/index.js': [
          'elementType'
        ]
      }
        // namedExports: {
        //   // left-hand side can be an absolute path, a path
        //   // relative to the current directory, or the name
        //   // of a module in node_modules
        //   '@josh-brown/vector': ['vec', 'dotProduct', 'normalize', 'mat']
        // 
    }),
    babel({ 
      exclude: 'node_modules/**',
      presets: ['@babel/env', '@babel/preset-react']
    }),
    !production && livereload(),
    production && terser() // minify, but only in production
  ]
};
