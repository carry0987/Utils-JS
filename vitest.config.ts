import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        environment: 'happy-dom',
        coverage: {
            // Test coverage options (optional)
            reporter: ['text', 'json', 'html'],
        }
    },
});
