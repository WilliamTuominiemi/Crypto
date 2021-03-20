const Transaction = require('../models/Transaction')
const User = require('../models/User')
const BlockToMine = require('../models/BlockToMine')



let BlockChain = require('../src/blockChain')
let hash = require('object-hash')


const dotenv = require('dotenv')

dotenv.config({ path: './config/config.env' })

const admin_id = `${process.env.ADMIN_ID}`

const render_index = (req, res, user, page) => {
}

// Redirects to /posts
const main = (req, res) => {
	if(req.user === undefined) {
		res.render('index', { title: 'Main', user: "undefined", code: "000"})
	}	else {
		res.render('index', { title: 'Main', user: req.user, code: "000"})
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
	console.log(req.body.blockToMine_id)
	const filter = {_id: req.body.blockToMine_id}
	BlockToMine.findOneAndDelete({_id: req.body.blockToMine_id})
	.then((result) => {
		User.find({googleId: req.body.sender_id})
		.then((result) =>	{
			console.log(result[0])
			let blockChain = new BlockChain()
				console.log(blockChain)
		
				let PROOF = 420
		
				blockChain.addNewTransaction(req.user.googleId, req.body.sender_id, req.body.recipient_id, req.body.amount)
				
				blockChain.addNewBlock(null)
		
				res.redirect('/success')
			if(parseInt(result[0].crypto >= req.body.amount ))	{
				
			}	else {
			 	res.redirect('/insufficient')
			}
		})	
	})
}



module.exports = {
	main,
	send,
	mine_page,
	mine
}
