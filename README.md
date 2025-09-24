<div align="center">

<h1>Duckling Browser Extension</h1>
<h3>Bring native DuckDuckGo bangs into your browser search bar</h3>

<img src="_assets/Duckling.gif" alt="Duckling usage example">

</div>

# Installation

## Via Chrome Web Store

1. Go to Duckling [Chrome extension page](https://chromewebstore.google.com/detail/duckling/kkhpjkabnebjkdpcpagdpcchpcdjnonp).
2. Click on "Add to Chrome".
3. Enable the extension.

## Build and install extension from source

1. Clone the repository
```bash
git clone git@github.com:theonekeyg/duckling.git
```
2. Install dependencies
```bash
pnpm install
```
3. Build the extension bundle
```
pnpm build
```
4. Open Chrome extension page (chrome://extensions).
5. Enable "Developer mode" in top right.
6. Click on "Load unpacked" in the top left and select the directory `.output/chrome-mv3`.

# Usage

1. In the search bar, type "! " (exclamation mark, then space).
2. Start typing a bang (e.g. gh, so, npm, wiki) and pick from live suggestions.
3. Add your query and press Enter to jump directly to target site.

# Key Benefits

* **Instant**: No network delay while you type. Suggestions and query resolution happen locally.
* **No DNS lookups during query composition**: the browser doesn't touch the network until you press Enter.
* **Don't memorize bangs**: type-ahead suggestions surface the right bang as you type.
* **Fully local resolution**: the final URL is built inside the extension - no extra hops or redirects.
* **Privacy-first**: no telemetry, no background requests - only the final navigation is performed.
