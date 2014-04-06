"use strict";

var fs = require("fs");

function HtmlReport() {
    this.stream = fs.createWriteStream("./khan-report.html", {
        flags: 'w',
        encoding: null,
        mode: 438
    });
    this.stream.write("<html><head></head><body><ul>");
}

HtmlReport.prototype.dump = function (message) {
    this.stream.write("<li>" + message + "</li>");
};

HtmlReport.prototype.done = function () {
    this.stream.write("</ul></body></html>");
    this.stream.end();
};

exports.HtmlReport = HtmlReport;