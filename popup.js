var visits = [];
function url_domain(data) {
    var a = document.createElement('a');
    a.href = data;
    return a.hostname;
}

function getMoreVisitInfo(event) {
    var cardHeader = event.target;
    //Get the parent card
    while (cardHeader.className !== 'card-header') {
        cardHeader = cardHeader.parentElement;
    }
    //Get the index of the card
    var elemIndex = parseInt(cardHeader.id.replace('heading', ''));
    var currentVisit = visits[elemIndex];
    var millisecondsPerWeek = 1000 * 60 * 20;
    var endTime = currentVisit.visitTime + millisecondsPerWeek;
    var queryInfo = {
        'text': '',
        'startTime': currentVisit.visitTime,
        'endTime': endTime
    };
    var table = cardHeader.nextElementSibling.getElementsByTagName('tbody')[0];
    if (table.rows.length == 0) {
        //Get all history items in the 20 mins following the visit of the page
        chrome.history.search(queryInfo, function (historyItems) {
            //Get the card's table
            for (var i = 0; i < historyItems.length; i++) {
                var historyItem = historyItems[i];
                if (historyItem.title.length === 0)
                    historyItem.title = historyItem.url;

                var row = table.insertRow(i);
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);

                cell1.innerHTML = url_domain(historyItem.url);
                cell2.innerHTML = '<a target="_blank" title="' + historyItem.url + '" href="' + historyItem.url + '">' + historyItem.title + '</a>';
            }
        });
    }
}

function searchHistory(url) {
    var queryInfoVisit = {
        'url': url
    };
    chrome.history.getVisits(queryInfoVisit, function (visitItems) {
        visits = visitItems;
        var accordion = document.getElementById('accordion');
        var index = 0;
        for (var i = 0; i < visits.length; i++) {
            var date = new Date(visits[i].visitTime);
            var html = '';
            html += '<div class="card" >';
            html += '<div class="card-header" role="tab" id="heading' + index + '">';
            html += '<h7 class="mb-0">';
            html += '<a data-toggle="collapse" href="#collapse' + index + '" aria-expanded="false" aria-controls="collapse' + index + '">';
            html += 'Visited on ' + date.toLocaleDateString() + ' - ' + date.toLocaleTimeString();
            html += '</a>';
            html += '</h7>';
            html += '</div>';
            html += '<div id="collapse' + index + '" class="collapse" role="tabpanel" aria-labelledby="heading' + index + '" data-parent="#accordion">';
            html += '<div class="card-body">';
            html += '<table class="table table-hover table-bordered">';
            html += '<thead>';
            html += '<tr>';
            html += '<th style="width:30%">Site</th>';
            html += '<th style="width:70%">Page</th>';
            html += '</tr>';
            html += '</thead>';
            html += '<tbody>';
            html += '</tbody>';
            html += '</table>';
            html += '</div>';
            html += '</div>';
            html += '</div >';
            accordion.insertAdjacentHTML('beforeend', html);
            document.getElementById('heading' + index).addEventListener("click", getMoreVisitInfo);
            index++;
        }
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
