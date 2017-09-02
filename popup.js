function searchHistory(url) {
    var queryInfo = {
        'text': url
    };
    chrome.history.search(queryInfo, function (historyItems) {
        console.log(historyItems);
    });
}

function getCurrentTabUrl(callback) {
    var queryInfo = {
        active: true,
        currentWindow: true
    };

    chrome.tabs.query(queryInfo, function (tabs) {
        var tab = tabs[0];
        var url = tab.url;
        callback(url);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    getCurrentTabUrl(searchHistory);
});
