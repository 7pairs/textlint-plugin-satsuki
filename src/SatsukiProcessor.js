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

    static get BLOCK_TAGS() {
        return [
            [/^>>$/, "<<"],
            [/^>>\|$/, "|<<"],
            [/^>>\|\|$/, "||<<"],
            [/^>>\[https?:\/\/[^\]]+\]$/, "<<"],
            [/^>https?:\/\/[^>]+>$/, "<<"],
            [/^>\|$/, "|<"],
            [/^>\|\|$/, "||<"],
            [/^>\|\|#$/, "#||<"],
            [/^>\|\?\|$/, "||<"],
            [/^>\|[^\|]+\|$/, "||<"]
        ];
    }

    processor(ext) {
        return {
            preProcess: (text, filePath) => {
                const result = parse(text);
                this.ignoreLines = new Array(result.loc.end.line);
                this.ignoreColumns = new Array(result.loc.end.line);
                for (let i = 0; i < this.ignoreColumns.length; i++) {
                    this.ignoreColumns[i] = new Array();
                }

                let inBlock = false;
                let endTag = null;
                for (let i = 0; i < result.children.length; i++) {
                    if (!inBlock) {
                        for (let j = 0; j < SatsukiProcessor.BLOCK_TAGS.length; j++) {
                            if (result.children[i].raw.match(SatsukiProcessor.BLOCK_TAGS[j][0])) {
                                inBlock = true;
                                endTag = SatsukiProcessor.BLOCK_TAGS[j][1];
                                break;
                            }
                        }
                    }
                    if (inBlock) {
                        if (result.children[i].raw === endTag) {
                            inBlock = false;
                        }
                        this.ignoreLines[result.children[i].loc.start.line - 1] = true;
                    } else {
                        const regexp = /\[[^\]]+\]/g;
                        let tag = null;
                        while (tag = regexp.exec(result.children[i].raw)) {
                            this.ignoreColumns[result.children[i].loc.start.line - 1].push(
                                [tag.index + 1, regexp.lastIndex]
                            );
                        }
                    }
                }

                return result;
            },
            postProcess: (messages, filePath) => {
                const activeMessages = messages.filter((message) => {
                    if (this.ignoreLines[message.line - 1]) {
                        return false;
                    }
                    for (let i = 0; i < this.ignoreColumns[message.line - 1].length; i++) {
                        const ignoreColumn = this.ignoreColumns[message.line - 1][i];
                        if (ignoreColumn[0] <= message.column && ignoreColumn[1] >= message.column) {
                            return false;
                        }
                    }
                    return true;
                });

                return {
                    messages: activeMessages,
                    filePath: filePath ? filePath : "<text>"
                };
            }
        };
    }
}
