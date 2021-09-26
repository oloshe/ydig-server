import { Context } from "koa";
import { config } from "./config";
import winston, { transports, format } from "winston";
import * as path from "path";

const loggerMiddleWave = (winstonInstance: any): any  => {
    winstonInstance.configure({
        level: config.debugLogging ? "debug" : "info",
        transports: [
            //
            // - Write all logs error (and below) to `error.log`.
            new transports.File({ filename: path.resolve(__dirname, "../error.log"), level: "error" }),
            //
            // - Write to all logs with specified level to console.
            new transports.Console({
                format: format.combine(
                    format.colorize(),
                    format.simple()
                )
            })
        ]
    });

    return async (ctx: Context, next: () => Promise<any>): Promise<void> => {
        
        const start = new Date().getTime();
        try {
            await next();
        } catch (err: any) {
            ctx.status = err.status || 500;
            ctx.body = err.message;
        }
        const ms = new Date().getTime() - start;

        let logLevel: string;
        if (ctx.status >= 500) {
            logLevel = "error";
        } else if (ctx.status >= 400) {
            logLevel = "warn";
        } else {
            logLevel = "info";
        }

        const msg = `${ctx.method} ${ctx.originalUrl} ${ctx.status} ${ms}ms`;

        winstonInstance.log(logLevel, msg);
    };
};

const logger = winston.createLogger({
    transports: [new winston.transports.Console({ level: 'info' })],
    format: format.combine(
        format.splat(),
        format.printf(info => `[${info.label}] ${info.message}`)
    )
})

export { loggerMiddleWave, logger };