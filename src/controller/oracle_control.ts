import ash from 'express-async-handler'

import {mvlPriceModel} from '../model'
import {getTime, getBetweenDay} from '../utils'
import {redisC, redisState} from '../model'
import { send } from 'process'

const getMVLprice = ash(async (req, res) => {
    try {
        if (redisState){
            let mvlPrice = await redisC.sendCommand(["RPOP", getTime("day")]);
            res.send({"Description": "Get MVL price from cache",
            "price": mvlPrice});
        } else {
            throw new Error("Redis disconnected")
        }
    } catch (e) {
        let mvlPrice = await mvlPriceModel.findOne({date: getTime('day')});
        res.send({"Description": "Get MVL price from MongoDB due to Redis error",
                              "price": mvlPrice.price.pop()});
    }
})

const getFinalPrice = ash(async (req, res) => {
    let startDate: string = req.query.start as string;
    let period: number = parseInt(req.query.period as string);
    let auctionPeriod = getBetweenDay(startDate, period);

    let totLen = 0;
    let totAmount = 0;
    for (let d of auctionPeriod) {
        let dayPriceList = await mvlPriceModel.findOne({date: d});
        totLen += dayPriceList.price.length;
        for (let p of dayPriceList.price) {
            totAmount += p;
        }
    }
    res.send((totAmount / totLen).toString())
})

export {
    getMVLprice,
    getFinalPrice
}