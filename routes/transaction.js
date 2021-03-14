const express = require('express')
const transactionController = require('../controllers/transactionController')


const router = express.Router()

router.post('/', transactionController.send_crypto)

module.exports = router
