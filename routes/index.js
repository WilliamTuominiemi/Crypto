const express = require('express')
const indexController = require('../controllers/indexController')
const payController = require('../controllers/payController')

const router = express.Router()

router.get('/', indexController.main)
router.get('/send', indexController.send_page)
router.get('/mine', indexController.mine_page)
router.get('/blockchain', indexController.blockchain)

router.post('/coinflip', indexController.coinflip)
router.post('/mine', indexController.mine)
router.post('/send', indexController.send)


module.exports = router
