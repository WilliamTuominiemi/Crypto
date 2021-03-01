const express = require('express')
const postController = require('../controllers/postController')

const router = express.Router()

router.get('/', postController.post_index)
router.post('/', postController.post_add_post)
//router.get('/add', postController.post_add_get)
//router.get('/delete/:id', postController.post_delete)


module.exports = router
