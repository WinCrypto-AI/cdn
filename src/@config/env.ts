import { join } from 'path';
import { ConnectionOptions } from 'typeorm';

const stringToBoolean = (value: string | boolean) => {
  return Boolean(JSON.parse(`${value}`));
};

export type IEnvConfig = {
  DBS: ConnectionOptions[];
  CONNECTORS?: {
    SSO: {
      baseUrl: string;
    };
  };
  TON_CHAIN_CONFIG: {
    endpoint: string;
    apiKey: string;
    ROOT_WALLET: string;
  };
} & NodeJS.ProcessEnv;

export function configEnv(): IEnvConfig {
  const {
    PORT = 3000,
    TZ,
    REQUEST_TIMEOUT = 3 * 60 * 1000,

    // SWAGGER CONFIG
    SWAGGER_TITLE = 'BASE API',
    SWAGGER_DESCRIPTION = 'The BASE API',
    SWAGGER_VERSION = '1.0',
    DIR_RESOURCE,
    STATIC_PATH_FILES,
  } = process.env;
  return {
    REQUEST_TIMEOUT: Number(REQUEST_TIMEOUT),
    SWAGGER_TITLE,
    SWAGGER_DESCRIPTION,
    SWAGGER_VERSION,
    DIR_RESOURCE,
    STATIC_PATH_FILES,
    DBS: [],
  } as IEnvConfig;
}
