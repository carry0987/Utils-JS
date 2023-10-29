import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import replace from '@rollup/plugin-replace';
import { dts } from 'rollup-plugin-dts';
import { createRequire } from 'module';
const pkg = createRequire(import.meta.url)('./package.json');

const isProduction = process.env.BUILD === 'production';

const jsConfig = {
    input: 'src/utils.ts',
    output: [
        {
            file: pkg.main,
            format: 'umd',
            name: 'Utils',
            plugins: isProduction ? [terser()] : []
        },
        {
            file: pkg.module,
            format: 'es'
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

// Configuration for generating the type definitions
const dtsConfig = {
    input: 'dist/utils.d.ts', // Use the TypeScript-generated declaration as input
    output: {
        file: pkg.types,
        format: 'es'
    },
    plugins: [
        dts()
    ]
};

export default [jsConfig, dtsConfig];
