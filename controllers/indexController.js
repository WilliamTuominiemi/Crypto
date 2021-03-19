const Transaction = require('../models/Transaction')
const User = require('../models/User')
const BlockToMine = require('../models/BlockToMine')



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
	const body = {
		sender: req.user.googleId,
		recipient: req.body.recipient_id,
		amount: req.body.amount,
	}

	console.log(body)
	
	const blockToMine = new BlockToMine(body)

	blockToMine.save()
	.then((result) => {
		res.redirect('/')
	})

}

const mine_page = (req, res) => {
	BlockToMine.find()
	.then((result) => {
		res.render('mine', { title: 'Mine', user: req.user, blocks: result})
	})
}

const mine = (req, res) => {
	User.find({googleId: req.user.googleId})
	.then((result) =>	{
		console.log(result[0])
		let blockChain = new BlockChain()
			console.log(blockChain)
	
			let PROOF = 420
	
			console.log(req)

			blockChain.addNewTransaction('GlocKoin', req.user.googleId/*req.body.r_name*/, req.body.amount)
			
			blockChain.addNewBlock(null)
	
			res.redirect('/success')
		// if(parseInt(result[0] >= req.body.amount ))	{
			
		// }	else {
		// 	res.redirect('/insufficient')
		// }
	})	
}



module.exports = {
	main,
	send
}
