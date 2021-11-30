import express from 'express'
import { oracleC } from '../controllers'

const router = express.Router();

router
    .route('/mvl')
    .get(oracleC.getMVLprice)

export default router