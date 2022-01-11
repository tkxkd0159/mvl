import path from 'path';
import winston from 'winston';
import winstonDaily from 'winston-daily-rotate-file';

const OP_LOG_PATH = process.env.NODE_ENV == 'production' ?
                                                path.join(__dirname, '..', '..', 'log', 'operate', 'prod') :
                                                path.join(__dirname, '..', '..', 'log', 'operate', 'dev');

const ERROR_LOG_PATH = process.env.NODE_ENV == 'production' ?
                                                path.join(__dirname, '..', '..', 'log', 'error', 'prod') :
                                                path.join(__dirname, '..', '..', 'log', 'error', 'dev');

const AUCTION_LOG_PATH = path.join(__dirname, '..', '..', 'log', 'auction')

const { combine, timestamp, printf } = winston.format
const logFormat = printf(info => {
    return `${info.timestamp} [${info.level}] ${info.message}`
})

const opLogger = winston.createLogger({
    format: combine(
        timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        logFormat,
    ),
    transports: [
        new winstonDaily({
            level: 'info',
            datePattern: 'YYYY-MM-DD',
            dirname: OP_LOG_PATH,
            filename: `%DATE%.log`,
            maxFiles: 30,
        })
    ]
})

if (process.env.NODE_ENV === 'development'){
    opLogger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple(),
        )
    }))
}


const errorLogger = winston.createLogger({
    format: combine(
        timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        logFormat,
    ),
    transports: [
        new winstonDaily({
            level: 'error',
            datePattern: 'YYYY-MM-DD',
            dirname: ERROR_LOG_PATH,
            filename: `%DATE%.error.log`,
            maxFiles: 30,
        })
    ]
})

const auctionLogger = winston.createLogger({
    format: combine(
        timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        logFormat,
    ),
    transports: [
        new winstonDaily({
            level: 'info',
            datePattern: 'YYYY',
            dirname: AUCTION_LOG_PATH,
            filename: `%DATE%.auction.log`,
            maxFiles: 30,
        })
    ]
})

export {
    opLogger,
    errorLogger,
    auctionLogger
}