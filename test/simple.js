/* jshint node: true */
/* global describe:true, it:true */
"use strict";

var assert = require("assert");
var nfdForNativeString = require("./support").nfdForNativeString;

describe("simple examples", function () {
    it("äiti", function () {
        var str = "äiti";
        assert.equal("\u0061\u0308\u0069\u0074\u0069", nfdForNativeString(str));
    });
});
