import { createClient } from "redis";
import { opLogger, errorLogger } from "../config/logger"

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


export { redisC, redisState, redisConn };
export {mvlPriceModel} from './price.model'
