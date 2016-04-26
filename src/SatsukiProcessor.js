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
