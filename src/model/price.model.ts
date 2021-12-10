import mongoose from 'mongoose'

const priceSchema = new mongoose.Schema({
    date: String,
    price: Number
})
const mvlPriceDoc = mongoose.model('mvl', priceSchema)

export {
    mvlPriceDoc
}