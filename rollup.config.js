import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import { dts } from 'rollup-plugin-dts';
import del from 'rollup-plugin-delete';
import { createRequire } from 'module';
const pkg = createRequire(import.meta.url)('./package.json');

const isDts = process.env.BUILD === 'dts';

// ESM build configuration
const esmConfig = {
    input: 'src/index.ts',
    output: [
        {
            file: pkg.module,
            format: 'es',
            sourcemap: false
        }
    ],
    plugins: [
        resolve(),
        typescript()
    ]
};

// TypeScript type definition configuration
const dtsConfig = {
    input: 'src/index.ts',
    output: {
        file: pkg.types,
        format: 'es'
    },
    plugins: [
        dts(),
        del({ hook: 'buildEnd', targets: ['dist/*.js', '!dist/index.js'] })
    ]
};

export default isDts ? dtsConfig : esmConfig;
