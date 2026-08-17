import { createRequire } from 'node:module';
import { defineConfig, type RolldownOptions } from 'rolldown';
import { replacePlugin } from 'rolldown/plugins';
import { dts } from 'rolldown-plugin-dts';

const pkg = createRequire(import.meta.url)('./package.json');
const tsconfig = './tsconfig.json';

const runtimeEntries = [
    {
        input: 'src/index.ts',
        importFile: pkg.exports['.'].import,
        requireFile: pkg.exports['.'].require
    },
    {
        input: 'src/browser.ts',
        importFile: pkg.exports['./browser'].import,
        requireFile: pkg.exports['./browser'].require
    }
];

const dtsEntries = {
    index: 'src/index.ts',
    browser: 'src/browser.ts',
    'types/index': 'src/types/index.ts'
};

const basePlugins = [
    replacePlugin(
        {
            __version__: pkg.version
        },
        {
            preventAssignment: true
        }
    )
];

const jsConfigs: RolldownOptions[] = runtimeEntries.flatMap((entry) => {
    return [
        {
            input: entry.input,
            platform: 'node',
            tsconfig,
            output: {
                codeSplitting: false,
                file: entry.importFile,
                format: 'es' as const,
                sourcemap: false
            },
            plugins: basePlugins
        },
        {
            input: entry.input,
            platform: 'node',
            tsconfig,
            output: {
                codeSplitting: false,
                file: entry.requireFile,
                format: 'cjs' as const,
                sourcemap: false
            },
            plugins: basePlugins
        }
    ];
});

const dtsConfig: RolldownOptions = {
    input: dtsEntries,
    tsconfig,
    output: {
        dir: 'dist',
        format: 'es' as const
    },
    plugins: [dts({ emitDtsOnly: true })]
};

export default defineConfig([...jsConfigs, dtsConfig]);
