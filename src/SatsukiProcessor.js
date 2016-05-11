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
        this.ignoreMessagesMap = {};
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
                let ignoreMessages = new Array(result.loc.end.line);
                for (let i = 0; i < ignoreMessages.length; i++) {
                    ignoreMessages[i] = [false, []];
                }

                let inBlock = false;
                let endTag = null;
                for (let i = 0; i < result.children.length; i++) {
                    const node = result.children[i];
                    if (!inBlock) {
                        for (let j = 0; j < SatsukiProcessor.BLOCK_TAGS.length; j++) {
                            const blockTag = SatsukiProcessor.BLOCK_TAGS[j];
                            if (node.raw.match(blockTag[0])) {
                                inBlock = true;
                                endTag = blockTag[1];
                                break;
                            }
                        }
                    }
                    if (inBlock) {
                        if (node.raw === endTag) {
                            inBlock = false;
                        }
                        ignoreMessages[node.loc.start.line - 1][0] = true;
                    } else {
                        const inlineTagPattern = /\[[^\]]+\]/g;
                        let inlineTag = null;
                        while (inlineTag = inlineTagPattern.exec(node.raw)) {
                            ignoreMessages[node.loc.start.line - 1][1].push(
                                [inlineTag.index + 1, inlineTagPattern.lastIndex]
                            );
                        }
                    }
                }

                this.ignoreMessagesMap[filePath] = ignoreMessages;

                return result;
            },
            postProcess: (messages, filePath) => {
                const activeMessages = messages.filter((message) => {
                    const ignoreMessage = this.ignoreMessagesMap[filePath][message.line - 1];
                    if (typeof ignoreMessage === "undefined") {
                        return true;
                    }
                    if (ignoreMessage[0]) {
                        return false;
                    }
                    for (let i = 0; i < ignoreMessage[1].length; i++) {
                        const ignoreColumn = ignoreMessage[1][i];
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
