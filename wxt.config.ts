import { build, defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
    manifest: ({ browser, manifestVersion, mode, command }) => {
        return {
            name: "Duckling",
            description: "Instant DuckDuckGo bangs in your search bar. Local suggestions, no network requests - just type '! <bang> <query>'.",
            version: "0.0.4",
            minimum_chrome_version: "102",
            omnibox: {
                keyword: "!",
            },
        };
    },
    vite: () => ({
        build: {
            // Minification is disabled to make review process by distributions easier.
            // Note from google (https://developer.chrome.com/docs/webstore/review-process#review-time-factors):
            // '''
            // Minification is allowed, but it can also make reviewing extension code more difficult.
            // Where possible, consider submitting your code as authored.
            // '''
            // NOTE: Could be enabled it in the future, once reviews are more streamlined and faster.
            minify: false,
        }
    }),
});
