import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import sourceMaps from 'rollup-plugin-sourcemaps';
import typescript from 'rollup-plugin-typescript2';

const pkg = require('./package.json');

export default {
    input: `src/index.ts`,
    output: [
        { file: pkg.main, name: 'sweetalert2decorators', format: 'umd' },
        { file: pkg.module, format: 'es' }
    ],
    sourcemap: true,
    external: [],
    watch: { include: 'src/**', },
    plugins: [
        typescript(),
        commonjs(),
        resolve(),
        sourceMaps()
    ]
};
