import type { ConsolaOptions, ConsolaReporter, LogObject } from "consola";
declare class DefaultReporter implements ConsolaReporter {
    private tag;
    constructor(indexer: string, indexers: string[], preset?: string);
    log(logObj: LogObject, ctx: {
        options: ConsolaOptions;
    }): void;
}
export declare function createLogger({ indexer, indexers, preset, }: {
    indexer: string;
    indexers: string[];
    preset?: string;
}): DefaultReporter;
export {};
