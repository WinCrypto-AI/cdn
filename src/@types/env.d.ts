/// <reference types="node" />

declare namespace NodeJS {
  interface ProcessEnv {
    PORT: number;
    REQUEST_TIMEOUT: number;
    // Swagger Config
    SWAGGER_TITLE: string;
    SWAGGER_DESCRIPTION: string;
    SWAGGER_VERSION: string;
    // FILE CONFIG
    DIR_RESOURCE: string;
    STATIC_PATH_FILES: string;
  }
}
