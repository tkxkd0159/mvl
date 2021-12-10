import express from 'express'
import {oracle as o} from '../../controller'

const router = express.Router();

router
    .route('/mvl')
    .get(o.getMVLprice)

export default router