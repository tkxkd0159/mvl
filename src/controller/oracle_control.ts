import ash from 'express-async-handler'

import {mvlPriceDoc} from '../model'
import {getTime} from '../utils'
import {redisC, redisState} from '../index'

const getMVLprice = ash(async (req, res) => {
    try {
        console.log(redisState);
        if (redisState){
            let mvlPrice = await redisC.sendCommand(["LINDEX", "20211202", "0"]);
            res.status(200).send({"Description": "Get MVL price from cache",
            "price": mvlPrice});
        } else {
            throw new Error("Redis disconnected")
        }
    } catch (e) {
        // let mvlPrice = await mvlPriceDoc.findOne({'date':getTime('day')});
        let mvlPrice = await mvlPriceDoc.findOne({});
        res.status(200).send({"Description": "Get MVL price from MongoDB due to Redis error",
                              "price": mvlPrice});
    }

})

export {
    getMVLprice,
}