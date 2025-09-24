import { build, defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
    manifest: ({ browser, manifestVersion, mode, command }) => {
        return {
            name: "Duckling",
            description: "Instant DuckDuckGo bangs in your search bar. Local suggestions, no network requests - just type '! <bang> <query>'.",
            version: "0.0.3",
            minimum_chrome_version: "102",
            omnibox: {
                keyword: "!",
            },
        };
    },
    vite: () => ({
        build: {
            minify: false,
        }
    }),
});
