import { colors, getColor } from "consola/utils";
import { murmurHash } from "ohash";
const INDEXER_COLOR_MAP = [
  colors.red,
  colors.green,
  colors.yellow,
  colors.blue,
  colors.magenta,
  colors.cyan
];
const TYPE_COLOR_MAP = {
  info: "cyan",
  fail: "red",
  success: "green",
  ready: "green",
  start: "magenta"
};
const LEVEL_COLOR_MAP = {
  0: "red",
  1: "yellow"
};
const MAX_INDEXER_NAME_LENGTH = 20;
class DefaultReporter {
  tag;
  constructor(indexer, indexers, preset) {
    const color = INDEXER_COLOR_MAP[murmurHash(indexer) % INDEXER_COLOR_MAP.length];
    const presetLength = preset ? preset.length : 0;
    const longestIndexerName = Math.max(...indexers.map((i) => i.length), indexer.length) + presetLength;
    const paddedIndexer = `${indexer}${preset ? `:${preset} ` : ""}`.padEnd(longestIndexerName, " ").slice(0, Math.min(longestIndexerName, MAX_INDEXER_NAME_LENGTH));
    this.tag = color(`${paddedIndexer} |`);
  }
  log(logObj, ctx) {
    const { args } = logObj;
    const typeColor = TYPE_COLOR_MAP[logObj.type] || LEVEL_COLOR_MAP[logObj.level] || "gray";
    const type = getColor(typeColor, "white")(logObj.type);
    console.log(`${this.tag} ${type}`, ...args);
  }
}
export function createLogger({
  indexer,
  indexers,
  preset
}) {
  return new DefaultReporter(indexer, indexers, preset);
}
