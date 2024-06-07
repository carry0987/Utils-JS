import typescript from '@rollup/plugin-typescript';
import replace from '@rollup/plugin-replace';
import { dts } from 'rollup-plugin-dts';
import del from 'rollup-plugin-delete';
import { createRequire } from 'module';
const pkg = createRequire(import.meta.url)('./package.json');

const isDts = process.env.BUILD === 'dts';
const isCjs = process.env.BUILD === 'cjs';
const sourceFile = 'src/index.ts';

// ESM build configuration
const esmConfig = {
    input: sourceFile,
    output: [
        {
            file: pkg.module,
            format: 'es',
            sourcemap: false
        }
    ],
    plugins: [
        typescript(),
        replace({
            preventAssignment: true,
            __version__: pkg.version
        })
    ]
};

// CJS build configuration
const cjsConfig = {
    input: sourceFile,
    output: [
        {
            file: 'dist/index.cjs',
            format: 'cjs',
            sourcemap: false
        }
    ],
    plugins: [
        typescript(),
        replace({
            preventAssignment: true,
            __version__: pkg.version
        })
    ]
};

// TypeScript type definition configuration
const dtsConfig = {
    input: sourceFile,
    output: {
        file: pkg.types,
        format: 'es'
    },
    plugins: [
        dts(),
        del({ hook: 'buildEnd', targets: ['dist/*.js', '!dist/index.js', 'dist/dts'] })
    ]
};

export default isDts ? dtsConfig : isCjs ? cjsConfig : esmConfig;
