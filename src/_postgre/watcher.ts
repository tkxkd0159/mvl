import path from 'path'
import fs from "fs"
import axios, { AxiosError } from 'axios'
import {createClient} from 'redis'
import {Pool} from 'pg'
import moment from 'moment'
import {ethers} from 'ethers'
import dotenv from "dotenv";
dotenv.config({ path: path.join(__dirname, '../.op.env') })

import { getTime } from "./utils"
import {config} from './config'
import {opLogger, errorLogger} from './config/logger'
import {priceTable} from './model'

const DB_INTV = 1800;
const pgp = new Pool(config.pg);
const ORACLE_INTV = 300;

const provider = new ethers.providers.JsonRpcProvider(process.env.BSC_URL);
const signer = new ethers.Wallet(process.env.ADMIN_KEY as string, provider);
const baseAbiPath = path.join(__dirname, "..", "abi", "contracts");
const oracleABI = JSON.parse(fs.readFileSync(path.join(baseAbiPath, "oracle", "MvlPriceOracle.sol/MvlPriceOracle.json")).toString()).abi;
const oracleC = new ethers.Contract(process.env.ORACLE_ADDR as string, oracleABI, signer);

pgp.on('error', (err, client) => {
    errorLogger.error("[Watcher] Unexpected error on PostSQL client")
    process.exit(1);
})

async function setOracle(price: string) {
    await oracleC.setCurrentPrice(ethers.utils.parseUnits(price, 18));
}

function delay(sec: number) {
    return new Promise(resolve => setTimeout(resolve, sec*1000));
}

async function getPriceFromWeb(dataSrc: string){
    try {
        let mvlPrice: any = await axios(
            {
                method: 'get',
                url: dataSrc,
                timeout: 2000,
            }
            )
        return mvlPrice;
    } catch (error: Error | AxiosError | any) {
        if (error.response) {
            errorLogger.error(error.response.data, error.response.status, error.response.headers);
        } else if (error.request) {
            errorLogger.error(error.request);
        } else {
            errorLogger.error(error.message);
        }
        return null;
    }
}

(async function(){
    const pgc = await pgp.connect();
    opLogger.info("[Watcher] Estabilished PostgreSQL connection for watcher");
    const redisClient = createClient();
    redisClient.on('error', (err) => errorLogger.error("[Watcher] RedisDB is not available"));
    await redisClient.connect();
    opLogger.info("[Watcher] Estabilished Redis connection for watcher");

    await delay(2);
    let mvlPrice = await getPriceFromWeb('https://api.coingecko.com/api/v3/simple/price?ids=mass-vehicle-ledger&vs_currencies=usd');
    if (mvlPrice === null) {
        mvlPrice = await pgc.query('SELECT usd FROM prices ORDER BY record_ts desc LIMIT 1');
        mvlPrice = mvlPrice.rows[0]['usd'];
    } else {
        mvlPrice = parseFloat(mvlPrice['data']['mass-vehicle-ledger']['usd'].toString());
    }

    let cnt = 0;
    let cntO = 0;

    await pgc.query(priceTable);
    const addPrice = {
        text: 'INSERT INTO prices(usd, record_ts) VALUES ($1, $2)',
        values: [mvlPrice, moment.utc().format("YYYY-MM-DD HH:mm:ss")]
    }
    await pgc.query(addPrice);


    while (true) {
        await delay(2);
        let mvlPrice = await getPriceFromWeb('https://api.coingecko.com/api/v3/simple/price?ids=mass-vehicle-ledger&vs_currencies=usd');
        if (mvlPrice === null) {
            mvlPrice = await pgc.query('SELECT usd FROM prices ORDER BY record_ts desc LIMIT 1');
            mvlPrice = mvlPrice.rows[0]['usd'];
        } else {
            mvlPrice = mvlPrice['data']['mass-vehicle-ledger']['usd'].toString();
        }

        if (redisClient) {
            await redisClient.rPush(getTime('day'), mvlPrice)
        }
        cnt += 1;
        cntO += 1;
        if (cnt == DB_INTV) {
            cnt = 0;
            mvlPrice = parseFloat(mvlPrice)
            addPrice.values = [mvlPrice, moment.utc().format("YYYY-MM-DD HH:mm:ss")]
            await pgc.query(addPrice)
        }

        if (cntO == ORACLE_INTV) {
            await setOracle(mvlPrice);
        }
    }
})();
