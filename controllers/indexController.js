const Transaction = require('../models/Transaction')
const User = require('../models/User')


let BlockChain = require('../src/blockChain')
let hash = require('object-hash')


const dotenv = require('dotenv')

dotenv.config({ path: './config/config.env' })

const admin_id = `${process.env.ADMIN_ID}`

const render_index = (req, res, user, page) => {
	res.render(page, { title: 'Main', user: user})
}

// Redirects to /posts
const main = (req, res) => {
	if(req.user === undefined) {
		render_index(req, res, "undefined", 'index')
	}	else {
		if(req.user.googleId.toString() === admin_id)	{
			render_index(req, res, req.user, 'index')

		}	else {
			render_index(req, res,req.user, 'index')
		}
	}
}

const send = (req, res) => {

	User.find({googleId: req.user.googleId})
	.then((result) =>	{
		console.log(result[0])
		if(parseInt(result[0] >= req.body.amount ))	{
			let blockChain = new BlockChain()
			console.log(blockChain)
	
			let PROOF = 420
	
			blockChain.addNewTransaction(req.user.displayName, req.body.r_name, req.body.amount)
			
			blockChain.addNewBlock(null)
	
			console.log("Chain : ", blockChain.chain)

			res.redirect('/success')
		}	else {
			res.redirect('/insufficient')
		}
	})	
}



module.exports = {
	main,
	send
}
