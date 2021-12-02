import express from 'express'
import {getMVLprice} from '../controller'

const router = express.Router();

router
    .route('/mvl')
    .get(getMVLprice)

export default router