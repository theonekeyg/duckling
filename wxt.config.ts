import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
    manifest: ({ browser, manifestVersion, mode, command }) => {
        console.log("calling define config");
        console.log("browser", browser);
        console.log("manifestVersion", manifestVersion);
        console.log("mode", mode);
        console.log("command", command);

        return {
            name: "Duckling-local",
            description: "Instant DuckDuckGo bangs in your search bar. Local suggestions, no network requests - just type '! <bang> <query>'.",
            version: "0.0.3",
            minimum_chrome_version: "102",
            omnibox: {
                keyword: "!",
            },
        };
    },
});
