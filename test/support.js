/* jshint node: true */
/* global Symbol:false */

var unorm = require("../lib/unorm");

exports.nfdForNativeString = function (str) {
    var strIter = {
        originalIter: str[Symbol.iterator](),
        next: function () {
            var result = this.originalIter.next();
            if (!result.done) {
                result.value = result.value.codePointAt(0);
            }
            return result;
        }
    };
    var iter = unorm.nfd(strIter);
    var codePoints = [];
    var it;
    while((it = iter.next()) && !it.done) {
        codePoints.push(it.value);
    }
    return String.fromCodePoint.apply(String, codePoints);
};