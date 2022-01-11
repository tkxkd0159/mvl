import express from "express"
import {cors, limiter} from "./middleware"
import {ReqErrHandler} from './utils'

import BaseRoute from './route'
import routesV1 from './route/v1'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(limiter)

app.use('/', BaseRoute)
app.use('/v1', routesV1)


app.use(ReqErrHandler)


export default app