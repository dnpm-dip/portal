/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2016-present - Nuxt Team
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
import type { SegmentToken } from './types';
import { SegmentParserState, SegmentTokenType } from './constants';

export function parseSegment(segment: string): SegmentToken[] {
    let state: SegmentParserState = SegmentParserState.initial;
    let i = 0;

    let buffer = '';
    const tokens: SegmentToken[] = [];

    function consumeBuffer() {
        if (!buffer) {
            return;
        }
        if (state === SegmentParserState.initial) {
            throw new Error('wrong state');
        }

        let type: SegmentTokenType;
        switch (state) {
            case SegmentParserState.static: {
                type = SegmentTokenType.static;
                break;
            }
            case SegmentParserState.dynamic: {
                type = SegmentTokenType.dynamic;
                break;
            }
            case SegmentParserState.optional: {
                type = SegmentTokenType.optional;
                break;
            }
            default: {
                type = SegmentTokenType.catchall;
                break;
            }
        }

        tokens.push({
            type,
            value: buffer,
        });

        buffer = '';
    }

    while (i < segment.length) {
        const c = segment[i];

        switch (state) {
            case SegmentParserState.initial:
                buffer = '';
                if (c === '[') {
                    state = SegmentParserState.dynamic;
                } else {
                    i--;
                    state = SegmentParserState.static;
                }
                break;

            case SegmentParserState.static:
                if (c === '[') {
                    consumeBuffer();
                    state = SegmentParserState.dynamic;
                } else {
                    buffer += c;
                }
                break;

            case SegmentParserState.catchall:
            case SegmentParserState.dynamic:
            case SegmentParserState.optional:
                if (buffer === '...') {
                    buffer = '';
                    state = SegmentParserState.catchall;
                }
                if (c === '[' && state === SegmentParserState.dynamic) {
                    state = SegmentParserState.optional;
                }
                if (c === ']' && (state !== SegmentParserState.optional || segment[i - 1] === ']')) {
                    if (!buffer) {
                        throw new Error('Empty param');
                    } else {
                        consumeBuffer();
                    }
                    state = SegmentParserState.initial;
                } else if (/[\w\d_.]/.test(c)) {
                    buffer += c;
                }

                break;
        }
        i++;
    }

    if (state === SegmentParserState.dynamic) {
        throw new Error(`Unfinished param "${buffer}"`);
    }

    consumeBuffer();

    return tokens;
}
