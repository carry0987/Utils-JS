import { createRequire } from 'node:module';
import { defineConfig, type RolldownOptions, type RolldownPluginOption } from 'rolldown';
import { replacePlugin } from 'rolldown/plugins';
import { dts } from 'rolldown-plugin-dts';

const pkg = createRequire(import.meta.url)('./package.json');
const tsconfig = './tsconfig.json';

type RuntimeEntry = {
    input: string;
    platform: NonNullable<RolldownOptions['platform']>;
    importFile: string;
    requireFile: string;
};

const runtimeEntries: RuntimeEntry[] = [
    {
        input: 'src/index.ts',
        platform: 'neutral',
        importFile: pkg.exports['.'].import,
        requireFile: pkg.exports['.'].require
    },
    {
        input: 'src/browser.ts',
        platform: 'browser',
        importFile: pkg.exports['./browser'].import,
        requireFile: pkg.exports['./browser'].require
    }
];

const dtsEntries = {
    index: 'src/index.ts',
    browser: 'src/browser.ts',
    'types/index': 'src/types/index.ts'
};

const basePlugins: RolldownPluginOption[] = [
    replacePlugin(
        {
            __version__: pkg.version
        },
        {
            preventAssignment: true
        }
    )
];

function createRuntimeConfig(entry: RuntimeEntry, file: string, format: 'es' | 'cjs'): RolldownOptions {
    return {
        input: entry.input,
        platform: entry.platform,
        tsconfig,
        output: {
            codeSplitting: false,
            file: file,
            format: format,
            sourcemap: false
        },
        plugins: basePlugins
    };
}

const jsConfigs: RolldownOptions[] = runtimeEntries.flatMap((entry) => [
    createRuntimeConfig(entry, entry.importFile, 'es'),
    createRuntimeConfig(entry, entry.requireFile, 'cjs')
]);

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
