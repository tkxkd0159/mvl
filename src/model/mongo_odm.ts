import mongoose from 'mongoose'
const priceSchema = new mongoose.Schema({
    date: String,
    price: Number
})

const mvlPriceDoc = mongoose.model('mvl', priceSchema)

//  date : yyyymmddhhmm, price : 0.xxxxxx ($)
async function savePrice(date: string, price: number) {
    const tmp = new mvlPriceDoc({date, price})
    await tmp.save()
    console.log(" * Complete saving data")
    console.log(tmp)
}

export {
    mvlPriceDoc
}