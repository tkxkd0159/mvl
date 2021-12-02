import axios from 'axios'
import ash from 'express-async-handler'


const getMVLprice = ash(async (req, res) => {
    const mvlPrice = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=mass-vehicle-ledger&vs_currencies=usd')
    console.log(typeof(mvlPrice.data))
    res.send(mvlPrice['data']['mass-vehicle-ledger']['usd'].toString())
})



export default {
    getMVLprice,
}