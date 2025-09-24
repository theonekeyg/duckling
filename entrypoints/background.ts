import { initOmnibox, FormatCallbacks } from "../src";

// Select format callbacks during build time, so there's only browser-specific code
// at runtime. The actual code picking for final bundle is handled by wxt.
// P.S. These envs are available at both build and runtime, I checked it, I promise.
let formatCallbacks: FormatCallbacks;
if (import.meta.env.FIREFOX) {
    formatCallbacks = {
        SelectedMatch: firefoxSelectedMatch,
        IsNotValidBang: firefoxIsNotValidBang,
        Suggestion: firefoxSuggestion,
    };
} else {
    formatCallbacks = {
        SelectedMatch: chromeSelectedMatch,
        IsNotValidBang: chromeIsNotValidBang,
        Suggestion: chromeSuggestion,
    };
}

export default defineBackground(() => {
    initOmnibox(formatCallbacks);
});

function chromeSelectedMatch(name: string, bang: string) {
    return `Selected: <match>${name}</match> <dim>(${bang})</dim>`;
}

function chromeIsNotValidBang(bang: string) {
    return `❌ "${bang}" <match>is not a valid bang</match>`;
}

function chromeSuggestion(name: string, bang: string) {
    return `<match>${name}</match> <dim>(${bang})</dim>`;
}

function firefoxSelectedMatch(name: string, bang: string) {
    return `Selected: ${name} (${bang})`;
}

function firefoxIsNotValidBang(bang: string) {
    return `❌ "${bang}" is not a valid bang`;
}

function firefoxSuggestion(name: string, bang: string) {
    return `${name} (${bang})`;
}