import dotenv from "dotenv";

dotenv.config({ path: ".env" });

export interface Config {
    port: number;
    debugLogging: boolean;
    dbConfig: {
        dbName: string, 
        databaseUrl: string;
        dbEntitiesPath: string[];
    },
    redis: {
        port?: number,
        host: string,
        prefix?: string,
    }
}

const isDevMode = process.env.NODE_ENV == "development";

const config: Config = {
    port: +(process.env.PORT || 8001),
    debugLogging: isDevMode,
    dbConfig: {
        databaseUrl: process.env.DATABASE_URL || "mongodb://localhost:27017/",
        dbName: process.env.DB_NAME || 'ydig',
        dbEntitiesPath: [
          ... isDevMode ? ["src/entity/**/*.ts"] : ["dist/entity/**/*.js"],
        ],
    },
    redis: {
        port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : void 0,
        host: process.env.REDIS_HOST || 'localhost',
        prefix: (process.env.REDIS_PREFIX || 'ydig') + ':',
    }
};

export { config };