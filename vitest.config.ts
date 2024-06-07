import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'happy-dom',
        coverage: {
            // Test coverage options (optional)
            reporter: ['text', 'json', 'html'],
        }
    },
});
