import express from 'express'
import oracleR from './oracle_route'

const router = express.Router()

const subRoutes = [
    {
        path: '/oracle',
        route: oracleR
    }
]

subRoutes.forEach((sub) => {
    router.use(sub.path, sub.route)
})



export default router