import { ApibaraConfig, LoadConfigOptions, Apibara } from 'apibara/types';

declare function createApibara(config?: ApibaraConfig, opts?: LoadConfigOptions, dev?: boolean): Promise<Apibara>;

declare function build(apibara: Apibara): Promise<void>;

declare function prepare(apibara: Apibara): Promise<void>;

declare function writeTypes(apibara: Apibara): Promise<void>;

export { build, createApibara, prepare, writeTypes };
