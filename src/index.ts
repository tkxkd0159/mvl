import mongoose from "mongoose";
import {createClient} from "redis";

import app from "./app";
import { config } from "./config";
import logger from './config/logger';


let server: any;
let redisC: any;
mongoose
    .connect(config.mongoose.url, config.mongoose.options)
    .then(() => {
        console.log("Connected to MongoDB");

    })
    .then(() => {
        server = app.listen(config.port, () => {
            console.log(`Listening to port ${config.port}`);
        });
    })
    .catch((e) => {
        console.log("Init ERROR : ", e)
    })

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
    console.error(error);
    exitHandler();
};

let redisState: boolean = true;
(async function(){
    redisC = createClient();
    redisC.on("error", (err: Error) => {
        redisState = false;
        logger.error("RedisDB is not available")
    });
    await redisC.connect();
    console.log("Connected to RedisDB");
})();

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

export {
    redisC,
    redisState
}