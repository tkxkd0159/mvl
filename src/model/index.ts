import mongoose from 'mongoose'
import {config} from '../config'
import {createClient} from 'redis'

async function dbConn() {
    await mongoose.connect(config.mongoose.url, {
                            serverSelectionTimeoutMS: 2000
                            });
    console.log(" * Estabilished MongoDB connection")
    const redisC = createClient()
    redisC.on('error', (err) => console.log('Redis Client Error', err))
    await redisC.connect()
    console.log(" * Estabilished Redis connection")

    return redisC

}

export {
    dbConn
}