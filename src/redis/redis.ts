import ioRedis from "ioredis";
import { config } from "../config";

export const redis = new ioRedis({
    port: config.redis.port,
    host: config.redis.host,
    keyPrefix: config.redis.prefix,
})