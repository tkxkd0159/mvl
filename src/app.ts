import express from "express"
import {cors, limiter} from "./middleware"
import {ReqErrHandler} from './utils'
import {config} from './config'
import routesV1 from './route'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(limiter)

app.use('/v1', routesV1)

if (config.env === 'production') {
    app.use(ReqErrHandler)
}

app.listen(config.port, () => {
    console.log(`Listening to on port ${config.port}`)
})