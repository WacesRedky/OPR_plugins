// ==UserScript==
// @name         OPR percentage
// @namespace    https://opr.ingress.com/
// @version      0.1
// @description  Percents for statistics.
// @author       WacesRedky
// @match        https://opr.ingress.com/*
// @grant        unsafeWindow
// ==/UserScript==

var spans = document.querySelectorAll('.hidden-xs #player_stats p .gold');
var statistics = {};
var now = new Date();
now.setHours(0);
now.setMinutes(0);
now.setSeconds(0);
now.setMilliseconds(0);
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

function saveLastStatistics() {
    var last_statistics = JSON.stringify(statistics);
    localStorage.setItem('last_statistics', last_statistics);
    return last_statistics;
}
function getPreviousStatistics() {
    var previous_statistics = localStorage.getItem('previous_statistics');
    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0);
    yesterday.setMinutes(0);
    yesterday.setSeconds(0);
    yesterday.setMilliseconds(0);
    if (!previous_statistics || previous_statistics.date < yesterday.valueOf()) {
        previous_statistics = saveLastStatistics();
        localStorage.setItem('previous_statistics', previous_statistics);
    }
    return JSON.parse(previous_statistics);
}