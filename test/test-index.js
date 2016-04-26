"use strict";

const assert = require("assert");
import dummy from "../src/index";

describe("Dummy", function () {
    it("should return true", function () {
        const result = dummy();
        assert.equal(result, true);
    });
});
