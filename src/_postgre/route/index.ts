import express from 'express'

const router = express.Router();

router.get('/', function (req, res) {
    res.send('MVL Oracle API')
  });

  export default router