const Item = require('../models/Wallet')
const Order = require('../models/Order')
const Cart = require('../models/Cart')
const Review = require('../models/Review')



const dotenv = require('dotenv')

dotenv.config({ path: './config/config.env' })

const admin_id = `${process.env.ADMIN_ID}`

const render_index = (req, res, user, dev, page) => {
	Item.find()
	.then((result) => {
		res.render(page, { title: 'Main', user: user, dev: dev, items: result})
	})
	.catch((err) => {
		console.log(err)
	})
}

// Redirects to /posts
const main = (req, res) => {
	if(req.user === undefined) {
		render_index(req, res, "undefined", false, 'index')
	}	else {
		if(req.user.googleId.toString() === admin_id)	{
			render_index(req, res, req.user, true, 'index')

		}	else {
			render_index(req, res,req.user, false, 'index')
		}
	}
}




module.exports = {
	main
}
