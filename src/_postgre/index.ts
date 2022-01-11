import app from "./app";
import { config } from "./config";
import { errorLogger } from "./config/logger";
import {redisConn, pgp} from "./model"

let server: any = undefined;

async function init() {
    await redisConn();
    pgp.query('SELECT NOW()', (err, res) => {
        if (err) {
            pgp.end()
            console.log(err);
            process.exit(1);
        } else {
            console.log(res.rows[0])
        }
      })
    if (process.env.NODE_ENV !== "test") {
        server = app.listen(config.port, () => {
            console.log(`Listening to port ${config.port}`);
        });
    }
}

init()
.catch((e) => {
    errorLogger.info(`[API] Initial error : ${e}`);
});


const exitHandler = () => {
    if (server) {
        server.close(() => {
            pgp.end();
            process.exit(1);
        });
    } else {
        pgp.end();
        process.exit(1);
    }
};

const unexpectedErrorHandler = (error: Error) => {
    errorLogger.error(`[API] ${error}`);
    exitHandler();
};



process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);
