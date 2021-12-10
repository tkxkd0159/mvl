import path from 'path';
import winston from 'winston';
import winstonDaily from 'winston-daily-rotate-file';

const LOG_PATH = process.env.NODE_ENV == 'production' ?
                                                path.join(__dirname, '..', '..', 'log', 'prod') :
                                                path.join(__dirname, '..', '..', 'log', 'dev');

const { combine, timestamp, printf } = winston.format
const logFormat = printf(info => {
    return `${info.timestamp} [${info.level}] ${info.message}`
})

const logger = winston.createLogger({
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
            dirname: LOG_PATH,
            filename: `%DATE%.error.log`,
            maxFiles: 30,
        })
    ]
})

if (process.env.NODE_ENV !== 'production'){
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple(),
        )
    }))
}

export default logger