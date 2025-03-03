import typescript from "@rollup/plugin-typescript";
import type { Plugin } from "apibara/rollup";
import { defineConfig } from "apibara/config";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  runtimeConfig: {
    colonizIndexer: {
      startingBlock: 464939,
      streamUrl: "https://starknet-sepolia.preview.apibara.org",
      postgresConnectionString:
        process.env["POSTGRES_CONNECTION_STRING"] ?? "memory://colonizIndexer",
      colonizHubContractAddress:
        "0x04bd89ef797c5a34a3c8bcc9dafca270959d9edcd568ea22a2364ffb3af959f0",
    },
    newindexer: {
      startingBlock: 0,
      streamUrl: "https://starknet-sepolia.preview.apibara.org",
      postgresConnectionString:
        process.env["POSTGRES_CONNECTION_STRING"] ?? "memory://newindexer",
    },
  },
  rollupConfig: {
    plugins: [typescript() as Plugin],
  },
});
