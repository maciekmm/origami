import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy';
// import { terser } from 'rollup-plugin-terser';

// const production = !process.env.ROLLUP_WATCH;

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/main.js',
    format: 'iife', // immediately-invoked function expression — suitable for <script> tags
    sourcemap: true
  },
  plugins: [
    resolve(),
    commonjs({
        namedExports: {
          // left-hand side can be an absolute path, a path
          // relative to the current directory, or the name
          // of a module in node_modules
          '@josh-brown/vector': ['vec', 'dotProduct', 'normalize', 'mat']
        }
      }
    ),
    // production && terser() // minify, but only in production
    copy({
      targets: [
        { src: 'index.html', dest: 'dist' },
        { src: 'public/**', dest: 'dist' }
      ],
      flatten: false,
      hook: 'writeBundle'
    })
  ]
};
