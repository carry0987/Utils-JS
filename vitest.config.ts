import os from 'node:os';
import path from 'node:path';
import { coverageConfigDefaults, defineConfig } from 'vitest/config';

const projectRoot = import.meta.dirname;

export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(projectRoot, 'src')
        }
    },
    test: {
        environment: 'happy-dom',
        execArgv: ['--localstorage-file', path.resolve(os.tmpdir(), `vitest-${process.pid}.localstorage`)],
        coverage: {
            // Test coverage options
            enabled: false,
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            exclude: [...coverageConfigDefaults.exclude]
        },
        typecheck: {
            // Type check options (optional)
            enabled: true
        }
    }
});
