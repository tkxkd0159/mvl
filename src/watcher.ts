import path from 'path'
import fs from "fs"
import axios from 'axios'
import mongoose from 'mongoose'
import {createClient} from 'redis'
import {ethers} from 'ethers'
import dotenv from "dotenv";
dotenv.config({ path: path.join(__dirname, '../.op.env') })

import { getTime } from "./utils"
import {config} from './config'
import {opLogger, errorLogger} from './config/logger'
import {mvlPriceModel} from './model'

const DB_INTV = 1800;
const ORACLE_INTV = 300;

const provider = new ethers.providers.JsonRpcProvider(process.env.BSC_URL);
const signer = new ethers.Wallet(process.env.ADMIN_KEY as string, provider);
const baseAbiPath = path.join(__dirname, "..", "abi", "contracts");
const oracleABI = JSON.parse(fs.readFileSync(path.join(baseAbiPath, "oracle", "MvlPriceOracle.sol/MvlPriceOracle.json")).toString()).abi;
const oracleC = new ethers.Contract(process.env.ORACLE_ADDR as string, oracleABI, signer);


async function setOracle(price: string) {
    await oracleC.setCurrentPrice(ethers.utils.parseUnits(price, 18));
}

const getMVLpriceAfter = function (sec: number) {
    return new Promise(resolve => {
        setTimeout(async () => {
            const mvlPrice = await axios(
                {
                    method: 'get',
                    url: 'https://api.coingecko.com/api/v3/simple/price?ids=mass-vehicle-ledger&vs_currencies=usd',
                    timeout: 2000,
                }
                )
            resolve(mvlPrice)
        }, sec*1000)
    })
};

(async function(){
    await mongoose.connect(config.mongoose.url, {
        serverSelectionTimeoutMS: 2000
        });
    opLogger.info("[Watcher] Estabilished MongoDB connection for watcher")
    const redisClient = createClient()
    redisClient.on('error', (err) => errorLogger.error("[Watcher] RedisDB is not available"))
    await redisClient.connect()
    opLogger.info("[Watcher] Estabilished Redis connection for watcher")

    let mvlPrice: any = await getMVLpriceAfter(2)
    mvlPrice = parseFloat(mvlPrice['data']['mass-vehicle-ledger']['usd'].toString());
    let cnt = 0;
    let cntO = 0;

    let prevDay = getTime('day');
    let nowDay;
    let doc = new mvlPriceModel({date: prevDay, price: [mvlPrice]}); //  date : yyyymmddhhmm, price : 0.xxxxxx ($)
    await doc.save();

    while (true) {
        let mvlPrice: any = await getMVLpriceAfter(2)
        mvlPrice = mvlPrice['data']['mass-vehicle-ledger']['usd'].toString();
        if (redisClient) {
            await redisClient.rPush(getTime('day'), mvlPrice)
        }
        cnt += 1;
        cntO += 1;
        if (cnt == DB_INTV) {
            cnt = 0;
            nowDay = getTime('day')
            mvlPrice = parseFloat(mvlPrice)
            if (nowDay != prevDay) {
                doc = new mvlPriceModel({date: nowDay, price: [mvlPrice]});
                await doc.save();
            } else {
                doc.price.push(mvlPrice);
                await doc.save();
            }
            prevDay = nowDay;
        }

        if (cntO == ORACLE_INTV) {
            await setOracle(mvlPrice);
        }
    }
})();
