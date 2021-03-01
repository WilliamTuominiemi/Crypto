const express = require('express')
const indexController = require('../controllers/indexController')
const payController = require('../controllers/payController')

const router = express.Router()

router.get('/', indexController.index_store)
router.get('/dev', indexController.index_dev)
router.post('/dev', indexController.index_dev_post)
router.get('/orders', indexController.orders)
router.post('/addtocart', indexController.add_to_cart)
router.get('/cart', indexController.cart)
router.post('/edit_cart', indexController.edit_cart)
router.get('/reviews', indexController.reviews)






router.post('/pay', payController.pay)
router.get('/success', payController.success)
router.get('/cancel', payController.cancel)

router.get('/review/:id', indexController.review)
router.post('/review/:id', indexController.write_review)

router.get('/:id', indexController.product_page)


//router.get('/about', indexController.index_about)
//router.get('/profile', indexController.index_profile)
//router.get('/profile/:posterId', indexController.index_profile_)
//router.get('/delete/:id', indexController.post_delete)


module.exports = router
