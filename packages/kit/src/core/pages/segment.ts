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
