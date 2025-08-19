console.log("executing omnibox.js");
import { bangs } from './bangs.js';

const bangEntries = bangs.map((b, i) => ({ key: b.t, i }));
bangEntries.sort((a, b) => a.key.localeCompare(b.key));
const keyToBang = new Map(bangs.map((b, _) => [b.t, b]));
const MAX_SUGGESTIONS = 100;

function lowerBound(arr, target) {
    let lo = 0;
    let hi = arr.length;
    while (lo < hi) {
        const mid = (lo + hi) >>> 1;
        if (arr[mid].key < target) {
            lo = mid + 1;
        } else {
            hi = mid;
        }
    }
    return lo;
}

function rangeByPrefix(prefix) {
    const lo = lowerBound(bangEntries, prefix);
    const hi = lowerBound(bangEntries, prefix + '\uffff');
    return bangEntries.slice(lo, Math.min(hi, lo + MAX_SUGGESTIONS));
}

function parseBangFromText(text) {
    return text.split(' ')[0];
}

// This function post-processes the text to be used in the omnibox, it escapes XML characters.
// Specifically we need to escape the following characters:
// `"` -> &quot;
// `'` -> &apos;
// `<` -> &lt;
// `>` -> &gt;
// `&` -> &amp;
//
// More info at https://stackoverflow.com/questions/1091945/what-characters-do-i-need-to-escape-in-xml-documents/1091953.
const ESC_XML_MAP = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&apos;",
  };
function escapeOmniboxText(text) {
    return text.replace(/[&<>"']/g, c => ESC_XML_MAP[c]);
}

// On enter we should parse the first word as a bang and the rest as a query.
// If the bang is not found, we should just open the query in the default browser.
// For example, if the user typed "g what is c language", the query will resolve to
// google search to query "what is c language".
chrome.omnibox.onInputEntered.addListener((text) => {
    const bangKey = parseBangFromText(text);
    const bang = keyToBang.get(bangKey);
    if (bang) {
        const query = text.slice(bangKey.length).trim();
        console.log(`redirecting to query: "${query}"`);
        chrome.tabs.update({
            url: bang.u.replace('{{{s}}}', encodeURIComponent(query)),
            highlighted: false,
        });
    }
    return;
});

// When user changes input, this could mean 2 possible scenarios:
// 1. User is typing a bang. We should suggest most similar bangs
// 2. User is typing a query. We should show the selected bang
chrome.omnibox.onInputChanged.addListener(function(text, suggest) {

    // Check if user is past the bang by checking if word count is more than 1
    const words = text.split(' ');

    if (words.length > 1) {
        const bangKey = parseBangFromText(text);
        const bang = keyToBang.get(bangKey);
        if (bang) {
            suggest([{
                content: " ", // Empty content breaks chrome API, so use space when it's not needed
                description: `Selected: <match>${escapeOmniboxText(bang.s)}</match> <dim>(${bang.t})</dim>`,
            }]);
            return;
        } else {
            // If first word is not a valid bang, indicate an error to user
            suggest([{
                content: " ",
                description: `❌ "${escapeOmniboxText(bangKey)}" <match>is not a valid bang</match>`,
            }])
            return;
        }
    }

    const suggestions = rangeByPrefix(text).map((entry) => {
        return {
            content: `${bangs[entry.i].t} `,
            description: `<match>${escapeOmniboxText(bangs[entry.i].s)}</match> <dim>(${bangs[entry.i].t})</dim>`,
            deletable: true
        }
    });

    // If there are no suggestions, this means user already wrote incorrect bang,
    // inform them with special suggestion
    if (suggestions.length == 0) {
        suggest([{
            content: " ",
            description: `❌ "${escapeOmniboxText(text)}" <match>is not a valid bang</match>`,
        }]);
        return
    }

    suggest(suggestions);
    return;
});
