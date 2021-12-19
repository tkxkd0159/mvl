import mongoose from 'mongoose'

const priceSchema = new mongoose.Schema({
    date: String,
    price: [Number]
})
const mvlPriceModel = mongoose.model('mvl', priceSchema)

export {
    mvlPriceModel
}