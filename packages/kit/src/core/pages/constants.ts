export enum SegmentParserState {
    initial,
    static,
    dynamic,
    optional,
    catchall,
}

export enum SegmentTokenType {
    static,
    dynamic,
    optional,
    catchall,
}
