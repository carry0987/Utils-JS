import { createRequire } from 'node:module';
import replace from '@rollup/plugin-replace';
import typescript from '@rollup/plugin-typescript';
import type { RollupOptions } from 'rollup';
import { dts } from 'rollup-plugin-dts';
import tsConfigPaths from 'rollup-plugin-tsconfig-paths';

const pkg = createRequire(import.meta.url)('./package.json');
const isDts = process.env.BUILD === 'dts';
const typeSourceFile = 'src/types/index.ts';
const interfaceSourceFile = 'src/interfaces/index.ts';

const entryConfigs = [
    {
        input: 'src/index.ts',
        types: pkg.exports['.'].types,
        importFile: pkg.exports['.'].import,
        requireFile: pkg.exports['.'].require
    },
    {
        input: 'src/browser.ts',
        types: pkg.exports['./browser'].types,
        importFile: pkg.exports['./browser'].import,
        requireFile: pkg.exports['./browser'].require
    }
];

function createJsConfig(input: string, outputFile: string, format: 'cjs' | 'es'): RollupOptions {
    return {
        input,
        output: [
            {
                file: outputFile,
                format,
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
}

function createDtsConfig(input: string, outputFile: string): RollupOptions {
    return {
        input,
        output: {
            file: outputFile,
            format: 'es'
        },
        plugins: [tsConfigPaths(), dts()]
    };
}

const jsConfigs = entryConfigs.flatMap((entry) => {
    return [createJsConfig(entry.input, entry.importFile, 'es'), createJsConfig(entry.input, entry.requireFile, 'cjs')];
});

const dtsConfigs = entryConfigs.map((entry) => createDtsConfig(entry.input, entry.types));

// DTS config for types
const typeDtsConfig: RollupOptions = {
    input: typeSourceFile,
    output: {
        file: pkg.exports['./types'],
        format: 'es'
    },
    plugins: [tsConfigPaths(), dts()]
};

// DTS config for interfaces
const interfaceDtsConfig: RollupOptions = {
    input: interfaceSourceFile,
    output: {
        file: pkg.exports['./interfaces'],
        format: 'es'
    },
    plugins: [tsConfigPaths(), dts()]
};

export default isDts ? [...dtsConfigs, typeDtsConfig, interfaceDtsConfig] : jsConfigs;
