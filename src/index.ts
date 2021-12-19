import mongoose from "mongoose";

import app from "./app";
import { config } from "./config";
import { opLogger, errorLogger } from "./config/logger";
import {redisConn} from "./model"

let server: any = undefined;
mongoose
    .connect(config.mongoose.url, config.mongoose.options)
    .then(() => {
        opLogger.info("[API] Connected to MongoDB");
        return redisConn()
    })
    .then(() => {
        if (process.env.NODE_ENV !== "test") {
            server = app.listen(config.port, () => {
                console.log(`Listening to port ${config.port}`);
            });
        }
    })
    .catch((e) => {
        errorLogger.info(`[API] Initial error : ${e}`);
    });

const exitHandler = () => {
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
};

const unexpectedErrorHandler = (error: Error) => {
    errorLogger.error(`[API] ${error}`);
    exitHandler();
};



process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);
