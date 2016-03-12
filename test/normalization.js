/* jshint node: true */
/* global describe:true, it:true */
"use strict";

var assert = require("assert");
var fs = require("fs");
var nfdForNativeString = require("./support").nfdForNativeString;

var utdata = fs.readFileSync(__dirname + "/../data/NormalizationTest.txt").toString();
var tests = [];

utdata.split("\n").forEach(function (line, lineNumber) {
   line = line.replace(/#.*$/, "");
   if (line[0] === "@") {
      return; // title
   }

   // Columns (c1, c2,...) are separated by semicolons
   // They have the following meaning: source; NFC; NFD; NFKC; NFKD
   var parts = line.split(/\s*;\s*/);
   assert(parts.length === 1 || parts.length === 6, "There should be five columns, not " + parts.length + " -- line " + lineNumber);
   if (parts.length === 1)  {
      return;
   }
   parts.slice(0, 5);

   // split p
   parts = parts.map(function (p) {
      return p.split(/\s+/).map(function (x) {
         // should use fromCodePoint - part of ES6
         return parseInt(x, 16);
      });
   });

   parts.line = lineNumber + ": " + line;

   tests.push(parts);
});

function doTest(test){
   var raw = test.map(function (p) {
      return String.fromCharCode.apply(undefined, p);
   });

   var nfd = raw.map(nfdForNativeString);

   //NFD
   assert.strictEqual(nfd[0], raw[2], test.line + ": c3 == NFD(c1)");
   assert.strictEqual(nfd[1], raw[2], test.line + ": c3 == NFD(c2)");
   assert.strictEqual(nfd[2], raw[2], test.line + ": c3 == NFD(c3)");
   assert.strictEqual(nfd[3], raw[4], test.line + ": c5 == NFD(c4)");
   assert.strictEqual(nfd[4], raw[4], test.line + ": c5 == NFD(c5)");
}

describe("normalization " + tests.length + " tests", function () {
   var bucketSize = 100;
   var m = Math.ceil(tests.length / bucketSize);
   for (var i = 0; i < m; i++) {
      var start = i * bucketSize;
      var end = Math.min(tests.length, (i+1) * bucketSize);

      /* jshint -W083 */
      it((start+1) + " - " + end, function () {
         for (var j = start; j < end; j++) {
            doTest(tests[j]);
         }
      });
      /* jshint +W083 */
   }
});

describe("anti-tests", function () {
   it("should fail", function () {
      // deep-copy test
      assert.throws(function () {
         var test = tests[0].map(function (x) { return x.slice(); });
         test[0][0] += 1;

         doTest(test);
      });
   });
});
