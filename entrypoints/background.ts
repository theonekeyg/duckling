import { initOmnibox, FormatCallbacks } from "../src";

export default defineBackground(() => {

    var formatCallbacks: FormatCallbacks;
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