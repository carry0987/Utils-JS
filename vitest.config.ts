import { defineConfig, coverageConfigDefaults } from 'vitest/config';
import os from 'node:os';
import path from 'path';

export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src')
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
