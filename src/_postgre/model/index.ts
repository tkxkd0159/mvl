import { createClient } from "redis";
import { Pool } from "pg";
import { opLogger, errorLogger } from "../config/logger"
import {config} from "../config"

import {priceTable} from "./price.table"

let redisState: boolean = false;
let redisC: any;
async function redisConn () {
    redisC = createClient();
    redisC.on("error", (err: Error) => {
        redisState = false;
        errorLogger.error("[API] RedisDB is not available");
    });

    await redisC.connect();
    redisState = true;
    opLogger.info("[API] Connected to RedisDB");

};


const pgp = new Pool(config.pg)

export {
    redisC, redisState, redisConn, pgp,
    priceTable
        };