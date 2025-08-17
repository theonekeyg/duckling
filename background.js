console.log("executing omnibox.js");
import { bangs } from './bangs.js';

const bangEntries = bangs.map((b, i) => ({ key: b.t, i}));
bangEntries.sort((a, b) => a.key.localeCompare(b.key));
const keyToBang = new Map(bangs.map((b, _) => [b.t, b]));

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
    return bangEntries.slice(lo, Math.min(hi, lo + 10));
}

// On enter we should parse the first word as a bang and the rest as a query.
// If the bang is not found, we should just open the query in the default browser.
// For example, if the user typed "g what is c language", the query will resolve to
// google search to query "what is c language".
chrome.omnibox.onInputEntered.addListener((text) => {
    const bangKey = parseBangFromText(text);
    const bang = keyToBang.get(bangKey);
    if (bang) {
        const query = text.slice(bangKey.length);
        chrome.tabs.create({ url: bang.u.replace('{{{s}}}', query) });
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
            console.log("bang", bang);
            suggest([{
                content: " ", // Empty content breaks chrome API, so use space when it's not needed
                description: `Selected: ${bang.s} (${bang.t})`,
                deletable: true
            }]);
            return;
        } else {
            // If first word is not a valid bang, indicate an error to user
            suggest([{
                content: " ",
                description: `"${bangKey}" is not a valid bang`,
                deletable: true
            }])
            return;
        }
    }
    
    const suggestions = rangeByPrefix(text).map((entry) => {
        return {
            content: bangs[entry.i].t,
            description: `${bangs[entry.i].s} (${bangs[entry.i].t})`,
            deletable: true
        }
    });
    suggest(suggestions);
    return;
});

function parseBangFromText(text) {
    return text.split(' ')[0];
}