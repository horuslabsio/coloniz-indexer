import typescript from "@rollup/plugin-typescript";
import type { Plugin } from "apibara/rollup";
import { defineConfig } from "apibara/config";

export default defineConfig({
  runtimeConfig: {
    colonizIndexer: {
      startingBlock: 0,
      streamUrl: "https://starknet-sepolia.preview.apibara.org",
      postgresConnectionString:
        process.env["POSTGRES_CONNECTION_STRING"] ?? "memory://colonizIndexer",
      colonizHubContractAddress:
        "0x04bd89ef797c5a34a3c8bcc9dafca270959d9edcd568ea22a2364ffb3af959f0",
    },
  },
  rollupConfig: {
    plugins: [typescript() as Plugin],
  },
});
