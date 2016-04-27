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

import {parse} from "txt-to-ast";

export default class SatsukiProcessor {

    constructor(config) {
        this.config = config;
    }

    static availableExtensions() {
        return [
            ".txt"
        ];
    }

    static get TAGS() {
        return [
            [/>>/, "<<"],
            [/>>\|/, "|<<"],
            [/>>\|\|/, "||<<"],
            [/>>\[https?:\/\/[^\]]+\]/, "<<"],
            [/>https?:\/\/[^>]+>/, "<<"],
            [/>\|/, "|<"],
            [/>\|\|/, "||<"],
            [/>\|\|#/, "#||<"],
            [/>\|\?\|/, "||<"],
            [/>\|[^\|]+\|/, "||<"]
        ];
    }

    processor(ext) {
        return {
            preProcess: (text, filePath) => {
                const result = parse(text);
                this.ignoreLines = new Array(result.loc.end.line);

                let isBlock = false;
                let endTag = null;
                for (let i = 0; i < result.children.length; i++) {
                    if (!isBlock) {
                        for (let j = 0; j < SatsukiProcessor.TAGS.length; j++) {
                            if (result.children[i].raw.match(SatsukiProcessor.TAGS[j][0])) {
                                isBlock = true;
                                endTag = SatsukiProcessor.TAGS[j][1];
                                break;
                            }
                        }
                    }
                    if (isBlock) {
                        if (result.children[i].raw === endTag) {
                            isBlock = false;
                        }
                        this.ignoreLines[result.children[i].loc.start.line - 1] = true;
                    }
                }

                return result;
            },
            postProcess: (messages, filePath) => {
                const validMessages = messages.filter((message) => {
                    return this.ignoreLines[message.line - 1] !== true;
                });

                return {
                    messages: validMessages,
                    filePath: filePath ? filePath : "<text>"
                };
            }
        };
    }
}
