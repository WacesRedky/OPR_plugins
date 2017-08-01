// ==UserScript==
// @name         OPR percentage
// @namespace    https://opr.ingress.com/
// @version      0.1.3
// @description  Percents for statistics.
// @author       WacesRedky
// @match        https://opr.ingress.com/*
// @grant        unsafeWindow
// @downloadURL  https://github.com/WacesRedky/OPR_plugins/raw/master/OPR_percentage.user.js
// @updateURL    https://github.com/WacesRedky/OPR_plugins/raw/master/OPR_percentage.user.js
// ==/UserScript==

var spans = document.querySelectorAll('.hidden-xs #player_stats p .gold');
var statistics = {};
var now = getNow();
statistics.date = now.valueOf();
spans.forEach(function(span, i) {
    var value = parseInt(span.innerHTML, 10) || 0;
    switch(i) {
        case 0:
            statistics.total = value;
            break;
        case 1:
            statistics.accepted = value;
            break;
        case 2:
            statistics.rejected = value;
            break;
    }
});
var previous_statistics = getPreviousStatistics();
spans.forEach(function(span, i) {
    var percent = 0;
    var difference = 0;
    switch(i) {
        case 0:
            difference = statistics.total - previous_statistics.total;
            percent = (statistics.accepted + statistics.rejected) / statistics.total;
            break;
        case 1:
            difference = statistics.accepted - previous_statistics.accepted;
            percent = (statistics.accepted) / statistics.total;
            break;
        case 2:
            difference = statistics.rejected - previous_statistics.rejected;
            percent = (statistics.rejected) / statistics.total;
            break;
    }
    percent = Math.floor(percent * (i === 0 ? 10000 : 1000)) / (i === 0 ? 100 : 10);
    var append_html = '';
    if (difference !== 0) {
        append_html += ' ';
        append_html += '<span style="color: green;">+' + difference + '</span>';
    }
    append_html += ', ';
    append_html += '<span style="color: grey;">' + percent + '%</span>';
    span.innerHTML += append_html;
});

$$('#player_stats')[1].previousElementSibling.innerHTML += '<span style="position: absolute;font-size: 10px;top: 28px;">' + (statistics.accepted + statistics.rejected) + '</span>';

function getNow() {
    var now = new Date();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    now.setMilliseconds(0);
    return now;
}

function getPreviousStatistics() {
    var previous_statistics = localStorage.getItem('previous_statistics');
    previous_statistics = JSON.parse(previous_statistics);
    var yesterday = getNow();
    yesterday.setDate(yesterday.getDate() - 1);
    if (!previous_statistics || previous_statistics.date < yesterday.valueOf()) {
        previous_statistics = statistics;
        localStorage.setItem('previous_statistics', JSON.stringify(previous_statistics));
    }
    return previous_statistics;
}