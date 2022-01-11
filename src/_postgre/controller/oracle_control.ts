import ash from 'express-async-handler'
import moment from 'moment'

import {config} from '../config'
import {getTime} from '../utils'
import {redisC, redisState, pgp} from '../model'

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
        let mvlPrice = await pgp.query('SELECT usd FROM prices ORDER BY record_ts desc LIMIT 1');
        mvlPrice = mvlPrice.rows[0]['usd'];
        res.send({"Description": "Get MVL price from PostgreSQL due to Redis error",
                              "price": mvlPrice});
    }
})

const getFinalPrice = ash(async (req, res) => {
    let startDate = undefined;
    let endDate = undefined;
    if (typeof req.query.start === 'string') {
        let tmp = moment(req.query.start, 'YYYY-MM-DD-HH-mm-ss');
        startDate = tmp.format(config.tformat);
        }
    if (typeof req.query.end === 'string') {
        let tmp = moment(req.query.end, 'YYYY-MM-DD-HH-mm-ss');
        endDate = tmp.format(config.tformat);
    }

    if (startDate === undefined || endDate === undefined) {
        res.status(500).send(new Error('Wrong input date'));
    }
    const tquery = {
        text: 'SELECT usd FROM prices WHERE record_ts BETWEEN $1 AND $2',
        values: [startDate, endDate],
        rowMode: 'array'
    }
    let totalPrice = 0;
    let mvlPrices = await pgp.query(tquery);
    for (let p of mvlPrices.rows) {
        totalPrice += parseFloat(p[0]);
    }
    totalPrice /= mvlPrices.rows.length;

    res.send(totalPrice.toString())
})

export {
    getMVLprice,
    getFinalPrice
}