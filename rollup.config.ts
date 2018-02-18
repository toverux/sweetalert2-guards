import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import sourceMaps from 'rollup-plugin-sourcemaps';
import typescript from 'rollup-plugin-typescript2';

const pkg = require('./package.json');

export default {
    input: `src/index.ts`,
    output: [
        { file: pkg.main, name: 'sweetalert2guards', format: 'umd' },
        { file: pkg.module, format: 'es' }
    ],
    sourcemap: true,
    external: ['sweetalert2'],
    globals: { sweetalert2: 'swal' },
    watch: { include: 'src/**', },
    plugins: [
        typescript({ useTsconfigDeclarationDir: true }),
        commonjs(),
        resolve(),
        sourceMaps()
    ]
};
