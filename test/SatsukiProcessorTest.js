/*
 * Copyright 2016 Jun-ya HASEBA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

"use strict";

import assert from "power-assert";
import SatsukiProcessor from "../src/SatsukiProcessor"
import {TextLintCore} from "textlint";

describe("SatsukiProcessor", function () {
    let textlint;
    beforeEach(function () {
        textlint = new TextLintCore();
        textlint.addProcessor(SatsukiProcessor);
        textlint.setupRules({
            "no-todo": require("textlint-rule-no-todo")
        });
    });
    context("when target is blockquote, '>>' - '<<'", function () {
        it("should no error", function () {
            const target =
                ">>\n" +
                "TODO: this is todo\n" +
                "<<\n";
            return textlint.lintText(target, ".txt").then((result) => {
                assert(result.messages.length === 0);
            });
        });
        it("should report error", function () {
            const target =
                "TODO: this is todo\n" +
                ">>\n" +
                "TODO: this is todo\n" +
                "<<\n" +
                "TODO: this is todo\n";
            return textlint.lintText(target, ".txt").then((result) => {
                assert(result.messages.length === 2);
            });
        });
    });
    context("when target is blockquote, '>>|' - '|<<'", function () {
        it("should no error", function () {
            const target =
                ">>|\n" +
                "TODO: this is todo\n" +
                "|<<\n";
            return textlint.lintText(target, ".txt").then((result) => {
                assert(result.messages.length === 0);
            });
        });
        it("should report error", function () {
            const target =
                "TODO: this is todo\n" +
                ">>|\n" +
                "TODO: this is todo\n" +
                "|<<\n" +
                "TODO: this is todo\n";
            return textlint.lintText(target, ".txt").then((result) => {
                assert(result.messages.length === 2);
            });
        });
    });
    context("when target is blockquote, '>>||' - '||<<'", function () {
        it("should no error", function () {
            const target =
                ">>||\n" +
                "TODO: this is todo\n" +
                "||<<\n";
            return textlint.lintText(target, ".txt").then((result) => {
                assert(result.messages.length === 0);
            });
        });
        it("should report error", function () {
            const target =
                "TODO: this is todo\n" +
                ">>||\n" +
                "TODO: this is todo\n" +
                "||<<\n" +
                "TODO: this is todo\n";
            return textlint.lintText(target, ".txt").then((result) => {
                assert(result.messages.length === 2);
            });
        });
    });
    context("when target is blockquote, '>>[URL]' - '<<'", function () {
        it("should no error", function () {
            const target =
                ">>[https://github.com/7pairs/textlint-plugin-satsuki]\n" +
                "TODO: this is todo\n" +
                "<<\n";
            return textlint.lintText(target, ".txt").then((result) => {
                assert(result.messages.length === 0);
            });
        });
        it("should report error", function () {
            const target =
                "TODO: this is todo\n" +
                ">>[https://github.com/7pairs/textlint-plugin-satsuki]\n" +
                "TODO: this is todo\n" +
                "<<\n" +
                "TODO: this is todo\n";
            return textlint.lintText(target, ".txt").then((result) => {
                assert(result.messages.length === 2);
            });
        });
    });
    context("when target is blockquote, '>URL>' - '<<'", function () {
        it("should no error", function () {
            const target =
                ">https://github.com/7pairs/textlint-plugin-satsuki>\n" +
                "TODO: this is todo\n" +
                "<<\n";
            return textlint.lintText(target, ".txt").then((result) => {
                assert(result.messages.length === 0);
            });
        });
        it("should report error", function () {
            const target =
                "TODO: this is todo\n" +
                ">https://github.com/7pairs/textlint-plugin-satsuki>\n" +
                "TODO: this is todo\n" +
                "<<\n" +
                "TODO: this is todo\n";
            return textlint.lintText(target, ".txt").then((result) => {
                assert(result.messages.length === 2);
            });
        });
    });
    context("when target is pre, '>|' - '|<'", function () {
        it("should no error", function () {
            const target =
                ">|\n" +
                "TODO: this is todo\n" +
                "|<\n";
            return textlint.lintText(target, ".txt").then((result) => {
                assert(result.messages.length === 0);
            });
        });
        it("should report error", function () {
            const target =
                "TODO: this is todo\n" +
                ">|\n" +
                "TODO: this is todo\n" +
                "|<\n" +
                "TODO: this is todo\n";
            return textlint.lintText(target, ".txt").then((result) => {
                assert(result.messages.length === 2);
            });
        });
    });
    context("when target is pre, '>||' - '||<'", function () {
        it("should no error", function () {
            const target =
                ">||\n" +
                "TODO: this is todo\n" +
                "||<\n";
            return textlint.lintText(target, ".txt").then((result) => {
                assert(result.messages.length === 0);
            });
        });
        it("should report error", function () {
            const target =
                "TODO: this is todo\n" +
                ">||\n" +
                "TODO: this is todo\n" +
                "||<\n" +
                "TODO: this is todo\n";
            return textlint.lintText(target, ".txt").then((result) => {
                assert(result.messages.length === 2);
            });
        });
    });
    context("when target is pre, '>||#' - '#||<'", function () {
        it("should no error", function () {
            const target =
                ">||#\n" +
                "TODO: this is todo\n" +
                "#||<\n";
            return textlint.lintText(target, ".txt").then((result) => {
                assert(result.messages.length === 0);
            });
        });
        it("should report error", function () {
            const target =
                "TODO: this is todo\n" +
                ">||#\n" +
                "TODO: this is todo\n" +
                "#||<\n" +
                "TODO: this is todo\n";
            return textlint.lintText(target, ".txt").then((result) => {
                assert(result.messages.length === 2);
            });
        });
    });
    context("when target is pre, '>|?|' - '||<'", function () {
        it("should no error", function () {
            const target =
                ">|?|\n" +
                "TODO: this is todo\n" +
                "||<\n";
            return textlint.lintText(target, ".txt").then((result) => {
                assert(result.messages.length === 0);
            });
        });
        it("should report error", function () {
            const target =
                "TODO: this is todo\n" +
                ">|?|\n" +
                "TODO: this is todo\n" +
                "||<\n" +
                "TODO: this is todo\n";
            return textlint.lintText(target, ".txt").then((result) => {
                assert(result.messages.length === 2);
            });
        });
    });
    context("when target is pre, '>|lang|' - '||<'", function () {
        it("should no error", function () {
            const target =
                ">|python|\n" +
                "TODO: this is todo\n" +
                "||<\n";
            return textlint.lintText(target, ".txt").then((result) => {
                assert(result.messages.length === 0);
            });
        });
        it("should report error", function () {
            const target =
                "TODO: this is todo\n" +
                ">|python|\n" +
                "TODO: this is todo\n" +
                "||<\n" +
                "TODO: this is todo\n";
            return textlint.lintText(target, ".txt").then((result) => {
                assert(result.messages.length === 2);
            });
        });
    });
});
