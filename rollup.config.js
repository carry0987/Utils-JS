import terser from '@rollup/plugin-terser';
import replace from '@rollup/plugin-replace';
import { createRequire } from 'module';
const pkg = createRequire(import.meta.url)('./package.json');

export default {
    input: 'src/utils.js',
    output: [
        {
            file: pkg.main,
            format: 'umd',
            name: 'Utils',
            plugins: [terser()]
        },
        {
            file: pkg.module,
            format: 'es'
        }
    ],
    plugins: [
        replace({
            preventAssignment: true,
            __version__: pkg.version
        })
    ]
};
