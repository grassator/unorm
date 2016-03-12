/* jshint node: true */
/* global Symbol:false */

var unorm = require("../lib/unorm");

exports.nfdForNativeString = function (str) {
    var iter = unorm.nfd(str[Symbol.iterator]());
    var codePoints = [];
    var it;
    while((it = iter.next()) && !it.done) {
        codePoints.push(it.value);
    }
    return String.fromCodePoint.apply(String, codePoints);
};