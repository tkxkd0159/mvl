import axios from 'axios'
import mongoose from 'mongoose'
import {createClient} from 'redis'

import { getTime } from "./utils"
import {config} from './config'
import {mvlPriceDoc} from './model'

//  date : yyyymmddhhmm, price : 0.xxxxxx ($)
async function savePrice(date: string, price: number) {
    const tmp = new mvlPriceDoc({date, price})
    await tmp.save()
    console.log(" * Complete saving data")
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
    console.log(" * Estabilished MongoDB connection for watcher")
    const redisClient = createClient()
    redisClient.on('error', (err) => console.log('Redis Server Error'))
    await redisClient.connect()
    console.log(" * Estabilished Redis connection for watcher")

    while (true) {
        let mvlPrice: any = await getMVLpriceAfter(2)
        mvlPrice = mvlPrice['data']['mass-vehicle-ledger']['usd'].toString()
        if (redisClient) {
            await redisClient.rPush(getTime('day'), mvlPrice)
        }
    }
})();

