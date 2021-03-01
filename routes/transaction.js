const express = require('express')
const postController = require('../controllers/transactionController')

const router = express.Router()

router.post('/', transactionController.send_crypto)

module.exports = router
