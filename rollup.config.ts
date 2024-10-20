import { RollupOptions } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import tsConfigPaths from 'rollup-plugin-tsconfig-paths';
import replace from '@rollup/plugin-replace';
import { dts } from 'rollup-plugin-dts';
import { createRequire } from 'module';

const pkg = createRequire(import.meta.url)('./package.json');
const isDts = process.env.BUILD === 'dts';
const sourceFile = 'src/index.ts';

// CommonJS build configuration
const cjsConfig: RollupOptions = {
    input: sourceFile,
    output: [
        {
            file: pkg.main,
            format: 'cjs',
            sourcemap: false
        }
    ],
    plugins: [
        typescript(),
        tsConfigPaths(),
        replace({
            preventAssignment: true,
            __version__: pkg.version
        })
    ]
};

// ESM build configuration
const esmConfig: RollupOptions = {
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
        tsConfigPaths(),
        replace({
            preventAssignment: true,
            __version__: pkg.version
        })
    ]
};

// TypeScript type definition configuration
const dtsConfig: RollupOptions = {
    input: sourceFile,
    output: {
        file: pkg.types,
        format: 'es'
    },
    plugins: [
        tsConfigPaths(),
        dts()
    ]
};

export default isDts ? dtsConfig : [esmConfig, cjsConfig];
