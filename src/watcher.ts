import axios from 'axios'
import { dbConn } from "./model";
import { getTime } from "./utils"

const getMVLpriceAfter = function (sec: number) {
    return new Promise(resolve => {
        setTimeout(async () => {
            const mvlPrice = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=mass-vehicle-ledger&vs_currencies=usd')
            resolve(mvlPrice)
        }, sec*1000)
    })
};

(async function(){
    const redisClient = await dbConn().catch(err => console.log(err))
    while (true) {
        let mvlPrice: any = await getMVLpriceAfter(2)
        mvlPrice = mvlPrice['data']['mass-vehicle-ledger']['usd'].toString()
        if (redisClient) {
            await redisClient.rPush(getTime('day'), mvlPrice)
        }
    }
})();

