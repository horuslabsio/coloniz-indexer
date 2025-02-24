import { DeepPartial, ApibaraConfig } from 'apibara/types';

declare function defineConfig<T extends Record<string, DeepPartial<Pick<ApibaraConfig<T, R>, "runtimeConfig">>> = Record<string, never>, R extends Record<string, unknown> = Record<string, never>>(config: ApibaraConfig<T, R>): ApibaraConfig<T, R>;

export { defineConfig };
